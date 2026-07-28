# Quality Plan

## IU Alumni Platform (ALUMAP)

**Project:** ALUMAP — Interactive Alumni Map

**Team:** Ahmad Helaly, Majed Naser, Roukaya Mohammed, Ghadeer Akleh, Aleksandr Kovalev

## Part 1: Introduction

### 1.1 Purpose

This Quality Plan defines the verification and validation (V&V) approach for the ALUMAP project. It specifies what quality activities will be performed, when, by whom, and with what tools.

### 1.2 Scope

This plan applies to all components of the ALUMAP system:

| Component | Technology | Criticality |
| --- | --- | --- |
| Backend API | Python 3.11 / FastAPI | High |
| Mobile App (Alumni) | Flutter / Dart | High |
| Telegram Mini-App | Flutter Web | Medium |
| Admin Portal | Nuxt 3 / Vue 3 / TypeScript | Medium |
| Infrastructure | Docker Swarm / Ansible | Medium |

### 1.3 Project Overview

ALUMAP connects Innopolis University alumni through:

- Mobile application (Flutter) for alumni
- Telegram Mini-App as lightweight alternative
- Admin portal (Nuxt 3) for university staff
- REST API backend (FastAPI) with PostgreSQL database

**Key features:**

- User authentication (email/password + OTP)
- Event creation and participation
- Interactive map showing alumni locations
- Profile management with graduation year
- Admin user verification and event approval

---

## Part 2: Quality Requirements (ISO 25010)

| ID | Quality Attribute | Requirement | Threshold | Metric | Tool |
| --- | --- | --- | --- | --- | --- |
| QR1 | Functional Suitability | All critical features work correctly | 100% pass rate | Test pass rate | pytest |
| QR2 | Reliability | System stays operational | 99.5% uptime (target — not measured) | Monthly uptime | Prometheus/Grafana set up (dashboards provisioned); no data collected yet |
| QR3 | Performance (API) | API responds to requests | p95 < 500ms (target — not measured) | Response time percentile | Prometheus/Grafana set up; no data collected yet |
| QR4 | Performance (Map) | Map loads on mobile | ≤ 5 s (E2E TC3 budget) | Map load time | E2E (Playwright, TC3) — passing |
| QR5 | Security | User data protected | 0 high-severity vulns | Vulnerability count | bandit (in CI; 0 high-severity) |
| QR6 | Maintainability | Code is testable and modifiable | ≥70% floor (measured 84.9%) | Line coverage | pytest-cov |
| QR7 | Compatibility | Feature parity across platforms | not formally measured | Manual spot checks | Manual (Telegram limited by RU restrictions) |
| QR8 | Usability | Users complete key tasks | not formally measured | — | Exploratory testing (no formal usability study) |

---

## Part 3: The 11 Decisions Framework

### Decision 1: Activities

We split quality activities into two distinct kinds:

- **Product quality (direct)** — activities that verify or improve the product
  itself: tests, static analysis, security scanning, monitoring. These map to
  **Quality Control (QC)**.
- **Process quality (indirect)** — activities that improve how the team works so
  defects are prevented before they reach the product: code review, quality
  gates, regression discipline, defect triage. These map to **Quality
  Assurance (QA)**.

#### 1a. Product-quality activities (QC — direct)

| Activity | Application | Status | Justification |
| --- | --- | --- | --- |
| Static Analysis (Lint) | Backend (ruff) | In CI | Fast, catches syntax/style errors early |
| Static Analysis (Lint) | Admin (pnpm lint) | In CI | Enforces Vue/TypeScript best practices |
| Infrastructure Linting | YAML, Ansible, Shell | In CI | Prevents deployment failures |
| Security Scanning | Backend (bandit) | In CI | Detects high-severity vulnerabilities (QR5) |
| Unit Testing | Backend (pytest) | In CI | Fast regression feedback |
| Unit Testing | Admin (vitest) | In CI | Pinia store logic, pagination, edge cases, error handling |
| Unit Testing | Mobile (flutter test) | Active (not yet in CI) | Native Dart testing |
| E2E Testing | Admin + Mobile Web (Playwright) | Active (run manually) | Validates complete user journeys |
| Exploratory Testing | Mobile + Admin | Active | Finds UX and platform bugs |
| Production Monitoring | Runtime metrics | Set up (no data collected yet) | Extends V&V into production |
| Backup Validation | PostgreSQL | Active | Ensures data recoverability |

