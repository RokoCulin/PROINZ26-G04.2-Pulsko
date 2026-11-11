#!/usr/bin/env bash
# =============================================================================
# seed-database.sh  --  priprema PostgreSQL baze za Pulsko (shema + šifrarnik)
#
# Upotreba (iz korijena repozitorija):
#   export DATABASE_URL="postgresql://korisnik:lozinka@localhost:5432/pulsko_dev"
#   ./scripts/seed-database.sh            # shema + šifrarnik
#   ./scripts/seed-database.sh --reset    # OBRIŠE sve tablice pa sve izgradi iznova
#
# DATABASE_URL se čita iz okoline; u repozitoriju se ne drže stvarne lozinke.
# Baza mora već postojati (createdb pulsko_dev).
# =============================================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DB_DIR="$ROOT_DIR/db"

RESET=0
ASSUME_YES=0
for arg in "$@"; do
    case "$arg" in
        --reset)   RESET=1 ;;
        --yes)     ASSUME_YES=1 ;;   # preskače potvrdu kod --reset (npr. u CI-ju)
        -h|--help) sed -n '3,17p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
        *) echo "Nepoznata opcija: $arg (koristi --help)" >&2; exit 2 ;;
    esac
done

if ! command -v psql >/dev/null 2>&1; then
    echo "GRESKA: psql nije instaliran ili nije na PATH-u." >&2
    exit 1
fi
if [ -z "${DATABASE_URL:-}" ]; then
    echo "GRESKA: DATABASE_URL nije postavljen." >&2
    echo "  npr. export DATABASE_URL=postgresql://korisnik:lozinka@localhost:5432/pulsko_dev" >&2
    exit 1
fi

# client_min_messages=warning: bez NOTICE ispisa (npr. pri --reset)
run_sql() { PGOPTIONS="-c client_min_messages=warning" psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q "$@"; }

if [ "$RESET" -eq 1 ]; then
    if [ "$ASSUME_YES" -ne 1 ]; then
        echo "UPOZORENJE: --reset BRISE sve tablice i podatke u bazi na koju pokazuje DATABASE_URL."
        read -r -p "Upisi 'da' za nastavak: " answer
        [ "$answer" = "da" ] || { echo "Prekinuto."; exit 1; }
    fi
    echo "Resetiram shemu (brisem sve tablice)..."
    run_sql -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'
fi

HAS_SCHEMA="$(run_sql -tA -c "SELECT to_regclass('public.app_user') IS NOT NULL")"
if [ "$HAS_SCHEMA" = "t" ]; then
    echo "Shema vec postoji - preskacem 001_create_schema.sql."
else
    echo "Stvaram shemu..."
    run_sql -f "$DB_DIR/001_create_schema.sql"
fi

echo "Punim sifrarnik biomarkera..."
run_sql -f "$DB_DIR/002_seed_reference_data.sql"

echo "Gotovo."
