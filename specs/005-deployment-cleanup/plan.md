# Implementation Plan: Deployment Cleanup

**Branch**: `005-deployment-cleanup` | **Date**: 2026-03-16 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-deployment-cleanup/spec.md`

## Summary

Odstranění mrtvých deployment konfigurací (Fly.io, Docker Compose prod, Caddyfile), konsolidace dvou Dockerfiles do jednoho, aktualizace dokumentace (CLAUDE.md, README) a příprava repozitáře pro Vercel deploy frontendových aplikací. Čistě infrastrukturní cleanup — žádné změny zdrojového kódu MCP serveru.

## Technical Context

**Language/Version**: Python 3.10+ (MCP server), Next.js 15 / React 19 (web), Nextra 4 (docs)
**Primary Dependencies**: Docker, Railway CLI, Turborepo, npm
**Storage**: N/A (žádné datové změny)
**Testing**: Ruční ověření — Docker build, npm builds, Railway healthcheck
**Target Platform**: Railway (server), Vercel (web + docs)
**Project Type**: Infrastructure cleanup (config files, docs)
**Performance Goals**: N/A
**Constraints**: Railway produkce nesmí být narušena
**Scale/Scope**: ~10 souborů dotčených (smazat 4, přejmenovat 1, upravit ~5)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Relevance | Status |
|-----------|-----------|--------|
| I. MCP Protocol First | N/A — žádné nové nástroje | PASS |
| II. Modular Domain Architecture | N/A — žádné doménové změny | PASS |
| III. Authoritative Data Sources | N/A — žádné datové zdroje | PASS |
| IV. CLI & MCP Dual Access | N/A — žádné nové operace | PASS |
| V. Testing Rigor | N/A — config cleanup, ne feature | PASS |
| Development Workflow | ALIGNS — feature branch, conventional commits, PR | PASS |
| Technical Constraints | N/A — žádné code changes | PASS |

**Gate Result**: PASS — čistě infrastrukturní cleanup, žádné porušení konstituce.

## Project Structure

### Documentation (this feature)

```text
specs/005-deployment-cleanup/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: findings about affected files
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (affected files)

```text
# Files to DELETE
fly.toml                     # Fly.io config (unused)
docker-compose.prod.yml      # Production Docker Compose (unused)
Caddyfile                    # Caddy reverse proxy (unused)
Dockerfile                   # Multi-stage with Next.js build (replaced)

# Files to RENAME
Dockerfile.railway → Dockerfile   # Becomes the sole Dockerfile

# Files to UPDATE
railway.json                 # dockerfilePath: Dockerfile.railway → Dockerfile
docker-compose.yml           # build: . (already correct after rename)
.env.example                 # Remove Caddy-specific comments (DOMAIN)
CLAUDE.md                    # Update deployment architecture section
README.md                    # Fix GitHub URL, add deployment info
```

**Structure Decision**: Žádné nové soubory ani adresáře. Pouze mazání, přejmenování a editace existujících konfiguračních a dokumentačních souborů.

## Phase 0: Research

### R-001: Dopad přejmenování Dockerfile na docker-compose.yml

**Decision**: `docker-compose.yml` používá `build: .` (ne explicitní `dockerfile:` klíč) — Docker automaticky hledá `Dockerfile` v daném adresáři. Po přejmenování `Dockerfile.railway` → `Dockerfile` bude compose fungovat bez změn.

