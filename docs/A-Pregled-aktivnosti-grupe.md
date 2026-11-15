# A. Pregled aktivnosti grupe

**Cilj:** Prikazati kako je tim organizirao projekt, raspodijelio rad, reagirao na važne probleme i pridonio rezultatu. Zapisi trebaju opisivati ishode, a ne samo navoditi da je sastanak održan ili da se o nekoj temi raspravljalo.

## A.1 Evidencija sastanaka

**Cilj:** Voditi kratak zapis projektnih sastanaka i tjedne koordinacije: tko je sudjelovao, što je odlučeno i koja je radnja uslijedila. Raspravu koja nije dovela do odluke zabilježite samo ako je važno pitanje ostalo otvoreno.

Članovi tima: RČ = Roko Čulin; BF = Borna Flegar; DM = Dora Maruševec; AN = Antonio Nović; BO = Borna Oršulić; HŠ = Hrvoje Štivić; JT = Jakov Troje

| Datum i sudionici | Glavna tema | Donesena odluka ili zadatak | Poveznica na zadatak ili rezultat, ako postoji |
| --- | --- | --- | --- |
| 14. 10. 2026.; RČ, BF, DM, AN, BO, HŠ, JT | Odabir i razrada ideje za projekt | Definirane su glavne funkcionalnosti i izrađen službeni prijedlog projekta | / |
| 24. 10. 2026.; RČ, BF, DM, AN, BO, HŠ | Podjela zadataka za dokumentaciju | Dogovorena je podjela i preuzimanje zadataka za popunjavanje projektne dokumentacije. RČ preuzima #1 i #6, BF #2, AN #3, BO #4 i #5, DM #7, a HŠ #9.” | Zadatci #1-#7 i #9 |
| 26. 10. 2026.; RČ, BF, DM, AN, BO, HŠ, JT | Podjela zadataka za implementaciju sustava | Dogovorena je raspodjela poslova za razvoj aplikacije. RČ preuzima razvoj backenda i administratorskog modula, JT izradu baze podataka, HŠ preuzima implementaciju prijave i registracije korisnika putem OAuth 2.0, AN i DM razvoj frontenda za pacijente i liječnike te oblikovanje korisničkog sučelja, a BO integracije i postavljanje sustava. | Zadaci #17–#20, #22–#25, #28, #30–#33 |
| 13. 11. 2026.; RČ, BF, DM, AN, BO, HŠ, JT | Pregled napretka implementacije i priprema za demonstraciju | Pregledan je napredak razvoja aplikacije i dogovoreno dovršavanje preostalih funkcionalnosti za demonstraciju. Za doradu dokumentacije BO preuzima ispravak prioriteta funkcijskih zahtjeva, HŠ ažuriranje pregleda aktivnosti, BF izradu UML dijagrama, AN preuzima dopunu arhitekturne dokumentacije i modela podataka, a DM izradu domenskog UML dijagrama. | Zadatci #16, #32, #49–#51, #53–#56 |

## A.2 Plan rada

**Cilj:** Prikazati planirani redoslijed rada i odgovornosti u timu. Prikažite projektne tjedne ili druga kratka razdoblja koja tim koristi, uključujući pripremu za formalne provjere.

**Trenutačni plan:** Održavana tablica u nastavku. Za ažurnost plana zadužen je HŠ.

