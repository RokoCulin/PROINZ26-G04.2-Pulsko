# 2. Analiza zahtjeva

**Cilj:** Iz odobrenog opsega projekta izvesti prepoznatljive, prioritetizirane i provjerljive zahtjeve. Zahtjevi se mogu mijenjati; pri završnoj predaji moraju odražavati dogovorenu aplikaciju. Izvori, odluke i poveznice u primjerima kolegija nastavni su scenariji, a ne projektni zapisi.

<details>
<summary><strong>Održavanje zahtjeva ažurnima</strong></summary>

Primjeri koriste temu projekta CrisisMap. Neki namjerno sadrže korisne nedostatke za raspravu. Izvori, odluke i poveznice na provjere u tim primjerima **nastavni su scenariji**, a ne zapisi rada stvarnog studentskog tima. Zamijenite ih zahtjevima i dokazima svojeg odobrenog projekta. Značajne promjene zabilježite u odjeljku 2.5.

</details>

## 2.1 Funkcijski zahtjevi

**Cilj:** Navesti što aplikacija mora omogućiti korisnicima, odakle pojedina mogućnost proizlazi i koji se opažljivi rezultat smatra prihvaćanjem.

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-001 | Sustav omogućuje pacijentu i liječniku prijavu putem vanjskog pružatelja identiteta uporabom protokola OpenID Connect odnosno OAuth 2.0. | Visok | Odobreni projektni zadatak | Nakon uspješne vanjske prijave korisnik ulazi u aplikaciju i dobiva pristup sučelju svoje uloge. Ako prijava ne uspije ili je korisnik prekine, zaštićene funkcionalnosti ostaju nedostupne. |
| F-002 | Sustav razlikuje uloge pacijenta i liječnika te ograničava dostupne podatke i radnje prema dodijeljenoj ulozi. | Visok | Odobreni projektni zadatak | Pacijent može pristupiti samo vlastitim zdravstvenim podatcima, a liječnik samo podatcima pacijenata koji su s njim povezani. Pokušaj nedopuštenog pristupa sustav odbija. |
| F-003 | Sustav omogućuje povezivanje pacijenta s liječnikom. | Visok | Odobreni projektni zadatak | Nakon uspješnog povezivanja liječnik vidi pacijenta na svojem popisu i može otvoriti njegove dopuštene podatke, dok nepovezani liječnik tim podatcima ne može pristupiti. |
| F-004 | Sustav pacijentu prikazuje osobnu nadzornu ploču sa sažetkom zdravstvenih podataka, obveza, termina i terapije. | Visok | Odobreni projektni zadatak | Prijavljeni pacijent na jednom mjestu vidi posljednje dostupne zdravstvene vrijednosti, nadolazeće termine i današnje obveze vezane uz terapiju. |
| F-005 | Sustav omogućuje pacijentu ispunjavanje dnevnog check-ina o trenutačnom stanju. | Visok | Odobreni projektni zadatak | Pacijent može za odabrani dan spremiti tražene podatke o tome kako se osjeća, naknadno ih pregledati, a povezani liječnik vidi spremljeni zapis. Neispravan ili nepotpun obavezan unos sustav ne prihvaća. |
| F-006 | Sustav omogućuje unos, pohranu i pregled podržanih zdravstvenih podataka pacijenta. | Visok | Odobreni projektni zadatak | Pacijent može unijeti podržane laboratorijske vrijednosti i druge dopuštene podatke, a sustav ih sprema uz datum i jedinicu mjere te ih prikazuje pacijentu i povezanom liječniku. |
| F-007 | Sustav iz podržanih PDF dokumenata izdvaja vrijednosti kompletne krvne slike i označava ih kao nepotvrđene. | Visok | Odobreni projektni zadatak i dogovoreno ograničenje tima | Nakon učitavanja od jednog do tri podržana PDF dokumenta sustav prikazuje izdvojene vrijednosti kompletne krvne slike radi provjere. Nepodržanu datoteku odbija uz razumljivu poruku i ne prikazuje je kao uspješno obrađenu. |
| F-008 | Sustav omogućuje liječniku potvrđivanje ili ispravljanje izdvojenih laboratorijskih vrijednosti. | Visok | Odobreni projektni zadatak | Liječnik može otvoriti nepotvrđene vrijednosti povezanog pacijenta, ispraviti ih ako je potrebno i potvrditi. Sustav bilježi status, vrijeme i liječnika koji je napravio potvrdu. |
| F-009 | Sustav dohvaća podatke o snu, koracima i srčanom pulsu iz jednog podržanog servisa pametnog sata. | Visok | Odobreni projektni zadatak | Nakon što pacijent poveže podržani servis i odobri pristup, sustav dohvaća dostupne vrijednosti za odabrano razdoblje i sprema ih uz vrijeme mjerenja. Neuspješna sinkronizacija ne briše prethodno spremljene podatke. |
| F-010 | Sustav pacijentu i povezanom liječniku prikazuje povijest i jednostavne trendove zdravstvenih podataka. | Srednji | Odobreni projektni zadatak | Korisnik može odabrati podržanu vrstu podatka i vremensko razdoblje te pregledati kronološki prikaz ili graf dostupnih vrijednosti, uz jasno označena razdoblja bez podataka. |
| F-011 | Sustav omogućuje razmjenu tekstualnih poruka između pacijenta i povezanog liječnika. | Srednji | Odobreni projektni zadatak | Pacijent i s njim povezani liječnik mogu poslati poruku i vidjeti je u zajedničkom razgovoru s vremenom slanja. Nepovezani korisnik ne može otvoriti ni koristiti taj razgovor. |
| F-012 | Sustav omogućuje evidentiranje i pregled termina pacijenta, a liječniku omogućuje upravljanje terminima povezanih pacijenata. | Srednji | Odobreni projektni zadatak | Liječnik može dodati, promijeniti ili otkazati termin, a pacijent vidi ažurirane nadolazeće i prethodne termine. Sustav sprječava spremanje termina bez obaveznog datuma i vremena. |
| F-013 | Sustav omogućuje liječniku unos i odobravanje rasporeda terapije za povezanog pacijenta. | Visok | Odobreni projektni zadatak | Liječnik može za lijek upisati naziv, količinu i vrijeme uzimanja te aktivirati raspored. Pacijent vidi samo trenutačno važeću terapiju i pripadajuće upute. |
| F-014 | Sustav pacijenta obavještava o dospjeloj obvezi uzimanja lijeka i čuva povijest obavijesti. | Visok | Odobreni projektni zadatak | Za aktivni raspored terapije sustav u dogovoreno vrijeme stvara obavijest unutar aplikacije ili podržanu push obavijest koja navodi lijek i količinu. Pacijent može pregledati prethodne obavijesti. |
| F-015 | Sustav pacijentu pruža Health Agenta koji objašnjava potvrđene podatke iz njegova profila i pomaže mu pripremiti pitanja za liječnika. | Visok | Odobreni projektni zadatak | Pacijent može postaviti pitanje o dostupnim potvrđenim podatcima, a agent vraća odgovor temeljen na tim podatcima ili jasno navodi da nema dovoljno informacija. Agent ne postavlja dijagnozu, ne propisuje lijek i ne mijenja dozu. |
| F-016 | Sustav liječniku pruža AI asistenta za sažimanje dostupnih podataka pacijenta, uočavanje mogućih obrazaca i pripremu nacrta pitanja ili objašnjenja. | Visok | Odobreni projektni zadatak | Liječnik za odabranog povezanog pacijenta može zatražiti sažetak ili nacrt, dobiti rezultat označen kao sadržaj koji zahtijeva stručnu provjeru te odlučiti hoće li ga urediti ili podijeliti. Sustav sadržaj ne šalje pacijentu automatski. |
| F-017 | Sustav vodi provjerljiv zapis važnih promjena zdravstvenih podataka, potvrda laboratorijskih vrijednosti i promjena terapije. | Srednji | Odobreni projektni zadatak | Za podržanu promjenu moguće je utvrditi vrstu radnje, vrijeme i korisnika koji ju je izvršio, a obični korisnik ne može mijenjati postojeći zapis aktivnosti. |


