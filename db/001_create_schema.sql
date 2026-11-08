-- =============================================================================
-- 001_create_schema.sql  --  Pulsko: shema baze podataka (PostgreSQL 14+)
--
-- Pokretanje (iz korijena repozitorija, na NOVOJ praznoj bazi):
--   createdb pulsko_dev
--   psql -d pulsko_dev -v ON_ERROR_STOP=1 -f db/001_create_schema.sql
--   psql -d pulsko_dev -c '\dt'
--
-- Konvencije:
--   * ključevi: bigint GENERATED ALWAYS AS IDENTITY
--   * vremena: timestamptz (pohranjuje se UTC, prikaz po potrebi u Europe/Zagreb)
--   * statusi: text + CHECK (jednostavnije za izmjene od ENUM-a)
--   * nazivi tablica i stupaca na engleskom (isto kao u kodu i ER dijagramu)
--
-- Pravila iz dokumentacije koja shema provodi sama (ne samo aplikacija):
--   NF-01  najviše 2.125 prihvaćenih pacijenata po liječniku  (trigger)
--   F-002  samo odobreni liječnik može imati prihvaćenu vezu   (trigger)
--   F-017  audit_log je samo za dodavanje                      (trigger)
--   UC-003 3a  nema dva aktivna zahtjeva za isti par           (partial unique)
--   UC-004 4b  jedan check-in po pacijentu po danu             (unique)
--   UC-006 1a  najviše 3 PDF-a po nalazu, svaki <= 10 MB       (unique + check)
--   UC-012 3a  liječnik/pacijent ne mogu imati preklapajuće termine (EXCLUDE)
--   UC-015     isti podsjetnik se ne šalje dvaput              (unique)
-- =============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS btree_gist;   -- za EXCLUDE na terminima

-- -----------------------------------------------------------------------------
-- Pomoćne funkcije
-- -----------------------------------------------------------------------------

CREATE FUNCTION set_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

-- =============================================================================
-- 1. KORISNICI I PRISTUP  (F-001, F-002, F-003, F-019)
-- =============================================================================

-- Aplikacija ne vodi lozinke (C-01): identitet dolazi od OIDC/OAuth pružatelja.
CREATE TABLE app_user (
    user_id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    oidc_provider  text        NOT NULL,
    oidc_subject   text        NOT NULL,
    email          text        NOT NULL,
    display_name   text        NOT NULL,
    role           text        NOT NULL
                   CHECK (role IN ('patient', 'doctor', 'admin')),
    created_at     timestamptz NOT NULL DEFAULT now(),
    last_login_at  timestamptz,
    CONSTRAINT app_user_oidc_uq  UNIQUE (oidc_provider, oidc_subject),
    -- pomoćni ključ za složene FK-eve koji osiguravaju da profil pacijenta
    -- pripada korisniku s ulogom 'patient' (a liječnika 'doctor')
    CONSTRAINT app_user_id_role_uq UNIQUE (user_id, role)
);
CREATE UNIQUE INDEX app_user_email_uq ON app_user (lower(email));

CREATE TABLE patient_profile (
    user_id        bigint PRIMARY KEY,
    role           text   NOT NULL DEFAULT 'patient' CHECK (role = 'patient'),
    date_of_birth  date   CHECK (date_of_birth <= CURRENT_DATE),
    sex            text   CHECK (sex IN ('female', 'male', 'other')),
    FOREIGN KEY (user_id, role) REFERENCES app_user (user_id, role)
        ON DELETE CASCADE
);

-- Liječnik se prijavljuje kao 'doctor', ali dobiva funkcije tek kad ga
-- administrator odobri (UC-001 4a, UC-014).
CREATE TABLE doctor_profile (
    user_id           bigint PRIMARY KEY,
    role              text   NOT NULL DEFAULT 'doctor' CHECK (role = 'doctor'),
    institution       text   NOT NULL,
    license_number    text   NOT NULL,
    approval_status   text   NOT NULL DEFAULT 'pending'
                      CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    reviewed_by       bigint REFERENCES app_user (user_id),
    reviewed_at       timestamptz,
    rejection_reason  text,
    created_at        timestamptz NOT NULL DEFAULT now(),
    FOREIGN KEY (user_id, role) REFERENCES app_user (user_id, role)
        ON DELETE CASCADE,
    CONSTRAINT doctor_license_uq UNIQUE (license_number),
    CONSTRAINT doctor_review_complete CHECK (
        approval_status = 'pending'
        OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL)
    ),
    CONSTRAINT doctor_rejection_reason CHECK (
        approval_status <> 'rejected' OR rejection_reason IS NOT NULL
    )
);
CREATE INDEX doctor_profile_status_idx ON doctor_profile (approval_status);