#### 1b. Process-quality activities (QA — via team process)

| Activity | Application | Status | Justification |
| --- | --- | --- | --- |
| Code Review | All pull requests | Active | Catches design issues; 10:1 ROI |
| Quality Gates | Pre-merge (CI) | Active | Blocks merge on failing checks (see Part 4) |
| Defect Triage | All reported bugs | Active | Severity-based handling (see Decision 10) |
| Regression Testing | All platforms | Manual (not gated) | Critical for sprint releases |
| Regression After Bug Fix | Specific feature + related areas | Manual (not gated) | Each P1/P2 fix triggers regression |

### Decision 1.5: Regression Testing Strategy

**What is Regression Testing:** Ensuring that new code changes do NOT break existing functionality.

**Scope of Regression:**

| Priority | Features to Test | When | Responsible |
| --- | --- | --- | --- |
| P0 (Critical) | Login, Event creation, Map display | Every release + after each P1 fix | Kovalev |
| P1 (High) | Profile edit, Event participation, Admin approval | Every sprint | Kovalev |
| P2 (Medium) | Filters, Search, Notifications | Before major releases | Kovalev |

**Regression Test Suite Composition:**

| Test Type | Count | Coverage | Automation Status |
| --- | --- | --- | --- |
| Smoke tests | 5-7 | Critical paths | Active (subset of the 19 E2E) |
| Core regression | ~19 (built) | Main features | Active (E2E, run manually) |
| Full regression | 50-60 (target) | All features | Partial (19 E2E + manual exploratory) |
| Bug-specific | Per bug | Fixed bug + related areas | Manual |

**When to Run Regression:**

| Trigger | Type | Time Estimate | Who |
| --- | --- | --- | --- |
| New sprint release | Full regression (P0+P1) | 4 hours | Kovalev |
| P1 bug fix | Smoke + bug-specific | 1 hour | Kovalev |
| P2 bug fix | Bug-specific only | 30 min | Developer |
| Infrastructure change | Smoke only | 30 min | Helaly |
| Hotfix | Smoke + affected area | 2 hours | Kovalev + Helaly |

**Regression Testing Process:**

| Step | Action | If PASS | If FAIL |
| ------ | -------- | --------- | --------- |
| 1 | Bug Fix / Feature Complete | → Step 2 | Return to development |
| 2 | Run unit tests | → Step 3 | Return to development |
| 3 | Run smoke tests (5-7 scenarios) | → Step 4 | Return to development |
| 4 | Run core regression (~19 E2E scenarios) | → Step 5 | Return to development |
| 5 | Deploy to test server → Manual exploratory | → Step 6 | Return to development |
| 6 | Production | Done | Return to development |

[Regression checklist](checklist.md)

### Decision 2: Interactions

**Workflow Integration:**

### 1. Development Phase

Write code → Local linting → Commit

### 2. Pull Request Phase (Gate 1)

### Steps

1. Open Pull Request (PR)
2. Run CI:
    - Lint (ruff, pnpm, infra linters)
    - Security scan (bandit)
    - Unit tests + coverage gate (pytest, vitest)
    - Build
3. Code Review (1+ approver)
4. **Quality Gate**

### Outcomes

### If gate passes

- Merge to `main`
- Build Docker image
- Deploy to Swarm
- Activate Prometheus monitoring

### If gate fails

- Return to **Development Phase**

**Interaction Points Table:**

| Phase | Activity | Tool | Responsible |
| --- | --- | --- | --- |
| Pre-commit | Local linting | ruff, ESLint | Developer |
| Pull Request | CI lint + build | GitHub Actions | Automated |
| Pull Request | Code review | GitHub | 1+ team member |
| Pre-merge | Quality gate | Branch protection | Automated |
| Post-merge | Docker build + deploy | GitHub Actions | Helaly |
| Runtime | Monitoring | Prometheus/Grafana | Helaly |
| Daily | Backup validation | Cron | Helaly |
| On Demand (per bugfix/feature) | Exploratory testing | Manual | Kovalev |

