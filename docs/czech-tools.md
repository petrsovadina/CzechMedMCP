# České zdravotnické nástroje

CzechMedMCP rozšiřuje BioMCP o **23 českých zdravotnických MCP nástrojů** v 5 modulech + 3 workflow orchestrace.

## Přehled modulů

| Modul | Nástrojů | Zdroj dat |
|-------|----------|-----------|
| SUKL | 8 | Státní ústav pro kontrolu léčiv (prehledy.sukl.cz) |
| MKN-10 | 4 | Mezinárodní klasifikace nemocí (mkn10.uzis.cz, nzip.cz) |
| NRPZS | 3 | Národní registr poskytovatelů zdravotních služeb (nrpzs.uzis.cz) |
| SZV | 3 | Seznam zdravotních výkonů (nzip.cz) |
| VZP | 2 | Úhrady léčiv VZP (vzp.cz) |
| Workflow | 3 | Orchestrace českých + globálních modulů |

Všechny nástroje mají prefix `czechmed_` (konvence FR-024).

---

## SUKL — Registr léčiv (8 nástrojů)

### czechmed_search_medicine

Fuzzy hledání léčiv podle názvu, účinné látky, SUKL kódu nebo ATC kódu. Podporuje diakritiku.

| Parametr | Typ | Povinný | Výchozí | Popis |
|----------|-----|---------|---------|-------|
| `query` | str | ano | — | Název léku, účinná látka, SUKL kód nebo ATC kód |
| `page` | int | ne | 1 | Číslo stránky (od 1) |
| `page_size` | int | ne | 10 | Počet výsledků (1–100) |

### czechmed_get_medicine_detail

Kompletní detail přípravku podle SUKL kódu — složení, registrace, léková forma, ATC.

| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `sukl_code` | str | ano | 7místný identifikátor SUKL |

### czechmed_get_spc

SPC dokument (Souhrn údajů o přípravku). Vrací celý text nebo konkrétní sekci.

| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `sukl_code` | str | ano | Identifikátor SUKL |
| `section` | str \| None | ne | Číslo sekce SPC (např. "4.1", "5.1") |

### czechmed_get_pil

Příbalová informace (PIL). Vrací celý text nebo konkrétní sekci.

| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `sukl_code` | str | ano | Identifikátor SUKL |
| `section` | str \| None | ne | Sekce: dosage, contraindications, side_effects, interactions, pregnancy, storage |

### czechmed_check_availability

Kontrola aktuální dostupnosti léku na českém trhu.

| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `sukl_code` | str | ano | Identifikátor SUKL |

### czechmed_batch_check_availability

Hromadná kontrola dostupnosti pro více léčiv najednou.

| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `sukl_codes` | list[str] | ano | Seznam SUKL kódů (1–50) |

### czechmed_get_reimbursement

Cena, úhrada pojišťovnou, doplatek pacienta a podmínky úhrady.

| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `sukl_code` | str | ano | 7místný SUKL kód |

### czechmed_find_pharmacies

Hledání lékáren podle města, PSC nebo filtru nonstop.

| Parametr | Typ | Povinný | Výchozí | Popis |
|----------|-----|---------|---------|-------|
| `city` | str \| None | ne | None | Název města |
| `postal_code` | str \| None | ne | None | 5místné PSC |
| `nonstop_only` | bool | ne | false | Pouze lékárny 24/7 |
| `page` | int | ne | 1 | Číslo stránky |
| `page_size` | int | ne | 10 | Počet výsledků (1–100) |

---

## MKN-10 — Klasifikace nemocí (4 nástroje)

### czechmed_search_diagnosis

Fulltext vyhledávání v české MKN-10 podle kódu nebo textu. Podporuje diakritiku.

| Parametr | Typ | Povinný | Výchozí | Popis |
|----------|-----|---------|---------|-------|
| `query` | str | ano | — | Kód MKN-10 nebo text v češtině |
| `max_results` | int | ne | 10 | Maximální počet výsledků (1–100) |

### czechmed_get_diagnosis_detail

Detail diagnózy s hierarchií (kapitola, blok, kategorie), inkluzemi a exkluzemi.

| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `code` | str | ano | Kód MKN-10 (např. "J06.9") |

### czechmed_browse_diagnosis

Procházení stromu kategorií MKN-10. Bez kódu zobrazí kapitoly, s kódem daný uzel a potomky.

| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `code` | str \| None | ne | Kód kategorie (bez = kořenové kapitoly) |

### czechmed_get_diagnosis_stats

Epidemiologické statistiky pro diagnózu — počet případů, pohlaví, věkové skupiny, regiony.

| Parametr | Typ | Povinný | Výchozí | Popis |
|----------|-----|---------|---------|-------|
| `code` | str | ano | — | Kód MKN-10 (např. "J06") |
| `year` | int \| None | ne | None | Rok (2015–2025) |

---

## NRPZS — Poskytovatelé zdravotních služeb (3 nástroje)

### czechmed_search_providers

Hledání poskytovatelů podle názvu, města nebo odbornosti. Podporuje kombinaci filtrů.

