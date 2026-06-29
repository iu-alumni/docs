# Strategic & Tactical Plan — IU Alumni Platform (ALUMAP)

Period: Feb 4 – Jul 28 (≈ 24 weeks, 4 roadmap phases)

![plan roadmap](../public/milestone-latest.png)

<!-- ```mermaid
timeline
    title Roadmap
    Feb 4th - Mar 17th : Infrastructure Migration
        : DB migration ready
        : CI/CD pipeline Implemented
    Mar 18th - May 12th : Platform Stability<br>(Core Features Fixes)
        : Fixing Migration-related repercussions
        : OTP Implementation
    June 2nd - June 30th : Profile Redesign & Badges
        : Auth Bug Fixes
        : Unit & E2E Testing
    Jul 1st - Jul 28th : Projects Tab
        : Social Features
        : Final stabilization & Acceptance Testing
        : Complete Documentation
``` -->

---

## Part 1 — Strategic Plan

### 1.1 Vision (where we want to be on July 28)

A self-hostable, university-operated alumni platform that can be handed over to a successor team and run for years with minimal intervention. By the end of July:

1. The platform runs on university infrastructure.
2. Every production change is gated by automated tests — not by exploratory testing.
3. The system is observable enough that an on-call engineer can answer "is something broken?" in under 60 seconds from a single dashboard.
4. The codebase is healthy enough that a new contributor can ship a feature in their first week without a senior pairing on every step.
5. Every quality claim in our documentation is backed by an evidence artifact that anyone can re-run.
6. New functionality (social and engagement features) is built on top of this foundation.

### 1.2 The strategic bet

ALUMAP is already in production. That changes the engineering problem. We are not building a system; we are _evolving a running one_ through a server migration, feature phase, and 2 stabilization phases, without breaking the alumni already using it.

This forces three strategic choices:

1. Stability > velocity in the migration phase, velocity > polish in the feature phases, polish > everything in stabilization. The order matters; the ratio shifts at each phase boundary.
2. Quality investments are front-loaded. The test, security, and observability foundation built in phases 1–2 is what makes phases 3–4 fast. Feature work without that foundation looks fast for two sprints and then collapses.
3. The migration is the forcing function for everything we should already have done. If we cannot restore from backup, we cannot migrate. If we cannot run the test suite headlessly, we cannot validate the migration. If our dashboards do not tell us when the platform is broken, we will not know if the migration broke it. We use phase 1 to fix all three.

## 1.3 Strategic objectives & success criteria

Each strategic objective has a measurable end-state checked at the end of project.

| Objective                      | End-state criterion (Jul 25)                                                                                                                     | Measured by                                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| O1. Operational independence   | Platform runs on university infrastructure; complete handover runbook exists; quarterly restore drill executed                                   | Runbooks committed in `iu-alumni-infra/docs/`; drill report dated within 90 days; deploy executed by a non-author |
| O2. Quality net                | Backend coverage ≥ 80% on critical modules; mobile ≥ 60%; frontend ≥ 50%; full E2E regression suite of ≥ 25 scenarios green on every release     | Coverage badges on every README; CI dashboards                                                                    |
| O3. Security posture           | Zero high-severity Bandit/Trivy/pip-audit findings; OWASP ZAP nightly green; quarterly threat-model review filed                                 | CI artifacts + ADR record                                                                                         |
| O4. Performance under load     | API p95 ≤ 500 ms at 500 concurrent users (k6 evidence); map renders 1,000 markers in ≤ 3 s on a mid-range Android                                | k6 reports + Flutter DevTools timeline                                                                            |
| O5. Observability              | RED metrics for every service, USE metrics for every resource, alert routing for every P0/P1 condition, error budget dashboard                   | Grafana dashboards as listed in QP §6                                                                             |
| O6. Documentation completeness | Every public API endpoint documented; requirements traceability matrix 100% mapped; onboarding guide enables a new contributor to ship in week 1 | docs CI green; matrix coverage report                                                                             |
| O7. Process maturity           | DORA: deployment frequency ≥ 1/day on `main`; lead time ≤ 24 h; change failure rate ≤ 15%; MTTR for P1 ≤ 1 h                                     | DORA dashboard + incident log                                                                                     |
| O8. Accessibility & usability  | SUS ≥ 75; WCAG 2.1 AA with 0 critical issues; ≥ 85% task completion in usability test                                                            | Usability report + axe-core artifact                                                                              |

## 1.4 Strategic risks (top of mind, reviewed monthly)

| Risk                                     | Why it threatens the vision                                                             | Strategic mitigation                                                                                                     |
| ---------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Migration failure mid-window             | Could destroy alumni trust and force a rollback to external server we no longer control | migration is done on several stages and we have a backup plan of last stable stage to roll back to in state of emergency |
| Single-person (DevOps)                   | One engineer holds the deploy, monitoring, and infra knowledge                          | documentation of everything is done to ease catch up later, and we have contact with that person                         |
| Notification spam in engagement features | Misconfigured notifications damage user trust faster than features build it             | include rate limits, opt-out, and an observability panel for notifications-per-user-per-day before the feature ships     |
| Documentation rot                        | Docs stop matching code, new contributors can't onboard, knowledge concentrates further | docs CI runs link/spell/lint and an OpenAPI-vs-doc diff on every PR; doc owner is named (Roukaya)                        |