### Decision 3: Artifacts

| Artifact | V&V Method | Status | Tool |
| --- | --- | --- | --- |
| Backend Python code | Static analysis | Active | ruff |
| Backend Python code | Unit tests  | Active | pytest |
| Admin Vue/TypeScript | Static analysis | Active | pnpm lint |
| Admin Vue/TypeScript | Unit tests | Active (in CI) | vitest |
| Mobile Flutter code | Static analysis  | Active | flutter analyze |
| Mobile Flutter code | Unit tests | Active | flutter test |
| Ansible playbooks | Infrastructure linting | Active | ansible-lint |
| Shell scripts | Infrastructure linting | Active | shellcheck |
| YAML files | Infrastructure linting | Active | yamllint |
| Database backups | Backup validation | Active | postgres-backup-local |
| API endpoints | Exploratory testing | Active | Manual |
| Full user journeys | E2E testing | Active | Playwright |

### Decision 4: Timing

| Phase | Frequency | Activities | Entry Criteria | Exit Criteria |
| --- | --- | --- | --- | --- |
| Development | Continuous | Local linting | Code written | No lint errors |
| Pull Request | Per commit | CI lint + build | PR opened | All checks pass |
| PR Review | Per PR | Code review | CI green | ≥1 approval |
| Pre-merge | Per PR | Quality gate | Review approved | Gate passes |
| Post-merge | Per merge | Deploy | Merge to main | Container running |
| Production | Continuous | Monitoring | Service running | No alerts |
| Daily | 00:00 UTC | Backup + validation | Cron triggers | Backup verified |
| On Demand | Sprint boundary | Exploratory testing | Sprint end | Check list passed |
| Per sprint | After code | Unit tests | Code complete | 70% coverage |
| Per release | Before deploy | E2E tests (manual run) | Release candidate | All scenarios pass |

### Decision 5: Responsibility

| Role | Name | Quality Responsibilities |
| --- | --- | --- |
| Product Owner & DevOps | Ahmad Helaly | CI/CD pipeline, monitoring, backups, ruff lint |
| Requirements & Backend | Majed Naser | API correctness, unit tests |
| Documentation & Frontend | Roukaya Mohammed | Admin portal UI validation |
| Frontend & Config | Ghadeer Akleh | Component testing, configuration validation |
| Project Tester | Aleksandr Kovalev | E2E tests, regression, test documentation |

**RACI Table:**

| Activity | Ghadeer | Aleksandr | Helaly | Roukaya | Majed |
| --- | --- | --- | --- | --- | --- |
| Write unit tests | I | R | A | C | I |
| Write E2E tests | I | R&A | I | I | C |
| Write regression tests | I | R&A | I | C | I |
| Run regression suite | I | R&A | C | I | I |
| Code review | R | C | A | C | I |
| Run CI | R | C | A | I | I |
| Triage bugs | R | R | I | C | A |
| Release decision | C | C | R&A | C | C |

Table Acronyms

- I - Informed
- R - Responsible
- C - Consultant
- A - Accountable

### Decision 6: Extent

**Coverage Targets by Criticality:**

| Component | Criticality | Coverage Target | Test Types |
| --- | --- | --- | --- |
| Backend Auth | High (A) | 70% | Unit + Integration + E2E |
| Backend Events | High (A) | 70% | Unit + Integration + E2E |
| Backend Other | Medium (B) | 70% | Unit + E2E |
| Mobile Main Flows | High (A) | 70% | Unit + E2E |
| Mobile Other | Medium (B) | 60% | Unit + E2E |
| Admin Portal | Low (C) | 50% | E2E + Unit (vitest, store logic) |
| Infrastructure | Medium (B) | 100% | Static analysis |

### Decision 7: Cost/Time

Dates below are the actual commit dates from the repositories, so every entry is
verifiable in git history.

**Completed Effort:**

