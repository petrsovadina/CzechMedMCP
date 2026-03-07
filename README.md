# CzechMedMCP: Český zdravotnický MCP server

> Fork projektu [genomoncology/biomcp](https://github.com/genomoncology/biomcp) rozšířený o české zdravotnické datové zdroje pro platformu [Medevio](https://medevio.com).

CzechMedMCP je open source (MIT) MCP server, který propojuje AI asistenty se **60 biomedicínskými a zdravotnickými nástroji** — 23 českých + 37 globálních. Postavený na [Model Context Protocol](https://modelcontextprotocol.io/), slouží jako datová vrstva pro AI asistenty lékařů.

## Proč CzechMedMCP?

| Problém | Řešení |
|---------|--------|
| LLM nemají přístup k českým zdravotnickým registrům | 23 nástrojů pro SUKL, MKN-10, NRPZS, SZV, VZP |
| Lékař potřebuje i světovou evidenci | 37 globálních nástrojů (PubMed, ClinicalTrials.gov, varianty) |
| Budování infrastruktury od nuly | Fork BioMCP s produkční infrastrukturou (cache, retry, circuit breaker) |
| Složitá integrace | MCP protokol — funguje v Claude Desktop, Cursor, VS Code, Medevio |

## Kompletní katalog nástrojů (60)

### České zdravotnické nástroje (23)

#### SUKL — Registr léčiv (8)

| Nástroj | Popis |
|---------|-------|
| `czechmed_search_medicine` | Fuzzy hledání léčiv (název, látka, SUKL kód, ATC) |
| `czechmed_get_medicine_detail` | Kompletní detail přípravku |
| `czechmed_get_spc` | SPC dokument (celý nebo konkrétní sekce) |
| `czechmed_get_pil` | Příbalová informace (celá nebo sekce) |
| `czechmed_check_availability` | Dostupnost léčiva na trhu |
| `czechmed_batch_check_availability` | Hromadná kontrola dostupnosti (max 50) |
| `czechmed_get_reimbursement` | Cena, úhrada, doplatek |
| `czechmed_find_pharmacies` | Lékárny dle města, PSC, nonstop |

#### MKN-10 — Klasifikace nemocí (4)

| Nástroj | Popis |
|---------|-------|
| `czechmed_search_diagnosis` | Fulltext v češtině s podporou diakritiky |
| `czechmed_get_diagnosis_detail` | Detail s hierarchií, inkluzemi/exkluzemi |
| `czechmed_browse_diagnosis` | Procházení stromu kategorií |
| `czechmed_get_diagnosis_stats` | Epidemiologické statistiky |

#### NRPZS — Poskytovatelé zdravotních služeb (3)

| Nástroj | Popis |
|---------|-------|
| `czechmed_search_providers` | Hledání dle lokality, oboru, formy péče |
| `czechmed_get_provider_detail` | Kompletní profil s pracovišti |
| `czechmed_get_nrpzs_codebooks` | Číselníky oborů, forem, druhů péče |

#### SZV — Seznam zdravotních výkonů (3)

| Nástroj | Popis |
|---------|-------|
| `czechmed_search_procedures` | Hledání výkonů (kód nebo text) |
| `czechmed_get_procedure_detail` | Detail s bodovou hodnotou a podmínkami |
| `czechmed_calculate_reimbursement` | Kalkulace úhrady výkonu |

#### VZP — Úhrady léčiv (2)

| Nástroj | Popis |
|---------|-------|
| `czechmed_get_drug_reimbursement` | Detailní úhrada léku od VZP |
| `czechmed_compare_alternatives` | Porovnání alternativ dle doplatku v ATC skupině |

#### Workflow — orchestrace (3)

| Nástroj | Popis |
|---------|-------|
| `czechmed_drug_profile` | SUKL detail + dostupnost + úhrada + PubMed evidence |
| `czechmed_diagnosis_assist` | MKN-10 search + PubMed evidence |
| `czechmed_referral_assist` | MKN-10 validace + NRPZS hledání poskytovatelů |

### Globální biomedicínské nástroje (37)

| Modul | Nástrojů | Zdroj |
|-------|----------|-------|
| Články | 2 | PubMed, PubTator3, bioRxiv, Europe PMC |
| Klinické studie | 6 | ClinicalTrials.gov, NCI CTS API |
| Genomické varianty | 3 | MyVariant.info, cBioPortal, OncoKB, AlphaGenome |
| Geny, nemoci, léčiva | 3 | MyGene, MyDisease, MyChem |
| NCI | 6 | NCI Thesaurus (organizace, intervence, biomarkery, nemoci) |
| OpenFDA | 12 | Nežádoucí účinky, labely, přístroje, schválení, recally, nedostatek |
| Obohacení | 1 | Enrichr (genové sady) |
| Utility | 4 | Unified search, fetch, think, metrics |

## Rychlý start

### Claude Desktop / Cursor / VS Code

Přidejte do konfigurace MCP serverů:

```json
{
  "mcpServers": {
    "czechmedmcp": {
      "command": "uv",
      "args": ["run", "--with", "biomcp-python", "biomcp", "run"]
    }
  }
}
```

### Instalace z PyPI

```bash
pip install biomcp-python
# nebo
uv pip install biomcp-python
```

### Spuštění serveru

```bash
# STDIO (lokální vývoj, Claude Desktop)
biomcp run

# HTTP (remote, Medevio integrace)
biomcp run --mode streamable_http --host 0.0.0.0 --port 8080
```

### MCP Inspector (testování)

```bash
npx @modelcontextprotocol/inspector uv run --with biomcp-python biomcp run
```

## Příklady použití

### Hledání léku a jeho profil

```python
# Najdi lék v SUKL registru
czechmed_search_medicine(query="Ibuprofen")

# Kompletní profil: registrace + dostupnost + úhrada + PubMed evidence
czechmed_drug_profile(query="Ibuprofen")
```

### Diagnostický asistent

```python
# Zakóduj příznaky do MKN-10 s PubMed evidencí
czechmed_diagnosis_assist(
    symptoms="bolest hlavy, horečka, kašel",
    max_candidates=5
)
```

### Hledání specialisty pro pacienta

```python
# Najdi kardiologa v Praze pro diagnózu I25.1
czechmed_referral_assist(
    diagnosis_code="I25.1",
    city="Praha",
    max_providers=10
)
```

### Kombinace českých a globálních dat

```python
# 1. Najdi lék v SUKL
czechmed_search_medicine(query="Pembrolizumab")

# 2. Najdi klinické studie pro stejnou látku
search(domain="trial", keywords=["pembrolizumab", "melanoma"])

# 3. Najdi relevantní články
search(domain="article", chemicals=["pembrolizumab"], diseases=["melanoma"])
```

### Unified router s českými doménami

```python
# Hledání přes český SUKL registr
search(domain="sukl_drug", query="ibuprofen")

# Detail diagnózy z MKN-10
fetch(domain="mkn_diagnosis", id="J06.9")

# Detail poskytovatele z NRPZS
fetch(domain="nrpzs_provider", id="12345678")
```

## Konfigurace

Zkopírujte `.env.example` do `.env` a nastavte potřebné hodnoty:

```bash
cp .env.example .env
```

Hlavní proměnné prostředí:

| Proměnná | Popis | Povinná |
|----------|-------|---------|
| `NCI_API_KEY` | API klíč pro NCI Clinical Trials | Ne |
| `OPENFDA_API_KEY` | API klíč pro OpenFDA (vyšší limity) | Ne |
| `ONCOKB_TOKEN` | Token pro OncoKB (demo funguje bez něj) | Ne |
| `ALPHAGENOME_API_KEY` | API klíč pro AlphaGenome | Ne |
| `BIOMCP_OFFLINE` | Offline mód (true/false) | Ne |
| `BIOMCP_METRICS_ENABLED` | Zapnutí metrik (true/false) | Ne |

České zdravotnické nástroje **nevyžadují žádné API klíče** — všechna data jsou veřejná.

## Datové zdroje

### České (veřejné, bez autentizace)

| Zdroj | Typ | Aktualizace |
|-------|-----|-------------|
| SUKL Open Data | Live REST API | Průběžně |
| SUKL web (PIL/SPC) | Web scraping + HTML parsing | Průběžně |
| MKN-10 (UZIS) | Offline XML/CSV, in-memory cache | Ročně |
| NRPZS | Live REST API | Měsíčně |
| SZV (MZ CR) | Offline CSV, in-memory cache | Ročně |
| VZP ceníky | Web scraping | Čtvrtletně |

### Globální (z BioMCP)

PubMed, ClinicalTrials.gov, MyVariant/MyGene/MyDisease/MyChem, cBioPortal, OncoKB, OpenFDA, AlphaGenome, Enrichr, NCI Thesaurus.

## Architektura

```
CzechMedMCP Server (60 nástrojů)
├── MCP Transport (STDIO | Streamable HTTP | SSE)
├── FastMCP registry (core.py)
├── České moduly (23 nástrojů)
│   ├── czech/sukl/     — 8 nástrojů (registr léčiv, SPC/PIL, dostupnost, lékárny)
│   ├── czech/mkn/      — 4 nástroje (diagnózy MKN-10, statistiky)
│   ├── czech/nrpzs/    — 3 nástroje (poskytovatelé zdravotních služeb)
│   ├── czech/szv/      — 3 nástroje (zdravotní výkony, kalkulace úhrad)
│   ├── czech/vzp/      — 2 nástroje (úhrady léčiv VZP)
│   └── czech/workflows/ — 3 workflow orchestrace
├── Globální moduly (37 nástrojů, z BioMCP beze změny)
│   ├── articles/ trials/ variants/ genes/ drugs/ diseases/
│   ├── openfda/ enrichr/ organizations/ interventions/ biomarkers/
│   └── router.py (unified search + fetch pro všech 21 domén)
└── Infrastruktura (z BioMCP)
    ├── http_client.py — async HTTP, connection pool, diskcache
    ├── circuit_breaker.py — ochrana proti cascading failures
    ├── retry.py — exponential backoff s jitter
    ├── rate_limiter.py — per-domain rate limiting
    └── metrics.py — p50/p95/p99 percentily
```

## Vývoj

```bash
# Instalace a nastavení
uv sync --all-extras && uv run pre-commit install

# Spuštění testů
uv run python -m pytest -x --ff -n auto --dist loadscope

# Pouze unit testy
uv run python -m pytest -m "not integration"

# Lint + formátování
uv run ruff check src tests
uv run ruff format src tests

# Kompletní kontrola kvality
make check
```

### Struktura testů

| Adresář | Popis | Počet |
|---------|-------|-------|
| `tests/tdd/` | Unit testy s mockovanými HTTP | 736 |
| `tests/czech/` | Testy českých modulů (offline) | 236 |
| `tests/bdd/` | BDD feature testy | — |
| `tests/integration/` | Live API testy (`@pytest.mark.integration`) | — |

## Dokumentace

- [Uživatelská příručka](./docs/czech-user-guide.md) — kompletní průvodce pro české uživatele
- [API Reference](./docs/czech-api-reference.md) — referenční příručka českých API
- [Architektura](./docs/czech-architecture.md) — technická architektura
- [Přehled nástrojů](./docs/czech-tools.md) — dokumentace českých nástrojů
- [Deployment](./docs/developer-guides/01-server-deployment.md) — nasazení serveru

## Licence

MIT — plná svoboda komerčního využití.

---

*CzechMedMCP je fork [BioMCP](https://github.com/genomoncology/biomcp) (MIT) rozšířený o české zdravotnické zdroje.*
*Vytvořeno pro platformu Medevio (4 000+ lékařů, 1M pacientů).*
