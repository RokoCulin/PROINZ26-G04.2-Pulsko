# Pulsko

Pulsko je web-aplikacija u kojoj pacijent na jednom mjestu prati svoje zdravstvene podatke i dijeli ih s liječnikom kojeg odabere, a liječnik prati stanje svojih povezanih pacijenata i na vrijeme reagira.

**Projekt na kolegiju:** Ovu je aplikaciju razvio studentski tim G04.2 u sklopu kolegija [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz) na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu (FER), ak. god. 2026./2027.

## Opis aplikacije

Pacijenti s kroničnim ili dugotrajnim zdravstvenim stanjima svoje podatke najčešće čuvaju dijelom na papiru, a dijelom u PDF-ovima i e-porukama, pa su razbacani i nepregledni, a liječnik između dva pregleda nema uvid u stanje pacijenta. Pulsko je namijenjena trima ulogama: **pacijentu**, koji bilježi i pregledava svoje podatke, **liječniku**, koji vidi podatke samo onih pacijenata koji su s njim povezani, i **administratoru**, koji odobrava liječničke račune kako bi zdravstvenim podacima pristupali samo provjereni liječnici. Glavna korist je pregledna povijest zdravlja i bolja priprema razgovora pacijenta i liječnika.

Prototip se demonstrira isključivo s izmišljenim podacima i nije namijenjen kliničkoj uporabi. Korisničko sučelje je na engleskom jeziku.

**Ključne funkcionalnosti (Za sada, rade u postavljenoj aplikaciji)**

- **Prijava putem Googlea (OAuth 2.0 / OpenID Connect)** s odabirom uloge pacijenta ili liječnika; jedan Google račun ima točno jednu ulogu, a administrator se prepoznaje automatski.
- **Odobravanje liječnika:** liječnik pri registraciji upisuje ustanovu i broj licence, a administrator ga odobrava ili odbija.
- **Povezivanje pacijenta i liječnika:** pacijent šalje zahtjev upisom e-maila liječnika, a odobreni liječnik zahtjev prihvaća ili odbija.
- **Dnevni check-in:** pacijent jednom dnevno bilježi opće stanje, san, korake, puls i tjelesnu aktivnost; podatke vidi on i njegov povezani liječnik, a nitko drugi.