-- Veza pacijent - liječnik (UC-003, UC-008, UC-016).
CREATE TABLE doctor_patient_link (
    link_id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id    bigint NOT NULL REFERENCES patient_profile (user_id),
    doctor_id     bigint NOT NULL REFERENCES doctor_profile (user_id),
    status        text   NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'accepted', 'rejected',
                                    'withdrawn', 'ended')),
    requested_at  timestamptz NOT NULL DEFAULT now(),
    responded_at  timestamptz
);
-- Pacijent ne može imati dva aktivna zahtjeva/veze s istim liječnikom,
-- ali nakon odbijanja/povlačenja smije poslati novi zahtjev.
CREATE UNIQUE INDEX link_active_pair_uq
    ON doctor_patient_link (patient_id, doctor_id)
    WHERE status IN ('pending', 'accepted');
CREATE INDEX link_doctor_status_idx  ON doctor_patient_link (doctor_id, status);
CREATE INDEX link_patient_status_idx ON doctor_patient_link (patient_id, status);

-- NF-01 / UC-008 3c: najviše 2.125 prihvaćenih pacijenata po liječniku.
-- Redak liječnika zaključava se da dva istodobna prihvaćanja ne probiju granicu.
CREATE FUNCTION enforce_link_rules() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
    v_status text;
    v_count  integer;
BEGIN
    IF NEW.status = 'accepted'
       AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'accepted') THEN

        SELECT approval_status INTO v_status
          FROM doctor_profile
         WHERE user_id = NEW.doctor_id
         FOR UPDATE;

        IF v_status IS DISTINCT FROM 'approved' THEN
            RAISE EXCEPTION 'Doctor % is not approved', NEW.doctor_id
                USING ERRCODE = 'check_violation';
        END IF;

        SELECT count(*) INTO v_count
          FROM doctor_patient_link
         WHERE doctor_id = NEW.doctor_id
           AND status = 'accepted'
           AND link_id IS DISTINCT FROM NEW.link_id;

        IF v_count >= 2125 THEN
            RAISE EXCEPTION 'Doctor % already has the maximum of 2125 patients',
                NEW.doctor_id USING ERRCODE = 'check_violation';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER link_rules_trg
    BEFORE INSERT OR UPDATE OF status ON doctor_patient_link
    FOR EACH ROW EXECUTE FUNCTION enforce_link_rules();

-- =============================================================================
-- 2. ZDRAVSTVENI PODACI  (F-005, F-006, F-007, F-008, F-009, F-010)
-- =============================================================================

-- Dnevni check-in (UC-004). Sva mjerna polja su nullable jer je dopušten
-- djelomičan unos (UC-004 3a); barem jedno polje mora biti uneseno.
-- Rasponi su razumne zadane vrijednosti: uskladite ih s timom (F-009).
CREATE TABLE daily_checkin (
    checkin_id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id            bigint NOT NULL REFERENCES patient_profile (user_id),
    checkin_date          date   NOT NULL,
    general_state         smallint      CHECK (general_state BETWEEN 1 AND 5),
    sleep_hours           numeric(4,2)  CHECK (sleep_hours BETWEEN 0 AND 24),
    steps                 integer       CHECK (steps BETWEEN 0 AND 100000),
    heart_rate_bpm        smallint      CHECK (heart_rate_bpm BETWEEN 30 AND 220),
    activity_minutes      smallint      CHECK (activity_minutes BETWEEN 0 AND 1440),
    activity_description  text,
    created_at            timestamptz NOT NULL DEFAULT now(),
    updated_at            timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT checkin_patient_day_uq UNIQUE (patient_id, checkin_date),
    CONSTRAINT checkin_not_empty CHECK (
        general_state IS NOT NULL OR sleep_hours IS NOT NULL
        OR steps IS NOT NULL OR heart_rate_bpm IS NOT NULL
        OR activity_minutes IS NOT NULL OR activity_description IS NOT NULL
    )
);
CREATE TRIGGER daily_checkin_updated_trg
    BEFORE UPDATE ON daily_checkin
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Šifrarnik biomarkera (kompletna krvna slika). Puni se u 002_seed_reference_data.sql.
CREATE TABLE biomarker (
    biomarker_id  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code          text NOT NULL UNIQUE,
    name          text NOT NULL,
    unit          text NOT NULL,
    ref_low       numeric(10,3),
    ref_high      numeric(10,3),
    CONSTRAINT biomarker_ref_order CHECK (ref_low IS NULL OR ref_high IS NULL
                                          OR ref_low <= ref_high)
);

