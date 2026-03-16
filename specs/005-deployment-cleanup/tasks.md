# Tasks: Deployment Cleanup

**Input**: Design documents from `/specs/005-deployment-cleanup/`
**Prerequisites**: plan.md (required), spec.md (required), research.md

**Tests**: Not requested — this is infrastructure cleanup, no test tasks.

**Organization**: Tasks grouped by user story. US1 and US2 are sequential (US2 depends on US1). US3 and US4 can run after US2.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to

---

## Phase 1: Pre-flight Verification

**Purpose**: Capture current state before making changes, ensure safety.

- [x] T001 Verify Railway production is healthy: `curl https://biomcp-production-0eb2.up.railway.app/health` returns `{"status":"healthy"}`
- [x] T002 Verify all 4 dead config files exist before deletion: `ls fly.toml docker-compose.prod.yml Caddyfile Dockerfile`

**Checkpoint**: Baseline confirmed — safe to proceed with changes.

---

## Phase 2: User Story 1 — Odstranění mrtvých konfigurací (Priority: P1) 🎯 MVP

**Goal**: Smazat nepoužívané deployment soubory (fly.toml, docker-compose.prod.yml, Caddyfile, starý Dockerfile).

**Independent Test**: `ls fly.toml docker-compose.prod.yml Caddyfile 2>&1` vrací "No such file" pro každý soubor. `Dockerfile.railway` stále existuje.

- [x] T003 [P] [US1] Delete Fly.io config: `git rm fly.toml`
- [x] T004 [P] [US1] Delete production Docker Compose: `git rm docker-compose.prod.yml`
- [x] T005 [P] [US1] Delete Caddy reverse proxy config: `git rm Caddyfile`
- [x] T006 [US1] Delete multi-stage Dockerfile (s Next.js buildem): `git rm Dockerfile`
- [x] T007 [US1] Verify only `Dockerfile.railway` remains: `ls Dockerfile* ` shows only `Dockerfile.railway`

**Checkpoint**: Dead configs removed. `Dockerfile.railway` is the sole remaining Dockerfile.

---

## Phase 3: User Story 2 — Konsolidace Dockerfile (Priority: P1)

**Goal**: Přejmenovat `Dockerfile.railway` → `Dockerfile`, aktualizovat `railway.json`.

**Independent Test**: `cat railway.json | grep dockerfilePath` shows `Dockerfile` (not `Dockerfile.railway`). `docker build -t czechmedmcp-test .` succeeds.

- [x] T008 [US2] Rename Dockerfile.railway to Dockerfile: `git mv Dockerfile.railway Dockerfile`
- [x] T009 [US2] Update `railway.json` — change `dockerfilePath` from `Dockerfile.railway` to `Dockerfile` in railway.json
- [x] T010 [US2] Verify docker-compose.yml needs no changes — `build: .` already uses default Dockerfile (per research R-001)
- [x] T011 [US2] Verify Docker build succeeds: `docker build -t czechmedmcp-test .`

**Checkpoint**: Single Dockerfile consolidated. Railway config updated. Docker build verified.

Phase 2 → Phase 3 dependency: Starý `Dockerfile` musí být smazán (T006) před přejmenováním (T008).

---

## Phase 4: User Story 3 — Aktualizace dokumentace (Priority: P2)

**Goal**: CLAUDE.md, README.md a .env.example odrážejí aktuální deployment architekturu.

**Independent Test**: `grep -c 'fly.toml\|Caddyfile\|docker-compose.prod\|Dockerfile.railway' CLAUDE.md README.md` returns 0.

- [x] T012 [P] [US3] Update CLAUDE.md — remove all references to `fly.toml`, `docker-compose.prod.yml`, `Caddyfile`; update `Dockerfile.railway` → `Dockerfile` in key files table; update deployment section to reflect Railway + Vercel architecture in CLAUDE.md
- [x] T013 [P] [US3] Update README.md — fix GitHub URL from `petrsovadina/czechmedmcp` to `petrsovadina/biomcp`; add brief deployment section (Railway for server, Vercel for web+docs) in README.md
- [x] T014 [P] [US3] Update .env.example — remove Caddy-specific comments (`# Caddy: nastavte DOMAIN pro auto Let's Encrypt HTTPS` and `# DOMAIN=mcp.example.com`) in .env.example
- [x] T015 [US3] Verify no stale references remain: `grep -r 'fly.toml\|Caddyfile\|docker-compose.prod\|Dockerfile.railway' CLAUDE.md README.md .env.example railway.json` returns empty

