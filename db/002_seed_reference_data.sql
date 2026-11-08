-- =============================================================================
-- 002_seed_reference_data.sql  --  nužni početni podaci (šifrarnik biomarkera)
--
-- Sigurno se može pokrenuti više puta (ON CONFLICT DO UPDATE).
--   psql -d pulsko_dev -v ON_ERROR_STOP=1 -f db/002_seed_reference_data.sql
--
-- NAPOMENA: referentni rasponi su općeniti orijentacijski rasponi za odraslu
-- osobu i služe samo za demonstraciju (C-04). Stvarni rasponi ovise o
-- laboratoriju, spolu i dobi; kod stvarne uporabe koristi se raspon s nalaza.
-- Jedinice slijede uobičajeni zapis u hrvatskim laboratorijima (SI jedinice).
-- =============================================================================

INSERT INTO biomarker (code, name, unit, ref_low, ref_high) VALUES
    ('WBC',   'White blood cells (leukocytes)',        '10^9/L', 4.000,   10.000),
    ('RBC',   'Red blood cells (erythrocytes)',        '10^12/L', 3.860,   5.800),
    ('HGB',   'Hemoglobin',                            'g/L',    119.000, 175.000),
    ('HCT',   'Hematocrit',                            'L/L',    0.356,   0.520),
    ('MCV',   'Mean corpuscular volume',               'fL',     80.000,  100.000),
    ('MCH',   'Mean corpuscular hemoglobin',           'pg',     27.000,  34.000),
    ('MCHC',  'Mean corpuscular hemoglobin concentration', 'g/L', 320.000, 360.000),
    ('RDW',   'Red cell distribution width',           '%',      11.500,  14.500),
    ('PLT',   'Platelets (thrombocytes)',              '10^9/L', 150.000, 400.000),
    ('MPV',   'Mean platelet volume',                  'fL',     7.500,   12.000),
    ('NEUT',  'Neutrophils',                           '10^9/L', 1.500,   7.500),
    ('LYMPH', 'Lymphocytes',                           '10^9/L', 1.000,   4.000),
    ('MONO',  'Monocytes',                             '10^9/L', 0.200,   1.000),
    ('EOS',   'Eosinophils',                           '10^9/L', 0.000,   0.500),
    ('BASO',  'Basophils',                             '10^9/L', 0.000,   0.100)
ON CONFLICT (code) DO UPDATE
   SET name     = EXCLUDED.name,
       unit     = EXCLUDED.unit,
       ref_low  = EXCLUDED.ref_low,
       ref_high = EXCLUDED.ref_high;
