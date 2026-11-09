
Pulsko koristi jednu PostgreSQL bazu (testirano na PostgreSQL 16, treba 14+). Model je prikazan ER dijagramom u [`docs/puml/4-2-pulsko-data-ERD.puml`](../docs/puml/4-2-pulsko-data-ERD.puml) (20 tablica).

| Datoteka | Sadržaj |
| --- | --- |
| `001_create_schema.sql` | tablice, ograničenja, indeksi, trigeri i view `v_confirmed_lab_values` |
| `002_seed_reference_data.sql` | šifrarnik biomarkera (kompletna krvna slika); jedini podaci koje baza ima od početka, potrebni i na stvarnom sustavu; siguran za ponovno pokretanje |

## Tablice

| Područje | Tablice |
| --- | --- |
| Korisnici i pristup | `app_user`, `patient_profile`, `doctor_profile`, `doctor_patient_link` |
| Zdravstveni podaci | `daily_checkin`, `biomarker`, `lab_report`, `lab_report_file`, `lab_value` |
| Terapija i termini | `therapy_plan`, `therapy_schedule`, `dose_event`, `appointment` |
| Komunikacija | `message`, `notification`, `reminder` |
| AI | `ai_chat_message`, `patient_question`, `ai_summary` |
| Revizija | `audit_log` |

## Pokretanje (iz korijena repozitorija)

```bash
createdb pulsko_dev
export DATABASE_URL="postgresql://<korisnik>:<lozinka>@localhost:5432/pulsko_dev"
./scripts/setup-database.sh            # shema + šifrarnik
./scripts/setup-database.sh --reset    # briše SVE tablice i gradi iznova (traži potvrdu)
```

Ručno: `psql -d pulsko_dev -v ON_ERROR_STOP=1 -f db/001_create_schema.sql`, pa isto za `002`.

**Pažnja:** `--reset` na stvarnoj bazi uništava sve podatke. Koristi ga samo lokalno.

## Kako se tablice pune

1. **Prva prijava preko OAuth/OIDC-a:** backend upisuje redak u `app_user`.
2. **Odabir uloge:** pacijent dobiva redak u `patient_profile`, a liječnik u `doctor_profile` sa statusom `pending`.
3. **Odobrenje liječnika:** administrator postavlja `approval_status = 'approved'`. Bez toga baza ne dopušta liječniku prihvaćanje veze s pacijentom.
4. Ostali podaci (veze, check-inovi, nalazi, terapija, termini, poruke) nastaju radom korisnika.

### Prvi administrator
Aplikacija ne smije dopustiti da se netko sam registrira kao administrator, pa se prvi administrator upisuje ručno jednom po bazi:

```sql
INSERT INTO app_user (oidc_provider, oidc_subject, email, display_name, role)
VALUES ('<pružatelj>', '<sub iz OIDC prijave>', 'ime@primjer.hr', 'Ime Prezime', 'admin');
```

`oidc_provider` i `oidc_subject` ovise o odabranom pružatelju prijave; backend ih dobiva pri prvoj prijavi.

## Pravila koja provodi sama baza

- najviše 2.125 prihvaćenih pacijenata po liječniku i samo odobreni liječnik može imati prihvaćenu vezu (NF-01, F-002)
- jedan aktivan zahtjev po paru pacijent–liječnik; jedan check-in po pacijentu po danu
- nalaz ima najviše 3 PDF-a, svaki do 10 MB; vrijednost i nalaz moraju pripadati istom pacijentu
- liječnik i pacijent ne mogu imati preklapajuće zakazane termine
- poruku mogu slati samo strane prihvaćene veze
- isti podsjetnik se ne stvara dvaput; `audit_log` je samo za dodavanje (F-017)

Greške koje baza vraća (npr. `Doctor % already has the maximum of 2125 patients`) backend treba uhvatiti i pretvoriti u poruku korisniku.

## Što nije u bazi (odluke aplikacije)

- sami PDF-ovi: u `lab_report_file.storage_path` je samo putanja do object storagea
- provjera da termin nije u prošlosti i da je liječnik povezan s pacijentom prije čitanja podataka (UC-016)
- generiranje redaka `dose_event` iz `therapy_schedule`
- slanje e-pošte i izrada podsjetnika