Laboratorijski nalazi, terapija, termini, poruke te AI pomoć za pacijenta i liječnika planirani su za drugi ciklus (vidi [Ograničenja](#deployment) i [odjeljak 2.1.1 Analize zahtjeva](docs/2-Analiza-zahtjeva.md)).

Za potpuni opseg, zahtjeve, oblikovanje i dokaze ispitivanja pogledajte [docs](docs/Home.md).

<a id="deployment"></a>

## Postavljanje (engl. deployment)

**Javno dostupna aplikacija:** <https://progi-pulsko.vercel.app>

**Isprobajte:**

1. Otvorite aplikaciju, kliknite prijavu, odaberite **Patient** i prijavite se Google računom.
2. Otvorite **Check-in**, spremite današnji unos i osvježite stranicu; unos se ponovno dohvaća iz baze.

**Demonstracija:** Prijava je obavezna i koristi vlastiti Google račun, pa lozinka za aplikaciju ne postoji. Pacijentski račun nastaje pri prvoj prijavi. Liječnički račun nakon registracije čeka odobrenje administratora, pa za isprobavanje liječničke uloge javite se timu (voditelj Roko Čulin) da račun odobri. Administratorska uloga ne može se odabrati u aplikaciji; dodjeljuje je tim kroz postavku `ADMIN_EMAILS` na poslužitelju.

**Ograničenja:**

- Stranice za laboratorijske nalaze, terapiju, termine, poruke i Health Agent zasad prikazuju **ogledne podatke** i nisu povezane s poslužiteljem (nalazi se privremeno spremaju samo u pregledniku). Povezivanje s bazom, obrada PDF nalaza, AI usluga i podsjetnici e-poštom dio su drugog ciklusa.
- Aplikacija nije za stvarne zdravstvene podatke; koristite samo izmišljene vrijednosti.
- Vercel Services, kojim su frontend i backend postavljeni zajedno, u statusu je Beta.

Aplikacija je postavljena na **Vercel**: React frontend i FastAPI backend grade se iz grane `main` kao dvije usluge iste domene (backend na putanji `/api`), a podaci su u upravljanoj PostgreSQL bazi **Neon** (regija Frankfurt). Postupak, varijable okruženja i povratak na prethodnu inačicu opisani su u [pripremi objave na Vercelu](docs/DEPLOY-VERCEL.md); širi vodič je [6. Postavljanje, instalacija i konfiguracija](docs/6-Postavljanje-instalacija-i-konfiguracija.md).

<a id="quick-start"></a>

## Brzi početak / instalacija

**Preduvjeti:** Git, Python 3.13 (vidi `backend/.python-version`), Node.js s npm-om (Vite 8 traži Node 20.19+ ili 22.12+), PostgreSQL 14+ (testirano na 16) s alatima `createdb` i `psql` te Google OAuth klijent (ID i tajna) s dopuštenom povratnom adresom `http://localhost:8000/auth/callback`.

```bash
git clone https://github.com/RokoCulin/PROINZ26-G04.2-Pulsko.git
cd PROINZ26-G04.2-Pulsko

# 1. Baza (iz korijena repozitorija)
createdb pulsko_dev
export DATABASE_URL="postgresql://<korisnik>:<lozinka>@localhost:5432/pulsko_dev"
./scripts/setup-database.sh          # shema (db/001) + šifrarnik biomarkera (db/002)

# 2. Backend (prvi terminal)
cd backend
python3 -m venv .venv
source .venv/bin/activate            # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                 # upisati vrijednosti, vidi Konfiguracija
uvicorn app.main:app --reload

# 3. Frontend (drugi terminal, iz korijena repozitorija)
cd frontend
npm ci
cp .env.example .env.local
npm run dev
```

**Adresa:** frontend <http://localhost:5173>, backend <http://localhost:8000> (API dokumentacija <http://localhost:8000/docs>).

**Konfiguracija:** Sve varijable navedene su u [`backend/.env.example`](backend/.env.example) i [`frontend/.env.example`](frontend/.env.example). Backend treba `DATABASE_URL` (lokalna baza), `GOOGLE_CLIENT_ID` i `GOOGLE_CLIENT_SECRET` (Google Cloud Console; tim ih dijeli samo privatnim kanalom), `SESSION_SECRET_KEY` (nasumičan niz od najmanje 32 znaka) te po želji `ADMIN_EMAILS` (Google e-mail koji pri prvoj prijavi postaje administrator). Frontend treba samo `VITE_API_URL` (zadano `http://localhost:8000`). Stvarne vrijednosti nikada se ne spremaju u repozitorij.

**Provjera:** <http://localhost:8000/health/db> mora vratiti JSON odgovor o vezi s bazom. Zatim se na <http://localhost:5173> prijavite kao pacijent, spremite check-in i osvježite stranicu; unos mora ostati. Detalji: [backend/README.md](backend/README.md), [frontend/README.md](frontend/README.md), [db/Readme.md](db/Readme.md) i [projektna dokumentacija](docs/Home.md).

## Tehnologije

| Tehnologija ili alat                        | Uloga u ovom projektu                                                                      | Razlog uporabe ili važno ograničenje                                                                                                              |
| ------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| React + Vite                                | Web-klijent za pacijenta, liječnika i administratora; rute po ulogama štiti `RequireRole`. | Jedna responzivna web-aplikacija umjesto nativne mobilne; adresa API-ja (`VITE_API_URL`) ugrađuje se pri izgradnji, pa promjena traži novi build. |
| Python FastAPI (Uvicorn)                    | Poslužiteljski REST API: prijava, uloge, odobravanje liječnika, povezivanje i check-in.    | Provjera uloge, veze pacijent–liječnik i CSRF tokena radi se na poslužitelju, ne samo u sučelju. Python je odobren od asistenata.                 |
| SQLAlchemy                                  | Pristup bazi i modeli tablica u backendu.                                                  | Shemu ne stvara ORM nego verzionirane SQL skripte u `db/`, pa se modeli moraju držati usklađenima s njima.                                        |
| PostgreSQL (lokalno) / Neon (javno)         | Pohrana korisnika, profila, veza i check-inova (20 tablica).                               | Ključna pravila (npr. jedan check-in dnevno, samo odobreni liječnik prihvaća vezu, najviše 2.125 pacijenata po liječniku) provodi i sama baza.    |
| Google OAuth 2.0 / OpenID Connect (Authlib) | Jedini način prijave; sesija u kolačiću `pulsko_session`.                                  | Aplikacija ne čuva lozinke, ali ovisi o vanjskom pružatelju identiteta i ispravno postavljenoj povratnoj adresi.                                  |
| Vercel (Services)                           | Javno postavljanje frontenda i backenda iz grane `main` na istu domenu.                    | Frontend i API dijele domenu pa nema problema s kolačićima između domena; Services je u statusu Beta.                                             |
| PlantUML + GitHub Actions                   | UML dijagrami u `docs/puml`, slike se generiraju automatski u `docs/assets/diagrams`.      | Izvor dijagrama verzionira se i pregledava kroz pull request kao i kod.                                                                           |

Arhitekturne odluke i kompromisi obrazloženi su u [4. Arhitektura i oblikovanje](docs/4-Arhitektura-i-oblikovanje.md).

<a id="team-members"></a>

## Članovi tima

| Član           | Glavna uloga ili doprinos                                              |
| -------------- | ---------------------------------------------------------------------- |
| Roko Čulin     | Voditelj tima, administratorski modul, jezgra backenda i ugovor API-ja |
| Borna Oršulić  | Integracije i DevOps (vanjske usluge, CI, javno postavljanje)          |
| Antonio Nović  | Frontend pacijenta i liječnika, korisničko sučelje                     |
| Dora Maruševec | Frontend pacijenta i liječnika, korisničko sučelje                     |
| Borna Flegar   | Backend i pisanje testova                                              |
| Jakov Troje    | Baza podataka (shema, skripte, ER i dijagram razreda)                  |
| Hrvoje Štivić  | Autentikacija (OAuth 2.0, uloge, sigurnost)                            |

Uloge se tijekom projekta mogu mijenjati. Pojedinačne aktivnosti i prijavljeni sati nalaze se u [A. Pregled aktivnosti grupe](docs/A-Pregled-aktivnosti-grupe.md), a repozitorij i [GitHub Issues](https://github.com/RokoCulin/PROINZ26-G04.2-Pulsko/issues) služe kao dodatni dokazi timskog rada.

## Doprinos projektu

Svaki značajniji zadatak najprije se otvara kao [GitHub issue](https://github.com/RokoCulin/PROINZ26-G04.2-Pulsko/issues) i dodjeljuje članu. Rad se odvija na zasebnoj grani, a u `main` ulazi isključivo putem pull requesta nakon pregleda promjena. Spajanje u `main` automatski pokreće novo postavljanje na Vercelu. Plan rada po tjednima vodi se u [Pregledu aktivnosti grupe](docs/A-Pregled-aktivnosti-grupe.md).

<a id="license"></a>

## Licenca

**Status licence:** Licenca aplikacije još nije dodijeljena.

Dokumentacijski predložak kolegija sadrži otvorene obrazovne sadržaje (engl. Open Educational Resources, OER) i licenciran je licencom Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. Ta licenca **ne određuje automatski licencu studentske aplikacije**; datoteka [`LICENSE`](LICENSE) i [`CITATION.cff`](CITATION.cff) u ovom repozitoriju odnose se na predložak.

Kod trećih strana (npr. React, FastAPI i ostale ovisnosti iz `frontend/package.json` i `backend/requirements.txt`) zadržava vlastite licence i uvjete uporabe.

<a id="ai-usage"></a>

## Uporaba umjetne inteligencije [![AI Usage: Disclosed](https://img.shields.io/badge/AI%20Usage-Disclosed-blue.svg)](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf)

Ovaj projekt slijedi FER-ova [pravila o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

**Izjava:** Tim je koristio modele Claude i ChatGPT kako bi provjerio usklađenost dokumentacije s pravilima kolegija, pri objašnjavanju tehničkih koncepata, pri pregledu dijelova koda te eventualno oko savjetovanja kako nešto napraviti bolje. Modele smo također pitali da nam objasne neke tehničke probleme s kojima smo se prvi put susretali na ovom kolegiju. Odluke o opsegu, akterima, zahtjevima i arhitekturi donosi tim. Svaki prijedlog umjetne inteligencije član tima pregleda, prilagodi, prouči i kasnije odluči na koji način želi pristupiti određenom problemu. Svatko može objasniti svoj doprinos. U AI alate ne unosimo osobne ni stvarne zdravstvene podatke, lozinke ni pristupne ključeve.

Detaljniji zapis uporabe nalazi se u odjeljku [Izjava o uporabi umjetne inteligencije](docs/Home.md#izjava-o-uporabi-umjetne-inteligencije) projektne dokumentacije.

<a id="code-of-conduct-and-support"></a>

## Kodeks ponašanja i podrška [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

Od članova tima očekuje se pridržavanje **Kodeksa ponašanja studenata** Fakulteta elektrotehnike i računarstva Sveučilišta u Zagrebu, pravila timskog rada na kolegiju i [Etičkog kodeksa IEEE-a](https://www.ieee.org/about/corporate/governance/p7-8.html). Repozitorij koristi [Contributor Covenant kodeks ponašanja](CODE_OF_CONDUCT.md). Pogreške i pitanja prijavljuju se kroz [GitHub Issues](https://github.com/RokoCulin/PROINZ26-G04.2-Pulsko/issues).

---

Struktura dokumentacije prilagođena je predlošku kolegija Programsko inženjerstvo FER-a autora [Vlade Sruka](https://www.fer.unizg.hr/vlado.sruk), licenciranom pod [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Aplikaciju i njezin sadržaj izradio je gore navedeni studentski tim.
