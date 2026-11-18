# Priprema objave Pulska na Vercelu

Cilj je objaviti postojeći React/Vite frontend i FastAPI backend iz istog `main`
na `https://progi-pulsko.vercel.app`. Ova priprema ne objavljuje backend, ne mijenja
Vercel projekt ni javnu domenu i ne dodaje PDF, AI, e-poštu ili podsjetnike.
Vercel Services je Beta; projektna dostupnost i stvarni cloud build još čekaju Roka.

## 1. Roko bilježi postojeći projekt prije bilo kakve promjene

U projektu koji poslužuje javnu domenu zabilježiti repo, Production Branch, Root
Directory, framework, install/build/output postavke, Node verziju te samo nazive
postojećih environment varijabli. Zapisati ID/URL i commit zadnjeg uspješnog
production deploymenta. Vrijednosti tajni ne slati u chat ili stavljati u ovaj zapis.

Djelomični Rokov zapis, dostavljen 18. 11. 2026. (nije neovisno očitan iz API-ja):

- Root Directory: `frontend`.
- Navedeni deployment: `proinz-26-g04-2-pulsko-59az4teb8-pulsko.vercel.app`.
- Environment varijable: Roko navodi da još nisu dodane.
- Node.js: `26.x`; zasad ostaviti postojeću verziju.
- Fluid Compute: enabled; Deployment Protection: Standard Protection.
- Build machine: Basic, 2 vCPU / 8 GB; Function CPU: Standard.
- Skew Protection i Cold Start Prevention: disabled.
- Prioritize Production Builds: enabled.

Još treba potvrditi povezani repo, Production Branch, Framework Preset, stvarne
install/build/output overrideove (ili da su zadani), uspješan status navedenog
deploymenta i njegov Git commit. Nije potvrđeno da odgovara lokalnom `main` commitu.
Agentova Vercel veza zasad nema dostupan Rokov projekt, pa se ove postavke ne
mijenjaju automatski. Zadržati postojeći frontend dok preduvjeti nisu spremni.

Read-only opažanja javne adrese 18. 11. 2026. prije promjena:

- `/` vraća 200 i HTML.
- Izravni `/signin` i `/patient` vraćaju 404.
- `/api/health` vraća 404; javni backend ovime nije potvrđen.
- Trenutačni javni JS bundle sadrži `localhost:8000`.

To nisu Vercel projektne postavke niti dokaz o vlasniku ili commitu deploymenta.
Postojeći frontend ostaje online tijekom pripreme. Ne brisati projekt ni domenu.

## 2. Borna priprema PR i lokalne provjere

Korijenski `vercel.json` odabire Services i definira dva zasebno građena servisa:

- `frontend/`: Vite, `npm ci`, `npm run build`, izlaz `dist`; servisni SPA fallback
  vraća `index.html` za frontend putanje.
- `backend/`: FastAPI, `pip install -r requirements.txt`, Python 3.13 iz
  `.python-version`, entrypoint `app.vercel:app`.

API pravila `/api` i `/api/(.*)` nalaze se ispred frontend catch-all pravila.
Ulazak u backend servis je konačan: nepostojeći API mora ostati JSON 404, a ne
prijeći na frontendov `index.html`.

Services backendu prenosi izvorni put zahtjeva. `backend/app/vercel.py` uvozi
**postojeći** objekt iz `app.main` i postavlja `root_path=/api`. Starlette time
pri usporedbi ruta obrađuje `/api/auth/me` kao postojeću `/auth/me` rutu. Generirani
callback/OpenAPI URL-ovi zadržavaju javni `/api` prefiks. Nema dvostrukog stripanja
prefiksa kroz servisni rewrite.

Za običan lokalni backend i dalje se koristi `uvicorn app.main:app --reload` iz
`backend/`, s postojećim neprefiksiranim rutama. Nema promjene autentikacije,
`credentials: include` ili `X-CSRF-Token` slanja.

U objavljenom frontendu treba postaviti `VITE_API_URL=/api` pri buildu. Ako ta
varijabla izostane, produkcijski fallback sada je `/api`; Vite razvojni fallback
ostaje `http://localhost:8000`. Izričita pogrešna env vrijednost i dalje ima
prednost, pa Roko mora provjeriti da Production nema `VITE_API_URL=localhost...`.

## 3. Provjere koje ne traže produkcijske tajne

Iz `frontend/`:

```bash
npm ci
VITE_API_URL=/api npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Provjeriti da `/`, `/signin` i `/patient` vraćaju SPA entrypoint te da JS iz
`dist/assets/` ne sadrži `localhost:8000`. Vite preview služi samo statički build:
uspjeh te provjere nije dokaz o radu backenda ili prijave.

Uz Python 3.13, instalirane `backend/requirements.txt` i iz korijena repozitorija:

```bash
python -m unittest discover -s tests/deploy -v
```

Testovi u zasebnim procesima koriste isključivo privremene unit-test postavke,
ne zapisane Vercel vrijednosti. Provjeravaju stvarne importe `app.main` i
`app.vercel`, `/api/health`, odjavljeni `/api/auth/me`, API JSON 404, zaštitu uloga,
CSRF, kolačiće i putanju callbacka. Ne povezuju se na bazu niti kontaktiraju Google.
Nisu zamjena za stvarni preview/production test.

`vercel.json` treba validirati prema službenoj shemi
`https://openapi.vercel.sh/vercel.json`. Lokalna provjera sheme ne potvrđuje da je
Services omogućen za Rokov projekt. Ako Services nije dostupan ili cloud build
odbije ovu postavu, analizirati prvi uzrok i dogovoriti pristup prije promjene
konfiguracije ili platforme.

