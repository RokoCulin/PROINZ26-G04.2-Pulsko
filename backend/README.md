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

## Privremena prijava

Dok OAuth nije gotov, korisnik se zadaje zaglavljem `X-User-Id`.
