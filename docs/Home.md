
# Pulsko - Projektna dokumentacija

**Kolegij:** [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz), Fakultet elektrotehnike i računarstva Sveučilišta u Zagrebu  
**Akademska godina:** 2026./2027.  
**Tim:** G04.2 
**Nastavnik:** Vlado Sruk  
**Asistent / demonstrator:** Eda Jovičić

## Pregled projekta

**Cilj:** Razviti web aplikaciju koja pacijentima omogućuje jednostavno pohranjivanje, organiziranje i praćenje zdravstvenih nalaza te sigurno dijeljenje odabranih podataka s liječnicima.

Pulsko je aplikacija namijenjena pacijentima i liječnicima, s ciljem jednostavnijeg upravljanja zdravstvenom dokumentacijom i praćenja zdravstvenog stanja. Pacijentima omogućuje vođenje osobne evidencije nalaza i zdravstvenih pokazatelja, dok liječnicima pruža mogućnost uvida u podatke pacijenata koji su im odobrili pristup.

Problem koji aplikacija nastoji riješiti jest nepreglednost zdravstvene dokumentacije koja se često nalazi na različitim mjestima i u različitim formatima. Objedinjavanjem podataka na jednom mjestu korisnicima se želi olakšati praćenje promjena zdravstvenog stanja kroz vrijeme te razmjena informacija između pacijenata i liječnika.

Projekt je u prvom razvojnom ciklusu (predaja 20. 11. 2026.). Zahtjevi i obrasci uporabe definirani su u poglavljima 2 i 3, a implementirani su prijava putem Googlea s ulogama pacijenta, liječnika i administratora, odobravanje liječničkih računa, povezivanje pacijenta i liječnika te dnevni check-in koji vide pacijent i povezani liječnik.

<details>
<summary><strong>Sažet pregled projekta</strong></summary>

### Ciljani korisnici

Aplikacija je namijenjena dvjema glavnim skupinama korisnika:

- **Pacijenti** – osobe koje žele na jednom mjestu pohraniti svoje zdravstvene nalaze, pratiti promjene zdravstvenih pokazatelja i dijeliti podatke s liječnicima.
- **Liječnici** – zdravstveni djelatnici koji žele imati pregled zdravstvenih podataka pacijenata koji su im odobrili pristup.

### Planirane funkcionalnosti

- Registracija i prijava korisnika uz razlikovanje uloga pacijenta i liječnika.
- Provjera liječničkih korisničkih računa.
- Unos, pohrana i pregled zdravstvenih nalaza.
- Evidencija zdravstvenih pokazatelja i praćenje njihovih promjena kroz vrijeme.
- Povezivanje pacijenata i liječnika.
- Upravljanje pristupom zdravstvenim podacima.
- Pregled dostupnih podataka pacijenata iz perspektive liječnika.
- Obavijesti unutar aplikacije.
- Pomoć pri razumijevanju laboratorijskih nalaza, s početnim naglaskom na kompletnu krvnu sliku.

Pomoć pri razumijevanju laboratorijskih nalaza zamišljena je kao informativna funkcionalnost i ne zamjenjuje stručno liječničko mišljenje, dijagnozu ili preporuku.

Detaljan popis funkcionalnih i nefunkcionalnih zahtjeva naveden je u dokumentu [Analiza zahtjeva](2-Analiza-zahtjeva.md).

### Trenutačno stanje projekta

Aplikacija se razvija kao React web-klijent i Python FastAPI poslužitelj s PostgreSQL bazom podataka; prijava koristi Google (OpenID Connect / OAuth 2.0). Opseg prvog ciklusa (MVP) i plan drugog ciklusa opisani su u odjeljku 2.1.1.

</details>