| Parametr | Typ | Povinný | Výchozí | Popis |
|----------|-----|---------|---------|-------|
| `query` | str \| None | ne | None | Název poskytovatele |
| `city` | str \| None | ne | None | Město |
| `specialty` | str \| None | ne | None | Lékařská odbornost |
| `page` | int | ne | 1 | Číslo stránky |
| `page_size` | int | ne | 10 | Počet výsledků (1–100) |

### czechmed_get_provider_detail

Kompletní profil poskytovatele s pracovišti, kontakty a typy péče.

| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `provider_id` | str | ano | Identifikátor poskytovatele v NRPZS |

### czechmed_get_nrpzs_codebooks

Referenční číselníky NRPZS — odbornosti, formy péče, druhy péče.

| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `codebook_type` | str | ano | Typ: specialties, care_forms, care_types |

---

## SZV — Zdravotní výkony (3 nástroje)

### czechmed_search_procedures

Hledání zdravotních výkonů podle kódu nebo názvu.

| Parametr | Typ | Povinný | Výchozí | Popis |
|----------|-----|---------|---------|-------|
| `query` | str | ano | — | Kód výkonu nebo název |
| `max_results` | int | ne | 10 | Maximální počet výsledků (1–100) |

### czechmed_get_procedure_detail

Detail výkonu — bodová hodnota, čas, podmínky, omezení, odbornosti.

| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `code` | str | ano | Kód výkonu (např. "09513") |

### czechmed_calculate_reimbursement

Kalkulace úhrady výkonu v CZK pro konkrétní pojišťovnu.

| Parametr | Typ | Povinný | Výchozí | Popis |
|----------|-----|---------|---------|-------|
| `procedure_code` | str | ano | — | 5místný kód výkonu |
| `insurance_code` | str | ne | "111" | Kód pojišťovny: 111 (VZP), 201 (VoZP), 205 (CPZP), 207 (OZP), 209 (ZPS), 211 (ZPMV), 213 (RBP) |
| `count` | int | ne | 1 | Počet výkonů |

---

## VZP — Úhrady léčiv (2 nástroje)

### czechmed_get_drug_reimbursement

Detailní úhrada léku od VZP — skupina, maximální cena, pokrytí, doplatek.

| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `sukl_code` | str | ano | 7místný SUKL kód |

### czechmed_compare_alternatives

Porovnání cenových alternativ v rámci stejné ATC skupiny. Seřazeno podle doplatku.

| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `sukl_code` | str | ano | 7místný SUKL kód referenčního léku |

---

## Workflow — orchestrace (3 nástroje)

Workflow nástroje kombinují data z více modulů (českých i globálních) v jednom volání.

### czechmed_drug_profile

Kompletní profil léku: SUKL registrace + dostupnost + úhrada + PubMed evidence.

| Parametr | Typ | Povinný | Popis |
|----------|-----|---------|-------|
| `query` | str | ano | Název léku, účinná látka nebo SUKL kód |

### czechmed_diagnosis_assist

Diagnostický asistent: navrhne MKN-10 kódy pro popsané symptomy a doplní PubMed evidenci.

| Parametr | Typ | Povinný | Výchozí | Popis |
|----------|-----|---------|---------|-------|
| `symptoms` | str | ano | — | Popis symptomů v češtině |
| `max_candidates` | int | ne | 5 | Max. počet kandidátních diagnóz (1–10) |

### czechmed_referral_assist

Asistent doporučení: z diagnózy určí odbornost a najde poskytovatele v daném městě.

| Parametr | Typ | Povinný | Výchozí | Popis |
|----------|-----|---------|---------|-------|
| `diagnosis_code` | str | ano | — | Kód MKN-10 (např. "I25.1") |
| `city` | str | ano | — | Město pacienta |
| `max_providers` | int | ne | 10 | Max. počet poskytovatelů (1–20) |

---

## Integrace do unified routeru

České domény jsou dostupné i přes unifikovaný `search()` a `fetch()` router:

```python
# Hledání přes SUKL registr
search(domain="sukl_drug", query="ibuprofen")

# Detail diagnózy z MKN-10
fetch(domain="mkn_diagnosis", id="J06.9")

# Detail poskytovatele z NRPZS
fetch(domain="nrpzs_provider", id="12345678")

# Hledání výkonů v SZV
search(domain="szv_procedure", query="EKG")

# Úhrada léku z VZP
fetch(domain="vzp_reimbursement", id="0012345")
```

Podporované domény: `sukl_drug`, `mkn_diagnosis`, `nrpzs_provider`, `szv_procedure`, `vzp_reimbursement`.

---

## Diakritika

Všechny vyhledávací nástroje podporují transparentní práci s diakritikou:

- "leky" najde "léky"
- "Usti" najde "Ústí"
- "kardiologie" = "kardiologie"

## Zdroje dat

| Zdroj | Typ | Licence | Autentizace |
|-------|-----|---------|-------------|
| SUKL Open Data | Live REST API | Veřejné | Ne |
| SUKL web (PIL/SPC) | HTML scraping + lxml | Veřejné | Ne |
| MKN-10 (UZIS/NZIP) | Offline XML/CSV + in-memory cache | CC BY 4.0 | Ne |
| NRPZS REST API | Live REST API | CC BY 4.0 | Ne |
| SZV (MZ CR) | Offline CSV + in-memory cache | Veřejné | Ne |
| VZP ceníky | Web scraping | Veřejné | Ne |
