# Issues za GitHub – grana `ponedjeljak-m1`

Popis issuea za otvaranje na GitHubu (rok M1, ponedjeljak 16. 11.). Za napravljene stavke naveden je commit kojim se issue može zatvoriti. Svi commitovi su samo lokalni, na grani `ponedjeljak-m1`.

Testovi backenda: `cd backend && TEST_DATABASE_URL=postgresql://<korisnik>@localhost:5432/pulsko_test pytest` (31 test, svi prolaze). Frontend: `npm run build` prolazi.

---

## Napravljeno

### Prijava: uloga se bira prije Googlea i provodi na backendu (B1–B6)
**Oznake:** feature
**Zaduženi (prijedlog):** Hrvoje
**Opis:** `GET /auth/login?role=patient|doctor` sprema odabranu ulogu u sesiju (nevaljana vrijednost → 422). Callback je čita prije `session.clear()`. Postojeći korisnik druge uloge se **ne** prijavljuje i vraća se na `/signin?error=role_mismatch&registered_as=<uloga>`. Admin se prijavljuje bez obzira na odabir. Novi korisnik bez uloge → `/signin?error=no_account`. `POST /auth/register` uzima ulogu iz sesije (`pending_role`), a ne iz tijela. `/auth/me` vraća `pending_role`.
**Kriterij gotovosti:** pravila 1–6 iz STO_FALI_M1.md 1.1.1 vrijede i kad se frontend zaobiđe; testovi u `backend/tests/test_auth.py` prolaze.
**Status:** napravljeno u commitu `1496e2a`

### Testovi za tok prijave i registracije (B7)
**Oznake:** feature
**Zaduženi (prijedlog):** Hrvoje
**Opis:** pytest s pravom PostgreSQL testnom bazom (ime mora završavati na `_test`, shema se gradi iz `db/001_create_schema.sql`). Google je zamijenjen lažnim odgovorom. Pokriveno: novi pacijent, novi liječnik bez licence (422), liječnik s podacima (pending), uloga iz tijela se ignorira, CSRF, postojeći korisnik ista/druga uloga, admin, `no_account`, nevaljan `role` (422), odjava.
**Kriterij gotovosti:** `pytest` prolazi; upute u `backend/README.md`.
**Status:** napravljeno u commitu `076b656`

### Frontend prijava: jedan Google gumb, odabir uloge, registracija liječnika (F1–F7)
**Oznake:** feature
**Zaduženi (prijedlog):** Dora+Antonio
**Opis:** maknuta dva gumba OIDC/OAuth i `provider`, potpuno maknut `sessionStorage`. Gumb „Prijava putem Googlea” je onemogućen dok uloga nije odabrana. Pacijent se registrira odmah, a liječnik dobiva formu (ustanova, broj licence). Prikazuju se poruke za `role_mismatch` i `no_account` te greške 401, 409 i 422. Preusmjeravanje ide po ulozi (admin → `/admin`). Maknut je tekst „Sign-in is simulated”.
**Kriterij gotovosti:** ručna provjera toka (vidi otvoreni issue „Ručna provjera”).
**Status:** napravljeno u commitu `14d90fe`

### Zaštita ruta, gumb za odjavu, `VITE_API_URL`, poruka „čeka odobrenje”
**Oznake:** feature
**Zaduženi (prijedlog):** Dora+Antonio
**Opis:** `src/api.js` (jedna adresa backenda iz `VITE_API_URL`, `credentials: "include"`, `X-CSRF-Token`). `RequireRole` u `src/auth.jsx`: neprijavljeni → `/signin` (`/auth/me` vraća 200 s `authenticated: false`), druga uloga → vlastita ploča, liječnik `pending`/`rejected` → poruka umjesto ploče. `LogoutButton` je na pločama pacijenta, liječnika i admina.
**Kriterij gotovosti:** `/patient` i `/doctor` se ne otvaraju bez prijave; pacijent ne ulazi na `/doctor` i obratno; odjava vodi na `/signin`.
**Status:** napravljeno u commitu `bc0640b` (napomena: `App.jsx` u tom commitu već uvozi `AdminHome`, koji stiže tek u `3648d0d`, pa se `bc0640b` sam za sebe ne builda; vrh grane se builda)