**Aplikacija i osnovno postavljanje:** [README repozitorija](../README.md#quick-start)  
**Javno dostupna aplikacija:** Poveznica će biti dodana nakon prve javne objave aplikacije.

## Članovi tima i uloge

Ažurirani popis članova, njihovih GitHub profila i glavnih uloga ili doprinosa nalazit će se u [README-u repozitorija](../README.md#team-members).

| Član | Glavna uloga |
| --- | --- |
| Roko Čulin | Voditelj tima, administratorski modul, jezgra backenda i ugovor API-ja |
| Jakov Troje | Baza podataka (shema, skripte, ER i dijagram razreda) |
| Hrvoje Štivić | Autentikacija (OAuth 2.0, uloge, sigurnost) |
| Dora Maruševec | Frontend pacijenta i liječnika, korisničko sučelje |
| Antonio Nović | Frontend pacijenta i liječnika, korisničko sučelje |
| Borna Oršulić | Integracije i DevOps (vanjske usluge, CI, javno postavljanje) |
| Borna Flegar | Backend i pisanje testova |

## Kazalo dokumentacije

| Stranica | Svrha |
| --- | --- |
| [1. Opseg projekta](1-Projekt.md) | Problem, cilj i granice projekta |
| [2. Analiza zahtjeva](2-Analiza-zahtjeva.md) | Zahtjevi, ograničenja i sljedivost |
| [3. Obrasci uporabe](3-Obrasci-uporabe.md) | Akteri i reprezentativne interakcije korisnika |
| [4. Arhitektura i oblikovanje](4-Arhitektura-i-oblikovanje.md) | Glavne odluke oblikovanja, struktura, podaci i ponašanje |
| [5. Ispitivanje](5-Ispitivanje.md) | Pristup ispitivanju, stvarni rezultati i poznati nedostaci |
| [6. Postavljanje, instalacija i konfiguracija](6-Postavljanje-instalacija-i-konfiguracija.md) | Lokalna instalacija, konfiguracija, javno postavljanje i administracija |
| [7. Zaključak i budući rad](7-Zakljucak-i-buduci-rad.md) | Zaključak i moguća daljnja poboljšanja |
| [A. Pregled aktivnosti grupe](A-Pregled-aktivnosti-grupe.md) | Aktivnosti tima, doprinosi i izazovi |

Dokumentacija će se postupno izrađivati i nadopunjavati tijekom razvoja projekta. Pojedine stranice trenutačno nisu dovršene.

## Ključne točke projekta

| Kontrolna točka | Demonstracija | Video |
| --- | --- | --- |
| Iteracija 1 | Poveznica će biti dodana nakon prve iteracije. | Poveznica će biti dodana nakon snimanja demonstracije. |
| Završni pregled | Poveznica će biti dodana nakon završetka projekta. | Poveznica će biti dodana nakon snimanja završne demonstracije. |

Dokumentacija se kontinuirano ažurira kako se aplikacija razvija.

## Organizacija projekta i razvojni proces

**Način rada:** Tim radi u tjednim koracima prema planu kolegija i dva razvojna ciklusa (predaje 20. 11. 2026. i 22. 1. 2027.). Svaki zadatak ima GitHub issue, radi se na zasebnoj grani i u `main` ulazi putem pull requesta.

**Praćenje trenutačnih zadataka i nedostataka:** [GitHub Issues](https://github.com/RokoCulin/PROINZ26-G04.2-Pulsko/issues). Plan rada po tjednima i doprinosi članova nalaze se u [Pregledu aktivnosti grupe](A-Pregled-aktivnosti-grupe.md).

<details>
<summary><strong>Opis načina rada tima</strong></summary>

Rad je podijeljen na analizu zahtjeva i obrazaca uporabe (tjedni 1–4, kontrolna točka M0 26. 10. 2026.), oblikovanje arhitekture i baze podataka te implementaciju po ulogama (tjedni 5–7). Članovi tima rade prema ulogama navedenima gore; zadatci se otvaraju kao GitHub issues, a promjene se pregledavaju kroz pull requeste prije spajanja u `main`.

Posebna pozornost posvećuje se usklađenosti dokumentacije i koda, sigurnosti zdravstvenih podataka (provjera uloga i povezanosti na poslužitelju) i jednostavnosti korištenja aplikacije.

Sastanci, odluke i doprinosi evidentiraju se u [Pregledu aktivnosti grupe](A-Pregled-aktivnosti-grupe.md).

</details>

## Pravila dokumentacije

Dokumentacija projekta sastoji se od međusobno povezanih Markdown stranica koje opisuju različite aspekte razvoja aplikacije.

Obavezni UML dijagrami izrađivat će se u PlantUML-u. Uz svaki dijagram potrebno je sačuvati izvornu `.puml` datoteku i odgovarajući čitljiv grafički prikaz.

Dokumentacija mora biti usklađena sa stvarnim stanjem projekta. Planirane funkcionalnosti jasno će se razlikovati od implementiranih, a rezultati ispitivanja navodit će se tek nakon provedenih provjera.

Dokumentacija će se ažurirati tijekom razvoja, osobito nakon promjena zahtjeva, arhitekture ili implementiranih funkcionalnosti.

<details>
<summary><strong>Izvori dijagrama i nastavni primjeri</strong></summary>

UML dijagrami izrađuju se u PlantUML-u tijekom analize zahtjeva i oblikovanja sustava. Izvori su u mapi `docs/puml`, a slike (SVG) automatski se generiraju u `docs/assets/diagrams`.

Dijagrami projekta uključuju:

- Dijagram obrazaca uporabe za prikaz interakcija pacijenata i liječnika sa sustavom.
- Dijagram klasa za prikaz strukture sustava i odnosa između glavnih entiteta.
- Sekvencijske dijagrame za prikaz komunikacije između dijelova sustava tijekom izvođenja važnijih funkcionalnosti.
- Ostale dijagrame potrebne za opis arhitekture i ponašanja aplikacije.

Izvorne PlantUML datoteke čuvaju se u repozitoriju projekta, uz odgovarajuće prikaze u dokumentaciji.

Primjeri iz nastavnih materijala koriste se isključivo kao smjernice za izradu vlastitih modela i ne prikazuju se kao rezultati projekta Pulsko.

Korištene tehnologije (React, Python FastAPI, PostgreSQL, Google OpenID Connect) obrazložene su u poglavlju [4. Arhitektura i oblikovanje](4-Arhitektura-i-oblikovanje.md).

</details>

## Akademski integritet, ponašanje i licenciranje

Projekt će se izrađivati u skladu s pravilima akademskog integriteta Fakulteta elektrotehnike i računarstva Sveučilišta u Zagrebu.

Svi korišteni vanjski izvori, biblioteke i drugi materijali bit će navedeni u dokumentaciji kada budu uključeni u projekt.

README repozitorija sadržavat će projektnu [izjavu o uporabi umjetne inteligencije](../README.md#ai-usage), [informacije o kodeksu ponašanja i podršci](../README.md#code-of-conduct-and-support) te [status licence ili ponovne uporabe](../README.md#license).

Posebna pozornost posvetit će se zaštiti zdravstvenih podataka korisnika. Stvarni osobni i osjetljivi zdravstveni podaci neće se koristiti u javno dostupnim primjerima, demonstracijama ili ispitivanjima aplikacije.

Pristupni podaci, lozinke i druge povjerljive informacije neće se objavljivati u dokumentaciji ni u izvornom kodu repozitorija.

## Izjava o uporabi umjetne inteligencije

Tijekom prvog ciklusa tim je koristio alate generativne umjetne inteligencije (Claude i ChatGPT) prvenstveno za učenje i objašnjenje gradiva, za savjete o tome kako nešto bolje implementirati te za usklađivanje dokumentacije među različitim datotekama.

Odluke o opsegu, akterima, zahtjevima i arhitekturi donio je tim. Zahtjeve, obrasce uporabe, dokumentaciju i programski kod pisali su članovi tima. Svaki prijedlog umjetne inteligencije član tima je pregledao, prilagodio i provjerio prije nego što je ušao u projekt, a svatko može objasniti svoj doprinos.

Korištenje umjetne inteligencije dokumentira se u skladu s [pravilima FER-a o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

Kratak sažetak uporabe umjetne inteligencije dostupan je i u [README-u repozitorija](../README.md#ai-usage).

### Korišteni alati

| Alat | Koristio/la | Glavna svrha |
| --- | --- | --- |
| Claude (Anthropic) | Članovi tima | Objašnjenje gradiva, savjeti o implementaciji, usklađivanje dokumentacije |
| ChatGPT (OpenAI) | Članovi tima | Objašnjenje gradiva i tehničkih problema, savjeti o implementaciji |

### Opseg doprinosa umjetne inteligencije

| Područje | Kako je umjetna inteligencija korištena | Što je napravio tim |
| --- | --- | --- |
| Učenje gradiva | Objašnjenje pojmova (UML, MoSCoW, OAuth 2.0, FastAPI, SQLAlchemy) na općenitim primjerima | Tim je sam pisao zahtjeve, obrasce uporabe i programski kod |
| Savjeti o implementaciji | Savjeti kako nešto bolje riješiti i upozorenja na moguće pogreške pri pregledu koda | Tim je odabrao rješenje, implementirao ga i provjerio |
| Usklađivanje dokumentacije | Provjera dosljednosti ID-jeva zahtjeva i obrazaca uporabe, naziva i dijagrama među datotekama | Tim je pregledao i odobrio svaku ispravku |
| Pomoć pri pisanju dijela koda | Na izričit zahtjev člana tima, za ograničene dijelove koda | Tim je kod pregledao, razumije ga i ispitao je |

### Provjera generiranog sadržaja

Sadržaj nastao uz pomoć umjetne inteligencije provjeren je prije prihvaćanja u projekt.

| Provjera | Način provjere | Dokaz |
| --- | --- | --- |
| Činjenična točnost | Usporedba s dogovorenim zahtjevima, izvornim kodom i ponašanjem aplikacije | Pregled dokumentacije i pripadajućih promjena |
| Nema tvrdnji o neostvarenim funkcionalnostima | Provjera odgovaraju li opisane funkcionalnosti implementiranom sustavu | Dokumentacija zahtjeva i README (poznata ograničenja) |
| Dosljednost s drugim stranicama | Usporedba naziva, zahtjeva i dijagrama između dijelova dokumentacije | Pregled povezanih dokumenata |
| Izvori dijagrama | Provjera PlantUML izvora i generiranih prikaza | Izvorne `.puml` datoteke i slike |
| Povjerljivi sadržaj | U AI alate nisu unošene lozinke, pristupni ključevi ni stvarni zdravstveni podaci | Pregled korištenih primjera i projektnih datoteka |

### Pogreške pronađene u izlazu umjetne inteligencije

| Problem | Kako je pronađen | Rješenje |
| --- | --- | --- |
|  |  |  |
