# Research: Deployment Cleanup

**Date**: 2026-03-16
**Feature**: 005-deployment-cleanup

## Findings

### R-001: docker-compose.yml uses implicit Dockerfile path

**Decision**: No change needed to `docker-compose.yml` after Dockerfile rename.
**Rationale**: `build: .` uses `Dockerfile` by default. Current `docker-compose.yml` doesn't specify `dockerfile:` key.
**Alternatives considered**: Adding explicit `dockerfile: Dockerfile` — rejected as unnecessary verbosity.

### R-002: railway.json explicit dockerfilePath

**Decision**: Update `dockerfilePath` from `Dockerfile.railway` to `Dockerfile`.
**Rationale**: Railway reads this field to locate Dockerfile. Could remove field entirely (Railway defaults to `Dockerfile`), but explicit is better for clarity.
**Alternatives considered**: Remove field entirely — rejected for explicit-over-implicit principle.

### R-003: CI/CD pipeline unaffected

**Decision**: No changes to `.github/workflows/ci.yml`.
**Rationale**: `deploy-railway` job runs `railway up` which reads `railway.json`. Updating `railway.json` is sufficient.

### R-004: .env.example Caddy cleanup

**Decision**: Remove Caddy-specific comments (DOMAIN, Let's Encrypt).
**Rationale**: Caddyfile is being deleted; DOMAIN variable is only used by Caddy.
**Alternatives considered**: Keep as historical reference — rejected as confusing.

### R-005: README GitHub URL mismatch

**Decision**: Fix `petrsovadina/czechmedmcp` → `petrsovadina/biomcp` in README.
**Rationale**: GitHub repo is `biomcp`, not `czechmedmcp`. Package name differs from repo name.

### R-006: Next.js build verification

**Decision**: Run both builds as verification step.
**Rationale**: Both apps have existing `.next/` cache from recent builds. High confidence they'll pass.

## No NEEDS CLARIFICATION items remain.