### Admin stranica `/admin` (F8, F-019)
**Oznake:** feature
**Zaduženi (prijedlog):** Dora+Antonio
**Opis:** popis liječnika na čekanju (`GET /admin/doctors`) s gumbima Odobri i Odbij (razlog je obavezan). Ploča liječnika prikazuje pravo ime umjesto „Dr. Alex Morgan”.
**Kriterij gotovosti:** admin odobri liječnika, a liječnik nakon ponovnog učitavanja vidi `/doctor`.
**Status:** napravljeno u commitu `3648d0d`

### CSRF zaštita na admin POST rutama
**Oznake:** bug
**Zaduženi (prijedlog):** Hrvoje
**Opis:** `/admin/doctors/{id}/approve` i `/reject` nisu provjeravali `X-CSRF-Token`, za razliku od `/auth/*`. Provjera je izdvojena u `require_csrf` (`auth_dependencies.py`) i dodana na obje rute.
**Kriterij gotovosti:** POST bez tokena vraća 403 (`backend/tests/test_admin.py`).
**Status:** napravljeno u commitu `97a5109`

### Backend API za dnevni check-in (issue #5)
**Oznake:** feature
**Zaduženi (prijedlog):** Roko
**Opis:** `POST /patient/checkins` (CSRF, samo pacijent) sprema ili zamjenjuje današnji unos: 201 za novi, 200 za ažuriran. `GET /patient/checkins?limit=N` (1–90, zadano 7) vraća unose od najnovijeg. Rasponi su isti kao CHECK ograničenja u bazi; prazan unos ili nepoznato polje → 422. „Danas” se računa po vremenskoj zoni Europe/Zagreb.
**Kriterij gotovosti:** `backend/tests/test_checkins.py` prolazi.
**Status:** napravljeno u commitu `1ee6b5a` (zatvara #5)

### Frontend check-in i prikaz na nadzornoj ploči (issue #6)
**Oznake:** feature
**Zaduženi (prijedlog):** Dora+Antonio
**Opis:** `PatientCheckIn.jsx` šalje `POST /patient/checkins` umjesto pisanja u `localStorage` (`pulsko-metrics`). Raspoloženje se mapira Great=5 … Unwell=1, prazno polje → `null`. Forma se popuni današnjim unosom, a greške 401 i 422 se prikazuju. `PatientHome.jsx` čita `GET /patient/checkins?limit=7` (kartice + tablica zadnjih 7 dana) i prikazuje pravo ime korisnika.
**Kriterij gotovosti:** unos ostaje nakon brisanja podataka preglednika i vidi se na `/patient`.
**Status:** napravljeno u commitu `24c37b7` (zatvara #6)

### Dijagram razreda za prijavu/registraciju i check-in
**Oznake:** docs
**Zaduženi (prijedlog):** Jakov (+ Roko)
**Opis:** novi `docs/puml/4-3-pulsko-domain-CD.puml` (routeri, ovisnosti, servisi, sheme, modeli, ključevi sesije), usklađen s kodom. Obrisan predložak `class-diagram.puml`.
**Kriterij gotovosti:** dijagram se renderira (vidi otvoreni issue) i ugrađen je u docs 4.3.2.
**Status:** napravljeno u commitu `0a0f474`

### UC-9 (prijava): alternativni tijek „račun registriran s drugom ulogom”
**Oznake:** docs
**Zaduženi (prijedlog):** Roko
**Opis:** u `docs/3-Obrasci-uporabe.md`, UC-9 dobio je alternativni tijek i redak „Ograničenja” (jedan račun = jedna uloga, ulogu ne mijenja sustav sam). Napomena: plan to zove UC-001, a u dokumentaciji je prijava **UC-9**.
**Kriterij gotovosti:** tekst odgovara ponašanju backenda (`role_mismatch`).
**Status:** napravljeno u commitu `51a67a5`

---

## F-003: povezivanje pacijenta s liječnikom (UC-3, UC-5.3)

Tablica `doctor_patient_link` već ima sve što treba: `status` (`pending`/`accepted`/`rejected`, uz `withdrawn`/`ended`), `requested_at`, `responded_at` i djelomični jedinstveni indeks `link_active_pair_uq` za par u stanju pending/accepted. Triger `enforce_link_rules` dopušta `accepted` samo odobrenom liječniku i najviše 2125 pacijenata. **Migracija nije potrebna.** Projekt nema Alembic; shema se gradi iz `db/*.sql`.

### F-003 backend: servis i endpointi za povezivanje
**Oznake:** backend, feature
**Zaduženi (prijedlog):** Roko
**Opis:** `LinkService` i endpointi:
- `POST /patient/doctors` – pacijent šalje zahtjev po e-mailu liječnika;
- `GET /patient/doctors` – pacijent vidi svoje veze i njihov status;
- `GET /doctor/requests` – liječnik vidi zahtjeve na čekanju upućene njemu;
- `POST /doctor/requests/{id}/accept` i `/reject`;
- `GET /doctor/patients` – liječnik vidi prihvaćene pacijente.

Koriste se postojeći `require_patient`, `require_approved_doctor` i `require_csrf`.

**Kriterij gotovosti:**
- zahtjev se može poslati samo odobrenom liječniku; inače 404 „Liječnik nije pronađen”;
- za par s pending ili accepted vezom vraća se 409;
- nakon `rejected` pacijent smije poslati novi zahtjev;
- liječnik obrađuje samo zahtjeve upućene njemu (tuđi → 404) i samo one na čekanju (inače 409);
- `responded_at` se postavlja pri odgovoru;
- krive uloge dobivaju 403, a neprijavljeni 401.

**Status:** napravljeno u commitu `63eaf14`

### F-003 testovi (pytest)
**Oznake:** backend, test
**Zaduženi (prijedlog):** Hrvoje
**Opis:** `backend/tests/test_links.py`: sretni put, liječnik nije odobren ili ne postoji, duplikat (pending i accepted), tuđi zahtjev, ponovni zahtjev nakon odbijanja, krive uloge, CSRF.
**Kriterij gotovosti:** svi testovi prolaze zajedno s postojećima.
**Status:** ostaje otvoreno

### F-003 frontend pacijent: sekcija „Moj liječnik” na /patient
**Oznake:** frontend, feature
**Zaduženi (prijedlog):** Dora+Antonio
**Opis:** na `/patient` se lažni popis liječnika i `localStorage` (`pulsko-patient-requests`) zamjenjuju formom za e-mail liječnika i popisom veza sa statusom (na čekanju / povezano / odbijeno).
**Kriterij gotovosti:**
- zahtjev se šalje na backend, a novi zahtjev odmah se vidi sa statusom „na čekanju”;
- greške 404 i 409 prikazuju se korisniku;
- nakon osvježavanja status je i dalje točan.

**Status:** ostaje otvoreno

### F-003 frontend liječnik: „Zahtjevi pacijenata” i popis pacijenata na /doctor
**Oznake:** frontend, feature
**Zaduženi (prijedlog):** Dora+Antonio
**Opis:** na ploči liječnika dodaju se zahtjevi na čekanju s gumbima Prihvati i Odbij te popis povezanih pacijenata. Brojke „Pending requests” i „Connected patients” dolaze s backenda.
**Kriterij gotovosti:**
- Prihvati premješta pacijenta u popis pacijenata;
- Odbij uklanja zahtjev;
- greške se prikazuju;
- pacijent nakon osvježavanja vidi novi status.

**Status:** ostaje otvoreno

### F-003 dogovor API-ja s JSON primjerima
**Oznake:** docs
**Zaduženi (prijedlog):** Roko
**Opis:** novi `backend/API.md` s endpointima za povezivanje (i za check-in, jer `checkin_api.md` ne postoji), JSON primjerima i kodovima grešaka. Poveznica iz `backend/README.md`.
**Kriterij gotovosti:** primjeri odgovaraju stvarnim odgovorima (provjereno testovima).
**Status:** ostaje otvoreno

### F-003 / F-020: obavijest e-poštom o zahtjevu i odgovoru (nije u ovom opsegu)
**Oznake:** feature
**Zaduženi (prijedlog):** Borna O.
**Opis:** UC-5.3 kaže „sustav obavještava pacijenta”. Za M1 nije potrebno, pa obavijest (u aplikaciji i/ili e-poštom) liječniku o novom zahtjevu i pacijentu o odgovoru ostaje za kasnije.
**Kriterij gotovosti:** pri slanju i obradi zahtjeva nastaje zapis u `notification` i/ili e-mail.
**Status:** ostaje otvoreno

### F-017: audit_log se još nigdje ne koristi
**Oznake:** backend, feature
**Zaduženi (prijedlog):** Hrvoje
**Opis:** model `AuditLog` postoji, ali ga nijedan servis ne piše: ni odobravanje liječnika, ni povezivanje. Zato ga u F-003 nisam uvodio. Kad se uvede, treba bilježiti zahtjev, prihvaćanje i odbijanje veze te odluke admina.
**Kriterij gotovosti:** zajednička pomoćna funkcija za audit, korištena u `DoctorService` i `LinkService`, uz testove.
**Status:** ostaje otvoreno

### F-003: povlačenje zahtjeva i prekid veze
**Oznake:** feature, pitanje
**Zaduženi (prijedlog):** Roko
**Opis:** baza podržava `withdrawn` i `ended`, a UC-5.3 spominje povlačenje zahtjeva. Nije traženo za M1, pa nije implementirano.
**Kriterij gotovosti:** odluka tima; po potrebi `POST /patient/doctors/{id}/withdraw`.
**Status:** ostaje otvoreno

### Stranice /doctor/requests i /doctor/patients i dalje imaju demo podatke
**Oznake:** frontend
**Zaduženi (prijedlog):** Dora+Antonio
**Opis:** F-003 je dodan na samu ploču `/doctor`. Zasebne stranice `DoctorRequests.jsx` i `DoctorPatients.jsx` i dalje prikazuju izmišljene podatke. Treba ih prebaciti na iste endpointe ili ukloniti poveznice.
**Kriterij gotovosti:** nema demo podataka o vezama ni na jednoj stranici.
**Status:** ostaje otvoreno

## Ostaje otvoreno

### Ručna provjera cijelog toka s pravim Google računom
**Oznake:** feature
**Zaduženi (prijedlog):** Hrvoje
**Opis:** Google prijava je u testovima simulirana. Treba proći pravi tok i zapisati rezultat za docs 5: novi pacijent → registracija → `/patient` → check-in → odjava → ponovna prijava; isti račun s ulogom Liječnik → poruka; novi liječnik → forma → „čeka odobrenje”; admin → `/admin` → odobri → liječnik vidi `/doctor`.
**Kriterij gotovosti:** svi koraci prolaze, rezultat je zapisan u `docs/5-Ispitivanje.md`.
**Status:** ostaje otvoreno

### Postavljanje prvog administratora (skripta + README)
**Oznake:** feature
**Zaduženi (prijedlog):** Jakov
**Opis:** `db/Readme.md` ima samo `INSERT` za admina s ručno upisanim `oidc_subject`. Plan traži skriptu koja postojećem korisniku postavi `role='admin'`. **Pazi:** `patient_profile` i `doctor_profile` imaju FK `(user_id, role)` na `app_user`, pa običan `UPDATE app_user SET role='admin'` pada ako korisnik već ima profil. Skripta zato mora u istoj transakciji prvo obrisati profil (i check-inove pacijenta), ili admin treba poseban Google račun: taj se jednom prijavi kao pacijent da se sazna `oidc_subject`, pa se profil obriše i uloga promijeni.
**Kriterij gotovosti:** skripta u `scripts/` ili `db/`, opisana u README; admin se prijavi i vidi `/admin`.
**Status:** zamijenjeno issueom „Postavljanje prvog admina preko ADMIN_EMAILS” (skripta više nije potrebna za prvog admina)

### Provjera renderiranja UML dijagrama i ugradnja u docs 4.3.2
**Oznake:** docs
**Zaduženi (prijedlog):** Jakov
**Opis:** PlantUML ni Graphviz nisu bili dostupni lokalno, pa je sintaksa `4-3-pulsko-domain-CD.puml` provjerena samo ručno. GitHub Action renderira SVG tek nakon pusha na `main`. U `docs/4-Arhitektura-i-oblikovanje.md` 4.3.2 je i dalje primjer CrisisMap.
**Kriterij gotovosti:** SVG je generiran bez greške, ugrađen u 4.3.2 s analizom, a CrisisMap primjer i stari `crisismap` `.puml` predlošci su maknuti.
**Status:** ostaje otvoreno

### MVP: F-003 (povezivanje pacijent–liječnik) i F-004 (nadzorna ploča)
**Oznake:** pitanje
**Zaduženi (prijedlog):** Roko
**Opis:** u docs 2.1.1 su u MVP-u 1. ciklusa, ali nisu napravljeni. Pretraga liječnika na `/patient` koristi izmišljene liječnike i `localStorage`; ploča liječnika ima demo brojke. Vidi prijedlog prioriteta niže.
**Kriterij gotovosti:** ili su napravljeni, ili su u 2.1.1 premješteni u 2. ciklus.
**Status:** ostaje otvoreno

### Poznati nedostaci: stranice s demo podacima
**Oznake:** docs
**Zaduženi (prijedlog):** Borna O.
**Opis:** `PatientLabs.jsx` (nalazi, 2. ciklus) i dalje koristi `localStorage`. Demo podatke imaju i terapija, termini, poruke, Health Agent te sve stranice liječnika osim imena na ploči. Treba ih navesti u „poznatim nedostacima” (docs 7 / README).
**Kriterij gotovosti:** popis u dokumentaciji.
**Status:** ostaje otvoreno

### CI ne pokreće ništa
**Oznake:** feature
**Zaduženi (prijedlog):** Borna F.
**Opis:** `.github/workflows/ci.yml` samo ispisuje `echo`. Treba dodati job s PostgreSQL servisom koji pokreće `pytest` (`TEST_DATABASE_URL=..._test`) i job `npm ci && npm run build`.
**Kriterij gotovosti:** PR pokazuje zelene/crvene provjere.
**Status:** ostaje otvoreno

### ESLint nema konfiguraciju
**Oznake:** bug
**Zaduženi (prijedlog):** Dora+Antonio
**Opis:** `npm run lint` pada s „ESLint couldn't find an eslint.config.(js|mjs|cjs) file”, iako su paketi u `devDependencies`.
**Kriterij gotovosti:** `eslint.config.js` postoji i `npm run lint` prolazi.
**Status:** ostaje otvoreno

---

## Bugovi primijećeni usput

### Postavljanje prvog admina preko ADMIN_EMAILS
**Oznake:** backend
**Zaduženi (prijedlog):** Hrvoje (auth)
**Opis:**
- *Problem:* administrator se ne može registrirati kroz aplikaciju (namjerno, F-001: ulogu admina nije moguće odabrati). Jedini način bio je ručni `INSERT` u `app_user` s `oidc_subject`, koji se ne zna prije prve Google prijave. Promjena uloge postojećeg korisnika (`UPDATE role='admin'`) pada zbog FK `(user_id, role)` s `patient_profile`/`doctor_profile`.
- *Rješenje:* varijabla okruženja `ADMIN_EMAILS` (popis e-mailova odvojenih zarezom; razmaci i velika slova se zanemaruju; prazno = nema automatskog admina). U `/auth/callback`, nakon što Google vrati potvrđen e-mail: ako je e-mail na popisu, a korisnik ne postoji, stvara se `app_user` s `role='admin'`, bez profila pacijenta ili liječnika, i preusmjerava na `/admin`. Odabrana uloga s `/signin` se tada ignorira. Postojeći korisnik s drugom ulogom se **ne** mijenja: u log ide upozorenje, a prijava ide dosadašnjim tokom. Postojeći admin i svi ostali korisnici ponašaju se kao i prije.

**Kriterij gotovosti:**
- novi e-mail s popisa nakon Google prijave postaje admin bez `patient_profile` i `doctor_profile` i završava na `/admin`;
- e-mail izvan popisa ide normalnim tokom registracije;
- popis je neosjetljiv na velika/mala slova i razmake;
- postojeći pacijent ili liječnik s popisa ostaje nepromijenjen;
- pytest testovi prolaze, a postupak je opisan u `backend/README.md` i `backend/.env.example`.

**Status:** napravljeno u commitu „Auth: prvi administrator preko ADMIN_EMAILS” (hash: `git log --oneline -1 -- backend/app/config.py`; commit ne može sadržavati vlastiti hash)

### Prijedlog: promaknuće postojećeg korisnika u admina (nije implementirano)
**Oznake:** pitanje
**Zaduženi (prijedlog):** Hrvoje
**Opis:** ako je postojeći pacijent ili liječnik na `ADMIN_EMAILS`, sada ga se namjerno ne promiče automatski. Promaknuće bi moralo obrisati profil (i kod pacijenta njegove check-inove, nalaze i veze), jer FK `(user_id, role)` ne dopušta admina s profilom, a F-002 kaže da admin ne smije vidjeti zdravstvene podatke. To je nepovratno brisanje zdravstvenih podataka pokrenuto samo varijablom okruženja. **Prijedlog:** ne promicati automatski. Za prvog admina koristiti zaseban Google račun. Ako ikad zatreba promaknuće, napraviti ga kao ručnu SQL skriptu u transakciji, uz izričitu potvrdu i zapis u `audit_log`.
**Kriterij gotovosti:** odluka tima.
**Status:** ostaje otvoreno

### Nakon spremanja dnevnog check-ina vratiti pacijenta na početnu stranicu
**Oznake:** frontend, bug/UX
**Zaduženi (prijedlog):** Dora+Antonio (frontend pacijent)
**Opis:**
- *Trenutno ponašanje:* nakon klika na „Save daily check-in” na `/patient/check-in` pacijent ostaje na formi i vidi samo kratku poruku ispod gumba.
- *Očekivano ponašanje:* nakon uspješnog spremanja pacijent se vraća na `/patient`, gdje vidi poruku „Check-in spremljen” i upravo spremljene vrijednosti.

**Kriterij gotovosti:**
- preusmjeravanje na `/patient` događa se samo nakon uspješnog odgovora backenda (201 ili 200);
- kod greške (401, 422, 409, backend nedostupan) pacijent ostaje na formi s porukom i unesenim vrijednostima;
- `/patient` ponovno dohvaća `GET /patient/checkins` i prikazuje upravo spremljene vrijednosti, bez zastarjelih podataka;
- na `/patient` je vidljiva poruka „Check-in spremljen”, koja se ne pojavljuje ponovno nakon osvježavanja stranice.

**Status:** napravljeno u commitu „Check-in: nakon spremanja povratak na /patient s porukom” (hash: `git log --oneline -1 -- ISSUES_ZA_GIT.md`; commit ne može sadržavati vlastiti hash)

### Odustajanje na Googleu ostavlja korisnika na JSON greški backenda
**Oznake:** bug
**Zaduženi (prijedlog):** Hrvoje
**Opis:** kad korisnik na Googleu klikne „Odustani”, Google vraća na `/auth/callback?error=access_denied` (bez `code`), a backend je vraćao JSON 400 na adresi backenda. Sad callback prvo provjerava `error`: `access_denied` → `/signin?error=oauth_cancelled`, ostale Google greške → `/signin?error=oauth_failed`. Isto vrijedi kad `authorize_access_token` baci `OAuthError` (npr. `mismatching_state`). Prije preusmjeravanja brišu se privremeni podaci prijave (`requested_role`, `pending_*`, Authlib state). `user_id` se ne briše, pa lažni callback ne odjavljuje prijavljenog korisnika. Frontend prikazuje „Prijava je otkazana.” odnosno „Prijava nije uspjela, pokušaj ponovno.”
**Kriterij gotovosti:** odustajanje vraća na `/signin` s porukom; testovi `test_odustajanje_na_googleu_vraca_na_signin`, `test_neispravan_state_vraca_oauth_failed`, `test_druga_google_greska_vraca_oauth_failed`, `test_lazni_callback_ne_odjavljuje_prijavljenog` prolaze.
**Status:** napravljeno u commitu „Prijava: povratak na /signin kad korisnik odustane ili Google prijava ne uspije” (hash: `git log --oneline -1 -- ISSUES_ZA_GIT.md`; commit ne može sadržavati vlastiti hash)

### Nepotvrđen e-mail i nedostajući podaci od Googlea još vraćaju JSON
**Oznake:** bug
**Zaduženi (prijedlog):** Hrvoje
**Opis:** kad je `email_verified` različit od `true` (403) ili nedostaju `sub`/`email` (400), callback i dalje vraća JSON umjesto preusmjeravanja na `/signin?error=...`. To je rijetko kod Google računa.
**Kriterij gotovosti:** preusmjeravanje s porukom na frontendu; test.
**Status:** ostaje otvoreno

### Razlog odbijanja liječnika može biti prazan
**Oznake:** bug
**Zaduženi (prijedlog):** Hrvoje
**Opis:** `RejectDoctorIn.reason: str` prihvaća `""`, a CHECK u bazi traži samo `IS NOT NULL`. Frontend `/admin` to blokira, ali API ne.
**Kriterij gotovosti:** `Field(min_length=1)` (nakon `strip`) i test za 422.
**Status:** ostaje otvoreno

### Odbijeni liječnik ne vidi razlog, nema obavijesti ni audit zapisa
**Oznake:** feature
**Zaduženi (prijedlog):** Hrvoje
**Opis:** F-019 kaže „sustav bilježi odluku i obavještava korisnika”. `DoctorService` ne piše u `audit_log` ni `notification`, a `/auth/me` ne vraća `rejection_reason`.
**Kriterij gotovosti:** odluka u `audit_log`, obavijest korisniku, razlog vidljiv na poruci „zahtjev je odbijen”.
**Status:** ostaje otvoreno (2. ciklus ili 2.8)

### Ponovljeni broj licence daje nejasnu poruku
**Oznake:** bug
**Zaduženi (prijedlog):** Hrvoje
**Opis:** `doctor_license_uq` → `IntegrityError` → 409 „Registracija nije uspjela”. Frontend sad piše „račun ili broj licence već postoji”, ali backend ne razlikuje ta dva slučaja.
**Kriterij gotovosti:** zasebna poruka za zauzet broj licence.
**Status:** ostaje otvoreno

---

## Otvorena pitanja (treba odluka tima)

### Dogovor o check-in API-ju (`checkin_api.md`) ne postoji u repou
**Oznake:** pitanje
**Zaduženi (prijedlog):** Roko
**Opis:** plan se poziva na `/mnt/project-files/dogovor/checkin_api.md`, ali datoteke nema ni tamo ni u repou. Napravljeni ugovor:
- `POST /patient/checkins`, tijelo `{general_state 1–5, sleep_hours 0–24, steps 0–100000, heart_rate_bpm 30–220, activity_minutes 0–1440, activity_description ≤1000}`, sva polja su opcionalna, barem jedno mora biti zadano, nepoznata polja → 422; odgovor 201 ili 200.
- `GET /patient/checkins?limit=N`.

Treba potvrditi da je to dogovor i spremiti ga u `docs/`.
**Kriterij gotovosti:** ugovor je u repou i odgovara kodu.
**Status:** ostaje otvoreno

### Ponovno slanje check-ina istog dana: zamjena ili spajanje?
**Oznake:** pitanje
**Zaduženi (prijedlog):** Roko
**Opis:** sad se današnji unos **zamjenjuje** (polje koje nije poslano postaje `null`). Forma uvijek šalje sva polja i popuni se današnjim unosom, pa korisnik ništa ne gubi. Ako će drugi klijent slati samo dio polja, bolje je spajanje.
**Kriterij gotovosti:** odluka zapisana u UC-1.1.
**Status:** ostaje otvoreno

### Polje „Additional note” iz stare forme nema stupac u bazi
**Oznake:** pitanje
**Zaduženi (prijedlog):** Roko
**Opis:** `daily_checkin` nema stupac za bilješku o simptomima, pa je polje maknuto. Forma umjesto toga ima „Activity (minutes)” i „Activity description”, kako stoji u bazi i F-009. Ako bilješka treba, dodati stupac `note` u shemu, model i API.
**Kriterij gotovosti:** odluka; po potrebi migracija.
**Status:** ostaje otvoreno

### Vremenska zona za „danas”
**Oznake:** pitanje
**Zaduženi (prijedlog):** Roko
**Opis:** backend i frontend računaju današnji datum po Europe/Zagreb, ne po vremenu servera (na deployu je obično UTC, pa bi unos u 00:30 inače pao na prethodni dan). Potvrditi.
**Kriterij gotovosti:** odluka zapisana (npr. u docs 4 ili NF-zahtjevima).
**Status:** ostaje otvoreno

### Postojeći korisnik koji otvori `/auth/login` bez `?role=`
**Oznake:** pitanje
**Zaduženi (prijedlog):** Hrvoje
**Opis:** po planu (B3) se razlikuje od svoje uloge, pa dobiva `role_mismatch` i nije prijavljen (admin je iznimka). Frontend uvijek šalje ulogu, pa se to događa samo kod ručnog URL-a. Odgovara li to, ili ga u tom slučaju prijaviti?
**Kriterij gotovosti:** odluka.
**Status:** ostaje otvoreno

### Jezik sučelja
**Oznake:** pitanje
**Zaduženi (prijedlog):** Dora+Antonio
**Opis:** stranica prijave, poruka „čeka odobrenje” i `/admin` su na hrvatskom (tekstovi su iz plana), a ostatak aplikacije je na engleskom. Poruke grešaka s backenda su na hrvatskom. Treba odlučiti jedan jezik.
**Kriterij gotovosti:** cijelo sučelje je na jednom jeziku.
**Status:** ostaje otvoreno

### Plan (STO_FALI_M1.md) je djelomično zastario
**Oznake:** pitanje
**Zaduženi (prijedlog):** Roko
**Opis:** (1) UC-001 je u dokumentaciji UC-9. (2) Pod 1.5 piše da nema generalizacije aktera, a `3-1-Pulsko-system-UC.puml` već ima `Patient -|> User` i `Doctor -|> User`. (3) Pod 1.4 piše da su svi F-zahtjevi „Visok”, a F-010, F-011, F-012, F-017 i F-020 su „Srednji”, što odgovara MoSCoW-u. Vidi prijedloge niže.
**Kriterij gotovosti:** plan ažuriran.
**Status:** ostaje otvoreno

---

## Prijedlozi za dokumentaciju (nisam mijenjao, odluka je tima)

### Prijedlog: prioriteti funkcijskih zahtjeva (docs 2.1 / 2.1.1)
**Oznake:** docs
**Zaduženi (prijedlog):** Roko
**Opis:** stupac „Prioritet” već prati MoSCoW grubo (Must → Visok, Should → Srednji), ali ne razlikuje MVP 1. ciklusa od Must 2. ciklusa, a MVP obećava F-003 i F-004 koji nisu napravljeni. Prijedlog:

| Zahtjev | Sada | Prijedlog | Zašto |
|---|---|---|---|
| F-001, F-002, F-005, F-006, F-009, F-019 | Visok, Must MVP | **Visok**, ostaje u MVP-u | napravljeno ili pokriveno ovom granom |
| F-003 (povezivanje) | Visok, Must MVP | **Visok**, premjestiti u **Must (2. ciklus)** | ne stižemo; bez povezivanja ionako nema liječničkih funkcija |
| F-004 (nadzorna ploča) | Visok, Must MVP | **Visok**, u MVP-u ostaje samo dio „sažetak check-ina”, a obveze/termini/terapija idu u 2. ciklus (ili cijeli F-004 u 2. ciklus) | ploča pacijenta sad stvarno prikazuje check-in; termini i terapija su 2. ciklus |
| F-007, F-008, F-013, F-014, F-015, F-016, F-018 | Visok, Must 2. ciklus | **Visok** | bez promjene |
| F-010, F-011, F-012, F-017, F-020 | Srednji, Should | **Srednji** | bez promjene |
| F-015, F-016 (AI) | Visok, Must 2. ciklus | razmotriti **Srednji / Should** | AI nije nužan za osnovnu vrijednost (praćenje + liječnik), a najveći je rizik |

Uz to, u tablicu 2.1 dodati stupac „Ciklus” (1/2) ili napisati MoSCoW oznaku umjesto Visok/Srednji, da asistent može izravno usporediti obećani MVP s onim što radi.
**Kriterij gotovosti:** 2.1 i 2.1.1 su usklađeni, a MVP odgovara onome što radi na M1.
**Status:** ostaje otvoreno

### Prijedlog: generalizacija aktera i UC-a (docs 3, UC dijagram)
**Oznake:** docs
**Zaduženi (prijedlog):** Roko (tekst), Dora+Antonio (dijagram)
**Opis:** generalizacija Korisnik ← Pacijent, Liječnik već postoji. Fali:
1. **Akter Administrator** kao treća specijalizacija aktera Korisnik (`Admin -|> User`). Postoji u docs 2 (A-03, F-001, F-002, F-019) i u kodu, ali ga UC dijagram i docs 3 nemaju (3.3 to izričito navodi kao izostavljeno).
2. **Novi UC „Odobravanje liječnika”** (F-019) s primarnim akterom Administrator. Može biti glavni UC (npr. UC-10 „Administracija korisnika”) s konkretnim UC-10.1 „Odobravanje ili odbijanje liječnika”, istim uzorkom generalizacije kao UC-1 do UC-8.
3. **„Registracija korisnika”** kao `<<extend>>` od UC-9 (uvjet: za Google račun ne postoji korisnički račun), a „Unos podataka liječnika (ustanova, licenca)” kao `<<extend>>` registracije (uvjet: odabrana uloga Liječnik). Tako se na dijagramu vidi tok iz 1.1.1 i alternativni tijek UC-9.
4. U 3.3 maknuti napomenu „Administrator nije prikazan kao akter”, a u tablicu aktera dodati Administratora.
**Kriterij gotovosti:** UC dijagram i docs 3 imaju Administratora, UC za F-019 i registraciju; 3.3 je usklađen.
**Status:** ostaje otvoreno
