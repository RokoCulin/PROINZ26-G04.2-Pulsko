# Pulsko backend (FastAPI)

## Pokretanje

```
cd backend
python3 -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # upisati svoj DATABASE_URL
uvicorn app.main:app --reload
```

API dokumentacija: http://127.0.0.1:8000/docs

Baza: vidi `db/Readme.md`.

## Struktura

- `app/routers/`: HTTP endpointi
- `app/schemas/`: oblik JSON-a (Pydantic)
- `app/services/`: poslovna logika
- `app/models/`: tablice baze (SQLAlchemy)
- `app/dependencies.py`: prijavljeni korisnik i provjera uloge

## Prijava (Google OAuth 2.0 / OpenID Connect)

1. Frontend šalje korisnika na `GET /auth/login?role=patient` ili `?role=doctor`. Uloga se sprema u sesiju.
2. Google vraća korisnika na `GET /auth/callback`:
   - novi korisnik → `pending_role` u sesiji, frontend ga registrira (`POST /auth/register`; liječnik šalje `institution` i `license_number`),
   - postojeći korisnik iste uloge → prijavljen,
   - postojeći korisnik druge uloge → **nije** prijavljen, preusmjeren na `/signin?error=role_mismatch&registered_as=<uloga>`,
   - administrator → prijavljen bez obzira na odabranu ulogu,
   - novi korisnik bez uloge → `/signin?error=no_account`.
3. `GET /auth/me` uvijek vraća 200 (`authenticated: false` kad korisnik nije prijavljen).
4. `POST` zahtjevi (`/auth/register`, `/auth/logout`, `/patient/checkins`) traže zaglavlje `X-CSRF-Token` s vrijednošću `csrf_token` iz `/auth/me`.

Jedan Google račun ima točno jednu ulogu; uloga se nikad ne mijenja automatski.

## Testovi

Testovi trebaju zasebnu bazu čije ime završava na `_test` (shema se pri svakom pokretanju briše i gradi iznova iz `db/001_create_schema.sql`):

```
createdb pulsko_test
pip install -r requirements-dev.txt
TEST_DATABASE_URL=postgresql://<korisnik>@localhost:5432/pulsko_test pytest
```

Bez `TEST_DATABASE_URL` testovi se preskaču. Google se u testovima ne poziva (zamijenjen je lažnim odgovorom).