---

## Part 2 — Tactical Plan (Phase-by-Phase)

Each phase has the same structure: theme → entry conditions → goals → workstreams → exit criteria → key risks → handoff to next phase. Exit criteria are the contract: a phase is not over when the calendar says so; it is over when the criteria are met. If it slips, it eats the next phase's buffer (deliberately reserved).

A standing rule applies in every phase: no production deploy goes out without all required CI checks green, and a rollback path documented. This is not repeated below; it is non-negotiable.

---

### Phase 1 + 2 — Infrastructure Migration & Stabilization

### Main objective

Move the platform from external hosting to university infrastructure. Lay down the foundation for easier future migrations if needed and environment for development.

### Why this phase comes first

Every later phase assumes we can deploy reliably, observe production, and recover from failure. Any feature work done before that foundation lands is built on sand.

### Entry conditions

- The previous team has handed over the codebase, documentation, and access to the current hosting environment.

### Goals

1. Migrate all production services (API, mobile web, admin portal, Telegram bot, Postgres, Nginx, Prometheus/Grafana) to university infrastructure with ≤ 1 h cumulative downtime and zero data loss.
2. Ratify the disaster-recovery procedure by performing one full restore drill from off-host backups before the migration date.
3. Stand up the foundational quality CI:
   - Container scanning (Trivy) on every image build
   - Secret scanning (gitleaks) on every PR
   - Branch protection on every repo (required reviews, CODEOWNERS, required status checks)
   - Dependabot/Renovate enabled across all repos (currently only `iu-alumni-infra`)
4. Rebuild Grafana dashboards around RED (per service) and USE (per resource) methods, retiring the cargo-culted PostgreSQL exporter panels.
5. Define and publish the SLOs that the rest of the year will be measured against (availability ≥ 99.5%, p95 ≤ 500 ms, error rate ≤ 0.5%).

### Workstreams

| Workstream               | Owner              | Deliverables                                                                                                                                                     |
| ------------------------ | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Migration execution      | DevOps lead        | Migration runbook (timed, scripted, dry-rehearsed twice); off-host backup verified; DNS cutover plan; rollback plan to old host valid for 14 days post-migration |
| CI hardening             | DevOps lead        | Trivy + gitleaks added to every repo's workflow; branch protection rules applied; Dependabot manifests for backend/mobile/frontend                               |
| Observability rebuild    | DevOps lead        | RED dashboards per service; USE dashboards per resource; alerts set                                                                                              |
| Backup & DR              | DevOps lead        | Off-host daily backup target configured; restore drill executed and report committed; cron exit code scraped by Prometheus; alert if last-success > 26 h         |
| Documentation foundation | Documentation lead | Operational runbooks structure committed in `iu-alumni/docs/`                                                                                                    |

### Tactical constraints

- No feature work merges to `main` during the migration window (24 h before through 24 h after the cutover). Feature branches stay open; PRs can be opened but not merged.
- The old host is not decommissioned for 14 days after migration; rollback path is held open for two weeks of soak time.
- Migration is executed during low-usage hours (validated against Prometheus traffic data from the previous month).

### Exit criteria

A phase-1 exit review checks each of the following. All must be green before phase 2 starts:

| #   | Criterion                                                                                       | Evidence                                                      |
| --- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | Production runs on university infrastructure for ≥ 7 consecutive days with availability ≥ 99.5% | Grafana SLI panel screenshot + uptime log                     |
| 2   | Off-host daily backup is verified working and alerted on failure                                | Prometheus alert history; sample restore from off-host backup |
| 3   | RED + USE dashboards exist and replace the legacy PostgreSQL exporter view                      | Grafana dashboard JSON committed in repo                      |
| 4   | Trivy + gitleaks fail builds on high severity in all four code repos                            | CI run history showing intentional failure on a probe commit  |
| 5   | Branch protection enforces required reviews + status checks on every repo                       | Repo settings screenshot                                      |

---

## Phase 3 — Profile & Auth Stabilization _(June 2 – June 30)_

### Main objective

Stabilize the user-facing experience by delivering the profile redesign with achievement badges, resolving outstanding authentication issues, and expanding test coverage while incorporating revised client priorities agreed in Sprint 12.

The follow feature is a lower priority for the client; Telegram-based event notifications remain on the roadmap but move to Phase 4. The phase end date shifted from June 23 to June 30 to align with the rescheduled mid-semester presentation.

---

### Entry conditions

- All core features working.
- Platform and code stability are fully green.
- Profile redesign requirements and badge definitions are approved by the client.

---