Backend pri importu zahtijeva `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` i valjani
`SESSION_SECRET_KEY` od najmanje 32 znaka. Prazan `DATABASE_URL` također uzrokuje
pogrešku pri stvaranju SQLAlchemy enginea. To ostaje namjerno vidljivo; ne unositi
lažne produkcijske vrijednosti radi zelenog builda. Stvarna baza, OAuth prijava i
Vercel cloud build još nisu verificirani.

Zabilježene lokalne provjere 18. 11. 2026.: `npm ci`, produkcijski build s
`VITE_API_URL=/api`, build bez te varijable radi provjere fallbacka i dodatni build
na Node `26.13.1` uspješni su. Službena Vercel JSON shema prihvaća konfiguraciju;
lokalni SPA preview vraća 200 za `/signin`, `/patient` i `/patient/check-in`.
Oba offline backend testa prolaze. Stvarni Services cloud build, baza i OAuth i
dalje čekaju vlasnika projekta i stvarnu konfiguraciju.

## 4. Član za bazu priprema stvarni PostgreSQL

Najprije potvrditi postoji li dopuštena zajednička baza i ima li aktualnu shemu,
SSL i pristup iz Vercela. Ako ne postoji, Roko i član za bazu odabiru plan i
pružatelja te je povezuju s projektom. Marketplace integracija ne izvršava naše
SQL skripte automatski.

Samo na novoj praznoj bazi pokrenuti redom `db/001_create_schema.sql` i
`db/002_seed_reference_data.sql`. Postojeću bazu ne resetirati. Connection string
pripada backend varijabli `DATABASE_URL`, nikada `VITE_` varijabli.

## 5. Član za autentikaciju priprema Google postavke

Dodati točan javni redirect URI:
`https://progi-pulsko.vercel.app/api/auth/callback`.
Potvrditi web OAuth klijent, potrebne testne korisnike i pristup profesora/asistenta;
postojeće lokalne callback adrese ostaviti za razvoj. Ključeve dostaviti Roki kroz
privatni kanal ili ih izravno unijeti u privatne postavke.

## 6. Roko unosi Production varijable prije objave

Potrebne privatne postavke:
`DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET_KEY`.
Sesijska tajna mora biti stabilna za sve instance istog okruženja; ne generirati
novu po zahtjevu ili pri svakom pokretanju.

Ostale postavke:

- `FRONTEND_URL=https://progi-pulsko.vercel.app`
- `GOOGLE_REDIRECT_URI=https://progi-pulsko.vercel.app/api/auth/callback`
- `AUTH_COOKIE_SECURE=true`
- `AUTH_COOKIE_SAMESITE=lax`
- `ADMIN_EMAILS`: dogovoreni Google račun administratora prema postojećim pravilima.
- `VITE_API_URL=/api`: javna vrijednost potrebna tijekom frontend builda.

Preview ne povezivati na produkcijsku bazu. Za stvarni preview treba zasebno
okruženje i odgovarajuća OAuth konfiguracija; bez njih navesti što nije testirano.

## 7. Zajednički dogovor prije prebacivanja projekta

Tek nakon pregleda PR-a, potvrde dostupnosti Servicesa, pripreme baze i stvarnih
varijabli te Google callbacka, Roko:

1. Potvrđuje `main` kao Production Branch i točan commit za objavu.
2. Mijenja Root Directory s dosadašnje vrijednosti na korijen repozitorija.
3. Prepušta framework Services konfiguraciji; ne ostavlja root projekt na Vite.
4. Isključuje stare globalne install/build/output overrideove. Naredbe sada
   pripadaju servisima; ne pokreće `npm run build` iz korijena bez `package.json`.
5. Zadržava trenutačni Node `26.x` ako Services build s postojećim lockom prolazi;
   backend zasebno koristi Python 3.13. Promjena Node verzije nije uvjet ovog PR-a.
6. Objavljuje dogovoreni commit i čita build logove prije provjere rada.

Ne prebacivati root niti spajati PR u produkciju dok preduvjeti nisu spremni.
Promjene environment varijabli zahtijevaju novi deployment. Postojeća `.github`
CD datoteka još je Render hook iz predloška; ne upisivati Render hook radi Vercela.
Ovaj PR je ne mijenja niti uspostavlja novi CI/CD sustav.

## 8. Borna i Roko provjeravaju objavljenu aplikaciju

Redom potvrditi SPA deep linkove i osvježavanje, izostanak localhost zahtjeva,
JSON odgovore na `/api/health` i `/api/health/db`, te JSON 404 za nepostojeći API.
Zatim stvarnu Google prijavu i povratak, trajanje sesije, odjavu i CSRF; admina i
odobravanje liječnika; spremanje check-ina i ponovni dohvat nakon prijave;
dopušteni pristup povezanog liječnika i zabranu nepovezanom korisniku.
Provjeriti da Vercel zaštita dopušta dogovoreni pristup profesorici/asistentu.

Zapisati live URL, commit, naziv okruženja/baze bez tajni, stvarno provedene
provjere i poznate demo funkcionalnosti. Zeleni build sam po sebi nije gotov deploy.

## 9. Povratak ako objava ne uspije

Roko koristi prethodno zabilježeni uspješni frontend deployment i stare projektne
postavke. Vraća Root Directory, framework, overrideove i primjenjive env postavke
iz svojeg zapisa; javna domena se ne briše. Za ponovno građenje starog frontenda
upotrijebiti njegov stari commit/config, ne Services granu s pogrešnim rootom.
Povratak koda ne vraća bazu. Ova priprema ne provodi migracije ni reset.

Izvori: [Services](https://vercel.com/docs/services),
[konfiguracija](https://vercel.com/docs/services/config-reference),
[routing](https://vercel.com/docs/services/routing),
[Python runtime](https://vercel.com/docs/functions/runtimes/python).