| Razdoblje/Tjedan | Glavni planirani rad | Odgovorni članovi | Poveznica na zadatke |
| --- | --- | --- | --- |
| Projektni tjedan 3 | Definiranje funkcijskih i nefunkcijskih zahtjeva te razrada obrazaca uporabe i dokumentacije | RČ, BF, DM, AN, BO, HŠ | Zadatci #1-#7 i #9 |
| Projektni tjedan 4 | Dorada UML dijagrama obrazaca uporabe te početak oblikovanja dizajna korisničkog sučelja. | DM | Zadatci #15 i #17 |
| Projektni tjedan 5 | Izrada PostgreSQL baze podataka i pripadajuće dokumentacije, postavljanje Python FastAPI backenda i njegovo povezivanje s bazom te početak pripreme i razvoja frontend stranica. | RČ, DM, AN, JT | Zadatci #18–#20, #22–#25, #30, #31 |
| Projektni tjedan 6 | Dovršavanje i integracija frontend stranica, implementacija OAuth 2.0 prijave, korisničkih uloga, administratorskih funkcionalnosti, povezivanja pacijenta s liječnikom i dnevnog check-ina. Dorada projektne dokumentacije prema primjedbama s laboratorijskih vježbi, ispravak prioriteta funkcijskih zahtjeva te izrada arhitekturnih i UML dijagrama. | RČ, BF, DM, AN, BO, HŠ, JT | Zadatci #15–#17, #22–#29, #32–#34, #43–#51, #53–#56 |
| Projektni tjedan 7 | Demonstracija funkcionalne aplikacije s prijavom korisnika, povezivanjem pacijenta s liječnikom te dnevnim check-inom. Završno ispravljanje nedostataka, postavljanje aplikacije na javno dostupnu adresu i predaja prvog ciklusa. | RČ, BF, DM, AN, BO, HŠ, JT | Zadatci #32, #49, #50 |

## A.3 Aktivnosti i doprinosi članova

**Cilj:** Prikazati koji su članovi radili na važnim projektnim aktivnostima i približan trud koji prijavljuju. Uz implementaciju uključite oblikovanje, dokumentaciju, integraciju, ispitivanje i postavljanje.

| Aktivnost ili rezultat | Član | Prijavljeni sati | Reprezentativni rezultat ili poveznica |
| --- | --- | --- | --- |
| Prilagođavanje sadržaja datoteke README.md | RČ | 2 | Zadatak #1 |
| Izrada uvodne stranice dokumentacije (docs/Home.md) | BF | 3 | Zadatak #2 |
| Definicija cilja, ciljanih korisnika i granica projekta (docs/1-Projekt.md) | AN | 3 | Zadatak #3 |
| Definiranje funkcijskih i nefunkcijskih zahtjeva ( docs/2-Analiza-zahtjeva.md ) | BO | 4 | Zadatak #4 i #5 |
| Razrada ključnih obrazaca uporabe ( docs/3-Obrasci-uporabe.md ) | RČ | 2 | Zadatak #6 |
| Izrada UML dijagrama obrazaca uporabe (docs/puml) | DM | 3 | Zadatak #7 |
| Izrada i vođenje pregleda aktivnosti grupe ( docs/A-Pregled-aktivnosti-grupe.md ) | HŠ | 2 | Zadatak #9 |
| Dorada UML dijagrama obrazaca uporabe | DM | 2 | Zadatak #15 |
| Oblikovanje dizajna korisničkog sučelja aplikacije | DM | 5 | Zadatak #17 |
| Izrada frontend stranica za početnu stranicu, prijavu, pacijenta, liječnika i laboratorijske nalaze te integracija frontenda u glavnu granu | DM, AN | 15 po članu | Zadatci #22–#26 |
| Izrada PostgreSQL baze podataka, sheme i dokumentacije te ispravak uputa za postavljanje baze | JT | 12 | Zadatci #18, #19, #20, #27 |
| Postavljanje Python FastAPI backenda, povezivanje s PostgreSQL bazom i izrada SQLAlchemy modela | RČ | 8 | Zadatci #30, #31, #43 |
| Implementacija OAuth 2.0 prijave, odabira korisničke uloge i CSRF zaštite administratorskih akcija | HŠ | 11 | Zadatci #32, #33, #48 |
| Integracija OAuth prijave i korisničkih sesija te ispravljanje konfiguracije .gitignore datoteke | RČ | 4 | Zadatci #44, #45 |
| Implementacija administratorske stranice za odobravanje liječnika, registracije liječnika s ustanovom i licencom te postavljanje administratorskog računa | RČ | 10 | Zadatci #28, #46, #47 |
| Implementacija API-ja za povezivanje pacijenta s liječnikom i backenda za dnevni check-in pacijenta | RČ | 9 | Zadatci #49, #50 |
| Usklađivanje podataka između frontenda, backenda i PostgreSQL baze te integracija funkcionalnosti aplikacije | RČ | 5 | Zadatak #29 |
| Dorada prioriteta funkcijskih zahtjeva prema primjedbama s laboratorijskih vježbi | BO | 2 | Zadatak #16 |
| Ažuriranje pregleda aktivnosti grupe, evidencije sastanaka, plana rada i doprinosa članova | HŠ | 2 | Zadatak #51 |
| Izrada UML dijagrama sustava i prve verzije domenskog UML dijagrama | BF | 6 | Zadatci #53, #56 |
| Dopuna arhitekturne dokumentacije, uključujući ključne arhitekturne odluke, model podataka i oblikovanje razreda | AN | 4 | Zadatak #54 |
| Izrada domenskog UML dijagrama | DM | 4 | Zadatak #55 |