| Activity | Effort | Date · Evidence (PR) | Status |
| --- | --- | --- | --- |
| CI/CD pipeline setup | 8 hours | 2026-02-23 · [PR](https://github.com/iu-alumni/iu-alumni-backend/pull/46) | Done |
| Infrastructure linting (yamllint / ansible-lint / shellcheck in CI) | 2 hours | 2026-02-23 · [PR](https://github.com/iu-alumni/iu-alumni-infra/pull/2) | Done |
| Prometheus + Grafana | 4 hours | 2026-02-23 · [PR](https://github.com/iu-alumni/iu-alumni-infra/pull/2) | Done |
| Database backups | 2 hours | 2026-03-08 · [PR](https://github.com/iu-alumni/iu-alumni-infra/pull/20) | Done |
| Backend unit tests (pytest, 453 tests, in CI) | 16 hours | 2026-06-28 · [PR](https://github.com/iu-alumni/iu-alumni-backend/pull/112) | Done |
| Exploratory testing (3 on-demand sessions: 6h / 2h / 5h) | 13 hours | ad-hoc · — | Done |
| Mobile unit tests (flutter test, 86 tests) | 8 hours | 2026-07-01 · [PR](https://github.com/iu-alumni/iu-alumni-mobile/pull/136) | Done (not yet in CI) |
| Admin unit tests (vitest, 2 Pinia stores, 31 tests, in CI) | 4 hours | 2026-07-26 · [PR](https://github.com/iu-alumni/iu-alumni-frontend/pull/80) | Done |
| E2E tests (Playwright + POM, 19 scenarios) | 16 hours | 2026-07-13 · [PR](https://github.com/iu-alumni/iu-alumni-backend/pull/134) | Done (run separately) |
| Security scanning (bandit, high-severity gate in CI — 0 high-severity findings) | 2 hours | 2026-07-26 · [PR](https://github.com/iu-alumni/iu-alumni-backend/pull/169) | Done |
| Load test R-04 (Locust, read-load vs test server) | 4 hours | 2026-07-27 · [PR](https://github.com/iu-alumni/iu-alumni-backend/pull/169) | Done — server saturates at ~10–20 concurrent users (feed p95 ~14–33s, ~1 req/s, 0 errors) |
| Backend coverage gate (`--cov-fail-under=70`, in CI) | 1 hour | 2026-07-27 · [PR](https://github.com/iu-alumni/iu-alumni-backend/pull/169) | Done |
| Smoke test in CI (post-deploy, verifies traffic) | 2 hours | 2026-07-26 · [PR](https://github.com/iu-alumni/iu-alumni-backend/pull/151) | Done |

**Planned Effort:**

| Activity | Estimated Effort | Target | Responsible |
| --- | --- | --- | --- |
| Wire `flutter test` into CI | 2 hours | by 2026-07-28 | Helaly, Kovalev |
| Manual regression run (unit + E2E) before release | 1 hour | before release | Kovalev |

> E2E in CI is intentionally deferred (unstable test server would produce flaky
> false failures); the suite is run manually before release instead.

### Decision 8: Tools

| Category | Tool | Command | Status |
| --- | --- | --- | --- |
| Python linting | ruff | `ruff check .` | Active |
| Vue/TS linting | pnpm | `pnpm run lint` | Active |
| YAML linting | yamllint | `yamllint .` | Active |
| Ansible linting | ansible-lint | `ansible-lint playbooks/*.yml` | Active |
| Shell linting | shellcheck | `shellcheck scripts/*.sh` | Active |
| Unit testing  | pytest | `pytest --cov-fail-under=70` (CI) | Active — coverage gate enforced in CI |
| Unit testing  | flutter test | `flutter test --coverage` | Implemented (not in CI) |
| Unit testing  | vitest | `pnpm test` | Active (in CI) |
| E2E testing | Playwright + Python | `cd e2e && pytest` | Active (manual / separate run) |
| Monitoring | Prometheus | Scrape `/metrics` | Set up (no data collected yet) |
| Visualization | Grafana | Dashboards | Set up (no data collected yet) |
| CI/CD | GitHub Actions | Workflows | Active |

### Decision 9: Training

| Skill | Needed For | Current Status | Training Plan |
| --- | --- | --- | --- |
| Python + pytest | Backend tests | Helaly, Kovalev | 2-hour session |
| Flutter testing | Mobile tests | Kovalev learning | Self-study + teach team |
| Playwright + Python | E2E tests | Kovalev (adapted from Selenide/Java) | Done |
| GitHub Actions | CI/CD | Helaly has experience; others basic | On-the-job |

### Decision 10: Defect Handling

**Defect Severity Levels:**

| Severity | Definition | Response | Release Gate |
| --- | --- | --- | --- |
| **P1 (Critical)** | Data loss, security breach, blocks feature | Fix NOW - hotfix branch | Blocks release |
| **P2 (High)** | Major bug, workaround exists | Fix this sprint | ≤2 allowed |
| **P3 (Medium)** | Minor bug, cosmetic | Add to backlog | Tracked, not blocking |
| **P4 (Low)** | Enhancement, nice-to-have | Backlog for future | Not tracked |

**Defect Triage Rules:**

- Who triages? Tester + Developer (within 24h)
- Escalation? PO at weekly meeting (if disagreement)
- P1 handling? STOP current task, fix immediately
- Verification? Tester only (P2-P4), Developer + Tester (P1)
- Release gate? Any P1 open - NO release

### Decision 11: Measurements

| Dimension | Metric | Target | Tool | Visibility |
| --- | --- | --- | --- | --- |
| Agreement-Based | CI pass rate | 100% | GitHub Actions | All team |
| Agreement-Based | Code review completion | 100% | GitHub | All team |
| Risk-Based | P1 bugs open | 0 | Bug tracker | PO + Tester |
| Effort-Based | Testing hours | Per sprint | Manual | Team |
| Coverage | Lint violations | 0 | ruff, yamllint | CI output |
| Coverage | Backend test coverage | ≥70% floor (CI gate) | pytest-cov | measured: 84.9% line / 69.2% branch |
| Coverage | Mobile test coverage (logic layer) | 70% target | flutter test --coverage | measured: ~20% logic (UI via E2E) |
| Product | API uptime | 99.5% (target — not measured) | Prometheus | dashboards set up; no data collected yet |
| Product | API response time | p95 < 500ms (target — not measured) | Prometheus | dashboards set up; no data collected yet |
| Product | Backup success | 100% | Cron | Helaly |

## Part 4: Quality Gates

| Gate | When | Checks | Who | Status |
| --- | --- | --- | --- | --- |
| Pre-submit (Pull Request) | Before merge to main | ruff, bandit, pytest (70% coverage gate), pnpm lint + build + vitest, yamllint, ansible-lint, shellcheck, ≥1 approval | Automated + Peer | Active |
| Post-submit | After merge | Deploy to Swarm + automated smoke test (public endpoints + Swarm replica health) | CI/CD | Active |
| **Regression** | **After merge / before release** | **Smoke (P0) + Core regression (P1)** | **Kovalev** | **Partial — deploy smoke automated in CI; functional regression manual** |
| Release | Before production deploy | All gates passed, no P1 bugs, backup verified, monitoring healthy | Helaly | Active |

### Regression Gate Details

| Check | Time | Failure Action |
| --- | --- | --- |
| Smoke tests (subset of the 19 E2E) | 30 min | Block release |
| Core regression (~19 E2E scenarios) | 2 hours | Block release |
| Bug-specific regression | 30 min - 2 hours | Block fix deployment |

### Gate 1: Pre-submit (Pull Request)

| Check | Command | Failure Action |
| --- | --- | --- |
| ruff lint | `ruff check .` | Block merge |
| bandit security scan | `bandit -r app --severity-level high` | Block merge |
| pytest (backend unit) | `pytest --cov-fail-under=70` | Block merge |
| pnpm lint | `pnpm run lint` | Block merge |
| pnpm build | `pnpm run build` | Block merge |
| vitest (admin unit) | `pnpm test` | Block merge |
| yamllint | `yamllint .` | Block merge |
| ansible-lint | `ansible-lint playbooks/*.yml` | Block merge |
| shellcheck | `shellcheck scripts/*.sh` | Block merge |
| Code review | ≥1 approval | Block merge |

### Gate 2: Release Criteria

| Criteria | Condition | Verification |
| --- | --- | --- |
| All pre-submit gates passed | Green on main | GitHub Actions |
| No P1 bugs open | Bug tracker zero | Manual check |
| ≤3 P2 bugs open | Documented with workarounds | Bug tracker |
| Backup verified | Latest backup restorable | Cron job |
| Monitoring healthy | No critical alerts | Prometheus |