### Goals

1. Deliver the profile redesign: updated layout, graduation labels, and user achievement badges.
2. Resolve authentication issues (email verification reliability, account recovery, alumni-approval separation from email verification).
3. Introduce the Alumni / Alumni Friend registration roles with admin-panel verification flow.
4. Expand test coverage for better reliability:
   - Backend: ≥ 75% overall, ≥ 85% on auth and profile modules
   - Mobile: ≥ 55% overall
   - Frontend: ≥ 50% overall
5. Maintain release velocity:
   - Deployment frequency ≥ 1 deploy/day
   - Change failure rate ≤ 15%
6. Push documentation maturity in parallel to avoid end-of-project compression.

---

### Exit criteria

| #   | Criterion                                                               | Evidence                   |
| --- | ----------------------------------------------------------------------- | -------------------------- |
| 1   | Profile redesign shipped and verified on mobile web and native          | UAT sign-off + screenshots |
| 2   | User badges visible on profiles and awarded correctly                   | Integration test outputs   |
| 3   | All high priority auth bugs closed                                      | Bug board                  |
| 4   | Alumni-approval flow separated from email verification                  | Integration test outputs   |
| 5   | Coverage targets achieved (backend ≥ 75%, mobile ≥ 55%, frontend ≥ 50%) | Coverage reports           |
| 6   | DORA metrics maintained (≥ 1 deploy/day, ≤ 15% CFR)                     | DORA dashboard             |
| 7   | OpenAPI vs documentation match ≥ 90%                                    | Docs CI report             |
| 8   | Zero open P0/P1 defects                                                 | Project board              |

---

## Phase 4 — New Features & Final Stabilization _(July 1 – July 28)_

### Entry conditions

- Phase 3 exit criteria all green.
- Projects Tab requirements finalized and approved by client.
- Social feature scope confirmed (Telegram-based event notifications, follow feature if capacity allows).
- Coverage and DORA metrics are at end-of-phase-3 levels.

### Goals

1. Ship the **Projects Tab**: a new section separate from Events where staff/admins can publish university projects with descriptions and donation links.
2. Ship **Social Features** (in priority order):
   - Telegram-based event notifications (notify users about event updates and new events via the bot)
   - Follow feature (if capacity allows after Projects Tab and notifications are stable)
3. Hit final coverage targets:
   - Backend: ≥ 80% overall, ≥ 90% on auth, ≥ 85% on events/profile/admin
   - Mobile: ≥ 60% overall, ≥ 75% on `application/`
   - Frontend: ≥ 50% overall, ≥ 65% on stores
4. Run the full evidence-collection battery for every QAS in the Quality Plan:
   - Performance: k6 report at thresholds
   - Security: ZAP full scan + Bandit + Trivy + pip-audit reports clean
   - Accessibility: axe-core + Flutter scanner reports against WCAG 2.1 AA
   - Usability: SUS ≥ 75; task completion ≥ 85%
   - Reliability: 30-day uptime ≥ 99.5%; one quarterly restore drill
5. Complete the documentation set:
   - Contributor onboarding
   - Requirements traceability matrix (100% mapped)
   - Architecture Decision Records for every major choice
6. Validate handover by having a non-author execute a deploy from documentation alone.
7. Prepare the defense exhibit set mapped to the strategic objectives.

### Tactical constraints

- No new features merge in this phase. Bug fixes only. The cutoff is the phase-4 entry meeting.

### Exit criteria

| #   | Criterion                                                                                | Evidence                           |
| --- | ---------------------------------------------------------------------------------------- | ---------------------------------- |
| 1   | Projects Tab shipped: staff can create projects with donation links; users can view them | UAT sign-off                       |
| 2   | Telegram-based event notifications working: users notified on event updates/new events   | Integration test outputs           |
| 3   | Alumni / Alumni Friend roles functional in registration and admin panel                  | Test report                        |
| 4   | Final coverage targets hit                                                               | Coverage reports per repo          |
| 5   | All QASs have a current, committed evidence artifact                                     | Traceability matrix complete       |
| 6   | k6 load test green at QAS201 - QAS203 thresholds                                         | k6 report                          |
| 7   | Follow feature or similar if specified in details                                        | Test Report |
| 8   | Usability: SUS ≥ 75, task completion ≥ 85%                                               | Study report                       |
| 9   | Architecture Decision Records committed for every major choice                           | ADR directory                      |
| 10  | All P0/P1/P2 bugs closed; P3+ documented in handover                                     | Bug board                          |

### Key risks for this phase

- Polish work expands to fill the schedule. Mitigation: weekly reviews with explicit "stop" criteria for each part.
- Last-minute scope additions ("just one more feature"). Mitigation: scope freeze is calendared at phase entry; exceptions require PO approval and must trade against another item.

### Final handoff

A 60-minute handover review:

- Walk the strategic objectives; attach evidence to each.
- Identify any criterion not met and the impact.
- File the project closeout document; thank the team.
