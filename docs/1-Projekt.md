# 1. Opseg projekta Pulsko

## 1.1 Problem i cilj projekta

Pacijentski zdravstveni podatci i obveze obuhvaćaju laboratorijske nalaze, dnevno stanje, san, aktivnost, puls, terapiju i termine. Kada su te informacije na različitim mjestima, pacijentu može biti teže pratiti ih i pripremiti pitanja za liječnika.

Cilj projekta je izraditi responzivnu web-platformu na kojoj pacijent može pratiti svoje podatke i obveze, a povezani liječnik pregledavati podatke, upravljati terapijom i terminima te komunicirati s pacijentom. Platforma uključuje AI pomoć za objašnjavanje potvrđenih podataka pacijentu i sažimanje dostupnih podataka liječniku. Očekivana je korist lakši pregled relevantnih informacija na jednom mjestu i bolja priprema razgovora između pacijenta i liječnika. Projektni prijedlog ne navodi izmjerene rezultate ni zajamčeno poboljšanje zdravstvenih ishoda.

## 1.2 Ciljani korisnici i dionici

| Skupina korisnika ili dionika | Potreba ili interes relevantan za ovaj projekt                                                                                                                                                                                          |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pacijent                      | Pregledati vlastite zdravstvene podatke, dnevne zapise, terapiju i termine; bilježiti dnevni check-in i komunicirati s povezanim liječnikom. Pacijentski AI agent pomaže razumjeti potvrđene podatke i pripremiti pitanja za liječnika. |
| Liječnik                      | Upravljati zahtjevima za povezivanje, pregledavati podatke pacijenata koji su prihvatili povezivanje, potvrditi ili ispraviti laboratorijske vrijednosti te upravljati terapijom, terminima i komunikacijom.                            |
| Administrator                 | Pregledati zahtjeve za liječničku ulogu (ustanova i broj licence) te ih odobriti ili odbiti, kako bi zdravstvenim podatcima pristupali samo provjereni liječnici. Administrator ne pregledava zdravstvene podatke pacijenata.           |
| Razvojni tim                  | Razviti, objaviti i održavati prototip te osigurati evidenciju važnih promjena i potvrda.                                                                                                                                               |
| Pružatelji vanjskih usluga    | Omogućiti prijavu korisnika, pohranu podataka, AI funkcionalnosti i slanje e-pošte za podsjetnike.                                                                                                                                      |

## 1.3 Granice projekta

**Uključeno:** Responzivna web-aplikacija na engleskom jeziku; prijava korisnika i pristup prema ulogama; odobravanje liječničkih računa od strane administratora; zahtjevi za povezivanje pacijenta i liječnika; pacijentska nadzorna ploča i dnevni check-in; pregled laboratorijskih nalaza i odabranih biomarkera, sna, koraka, pulsa, terapije, povijesti i jednostavnih trendova; ručni unos sna, koraka, aktivnosti i pulsa; automatsko izdvajanje vrijednosti kompletne krvne slike iz PDF nalaza; poruke i upravljanje terminima; unos terapije, evidentiranje uzetih i propuštenih doza te podsjetnici unutar aplikacije i e-poštom. Liječnik mora potvrditi izdvojene laboratorijske vrijednosti prije nego što se smatraju provjerenima. Pacijentski AI agent objašnjava potvrđene podatke i pomaže pripremiti pitanja, dok liječnički AI asistent sažima dostupne podatke i priprema pitanja ili nacrt objašnjenja. Liječnik provjerava AI sadržaj prije nego što ga podijeli s pacijentom. Prototip se javno postavlja i demonstrira s demonstracijskim zdravstvenim podatcima.

**Izvan opsega ili odgođeno:** Pacijentski AI agent ne postavlja dijagnoze, ne propisuje terapiju i ne mijenja doze. Izdvojeni laboratorijski podatci ne smatraju se provjerenima bez liječničke potvrde. Nativna mobilna aplikacija nije navedena u prijedlogu, koji opisuje web-aplikaciju i ručni unos aktivnosti i pulsa. Osnovna verzija uključuje podsjetnike putem e-pošte; push obavijesti nisu nužan dio osnovnog opsega. Automatski dohvat podataka s pametnog sata također nije dio osnovnog opsega; san, koraci i puls unose se ručno. Prototip nije namijenjen kliničkoj uporabi sa stvarnim zdravstvenim podatcima.

**Vanjske ovisnosti:** Pružatelj identiteta s podrškom za OpenID Connect odnosno OAuth 2.0; baza podataka; vanjska AI usluga; usluga e-pošte za podsjetnike; okruženje za javno postavljanje web-aplikacije. Automatsko izdvajanje podržava samo kompletnu krvnu sliku iz PDF dokumenata (od jednog do tri dokumenta, najviše 10 MB po dokumentu) i ovisi o tome sadrže li dokumenti strojno čitljiv tekst (C-06, AS-02). Konkretni pružatelji usluga bit će odabrani pri oblikovanju arhitekture.

## 1.4 Postojeći pristupi i opravdanost projekta

U scenariju bez zajedničkog pregleda poput Pulska pacijent može bilježiti dnevno stanje i aktivnost odvojeno, a termine, terapiju i pitanja obrađivati u zasebnim interakcijama s liječnikom. Takvi postupci omogućuju bilježenje i komunikaciju, ali ne objedinjuju nužno podatke, podsjetnike i termine u prikazu dostupnom povezanom liječniku. Pulsko objedinjuje te funkcije u svom prototipu, uz liječničku potvrdu izdvojenih laboratorijskih nalaza. Projektni prijedlog ne navodi konkretan postojeći proizvod ni podatke o izmjerenom učinku objedinjavanja.