-- Jedan učitani laboratorijski nalaz (UC-006). Status prati cijeli tijek:
-- uploaded -> pending_confirmation -> confirmed | rejected
-- (extraction_failed: AI nije prepoznao vrijednosti, pacijent unosi ručno).
CREATE TABLE lab_report (
    report_id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id         bigint NOT NULL REFERENCES patient_profile (user_id),
    status             text   NOT NULL DEFAULT 'uploaded'
                       CHECK (status IN ('uploaded', 'extraction_failed',
                                         'pending_confirmation',
                                         'confirmed', 'rejected')),
    collected_on       date,
    uploaded_at        timestamptz NOT NULL DEFAULT now(),
    reviewed_by        bigint REFERENCES doctor_profile (user_id),
    reviewed_at        timestamptz,
    rejection_comment  text,
    CONSTRAINT lab_report_id_patient_uq UNIQUE (report_id, patient_id),
    CONSTRAINT lab_report_review_complete CHECK (
        status NOT IN ('confirmed', 'rejected')
        OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL)
    ),
    CONSTRAINT lab_report_rejection_comment CHECK (
        status <> 'rejected' OR rejection_comment IS NOT NULL
    )
);
CREATE INDEX lab_report_patient_idx ON lab_report (patient_id, uploaded_at DESC);
CREATE INDEX lab_report_pending_idx ON lab_report (patient_id)
    WHERE status = 'pending_confirmation';

-- PDF datoteke nalaza: najviše 3 po nalazu (file_no 1..3), svaka <= 10 MB.
-- U bazi je samo putanja/ključ; sama datoteka ide u object storage
-- (disk na besplatnom Renderu nije trajan). Ako tim odluči drugačije,
-- ovdje se može dodati stupac content bytea.
CREATE TABLE lab_report_file (
    file_id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    report_id          bigint   NOT NULL REFERENCES lab_report (report_id)
                       ON DELETE CASCADE,
    file_no            smallint NOT NULL CHECK (file_no BETWEEN 1 AND 3),
    original_filename  text     NOT NULL,
    content_type       text     NOT NULL DEFAULT 'application/pdf'
                       CHECK (content_type = 'application/pdf'),
    size_bytes         integer  NOT NULL CHECK (size_bytes > 0
                                                AND size_bytes <= 10485760),
    storage_path       text     NOT NULL,
    uploaded_at        timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT lab_file_no_uq UNIQUE (report_id, file_no)
);

-- Pojedinačna laboratorijska vrijednost (F-006, F-007, F-008).
-- Složeni FK (report_id, patient_id) jamči da vrijednost i nalaz pripadaju
-- istom pacijentu. original_value se puni kad liječnik ispravi vrijednost;
-- reviewed_by/at bilježe tko je i kada vrijednost potvrdio ili odbio (F-008).
CREATE TABLE lab_value (
    value_id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    report_id       bigint NOT NULL,
    patient_id      bigint NOT NULL,
    biomarker_id    bigint NOT NULL REFERENCES biomarker (biomarker_id),
    value           numeric(12,4) NOT NULL,
    unit            text   NOT NULL,
    measured_on     date   NOT NULL,
    source          text   NOT NULL CHECK (source IN ('extracted', 'manual')),
    status          text   NOT NULL DEFAULT 'unconfirmed'
                    CHECK (status IN ('unconfirmed', 'confirmed', 'rejected')),
    original_value  numeric(12,4),
    reviewed_by     bigint REFERENCES doctor_profile (user_id),
    reviewed_at     timestamptz,
    FOREIGN KEY (report_id, patient_id)
        REFERENCES lab_report (report_id, patient_id) ON DELETE CASCADE,
    CONSTRAINT lab_value_once_per_report UNIQUE (report_id, biomarker_id),
    CONSTRAINT lab_value_review_complete CHECK (
        status = 'unconfirmed'
        OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL)
    )
);
CREATE INDEX lab_value_trend_idx
    ON lab_value (patient_id, biomarker_id, measured_on);

