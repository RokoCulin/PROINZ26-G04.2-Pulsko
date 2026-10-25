
# Pulsko - Projektna dokumentacija

**Kolegij:** [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz), Fakultet elektrotehnike i računarstva Sveučilišta u Zagrebu  
**Akademska godina:** 2026./2027.  
**Tim:** G04 
**Nastavnik:** Vlado Sruk  
**Asistent / demonstrator:** Eda Jovičić

## Pregled projekta

**Cilj:** Razviti web aplikaciju koja pacijentima omogućuje jednostavno pohranjivanje, organiziranje i praćenje zdravstvenih nalaza te sigurno dijeljenje odabranih podataka s liječnicima.

Pulsko je aplikacija namijenjena pacijentima i liječnicima, s ciljem jednostavnijeg upravljanja zdravstvenom dokumentacijom i praćenja zdravstvenog stanja. Pacijentima omogućuje vođenje osobne evidencije nalaza i zdravstvenih pokazatelja, dok liječnicima pruža mogućnost uvida u podatke pacijenata koji su im odobrili pristup.

Problem koji aplikacija nastoji riješiti jest nepreglednost zdravstvene dokumentacije koja se često nalazi na različitim mjestima i u različitim formatima. Objedinjavanjem podataka na jednom mjestu korisnicima se želi olakšati praćenje promjena zdravstvenog stanja kroz vrijeme te razmjena informacija između pacijenata i liječnika.

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

### Trenutačno stanje projekta

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

**Način rada:** Projekt će se razvijati kroz faze analize zahtjeva, oblikovanja sustava, implementacije i ispitivanja. Konačan način organizacije rada i trajanje razvojnih iteracija bit će definirani dogovorom članova tima.

**Praćenje trenutačnih zadataka i nedostataka:** Planirano je korištenje GitHuba za pohranu izvornog koda i praćenje promjena. Poveznica na sustav za praćenje zadataka bit će dodana nakon njegova uspostavljanja.

<details>
<summary><strong>Opis načina rada tima</strong></summary>

Razvoj aplikacije Pulsko bit će organiziran kroz nekoliko međusobno povezanih faza.

U početnoj fazi tim će analizirati problem koji aplikacija nastoji riješiti, definirati funkcionalne i nefunkcionalne zahtjeve te odrediti opseg projekta.

Nakon analize zahtjeva slijedi oblikovanje arhitekture sustava, modeliranje podataka i izrada potrebnih UML dijagrama.

Implementacija će obuhvatiti razvoj korisničkog sučelja, poslužiteljskog dijela i funkcionalnosti potrebnih za rad aplikacije.

Tijekom razvoja planira se redovito provjeravanje implementiranih funkcionalnosti te evidentiranje i otklanjanje pronađenih nedostataka.

Za organizaciju izvornog koda i međusobnu suradnju koristit će se GitHub. Zadaci će se raspodjeljivati među članovima tima u skladu s njihovim odgovornostima i trenutačnim potrebama projekta.

Posebna pozornost posvetit će se međusobnoj usklađenosti različitih dijelova sustava, sigurnosti zdravstvenih podataka i jednostavnosti korištenja aplikacije.

Konačan način organizacije rada, raspodjela odgovornosti i učestalost sastanaka bit će definirani nakon dogovora članova tima.

Ovaj opis predstavlja planirani tijek razvoja. Stvarni način rada bit će dokumentiran nakon početka projekta.

</details>

## Pravila dokumentacije

Dokumentacija projekta sastoji se od međusobno povezanih Markdown stranica koje opisuju različite aspekte razvoja aplikacije.

Obavezni UML dijagrami izrađivat će se u PlantUML-u. Uz svaki dijagram potrebno je sačuvati izvornu `.puml` datoteku i odgovarajući čitljiv grafički prikaz.

Dokumentacija mora biti usklađena sa stvarnim stanjem projekta. Planirane funkcionalnosti jasno će se razlikovati od implementiranih, a rezultati ispitivanja navodit će se tek nakon provedenih provjera.

Dokumentacija će se ažurirati tijekom razvoja, osobito nakon promjena zahtjeva, arhitekture ili implementiranih funkcionalnosti.

<details>
<summary><strong>Izvori dijagrama i nastavni primjeri</strong></summary>

UML dijagrami bit će izrađeni tijekom analize zahtjeva i oblikovanja sustava.

Planirani dijagrami uključuju:

