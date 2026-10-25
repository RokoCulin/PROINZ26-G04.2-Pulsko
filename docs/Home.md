
# Pulsko — Projektna dokumentacija

**Kolegij:** [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz), Fakultet elektrotehnike i računarstva Sveučilišta u Zagrebu  
**Akademska godina:** 2026./2027.  
**Tim:** [Oznaka i naziv tima]  
**Nastavnik:** Vlado Sruk  
**Asistent / demonstrator:** [Ime i prezime]

## Pregled projekta

**Cilj:** Razviti web aplikaciju koja pacijentima omogućuje jednostavno pohranjivanje, organiziranje i praćenje zdravstvenih nalaza te dijeljenje odabranih podataka s liječnicima.

Pulsko je aplikacija namijenjena pacijentima i liječnicima, s ciljem jednostavnijeg upravljanja zdravstvenim podacima i njihove preglednosti. Pacijentima omogućuje vođenje osobne evidencije nalaza i zdravstvenih pokazatelja, dok liječnicima pruža mogućnost uvida u podatke pacijenata koji su im odobrili pristup.

Problem koji aplikacija nastoji riješiti jest nepreglednost zdravstvene dokumentacije koja se često nalazi na različitim mjestima i u različitim formatima. Objedinjavanjem podataka na jednom mjestu korisnicima se želi olakšati praćenje zdravstvenog stanja kroz vrijeme i komunikacija s liječnicima.

Projekt se trenutačno nalazi u početnoj fazi. Predviđene funkcionalnosti bit će detaljnije definirane tijekom analize zahtjeva i implementirane u narednim fazama razvoja.

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

Detaljan popis funkcionalnih i nefunkcionalnih zahtjeva bit će naveden u dokumentu **Analiza zahtjeva**.

### Trenutačno stanje

Projekt je u fazi početnog planiranja. Razvoj aplikacije još nije započeo, a konačna arhitektura, tehnologije i način implementacije bit će određeni tijekom rada na projektu.

</details>

**Aplikacija i osnovno postavljanje:** [README repozitorija](../README.md#quick-start)  
**Javno dostupna aplikacija:** Poveznica će biti dodana nakon prve javne objave aplikacije.

## Članovi tima i uloge

Ažurirani popis članova, njihovih GitHub profila i glavnih uloga ili doprinosa nalazit će se u [README-u repozitorija](../README.md#team-members).

Raspodjela odgovornosti unutar tima bit će određena tijekom početne organizacije projekta.

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

**Način rada:** Način organizacije rada, raspodjela zadataka i trajanje razvojnih iteracija bit će definirani na početku razvoja projekta.

**Praćenje trenutačnih zadataka i nedostataka:** Planirano je korištenje GitHuba za pohranu izvornog koda i praćenje promjena. Poveznica na sustav za praćenje zadataka bit će dodana nakon njegova uspostavljanja.

<details>
<summary><strong>Opis načina rada tima</strong></summary>

Razvoj aplikacije Pulsko bit će organiziran kroz više faza.

U početnoj fazi tim će analizirati problem, definirati funkcionalne i nefunkcionalne zahtjeve te odrediti opseg projekta.

Nakon analize zahtjeva slijedi oblikovanje arhitekture sustava, modeliranje podataka i izrada potrebnih UML dijagrama.

Implementacija će obuhvatiti razvoj korisničkog sučelja, poslužiteljskog dijela i potrebnih funkcionalnosti aplikacije.

Tijekom razvoja planira se redovito provjeravanje implementiranih funkcionalnosti te evidentiranje pronađenih nedostataka.

Konačan način organizacije rada, raspodjela odgovornosti i učestalost sastanaka bit će definirani dogovorom članova tima.

Ovaj opis predstavlja planirani tijek razvoja. Stvarni način rada bit će dokumentiran nakon početka projekta.

</details>

## Pravila dokumentacije

Dokumentacija projekta sastoji se od međusobno povezanih Markdown stranica koje opisuju različite aspekte razvoja aplikacije.

Za prikaz arhitekture sustava, obrazaca uporabe i drugih potrebnih modela koristit će se UML dijagrami izrađeni u PlantUML-u.

Za svaki dijagram potrebno je sačuvati izvornu `.puml` datoteku i odgovarajući čitljiv grafički prikaz.

Dokumentacija mora biti usklađena sa stvarnim stanjem projekta. Planirane funkcionalnosti jasno će se razlikovati od implementiranih, a rezultati ispitivanja navodit će se tek nakon provedenih provjera.

<details>
<summary><strong>Izvori dijagrama i nastavni primjeri</strong></summary>

UML dijagrami bit će izrađeni tijekom analize zahtjeva i oblikovanja sustava.

Planirani dijagrami uključuju prikaz aktera i obrazaca uporabe, strukture sustava te komunikacije između njegovih dijelova.

Izvorne PlantUML datoteke čuvat će se u repozitoriju projekta, uz odgovarajuće prikaze u dokumentaciji.

Primjeri iz nastavnih materijala koristit će se isključivo kao smjernice za izradu vlastitih modela i neće se prikazivati kao rezultati projekta Pulsko.

Tehnologije koje će se koristiti za implementaciju aplikacije još nisu konačno određene. Nakon odabira bit će navedene i obrazložene u dokumentaciji arhitekture i oblikovanja.

</details>

## Akademski integritet, ponašanje i licenciranje

Projekt će se izrađivati u skladu s pravilima akademskog integriteta Fakulteta elektrotehnike i računarstva Sveučilišta u Zagrebu.

Svi korišteni vanjski izvori, biblioteke i drugi materijali bit će navedeni u dokumentaciji kada budu uključeni u projekt.

README repozitorija sadržavat će informacije o pravilima ponašanja i podršci te statusu licence i mogućnostima ponovne uporabe izvornog koda.

Posebna pozornost posvetit će se zaštiti zdravstvenih podataka korisnika. Stvarni osobni i osjetljivi zdravstveni podaci neće se koristiti u javno dostupnim primjerima, demonstracijama ili ispitivanjima aplikacije.

Pristupni podaci, lozinke i druge povjerljive informacije neće se objavljivati u dokumentaciji ni u izvornom kodu repozitorija.

## Izjava o uporabi umjetne inteligencije

U okviru ove vježbe predviđeno je da se projekt izrađuje bez uporabe alata generativne umjetne inteligencije.