-- Samo potvrđene vrijednosti: ovo smije čitati pacijentski AI agent (F-015).
CREATE VIEW v_confirmed_lab_values AS
SELECT lv.value_id, lv.patient_id, lv.report_id, b.code AS biomarker_code,
       b.name AS biomarker_name, lv.value, lv.unit, lv.measured_on,
       b.ref_low, b.ref_high, lv.reviewed_by AS confirmed_by,
       lv.reviewed_at AS confirmed_at
  FROM lab_value lv
  JOIN biomarker b USING (biomarker_id)
 WHERE lv.status = 'confirmed';

-- =============================================================================
-- 3. TERAPIJA I TERMINI  (F-012, F-013, F-018)
-- =============================================================================

CREATE TABLE therapy_plan (
    plan_id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id       bigint NOT NULL REFERENCES patient_profile (user_id),
    doctor_id        bigint NOT NULL REFERENCES doctor_profile (user_id),
    medication_name  text   NOT NULL,
    dose_amount      numeric(10,3) NOT NULL CHECK (dose_amount > 0),
    dose_unit        text   NOT NULL,
    instructions     text,
    start_date       date   NOT NULL,
    end_date         date,
    status           text   NOT NULL DEFAULT 'active'
                     CHECK (status IN ('active', 'ended')),
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT therapy_dates_ok CHECK (end_date IS NULL OR end_date >= start_date)
);
CREATE INDEX therapy_patient_status_idx ON therapy_plan (patient_id, status);
CREATE INDEX therapy_doctor_idx ON therapy_plan (doctor_id);
CREATE TRIGGER therapy_plan_updated_trg
    BEFORE UPDATE ON therapy_plan
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Vremena uzimanja unutar plana. days_of_week: ISO (1 = ponedjeljak ... 7 = nedjelja).
CREATE TABLE therapy_schedule (
    schedule_id   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    plan_id       bigint NOT NULL REFERENCES therapy_plan (plan_id)
                  ON DELETE CASCADE,
    time_of_day   time   NOT NULL,
    days_of_week  smallint[] NOT NULL DEFAULT '{1,2,3,4,5,6,7}'
                  CHECK (cardinality(days_of_week) > 0
                         AND days_of_week <@ ARRAY[1,2,3,4,5,6,7]::smallint[]),
    CONSTRAINT therapy_schedule_uq UNIQUE (plan_id, time_of_day)
);

-- Konkretna zakazana doza i njezin status (UC-017).
-- Retke se generiraju pozadinskim zadatkom (ili pri izradi plana).
CREATE TABLE dose_event (
    dose_id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    plan_id       bigint NOT NULL REFERENCES therapy_plan (plan_id)
                  ON DELETE CASCADE,
    scheduled_at  timestamptz NOT NULL,
    status        text   NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'taken', 'missed')),
    recorded_at   timestamptz,
    CONSTRAINT dose_event_uq UNIQUE (plan_id, scheduled_at),
    CONSTRAINT dose_recorded_consistent CHECK (
        (status = 'pending') = (recorded_at IS NULL)
    )
);
CREATE INDEX dose_due_idx ON dose_event (scheduled_at) WHERE status = 'pending';

