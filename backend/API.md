# Pulsko API – dogovor

Svi zahtjevi idu s kolačićem sesije (`credentials: "include"`). Svaki `POST` traži zaglavlje `X-CSRF-Token`, a vrijednost se uzima iz `csrf_token` u `GET /auth/me`. Greške imaju oblik `{"detail": "..."}`; kod 422 (validacija) `detail` može biti i popis grešaka. Vremena su ISO 8601 s vremenskom zonom.

Zajednički kodovi: **401** niste prijavljeni · **403** kriva uloga, neodobren liječnik ili neispravan CSRF token · **422** neispravan unos.

Interaktivna dokumentacija: `http://localhost:8000/docs`.

---

## Prijava

Tok je opisan u `README.md` (odjeljak „Prijava”). Endpointi: `GET /auth/login?role=patient|doctor`, `GET /auth/callback`, `POST /auth/register`, `GET /auth/me`, `POST /auth/logout`.

---

## Dnevni check-in (F-005, F-009, UC-1.1) – samo pacijent

### `POST /patient/checkins`
Spremi današnji check-in ili ga zamijeni novim vrijednostima. „Danas” se računa po zoni Europe/Zagreb. Sva polja su opcionalna, ali barem jedno mora biti zadano; nepoznata polja → 422.

```json
{
  "general_state": 4,
  "sleep_hours": 7.5,
  "steps": 6500,
  "heart_rate_bpm": 72,
  "activity_minutes": 30,
  "activity_description": "Šetnja"
}
```

| Polje | Raspon |
|---|---|
| `general_state` | 1–5 (5 = odlično) |
| `sleep_hours` | 0–24 |
| `steps` | 0–100000 |
| `heart_rate_bpm` | 30–220 |
| `activity_minutes` | 0–1440 |
| `activity_description` | do 1000 znakova |

Odgovor **201** (novi unos) ili **200** (ažuriran današnji):

```json
{
  "checkin_id": 12,
  "checkin_date": "2026-11-14",
  "general_state": 4,
  "sleep_hours": 7.5,
  "steps": 6500,
  "heart_rate_bpm": 72,
  "activity_minutes": 30,
  "activity_description": "Šetnja",
  "created_at": "2026-11-14T08:15:02.120000+01:00",
  "updated_at": "2026-11-14T08:15:02.120000+01:00"
}
```

Greške: **409** dva istovremena prva unosa istog dana (pokušati ponovno).

### `GET /patient/checkins?limit=7`
Zadnjih `limit` unosa (1–90, zadano 7), od najnovijeg. Odgovor je popis objekata kao gore.

---

## Povezivanje pacijenta s liječnikom (F-003, UC-3, UC-5.3)

Stanja veze: `pending` (čeka liječnika) → `accepted` ili `rejected`. Za isti par pacijent–liječnik smije postojati najviše jedna veza u stanju `pending` ili `accepted`. Nakon `rejected` pacijent smije poslati novi zahtjev, koji je nova veza s novim `link_id`. Baza dopušta `accepted` samo odobrenom liječniku i najviše 2125 pacijenata po liječniku.

### `POST /patient/doctors` – pacijent šalje zahtjev
```json
{ "doctor_email": "ana.novak@kbc.hr" }
```
E-mail se uspoređuje bez obzira na velika i mala slova i razmake. Odgovor **201**:

```json
{
  "link_id": 7,
  "status": "pending",
  "requested_at": "2026-11-14T09:00:00.000000+01:00",
  "responded_at": null,
  "doctor": {
    "user_id": 3,
    "display_name": "Ana Novak",
    "email": "ana.novak@kbc.hr",
    "institution": "KBC Zagreb"
  }
}
```

| Kod | Kada | `detail` |
|---|---|---|
| 404 | liječnik s tim e-mailom ne postoji ili nije odobren (ista poruka u oba slučaja) | `Liječnik nije pronađen` |
| 409 | za ovaj par već postoji veza `pending` ili `accepted` | `Zahtjev za ovog liječnika već čeka odgovor ili ste već povezani` |
| 422 | e-mail bez `@`, prazan ili predug | popis grešaka |

### `GET /patient/doctors` – pacijent vidi svoje veze
Sve veze pacijenta (svih stanja), od najnovije. Popis objekata kao u odgovoru na `POST`.

### `GET /doctor/requests` – liječnik vidi zahtjeve na čekanju
Samo odobreni liječnik (inače 403). Vraća samo zahtjeve upućene njemu, od najstarijeg:

```json
[
  {
    "link_id": 7,
    "status": "pending",
    "requested_at": "2026-11-14T09:00:00.000000+01:00",
    "responded_at": null,
    "patient": {
      "user_id": 2,
      "display_name": "Ivan Horvat",
      "email": "ivan.horvat@gmail.com"
    }
  }
]
```

### `POST /doctor/requests/{link_id}/accept` i `POST /doctor/requests/{link_id}/reject`
Bez tijela. Odgovor **200** je veza s novim stanjem i postavljenim `responded_at`:

```json
{
  "link_id": 7,
  "status": "accepted",
  "requested_at": "2026-11-14T09:00:00.000000+01:00",
  "responded_at": "2026-11-14T09:30:00.000000+01:00",
  "patient": { "user_id": 2, "display_name": "Ivan Horvat", "email": "ivan.horvat@gmail.com" }
}
```

| Kod | Kada | `detail` |
|---|---|---|
| 404 | zahtjev ne postoji ili je upućen drugom liječniku | `Zahtjev nije pronađen` |
| 409 | zahtjev više nije na čekanju | `Zahtjev je već obrađen` |
| 409 | baza odbija prihvaćanje (npr. 2125 pacijenata) | `Zahtjev nije moguće prihvatiti` |

### `GET /doctor/patients` – liječnik vidi povezane pacijente
Veze u stanju `accepted`, od najnovije prihvaćene. Oblik je isti kao kod `GET /doctor/requests`.

---

## Administrator (F-019) – samo admin

- `GET /admin/doctors?status=pending|approved|rejected` – liječnici po statusu (zadano `pending`)
- `POST /admin/doctors/{id}/approve` – odobri (**409** ako je već pregledan, **404** ako ne postoji)
- `POST /admin/doctors/{id}/reject` s tijelom `{"reason": "..."}` – odbij

Prvi administrator: vidi `README.md` („Prvi administrator”).