**Rationale**: Docker Compose [dokumentace](https://docs.docker.com/compose/compose-file/build/) — `build: .` implicitně hledá `Dockerfile`.

### R-002: Dopad přejmenování na railway.json

**Decision**: `railway.json` explicitně odkazuje na `"dockerfilePath": "Dockerfile.railway"` — musí být aktualizován na `"dockerfilePath": "Dockerfile"`. Alternativně: pole `dockerfilePath` může být odstraněno úplně, protože Railway defaultně hledá `Dockerfile`.

**Rationale**: Railway [docs](https://docs.railway.com/reference/config-as-code) — defaultní cesta je `Dockerfile`.

**Decision**: Ponechat explicitní `"dockerfilePath": "Dockerfile"` pro jasnost.

### R-003: Dopad přejmenování na CI/CD pipeline

**Decision**: CI workflow `.github/workflows/ci.yml` job `deploy-railway` používá `railway up` — ten čte `railway.json` pro Dockerfile cestu. Aktualizace `railway.json` je dostatečná, CI workflow samotný nepotřebuje změnu.

### R-004: .env.example — Caddy-specific proměnné

**Decision**: Komentář `# Caddy: nastavte DOMAIN pro auto Let's Encrypt HTTPS` a `# DOMAIN=mcp.example.com` budou odstraněny. Zbytek `.env.example` zůstane beze změn — všechny ostatní proměnné jsou relevantní.

### R-005: README.md — Nesprávná GitHub URL

**Decision**: README obsahuje odkaz na `https://github.com/petrsovadina/czechmedmcp` — repo se ale jmenuje `petrsovadina/biomcp`. Opravit na `https://github.com/petrsovadina/biomcp`.

### R-006: Ověření Next.js buildů

**Decision**: Oba buildy (`npm run build:web`, `npm run build:docs`) budou ověřeny jako součást implementace. Pokud selžou, oprava je v scope (ale pravděpodobně projdou — buildy fungují dle existujících `.next/` cache).

## Phase 1: Implementation Phases

Tato feature nemá data model ani API contracts — je to čistě konfigurační cleanup. Fáze jsou organizovány podle user stories.

### Phase 1: Delete Dead Configs (US1 — P1)

**Cíl**: Odstranit mrtvé konfigurační soubory.

**Soubory k smazání**:
1. `fly.toml` — Fly.io deployment config
2. `docker-compose.prod.yml` — Production Docker Compose s Caddy
3. `Caddyfile` — Caddy reverse proxy config
4. `Dockerfile` — Multi-stage Dockerfile s Next.js buildem

**Verifikace**: `ls fly.toml docker-compose.prod.yml Caddyfile` → "No such file"

**Riziko**: Žádné — soubory jsou nepoužívané.

### Phase 2: Consolidate Dockerfile (US2 — P1)

**Cíl**: Přejmenovat `Dockerfile.railway` na `Dockerfile`, aktualizovat reference.

**Kroky**:
1. `git mv Dockerfile.railway Dockerfile`
2. Aktualizovat `railway.json`: `dockerfilePath` → `Dockerfile`
3. Ověřit `docker-compose.yml` — `build: .` (žádná změna potřeba)
4. Ověřit Docker build: `docker build -t czechmedmcp-test .`

**Verifikace**: `docker build .` projde; `railway.json` odkazuje na `Dockerfile`

**Riziko**: Nízké — přejmenování souboru + update jednoho JSON fieldu. Railway deploy se nezmění dokud neproběhne nový push.

### Phase 3: Update Documentation (US3 — P2)

**Cíl**: Aktualizovat CLAUDE.md a README.

**CLAUDE.md změny**:
- Odstranit zmínky o `fly.toml`, `docker-compose.prod.yml`, `Caddyfile`
- Aktualizovat tabulku klíčových souborů — `Dockerfile.railway` → `Dockerfile`
- Aktualizovat deployment sekci

**README.md změny**:
- Opravit GitHub URL: `petrsovadina/czechmedmcp` → `petrsovadina/biomcp`
- Přidat stručnou deployment sekci (Railway server, Vercel web+docs)

**.env.example změny**:
- Odstranit Caddy-specific komentáře (`DOMAIN`, Let's Encrypt zmínka)

**Verifikace**: `grep -c 'fly.toml\|Caddyfile\|docker-compose.prod' CLAUDE.md README.md` → 0

### Phase 4: Verify Vercel Readiness (US4 — P2)

**Cíl**: Ověřit, že obě Next.js apps buildí a jsou připraveny pro Vercel.

**Kroky**:
1. `npm run build:web` — ověřit úspěšný build
2. `npm run build:docs` — ověřit úspěšný build
3. Ověřit `apps/web/vercel.json` a `apps/docs/` konfigurace

**Verifikace**: Oba buildy projdou bez chyb.

**Poznámka**: Samotné propojení s Vercel (dashboard setup) je mimo scope — to udělá maintainer ručně.

## Build Sequence

```text
Phase 1 (delete dead configs)
    ↓
Phase 2 (consolidate Dockerfile)  ← závisí na Phase 1 (hlavní Dockerfile musí být smazán před přejmenováním)
    ↓
Phase 3 (update docs)  ← závisí na Phase 2 (docs musí reflektovat finální stav)
    ↓
Phase 4 (verify Vercel)  ← nezávislý, ale logicky poslední
```

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Railway deploy selže po merge | Vysoký | Nízká | `railway.json` aktualizován atomicky s přejmenováním; healthcheck ověřen před merge |
| Docker build selže | Střední | Nízká | Dockerfile.railway je ověřeně funkční; pouze přejmenování |
| Next.js build selže | Nízký | Nízká | Existující `.next/` cache potvrzuje předchozí úspěšné buildy |
| GitHub Actions billing stále blokuje CI | Střední | Vysoká | Mimo scope; deploy lze provést ručně přes `railway up` |

## Complexity Tracking

Žádné porušení konstituce — tabulka není potřeba.