- Dijagram obrazaca uporabe za prikaz interakcija pacijenata i liječnika sa sustavom.
- Dijagram klasa za prikaz strukture sustava i odnosa između glavnih entiteta.
- Sekvencijske dijagrame za prikaz komunikacije između dijelova sustava tijekom izvođenja važnijih funkcionalnosti.
- Ostale dijagrame potrebne za opis arhitekture i ponašanja aplikacije.

Izvorne PlantUML datoteke čuvat će se u repozitoriju projekta, uz odgovarajuće prikaze u dokumentaciji.

Primjeri iz nastavnih materijala koristit će se isključivo kao smjernice za izradu vlastitih modela i neće se prikazivati kao rezultati projekta Pulsko.

Tehnologije koje će se koristiti za implementaciju aplikacije još nisu konačno određene. Nakon odabira bit će navedene i obrazložene u dokumentaciji arhitekture i oblikovanja.

</details>

## Akademski integritet, ponašanje i licenciranje

Projekt će se izrađivati u skladu s pravilima akademskog integriteta Fakulteta elektrotehnike i računarstva Sveučilišta u Zagrebu.

Svi korišteni vanjski izvori, biblioteke i drugi materijali bit će navedeni u dokumentaciji kada budu uključeni u projekt.

README repozitorija sadržavat će projektnu [izjavu o uporabi umjetne inteligencije](../README.md#ai-usage), [informacije o kodeksu ponašanja i podršci](../README.md#code-of-conduct-and-support) te [status licence ili ponovne uporabe](../README.md#license).

Posebna pozornost posvetit će se zaštiti zdravstvenih podataka korisnika. Stvarni osobni i osjetljivi zdravstveni podaci neće se koristiti u javno dostupnim primjerima, demonstracijama ili ispitivanjima aplikacije.

Pristupni podaci, lozinke i druge povjerljive informacije neće se objavljivati u dokumentaciji ni u izvornom kodu repozitorija.

## Izjava o uporabi umjetne inteligencije

Tijekom razvoja aplikacije Pulsko planira se korištenje alata generativne umjetne inteligencije kao pomoć pri analizi zahtjeva, izradi projektne dokumentacije, oblikovanju arhitekture sustava, pisanju i provjeri programskog koda te ispitivanju funkcionalnosti.

Umjetna inteligencija koristit će se prvenstveno za predlaganje mogućih rješenja, objašnjavanje tehničkih problema, optimizaciju programskog koda i izradu pomoćnih materijala potrebnih za razvoj aplikacije.

AI alati neće samostalno donositi projektne odluke. Za odabir konačnih rješenja, njihovu implementaciju i provjeru ispravnosti bit će odgovorni članovi tima.

Svi generirani prijedlozi provjeravat će se, prilagođavati stvarnim zahtjevima projekta i po potrebi dodatno ispitivati.

Korištenje umjetne inteligencije dokumentirat će se tijekom razvoja, u skladu s [pravilima FER-a o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

Kratak sažetak uporabe umjetne inteligencije bit će dostupan i u [README-u repozitorija](../README.md#ai-usage).

### Korišteni alati

U nastavku su navedeni alati čija se uporaba planira tijekom razvoja projekta. Popis će se ažurirati prema stvarnom korištenju.

| Alat | Inačica ili model | Koristio/la | Glavna svrha |
| --- | --- | --- | --- |
| ChatGPT (OpenAI) | Model će se evidentirati pri uporabi | Članovi tima prema potrebi | Analiza zahtjeva, pomoć pri programiranju, dokumentacija i objašnjavanje tehničkih problema |
| Ostali AI alati | Još nije određeno | Članovi tima prema potrebi | Moguća pomoć pri implementaciji, izradi dijagrama i ispitivanju |

### Opseg doprinosa umjetne inteligencije

Sljedeća tablica prikazuje područja u kojima se planira korištenje umjetne inteligencije. Konkretni doprinosi dodat će se nakon njihove realizacije.

| Stranica, datoteka ili artefakt | Vrsta pomoći | Planirani doprinos | Odgovornost tima | Lokacija |
| --- | --- | --- | --- | --- |
| Analiza zahtjeva | Analiza i strukturiranje | Prijedlozi funkcionalnih i nefunkcionalnih zahtjeva | Definiranje i provjera stvarnih zahtjeva | 2-Analiza-zahtjeva.md |
| Obrasci uporabe | Izrada nacrta | Prijedlozi scenarija i tijekova interakcije | Provjera i prilagodba obrazaca uporabe | 3-Obrasci-uporabe.md |
| Arhitektura i oblikovanje | Tehnički prijedlozi | Prijedlozi arhitekture, modela podataka i UML dijagrama | Odabir i provjera arhitekturnih rješenja | 4-Arhitektura-i-oblikovanje.md |
| Programski kod | Pomoć pri implementaciji | Prijedlozi koda, optimizacije i rješenja problema | Pregled, prilagodba i ispitivanje koda | Repozitorij projekta |
| Ispitivanje | Priprema testova | Prijedlozi testnih slučajeva i provjera | Provedba ispitivanja i analiza rezultata | 5-Ispitivanje.md |

Navedeni doprinosi predstavljaju planirane načine korištenja umjetne inteligencije, a ne već ostvarene rezultate. Tijekom razvoja evidentirat će se stvarno korišteni alati, njihove inačice i konkretni doprinosi pojedinim dijelovima projekta.

### Provjera generiranog sadržaja

Za svaki sadržaj izrađen uz pomoć umjetne inteligencije provodit će se odgovarajuća provjera prije njegova prihvaćanja u projekt.

| Provjera | Način provjere | Dokaz |
| --- | --- | --- |
| Činjenična točnost | Usporedba generiranih tvrdnji sa stvarnim zahtjevima, izvornim kodom i ponašanjem aplikacije | Pregled dokumentacije i pripadajućih promjena |
| Nema tvrdnji o neostvarenim funkcionalnostima | Provjera odgovaraju li opisane funkcionalnosti implementiranom sustavu | Dokumentacija zahtjeva i rezultati ispitivanja |
| Dosljednost s drugim stranicama | Usporedba naziva, zahtjeva i dijagrama između različitih dijelova dokumentacije | Pregled povezanih dokumenata |
| Izvori dijagrama | Provjera PlantUML izvora i odgovarajućih grafičkih prikaza | Izvorne `.puml` datoteke i slike |
| Povjerljivi sadržaj | Provjera da se u AI alate ne unose lozinke, pristupni podaci i osjetljivi zdravstveni podaci | Pregled korištenih primjera i projektnih datoteka |

Provjere povezane s implementacijom, arhitekturom i ispitivanjem provest će se nakon izrade odgovarajućih dijelova aplikacije.

### Pogreške pronađene u izlazu umjetne inteligencije

Tijekom razvoja evidentirat će se pogreške u generiranim prijedlozima, njihovi uzroci i načini ispravljanja.

| Problem | Kako je pronađen | Rješenje |
| --- | --- | --- |
| Još nema evidentiranih pogrešaka povezanih s implementacijom aplikacije. | Razvoj još nije započeo. | Tablica će se nadopunjavati tijekom razvoja. |

### Primjer zapisa uporabe umjetne inteligencije

<details>
<summary><strong>Primjer dokumentiranja korištenja AI alata</strong></summary>

Sljedeći primjer prikazuje kako će se tijekom razvoja evidentirati značajnije korištenje umjetne inteligencije. Primjer je ilustrativan i ne predstavlja već implementiranu funkcionalnost.

**Primjer - Pulsko:**

| Stranica ili artefakt | Vrsta pomoći | Što je alat predložio | Što tim treba provjeriti | Lokacija |
| --- | --- | --- | --- | --- |
| Obrasci uporabe, unos nalaza | Izrada nacrta | Glavni i alternativni tijek unosa zdravstvenog nalaza | Usklađenost koraka sa stvarnim zahtjevima | 3-Obrasci-uporabe.md |
| Sekvencijski dijagram unosa nalaza | Izvor dijagrama | Prijedlog PlantUML dijagrama | Usklađenost sudionika i komunikacije s arhitekturom sustava | 4-Arhitektura-i-oblikovanje.md |

**Primjeri mogućih pogrešaka:**

| Problem | Kako ga je moguće pronaći | Predviđeno rješenje |
| --- | --- | --- |
| Generirani opis uključuje funkcionalnost koja nije predviđena zahtjevima | Usporedba s analizom zahtjeva | Uklanjanje ili prilagodba netočne tvrdnje |
| Generirani dijagram prikazuje nepostojeće komponente | Usporedba s arhitekturom sustava | Ispravak dijagrama prema stvarnoj strukturi aplikacije |
| Generirani programski kod ne obrađuje određene rubne slučajeve | Jedinično i integracijsko ispitivanje | Ispravak implementacije i ponavljanje testova |

**Analiza primjera:** Svaki zapis o korištenju umjetne inteligencije treba jasno prikazati gdje je alat korišten, što je predložio i koje je provjere ili izmjene proveo tim.

Takav pristup omogućuje praćenje doprinosa AI alata i razlikovanje automatski generiranih prijedloga od provjerenih i implementiranih rezultata.

</details>