**Checkpoint**: Documentation reflects actual deployment architecture.

---

## Phase 5: User Story 4 — Příprava Vercel pro web a docs (Priority: P2)

**Goal**: Ověřit, že obě Next.js aplikace buildí a jsou připraveny pro Vercel deploy.

**Independent Test**: `npm run build:web` a `npm run build:docs` projdou bez chyb.

- [x] T016 [P] [US4] Verify web app build: `npm run build:web` succeeds in apps/web/
- [x] T017 [P] [US4] Verify docs app build: `npm run build:docs` succeeds in apps/docs/
- [x] T018 [US4] Verify apps/web/vercel.json exists and is valid
- [x] T019 [US4] Verify apps/docs/ has correct Next.js config with `output: 'export'` in apps/docs/next.config.mjs

**Checkpoint**: Both Next.js apps build successfully and are ready for Vercel deployment.

---

## Phase 6: Final Verification

**Purpose**: End-to-end validation across all user stories.

- [x] T020 Verify SC-001: exactly 1 Dockerfile exists (not 2): `ls Dockerfile*` shows only `Dockerfile`
- [x] T021 Verify SC-002: 0 Fly.io files: `test ! -f fly.toml`
- [x] T022 Verify SC-003: 0 Docker Compose prod files: `test ! -f docker-compose.prod.yml && test ! -f Caddyfile`
- [x] T023 Verify SC-004: Railway production healthy: `curl -s https://biomcp-production-0eb2.up.railway.app/health` returns `{"status":"healthy"}`
- [x] T024 Verify SC-006: no stale references in docs: `grep -c 'fly.toml\|docker-compose.prod\|Caddyfile' CLAUDE.md README.md` returns 0
- [x] T025 Run `uv run ruff check src tests` to ensure no lint issues introduced
- [x] T026 Commit all changes with message `chore: remove dead deployment configs, consolidate Dockerfiles`

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1 (pre-flight)
    ↓
Phase 2 (US1: delete dead configs)
    ↓
Phase 3 (US2: consolidate Dockerfile)  ← depends on Phase 2 (old Dockerfile must be deleted before rename)
    ↓
Phase 4 (US3: update docs)  ← depends on Phase 3 (docs must reflect final file state)
Phase 5 (US4: verify Vercel)  ← independent, can run in parallel with Phase 4
    ↓
Phase 6 (final verification)  ← depends on all previous phases
```

### User Story Dependencies

- **US1 (P1)**: No dependencies — can start immediately after pre-flight
- **US2 (P1)**: Depends on US1 — old Dockerfile must be deleted before rename
- **US3 (P2)**: Depends on US2 — docs must reflect final state
- **US4 (P2)**: Independent — can run in parallel with US3

### Parallel Opportunities

- **Phase 2**: T003, T004, T005 can run in parallel (different files)
- **Phase 4**: T012, T013, T014 can run in parallel (different files)
- **Phase 5**: T016, T017 can run in parallel (independent builds)
- **Phase 4 + Phase 5**: Can run in parallel (no dependencies between US3 and US4)

---

## Parallel Example: Phase 4 + Phase 5

```bash
# These can all run simultaneously:
Task T012: "Update CLAUDE.md"
Task T013: "Update README.md"
Task T014: "Update .env.example"
Task T016: "Verify web app build"
Task T017: "Verify docs app build"
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 1: Pre-flight verification
2. Complete Phase 2: Delete dead configs (US1)
3. Complete Phase 3: Consolidate Dockerfile (US2)
4. **STOP and VALIDATE**: Railway still healthy, Docker build works
5. This alone delivers the core value — clean, unambiguous deployment config

### Full Delivery

1. MVP (above) → core cleanup done
2. Add US3: Update documentation → all docs accurate
3. Add US4: Verify Vercel readiness → frontend deployment prepared
4. Final verification → all success criteria met
5. Commit and create PR

---

## Notes

- This is infrastructure cleanup — no source code changes to MCP server
- Railway production is NOT affected until a new push to `main` triggers deploy
- The rename `Dockerfile.railway` → `Dockerfile` is tracked by git (`git mv`) preserving history
- `.env.example` Caddy comments are the only content change (removal)
- GitHub Actions billing issue is out of scope — manual `railway up` remains as fallback