-- Termini (UC-012). Preklapanja se sprječavaju EXCLUDE ograničenjem,
-- i za liječnika i za pacijenta, samo među zakazanim terminima.
-- "Termin ne smije biti u prošlosti" ne može biti CHECK (now() nije
-- nepromjenjiv) pa se to provjerava u aplikaciji.
CREATE TABLE appointment (
    appointment_id  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    doctor_id       bigint NOT NULL REFERENCES doctor_profile (user_id),
    patient_id      bigint NOT NULL REFERENCES patient_profile (user_id),
    starts_at       timestamptz NOT NULL,
    ends_at         timestamptz NOT NULL,
    location        text,
    note            text,
    status          text NOT NULL DEFAULT 'scheduled'
                    CHECK (status IN ('scheduled', 'cancelled')),
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT appointment_time_ok CHECK (ends_at > starts_at),
    CONSTRAINT appointment_doctor_no_overlap EXCLUDE USING gist (
        doctor_id WITH =, tstzrange(starts_at, ends_at) WITH &&
    ) WHERE (status = 'scheduled'),
    CONSTRAINT appointment_patient_no_overlap EXCLUDE USING gist (
        patient_id WITH =, tstzrange(starts_at, ends_at) WITH &&
    ) WHERE (status = 'scheduled')
);
CREATE INDEX appointment_patient_idx ON appointment (patient_id, starts_at);
CREATE INDEX appointment_doctor_idx  ON appointment (doctor_id, starts_at);
CREATE TRIGGER appointment_updated_trg
    BEFORE UPDATE ON appointment
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- 4. KOMUNIKACIJA I PODSJETNICI  (F-011, F-014, F-020)
-- =============================================================================

-- Razgovor = veza pacijent-liječnik, zato nema zasebne tablice razgovora.
CREATE TABLE message (
    message_id  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    link_id     bigint NOT NULL REFERENCES doctor_patient_link (link_id),
    sender_id   bigint NOT NULL REFERENCES app_user (user_id),
    body        text   NOT NULL CHECK (length(btrim(body)) > 0),
    sent_at     timestamptz NOT NULL DEFAULT now(),
    read_at     timestamptz
);
CREATE INDEX message_thread_idx ON message (link_id, sent_at);
CREATE INDEX message_unread_idx ON message (link_id) WHERE read_at IS NULL;

-- Poruku smije poslati samo jedna od dviju strana veze, i to dok je veza prihvaćena.
CREATE FUNCTION enforce_message_rules() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
    l doctor_patient_link%ROWTYPE;
BEGIN
    SELECT * INTO l FROM doctor_patient_link WHERE link_id = NEW.link_id;
    IF l.status <> 'accepted' THEN
        RAISE EXCEPTION 'Link % is not accepted', NEW.link_id
            USING ERRCODE = 'check_violation';
    END IF;
    IF NEW.sender_id NOT IN (l.patient_id, l.doctor_id) THEN
        RAISE EXCEPTION 'User % is not a party of link %', NEW.sender_id, NEW.link_id
            USING ERRCODE = 'check_violation';
    END IF;
    RETURN NEW;
END;
$$;
CREATE TRIGGER message_rules_trg
    BEFORE INSERT ON message
    FOR EACH ROW EXECUTE FUNCTION enforce_message_rules();

-- Obavijesti unutar aplikacije (F-020).
CREATE TABLE notification (
    notification_id  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id          bigint NOT NULL REFERENCES app_user (user_id)
                     ON DELETE CASCADE,
    type             text   NOT NULL,
    title            text   NOT NULL,
    body             text,
    entity_type      text,
    entity_id        bigint,
    created_at       timestamptz NOT NULL DEFAULT now(),
    read_at          timestamptz
);
CREATE INDEX notification_user_idx ON notification (user_id, created_at DESC);
CREATE INDEX notification_unread_idx ON notification (user_id) WHERE read_at IS NULL;

