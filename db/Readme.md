# Baza podataka (PostgreSQL)

Pulsko koristi jednu PostgreSQL bazu (testirano na PostgreSQL 16, treba 14+). Model je opisan ER dijagramom u [`docs/puml/4-2-pulsko-data-ERD.puml`](../docs/puml/4-2-pulsko-data-ERD.puml) (20 tablica).

| Datoteka | Sadržaj |
| --- | --- |
| `001_kreiranje_sheme.sql` | tablice, ograničenja, indeksi, trigeri i view `v_potvrdene_laboratorijske_vrijednosti` |
| `002_pocetni_podaci.sql` | šifrarnik biomarkera (kompletna krvna slika); siguran za ponovno pokretanje |
| `003_demo_podaci.sql` | izmišljeni demo podaci: 1 administrator, 12 liječnika, 1.000 pacijenata i povezani zapisi (NF-01); preskače se ako već postoje |

## Tablice

| Područje | Tablice |
| --- | --- |
| Korisnici i pristup | `korisnik`, `profil_pacijenta`, `profil_lijecnika`, `veza_pacijent_lijecnik` |
| Zdravstveni podaci | `dnevni_checkin`, `biomarker`, `laboratorijski_nalaz`, `datoteka_nalaza`, `laboratorijska_vrijednost` |
| Terapija i termini | `plan_terapije`, `raspored_uzimanja`, `doza`, `termin` |
| Komunikacija | `poruka`, `obavijest`, `podsjetnik` |
| AI | `ai_poruka`, `pitanje_za_lijecnika`, `ai_sazetak` |
| Revizija | `revizijski_zapis` |



## Brzo pokretanje (iz korijena repozitorija)

```bash
createdb pulsko_dev
export DATABASE_URL="postgresql://<korisnik>:<lozinka>@localhost:5432/pulsko_dev"
./scripts/seed-database.sh            # shema + šifrarnik + demo podaci
./scripts/seed-database.sh --no-demo  # samo shema + šifrarnik
./scripts/seed-database.sh --reset    # briše sve tablice i gradi iznova
```

Ručno: `psql -d pulsko_dev -v ON_ERROR_STOP=1 -f db/001_kreiranje_sheme.sql`, pa isto za 002 i 003.
`DATABASE_URL` ne smije završiti u repozitoriju (NF-05).

## Pravila koja provodi sama baza

- najviše 2.125 prihvaćenih pacijenata po liječniku i samo odobreni liječnik može imati prihvaćenu vezu (NF-01, F-002)
- jedan aktivan zahtjev po paru pacijent–liječnik; jedan check-in po pacijentu po danu
- nalaz ima najviše 3 PDF-a, svaki do 10 MB; vrijednost i nalaz moraju pripadati istom pacijentu
- liječnik i pacijent ne mogu imati preklapajuće zakazane termine
- poruku mogu slati samo strane prihvaćene veze
- isti podsjetnik se ne stvara dvaput; `revizijski_zapis` je samo za dodavanje (F-017)

## Što nije u bazi (odluke aplikacije)

- sami PDF-ovi: u `datoteka_nalaza.putanja_pohrane` je samo putanja do object storagea
- provjera da termin nije u prošlosti i da je liječnik povezan s pacijentom prije čitanja podataka (UC-016)
- generiranje redaka `doza` iz `raspored_uzimanja`

## Demo prijava

Demo korisnici imaju `oidc_pruzatelj = 'demo'`, npr. `demo.pacijent0001@example.test`, `demo.lijecnik01@example.test`, `demo.admin01@example.test`. Za prijavu tijekom razvoja postavi njihov `oidc_pruzatelj` i `oidc_subjekt` na identitet svojeg testnog OIDC računa (primjer je u zaglavlju `003_demo_podaci.sql`).
