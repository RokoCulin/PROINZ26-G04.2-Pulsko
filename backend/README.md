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

Dogovor API-ja s JSON primjerima: [`API.md`](API.md).

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

## Prvi administrator

Uloga administratora ne može se odabrati u aplikaciji. Prvi admin postavlja se varijablom okruženja:

1. U `.env` upisati Google e-mail(ove), odvojene zarezom: `ADMIN_EMAILS=ime.prezime@gmail.com`
2. Ponovno pokrenuti backend.
3. Tim se računom prijaviti na `/signin`, s bilo kojom odabranom ulogom. Backend stvara korisnika s ulogom `admin` (bez profila pacijenta ili liječnika) i preusmjerava na `/admin`.

Vrijedi samo za račun koji se **još nije** registrirao. Ako je e-mail već registriran kao pacijent ili liječnik, uloga se ne mijenja (backend samo zapiše upozorenje u log), pa za admina treba koristiti zaseban Google račun. Nakon što je admin stvoren, e-mail može ostati na popisu ili se maknuti.