-- Povijest podsjetnika i stanje slanja e-pošte (UC-015, F-014).
-- UNIQUE na dose_id / appointment_id jamči da se isti podsjetnik ne stvori dvaput.
CREATE TABLE reminder (
    reminder_id     bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id      bigint NOT NULL REFERENCES patient_profile (user_id),
    kind            text   NOT NULL CHECK (kind IN ('dose', 'appointment')),
    dose_id         bigint REFERENCES dose_event (dose_id) ON DELETE CASCADE,
    appointment_id  bigint REFERENCES appointment (appointment_id) ON DELETE CASCADE,
    due_at          timestamptz NOT NULL,
    in_app_created_at timestamptz,
    email_status    text   NOT NULL DEFAULT 'pending'
                    CHECK (email_status IN ('pending', 'sent', 'failed')),
    email_attempts  smallint NOT NULL DEFAULT 0 CHECK (email_attempts >= 0),
    email_sent_at   timestamptz,
    CONSTRAINT reminder_dose_uq        UNIQUE (dose_id),
    CONSTRAINT reminder_appointment_uq UNIQUE (appointment_id),
    CONSTRAINT reminder_target_matches_kind CHECK (
        (kind = 'dose'        AND dose_id IS NOT NULL AND appointment_id IS NULL) OR
        (kind = 'appointment' AND appointment_id IS NOT NULL AND dose_id IS NULL)
    )
);
CREATE INDEX reminder_due_idx ON reminder (due_at)
    WHERE email_status IN ('pending', 'failed');
CREATE INDEX reminder_patient_idx ON reminder (patient_id, due_at DESC);

-- =============================================================================
-- 5. AI  (F-015, F-016)
-- =============================================================================


CREATE TABLE ai_chat_message (
    message_id  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id  bigint NOT NULL REFERENCES patient_profile (user_id),
    role        text   NOT NULL CHECK (role IN ('user', 'assistant')),
    content     text   NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ai_chat_patient_idx ON ai_chat_message (patient_id, created_at);

-- Pitanja za liječnika koja je pacijent spremio (UC-007, korak 5).
CREATE TABLE patient_question (
    question_id    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id     bigint NOT NULL REFERENCES patient_profile (user_id),
    question_text  text   NOT NULL CHECK (length(btrim(question_text)) > 0),
    source         text   NOT NULL DEFAULT 'ai_agent'
                   CHECK (source IN ('ai_agent', 'manual')),
    created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX patient_question_idx ON patient_question (patient_id, created_at DESC);

-- Liječnički AI sažetak (UC-013). Pacijent vidi isključivo shared_text,
-- i to tek kad je status 'shared' (liječnik je pregledao i odobrio).
CREATE TABLE ai_summary (
    summary_id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id           bigint NOT NULL REFERENCES patient_profile (user_id),
    doctor_id            bigint NOT NULL REFERENCES doctor_profile (user_id),
    model                text,
    summary_text         text   NOT NULL,
    suggested_questions  text[] NOT NULL DEFAULT '{}',
    patient_draft        text,
    shared_text          text,
    status               text   NOT NULL DEFAULT 'draft'
                         CHECK (status IN ('draft', 'shared', 'discarded')),
    created_at           timestamptz NOT NULL DEFAULT now(),
    shared_at            timestamptz,
    CONSTRAINT ai_summary_shared_complete CHECK (
        status <> 'shared' OR (shared_text IS NOT NULL AND shared_at IS NOT NULL)
    )
);
CREATE INDEX ai_summary_patient_idx ON ai_summary (patient_id, created_at DESC);
CREATE INDEX ai_summary_doctor_idx  ON ai_summary (doctor_id, created_at DESC);

-- =============================================================================
-- 6. REVIZIJA  (F-017)
-- =============================================================================

CREATE TABLE audit_log (
    audit_id     bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_id     bigint REFERENCES app_user (user_id),
    action       text   NOT NULL,          
    entity_type  text   NOT NULL,
    entity_id    bigint,
    old_value    jsonb,
    new_value    jsonb,
    created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_entity_idx ON audit_log (entity_type, entity_id, created_at);
CREATE INDEX audit_actor_idx  ON audit_log (actor_id, created_at);

CREATE FUNCTION audit_log_append_only() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    RAISE EXCEPTION 'audit_log is append-only (% not allowed)', TG_OP
        USING ERRCODE = 'insufficient_privilege';
END;
$$;
CREATE TRIGGER audit_log_no_change_trg
    BEFORE UPDATE OR DELETE ON audit_log
    FOR EACH ROW EXECUTE FUNCTION audit_log_append_only();
CREATE TRIGGER audit_log_no_truncate_trg
    BEFORE TRUNCATE ON audit_log
    FOR EACH STATEMENT EXECUTE FUNCTION audit_log_append_only();

COMMIT;