## A.4 Pregled promjena u repozitoriju

**Cilj:** Prikazati kada su promjene napravljene u repozitoriju i tko ih je napravio, uz napomenu da sam broj zapisa promjena ne mjeri kvalitetu doprinosa.

**Prikaz aktivnosti repozitorija:** [Contributors graf](https://github.com/RokoCulin/PROINZ26-G04.2-Pulsko/graphs/contributors)

*Napomena:* Graf prikazuje aktivnosti i doprinose članova tima tijekom razvoja projekta, uključujući promjene u dokumentaciji i implementaciji sustava.

## A.5 Ključni inženjerski izazovi i rješenja

**Cilj:** Dokumentirati stvarne tehničke i organizacijske prepreke s kojima se tim suočio, poduzete korektivne inženjerske korake te konačni ishod. Odaberite konkretne izazove umjesto općenite pohvale timskog rada.

| Izazov | Poduzeta radnja | Ishod ili preostalo ograničenje |
| --- | --- | --- |
| Nedovoljna razina apstrakcije i grupiranja elemenata u UML dijagramu obrazaca uporabe. | UML dijagram je dorađen uvođenjem apstraktnih obrazaca uporabe i grupiranjem konkretnih obrazaca u logičke cjeline te prilagodbom rasporeda dijagrama. | Poboljšana je organizacija i preglednost UML dijagrama, a ažurirani dijagram uključen je u projektnu dokumentaciju. |
| Neispravna konfiguracija .gitignore datoteke uzrokovala je ignoriranje datoteka potrebnih za pokretanje frontenda. | Uklonjena su pravila koja su ignorirala slike i konfiguracijske datoteke frontenda te je dodano pravilo za ignoriranje .DS_Store datoteka. | Omogućeno je praćenje potrebnih frontend datoteka u repozitoriju, a zadatak je zatvoren. |
| Nakon spajanja OAuth prijave u aplikaciju nedostajali su autentifikacijski router i podrška za korisničke sesije, zbog čega prijava nije funkcionirala. | Uključen je autentifikacijski router, dodan SessionMiddleware te je privremena autentifikacija putem X-User-Id zaglavlja zamijenjena provjerom korisnika iz sesije. | Omogućena je autentifikacija putem korisničkih sesija i prilagođena provjera administratorskih prava. Zadatak je zatvoren. |
| Neusklađenost podataka između frontenda i baze, uključujući različite nazive i tipove polja dnevnog check-ina te identifikatore korisnika. | Nadograđen je backend dodavanjem potrebnih API ruta, shema i servisa te je frontend prilagođen za komunikaciju s backendom i usklađivanje formata podataka. | Omogućena je razmjena podataka između frontenda i backenda za ključne funkcionalnosti, a zadatak je zatvoren nakon integracijskih promjena. |
