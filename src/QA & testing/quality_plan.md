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
| QR2 | Reliability | System stays operational | 99.5% uptime | Monthly uptime | Prometheus |
| QR3 | Performance (API) | API responds to requests | p95 < 500ms | Response time percentile | Prometheus |
| QR4 | Performance (Map) | Map loads on mobile | < 3 seconds | Load time | Manual/E2E |
| QR5 | Security | User data protected | 0 high-severity vulns | Vulnerability count | ruff, bandit |
| QR6 | Maintainability | Code is testable and modifiable | 80% coverage | Line coverage | pytest-cov |
| QR7 | Compatibility | Feature parity across platforms | 95% | Parity checklist | Manual |
| QR8 | Usability | Users complete key tasks | 85% success rate | Task completion | User testing |

---

## Part 3: The 11 Decisions Framework

### Decision 1: Activities

| Activity | Type | Application | Status | Justification |
| --- | --- | --- | --- | --- |
| Static Analysis (Lint) | QC | Backend (ruff) | In CI | Fast, catches syntax/style errors early |
| Static Analysis (Lint) | QC | Admin (pnpm lint) | In CI | Enforces Vue/TypeScript best practices |
| Infrastructure Linting | QC | YAML, Ansible, Shell | In CI | Prevents deployment failures |
| Code Review | QA | All pull requests | Active | Catches design issues; 10:1 ROI |
| Exploratory Testing | QC | Mobile + Admin | Active | Finds UX and platform bugs |
| Production Monitoring | QC | Runtime metrics | Active | Extends V&V into production |
| Backup Validation | QC | PostgreSQL | Active | Ensures data recoverability |
| Unit Testing | QC | Backend (pytest) | Planned | Fast regression feedback |
| Unit Testing | QC | Mobile (flutter test) | Planned | Native Dart testing |
| E2E Testing | QC | Admin + Mobile Web | Planned | Validates complete user journeys |
| Integration Testing | QC | API ↔ DB ↔ Telegram | Planned | Validates real dependencies |

### Decision 2: Interactions

**Workflow Integration:**

### 1. Development Phase

Write code → Local linting → Commit

### 2. Pull Request Phase (Gate 1)

### Steps

1. Open Pull Request (PR)
2. Run CI:
    - Lint
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
| Backend Python code | Unit tests (planned) | Planned | pytest |
| Admin Vue/TypeScript | Static analysis | Active | pnpm lint |
| Mobile Flutter code | Static analysis (planned) | Planned | flutter analyze |
| Mobile Flutter code | Unit tests (planned) | Planned | flutter test |
| Docker Swarm config | Infrastructure linting | Active | docker compose config |
| Ansible playbooks | Infrastructure linting | Active | ansible-lint |
| Shell scripts | Infrastructure linting | Active | shellcheck |
| YAML files | Infrastructure linting | Active | yamllint |
| Database backups | Backup validation | Active | postgres-backup-local |
| API endpoints | Exploratory testing | Active | Manual |
| Full user journeys | E2E testing (planned) | Planned | Selenium |

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
| Per sprint (planned) | After code | Unit tests | Code complete | 70% coverage |
| Per release (planned) | Before deploy | E2E tests | Release candidate | All scenarios pass |

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
| Backend Auth | High (A) | 80% | Unit + Integration + E2E |
| Backend Events | High (A) | 80% | Unit + Integration + E2E |
| Backend Other | Medium (B) | 70% | Unit + E2E |
| Mobile Main Flows | High (A) | 70% | Unit + E2E |
| Mobile Other | Medium (B) | 60% | Unit + E2E |
| Admin Portal | Low (C) | 50% | E2E only |
| Infrastructure | Medium (B) | 100% | Static analysis |

### Decision 7: Cost/Time

**Completed Effort:**

| Activity | Effort | Status |
| --- | --- | --- |
| CI/CD pipeline setup | 8 hours | Done |
| Prometheus + Grafana | 4 hours | Done |
| Database backups | 2 hours | Done |
| Infrastructure linting | 2 hours | Done |
| Exploratory testing (on Demand) | 1 session *6 hours, 1 session* 2 hours, 1 session * 5 hours | Done |

**Planned Effort:**

| Activity | Estimated Effort | Responsible |
| --- | --- | --- |
| Unit tests | 16 hours | Helaly, Naser |
| E2E tests (Selenium) | 16 hours | Kovalev |
| Integration tests | 8 hours | Kovalev |

### Decision 8: Tools

| Category | Tool | Command | Status |
| --- | --- | --- | --- |
| Python linting | ruff | `ruff check .` | Active |
| Vue/TS linting | pnpm | `pnpm run lint` | Active |
| YAML linting | yamllint | `yamllint .` | Active |
| Ansible linting | ansible-lint | `ansible-lint playbooks/*.yml` | Active |
| Shell linting | shellcheck | `shellcheck scripts/*.sh` | Active |
| Docker validation | docker compose | `docker compose config --quiet` | Active |
| Unit testing (planned) | pytest | `pytest --cov=app --cov-fail-under=80` | Planned |
| Unit testing (planned) | flutter test | `flutter test --coverage` | Planned |
| E2E testing (planned) | Selenium + Python | `pytest tests/e2e/` | Planned |
| Monitoring | Prometheus | Scrape `/metrics` | Active |
| Visualization | Grafana | Dashboards | Active |
| CI/CD | GitHub Actions | Workflows | Active |

### Decision 9: Training

| Skill | Needed For | Current Status | Training Plan |
| --- | --- | --- | --- |
| Python + pytest | Backend tests | Helaly, Naser, Kovalev needs | 2-hour session |
| Flutter testing | Mobile tests | Kovalev learning | Self-study + teach team |
| Selenium + Python | E2E tests | Kovalev has Selenide (Java) | Adapt to Python (3 hours) |
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
| Coverage | Test coverage (planned) | 80% | pytest-cov | CI output |
| Product | API uptime | 99.5% | Prometheus | Grafana |
| Product | API response time | p95 < 500ms | Prometheus | Grafana |
| Product | Backup success | 100% | Cron | Helaly |

## Part 4: Quality Gates

| Gate | When | Checks | Who | Status |
| --- | --- | --- | --- | --- |
| Pre-submit (Pull Request) | Before merge to main | ruff, pnpm lint, yamllint, ansible-lint, shellcheck, docker config | Automated | Active |
| Post-submit | After merge | Deploy to Swarm | CI/CD | Active |
| Release | Before production deploy | Monitoring health, backup verified | Helaly | Active |

### Gate 1: Pre-submit (Pull Request)

| Check | Command | Failure Action |
| --- | --- | --- |
| ruff lint | `ruff check .` | Block merge |
| pnpm lint | `pnpm run lint` | Block merge |
| pnpm build | `pnpm run build` | Block merge |
| yamllint | `yamllint .` | Block merge |
| ansible-lint | `ansible-lint playbooks/*.yml` | Block merge |
| shellcheck | `shellcheck scripts/*.sh` | Block merge |
| docker config | `docker compose config --quiet` | Block merge |
| Code review | ≥1 approval | Block merge |

### Gate 2: Release Criteria

| Criteria | Condition | Verification |
| --- | --- | --- |
| All pre-submit gates passed | Green on main | GitHub Actions |
| No P1 bugs open | Bug tracker zero | Manual check |
| ≤3 P2 bugs open | Documented with workarounds | Bug tracker |
| Backup verified | Latest backup restorable | Cron job |
| Monitoring healthy | No critical alerts | Prometheus |