## 2.2 Nefunkcijski zahtjevi

**Cilj:** Odrediti važna svojstva kvalitete i uvjete rada odobrene aplikacije na način koji tim može razumno provjeriti.

| ID | Opis | Prioritet | Izvor | Način provjere |
| --- | --- | --- | --- | --- |
| NF-01 | Sustav mora podržavati najmanje 10 registriranih liječnika i 1.000 registriranih pacijenata. Jedan liječnik ne smije biti povezan s više od 2.125 pacijenata. | Visok | Cilj kapaciteta tima; [maksimalni broj osiguranih osoba za tim opće/obiteljske medicine prema HZZO-u](https://hzzo.hr/en/pitanja-i-odgovori/15) | Generirati najmanje 10 liječničkih i 1.000 pacijentskih računa, povezati ih i provjeriti dohvat popisa i pojedinačnih profila. Zasebnim graničnim testom provjeriti da sustav odbija povezivanje 2.126. pacijenta s istim liječnikom. |
| NF-02 | Pri uobičajenom opterećenju od 30 istodobno aktivnih korisnika i najvećem predviđenom opterećenju od 150 korisnika obične radnje moraju završiti unutar tri sekunde, dok AI odgovor mora biti dostupan unutar deset sekundi. | Visok | Cilj performansi tima | Provesti ponovljiv test s 30 i 150 istodobnih korisnika nad reprezentativnim dohvatima i spremanjima te izmjeriti trajanje svake radnje. Zasebno izmjeriti najmanje deset zahtjeva prema AI usluzi; svaki uspješan odgovor mora stići unutar deset sekundi. |
| NF-03 | Sustav mora prihvatiti istodobni unos najviše tri PDF dokumenta veličine do 10 MB po dokumentu i dovršiti izdvajanje podržanih vrijednosti kompletne krvne slike unutar jedne minute. | Visok | Dogovoreno ograničenje opsega i performansi | Učitati tri podržana PDF dokumenta veličine do 10 MB i izmjeriti vrijeme do prikaza izdvojenih vrijednosti. Provjeriti da sustav odbija četvrti dokument, dokument veći od 10 MB i datoteku koja nije PDF, bez djelomičnog spremanja. |
| NF-04 | Obavijest o dospjeloj obvezi uzimanja lijeka mora biti stvorena najkasnije pet minuta nakon vremena određenog aktivnim rasporedom terapije. | Visok | Cilj pravodobnosti tima | U kontroliranom testu postaviti više rasporeda terapije i usporediti zakazano vrijeme s vremenom nastanka obavijesti; razlika ni u jednom uspješnom slučaju ne smije biti veća od pet minuta. |
| NF-05 | Sustav mora štititi zdravstvene podatke poslužiteljskom autorizacijom, prijenosom preko HTTPS-a i sigurnim čuvanjem tajni izvan repozitorija. Razvojni i demonstracijski podatci moraju biti izmišljeni ili anonimizirani. | Visok | Osjetljivost zdravstvenih podataka i pravila kolegija | Pokušati pristupiti zaštićenim podatcima kao odjavljeni korisnik, pacijent i nepovezani liječnik te potvrditi da su svi nedopušteni zahtjevi odbijeni. Provjeriti HTTPS, konfiguraciju tajni, testne podatke, dokumentaciju i povijest repozitorija. |
| NF-06 | Korisničko sučelje mora biti na engleskom jeziku, podržavati aktualne stabilne inačice preglednika Chrome, Firefox i Safari te ostati uporabivo na širinama zaslona od 360 px do najmanje 1.280 px. Glavne radnje moraju se moći izvesti tipkovnicom uz vidljiv fokus. | Srednji | Odobreni projektni zadatak i cilj pristupačnosti tima | U sva tri preglednika proći glavne pacijentske i liječničke tijekove na širinama od 360 px i 1.280 px. Provjeriti engleski tekst, izostanak vodoravnog pomicanja cijele stranice te izvođenje glavnih radnji samo tipkovnicom. |

## 2.3 Dionici i akteri

**Cilj:** Utvrditi uloge koje utječu na zahtjeve i razlikovati dionike od aktera koji komuniciraju s aplikacijom.

| ID uloge ili aktera | Odnos prema sustavu | Relevantni zahtjevi |
| --- | --- | --- |
|  |  |  |

<details>
<summary><strong>Akteri i povezani zahtjevi</strong></summary>

**Primjer — akteri aplikacije CrisisMap:**

| ID aktera | Uloga | Obuhvaćeni funkcijski zahtjevi |
| --- | --- | --- |
| A-01 | Koordinator pomoći | F-003: Pregled resursa; F-004: Podnošenje prijave kriznog događaja. |
| A-02 | Građanin | F-001: Izrada računa; F-005: Primanje obavijesti. |
| A-03 | Administrator sustava | NF-1.2: Provođenje sigurnosnih pravila; upravljanje korisnicima. |
| A-04 | Posjetitelj | F-007: Pregled prijava na karti. |
| A-05 | Moderator | F-008: Odobravanje ili odbijanje prijava. |

**Odgovornosti aktera:** Uloga aktera treba biti povezana s interakcijom, a ne samo s nazivom. Provjerite podnosi li koordinator pomoći u odobrenom zadatku doista prijave kriznih događaja. Poveznica administratora s NF-1.2 navodi sigurnosni aspekt, ali sama po sebi ne opisuje obrazac uporabe; navedite stvarnu radnju administratora ili izostavite ulogu ako je nema. Nastavnici zainteresirani za rezultat mogu biti dionici, a da nisu akteri aplikacije. Tablica je polazište za razmišljanje, a ne potvrđen opis ovlasti u CrisisMapu.

</details>

---

## 2.4 Ograničenja i pretpostavke

**Cilj:** Zabilježiti projektno specifične granice i pretpostavke koje utječu na zahtjeve ili oblikovanje, zajedno s njihovim izvorom i praktičnom posljedicom. Ovo je njihovo mjerodavno mjesto u dokumentaciji.

| ID | Tip | Opis ograničenja ili pretpostavke | Izvor | Inženjerska posljedica / Provjera |
| --- | --- | --- | --- | --- |
| C-01 | Ograničenje | [Fiksni tehnički ili procesni uvjet] | [Zadatak / Pravila] | [Utjecaj na arhitekturu i oblikovanje] |
| AS-01 | Pretpostavka | [Očekivani uvjet, npr. o podacima ili okolini] | [Procjena tima] | [Kako i kada će se provjeriti valjanost] |
|  |  |  |  |  |
<details>
<summary><strong>Ograničenja nasuprot pretpostavkama</strong></summary>

Ograničenje je uvjet koji tim mora poštovati; pretpostavka je uvjet na koji se tim oslanja i koji treba ponovno provjeravati.

**Primjer — projektni kontekst CrisisMapa:**

| ID | Ograničenje ili pretpostavka | Izvor | Posljedica ili način provjere |
| --- | --- | --- | --- |
| C-01 | Odobreni zadatak zahtijeva OAuth prijavu u sustav za uređivanje vlastitih prijava korisnika. | Odobreni zadatak  | Zaštićeno uređivanje projektirati oko odabranog pružatelja identiteta; provjeriti autorizirane i neautorizirane zahtjeve. |
| AS-01 | Prijave koje se prikazuju na karti imaju uporabive koordinate. | Pretpostavka o podacima  | Pregledati ogledne i uvezene prijave; planirati prikaz prijava bez valjanih koordinata. |

**Ograničenje nasuprot pretpostavci:** C-01 navodi obvezujuću odluku i njezin arhitekturni učinak; AS-01 je moguće provjeriti i može se pokazati netočnim. Nemojte kopirati C-01 ako OAuth nije dio stvarnog odobrenog zadatka. Projektni odgovor objasnite u arhitekturi bez prepisivanja ove tablice.

</details>

---

## 2.5 Značajne promjene zahtjeva

**Cilj:** Sačuvati razlog promjena koje mijenjaju dogovoreni opseg, prioritet ili kriterije prihvaćanja, uz istodobno održavanje prethodnih zahtjeva ažurnima.

| Datum | ID zahtjeva | Promjena i razlog | Dogovoreno s / dokaz |
| --- | --- | --- | --- |
|  |  |  |  |

<details>
<summary><strong>Primjer značajne promjene</strong></summary>

**Primjer scenarija — odluka tijekom pregleda CrisisMapa:**

| Datum | ID zahtjeva | Promjena i razlog | Dogovoreno s / dokaz |
| --- | --- | --- | --- |
| [Datum pregleda] | F-004, NF-01 | Dodati ručni odabir lokacije kada korisnik odbije geolokaciju preglednika; bez toga građanin ne može podnijeti prijavu kriznog događaja s lokacijom. | [Poveznica na stvarnu bilješku pregleda ili zadatak tima] |

**Razlog promjene:** Zapis navodi zahvaćene stavke i objašnjava razlog iz perspektive korisnika, a zatim upućuje na dokaz odluke.  Nakon stvarne odluke ažurirajte trenutačne zahtjeve; stilska izmjena teksta ne zahtijeva zapis u dnevniku promjena. Trenutačni red zadataka držite u alatu za praćenje zadataka.

</details>

---

## 2.6 Sljedivost zahtjeva

**Cilj:** Osigurati dvosmjernu sljedivost — povezati zahtjeve s opisanim ponašanjem, dijelovima sustava koji ih ostvaruju te ispitivanjem ili drugom provjerom. 

| ID zahtjeva | Obrazac uporabe / modul | Arhitekturna realizacija | Ispitivanje ili provjera |
| --- | --- | --- | --- |
| F-001 | [UC-001] | [Komponenta, modul ili drugo mjesto realizacije] | [ST-01, CT-01 ili druga provjera] |
|  |  |  |  |

<details>
<summary><strong>Sljedivost zahtjeva do obrazaca uporabe i ispitivanja</strong></summary>

**Primjer — poveznice zahtjeva CrisisMapa:**

| ID zahtjeva | Obrazac uporabe / ponašanje | Arhitekturna realizacija | Ispitivanje / provjera |
| --- | --- | --- | --- |
| F-004 | UC-002 Podnošenje prijave kriznog događaja | Web-klijent; API za prijave; usluga za prijave | ST-01 Valjano podnošenje prijave; ST-02 Nedostaje obavezna lokacija; ST-03 Dopuštenje geolokacije odbijeno |
| F-005 | Odabir primatelja obavijesti | Proces za obavijesti | CT-06 Primatelji obavijesti; potpuna dostava obavijesti nije pokrivena ovom provjerom |

**Pokrivenost i dokazi:** CT-06 provjerava odabir primatelja za F-005, ali sam po sebi ne dokazuje da je obavijest stvarno dostavljena; ako projekt zahtijeva potpunu dostavu od početka do kraja, za taj dio treba postojati zasebna provjera. Svaki redak pokazuje gdje je zahtjev opisan kao ponašanje, gdje je ostvaren u sustavu i gdje se nalazi dokaz njegove provjere. Zahtjev ne mora imati zaseban obrazac uporabe ako ne opisuje korisničku interakciju; tada navedite relevantno ponašanje, arhitekturni element ili drugi prikladan način realizacije. U svojem projektu koristite stvarne nazive komponenata, modula i provjera iz dokumentacije i implementacije. Nedostajuću poveznicu ostavite praznom ili označite kao *na čekanju* uz kratak razlog. Stvarni rezultati ispitivanja bilježe se uz ispitne slučajeve; ova tablica pokazuje gdje ih pronaći.

</details>

---

## 2.7 Pregled zahtjeva

**Cilj:** Zabilježiti važne povratne informacije o zahtjevima i odluke koje iz njih proizlaze na dvije formalne kontrolne točke projekta, u 7. i 14. tjednu.

| Kontrolna točka | Povratna informacija ili nalaz | Odluka o zahtjevu ili opsegu |
| --- | --- | --- |
| Iteracija 1 | [Povratna informacija] | [Odluka; vidi odjeljak 2.5] |
| Demo 2  | [Povratna informacija] | [Odluka; vidi odjeljak 2.5] |
| Završni pregled | [Povratna informacija] | [Odluka; vidi odjeljak 2.5] |

<details>
<summary><strong>Odluke o zahtjevima nakon pregleda</strong></summary>

**Primjer scenarija — pregled zahtjeva CrisisMapa:**

| Kontrolna točka | Povratna informacija ili nalaz | Odluka o zahtjevu ili opsegu |
| --- | --- | --- |
| Iteracija 1 | Demonstracija pokazuje da odbijanje pristupa lokaciji preglednika onemogućuje podnošenje prijave. | Dogovoriti ručni odabir lokacije; ažurirati F-004 i primjer NF-01 te razlog zabilježiti u odjeljku 2.5. |

**Odluka povezana s povratnom informacijom:** Zapis povezuje opaženo ponašanje s konkretnom promjenom zahtjeva i izbjegava zapisnik cijelog sastanka. Zapišite samo stvarne povratne informacije i odluke za kontrolne točke. Konzultacije u nekom drugom tjednu ne stvaraju dodatnu obaveznu predaju.

</details>

---

>**Završna provjera:** Zahtjevi su aktualni, provjerljivi i povezani. Svaki važan zahtjev moguće je pratiti od njegova opisa i ponašanja preko mjesta realizacije u sustavu do odgovarajućeg ispitivanja ili druge provjere. Poveznice koriste stvarne identifikatore i nazive iz projektne dokumentacije.

