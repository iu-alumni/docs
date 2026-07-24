# Risks

This document separates three different things that are often confused:

- **Active Risk Register** — things that *may* happen (forward-looking, probabilistic). See [Active Risk Register](#active-risk-register).
- **Resolved / Closed Risks (Archive)** — risks that did **not** happen (prevented) or no longer apply. See [Resolved / Closed Risks (Archive)](#resolved--closed-risks-archive).
- **Issue Log** — things that **already happened** and were handled. See [Issue Log (Occurred Problems)](#issue-log-occurred-problems).

A *risk* is a future, uncertain event ("the server **may** go down"). Once it happens with certainty it is no longer a risk — it becomes an **issue** and moves to the Issue Log. This separation was tightened after mentor feedback (see [Review Log](#review-log)).

## Status Legend

| Status | Meaning |
| --- | --- |
| **Active** | Risk has not occurred; still possible; reviewed every sprint |
| **Resolved** | Risk did NOT happen; prevented or no longer relevant → moved to Archive |
| **Closed** | Risk no longer applicable (scope changed, feature canceled, decision made) → moved to Archive |
| **Occurred** | Risk DID happen → moved to Issue Log as an issue |

## Priority Legend (Impact × Likelihood)

Priority is **not chosen by hand**. It is read mechanically from the matrix below (Impact = rows, Likelihood = columns), so two people scoring the same risk get the same priority.

| Impact \ Likelihood | Low | Medium | High |
| --- | --- | --- | --- |
| **Critical** | High | Critical | Critical |
| **High** | Medium | High | Critical |
| **Medium** | Low | Medium | High |
| **Low** | Low | Low | Medium |

| Priority | Action policy |
| --- | --- |
| **Critical** | Act immediately; mitigation is a current-sprint blocker |
| **High** | Plan mitigation this sprint |
| **Medium** | Monitor every sprint review |
| **Low** | Review monthly |

### Impact Scale

The matrix above is only objective if Impact and Likelihood are scored against fixed definitions. We use the bands below.

| Impact | Definition (for this project) |
| --- | --- |
| **Low** | Cosmetic or minor inconvenience; no schedule impact; worked around within hours |
| **Medium** | Up to ~1 day of team work lost, OR minor user-facing degradation; no data loss |
| **High** | A sprint slips, OR a core feature/service is degraded or unavailable for a limited time; no permanent data loss |
| **Critical** | Permanent data loss, OR production outage > 1 day, OR failure of a delivery / acceptance milestone (e.g. a stakeholder or mentor demo) |

### Likelihood Scale

Likelihood is the probability the risk occurs **over the remaining project horizon** (not "in general").

| Likelihood | Definition |
| --- | --- |
| **Low** | < 10% — no precedent and strong controls in place |
| **Medium** | 10–50% — plausible; some precedent, or controls are weak/incomplete |
| **High** | > 50% — expected unless actively prevented, or already recurring |

## Risk Identification & Review Process

Risks are identified through:

1. **Bi-weekly retrospectives** — team members share concerns and observations
2. **Sprint planning reviews** — tasks that are consistently delayed or unclear
3. **Stakeholder meeting notes** — new requests or changing priorities
4. **Technical design reviews** — architectural decisions with unknown consequences
5. **Historical data** — risks that occurred in previous semesters

Each risk has an **Owner** responsible for monitoring and mitigation. Every risk carries a **Date Opened**, a **Last Review** date, and a **Trend** (↑ worse / → stable / ↓ better since last review), so the review cadence is auditable. All register changes are recorded in the [Review Log](#review-log).

### Risk Acceptance & Customer Escalation

Risks whose impact falls on the **customer** (availability during events, capacity / traffic limits, delivery scope, external access) are **not resolved unilaterally by the team**. When such a risk is identified — or when a mitigation reveals a limitation (e.g. capacity or a service quota) — we present the Alumni Office with options:

- **(A)** accept the risk / limitation as-is, or
- **(B)** invest additional resources to remove it.

The stakeholders make the call based on their situation; the chosen option and its date are recorded in the risk's **Contingency** and **Evidence** columns. This is reflected in the contingency steps of R-04, R-05, and R-10.

---

## Active Risk Register

Forward-looking risks only. Descriptions use "may / could" on purpose — if wording turns to present tense ("is happening"), the item belongs in the [Issue Log](#issue-log-occurred-problems), not here. Triggers are **leading indicators** (early-warning signs) rather than the problem itself. In the **Mitigation Evidence** column, a link points to a completed action; **TODO:** marks a mitigation that is planned but not yet done (an open action for this / next sprint).

| Risk ID | Category | Description (may happen) | Leading Trigger | Impact | Likelihood | Priority | Mitigation (Preventive) | Contingency (Reactive) | Owner | Date Opened | Last Review | Trend | Mitigation Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-03b | External Dependency | A paid external dependency (domain, cloud/hosting account, TLS, container-registry quota) **could lapse** from a missed payment or renewal → outage or broken deploy. Generalised residual of the [R-03 incident](#issue-log-occurred-problems) | Renewal/expiry within 30 days is not confirmed, OR a balance/quota alert fires | Critical | Low | High | Backup payment method on every paid account; Grafana balance alert below threshold; calendar reminders for all renewals (domain, card, registry); emergency-contact email stored | Restore the lapsed service using backup payment/contact; if downtime exceeds 1 h, notify stakeholders via backup channel | Ahmad Helaly | 01.05.2026 | 22.07.2026 | ↓ | Backup payment added; Grafana balance alert configured (infra); monthly card-expiry check in team calendar |
| R-04 | Infrastructure | Production server **may go down** during an alumni event (single-node deployment = single point of failure, see [architecture design §7.1](../project/architecture_design.md)) → users can't register/participate, reputation damage | Uptime/Prometheus alert fires, OR pre-event load test shows capacity below expected peak | Critical | Medium | Critical | Load-test server before event; provision extra headroom for event duration; Telegram/Prometheus uptime alerts with 1-minute check interval | Restart Docker services via documented procedure; if restart fails, restore DB from latest backup; **if load test reveals a capacity limit, present the Alumni Office with options (A accept current capacity vs B invest in scale-up for the event) and record their decision before the event** | Ahmad Helaly | 13.04.2026 | 22.07.2026 | ↑ | Prod migrated to university server (infra); Prometheus/Grafana uptime alerts ([architecture design §5.1](../project/architecture_design.md)); **TODO:** run pre-event load test |
| R-05 | Scope | Stakeholder **may request** a major new feature during feature freeze → scope creep forces a choice between overtime, quality drop, or missed deadline | A feature request arrives after the signed freeze date and is not in the approved scope doc | High | Medium | High | Define and communicate the feature-freeze date at project start; document all approved features with explicit sign-off; keep buffer time for minor adjustments | Present effort estimate and timeline impact **before** agreeing; offer phase-2 delivery; **let the stakeholder decide (A accept scope vs B one-in-one-out removal of an existing feature) and record the decision** | Roukaya Mohammed | 13.04.2026 | 22.07.2026 | → | Feature-freeze communicated (client-meeting notes); approved feature scope documented in [functional requirements](../requirements/functional.md) |
| R-07a | Technical | Continuing **without refactoring** Flutter **risks** accumulating technical debt → features take up to 5× longer, morale drops, a full rewrite starts to look necessary | Time to add a simple feature exceeds **8 h** (was 2 h); OR a Flutter-specific bug fix takes >**4 h**; OR developer frustration >7/10 for 2 sprints | High | High | Critical | Track "debt files" (top 10 worst); allocate **1 h/day** for incremental improvements; enforce code reviews on problematic files; measure actual vs estimated hours per task weekly | Declare a "technical-debt sprint" (stop new features for **8 h** of focused refactoring); if still unsustainable → escalate the rewrite decision | Ghadeer Akleh | 13.04.2026 | 22.07.2026 | → | Debt/bug work visible in mobile-repo review PRs (#139, #140); extend-vs-rewrite quantified in [frontend-migration-decision.md](./frontend-migration-decision.md) (131 h extend vs 182 h rewrite) |
| R-08 | Team | Remote-only meetings **may be** less effective than in-person → slower decisions, more misunderstandings, unclear action items, lower productivity | Two consecutive meetings run >20% over time OR end with unassigned action items; recurring "cameras off / multitasking" | Medium | Medium | Medium | Cameras on for key discussions; assign a meeting facilitator; write decisions and action items in chat live; keep meetings under 45 min | Re-hold critical discussions asynchronously (written thread); Roukaya follows up individually; record meetings for absentees | Roukaya Mohammed | 07.06.2026 | 22.07.2026 | ↓ | Facilitator + in-chat action items used in team-meeting notes; decisions and action items recorded in sprint meeting notes, e.g. [sprint-17 client meeting](../sprints/sprint-17/client-meeting.md) |
| R-09b | Meetings / Infrastructure | An A/V failure (a participant's mic, audio, connection, or screen-share) **may recur** during a meeting or a stakeholder presentation → wasted time, missed context, a speaker unable to present their part. Residual risk — this **already materialized once** (see [Issue Log](#issue-log-occurred-problems)) | A pre-session A/V check fails, OR a participant reports mic / audio / connection problems before the session | Medium | Medium | Medium | Run a full A/V check (each presenter's mic, audio, screen-share) 5 min before every stakeholder / mentor session; keep a backup mic / headset; assign a backup presenter able to cover any section; keep Zoom ready as a backup platform | Reassign the affected section to the backup presenter (as done in the mentor presentation); switch device or relay through another member; switch platform if the issue is platform-side; record and summarise decisions in writing | Majed Naser | 07.06.2026 | 22.07.2026 | ↑ | Zoom backup available; incident recorded in the Issue Log; **TODO:** add a pre-session A/V-check checklist |
| R-10 | Team | A critical task **may overrun** its estimate significantly → team momentum lost, dependent tasks blocked, morale drops, deadlines slip | Task passes **50% over estimate** with no clear completion path (early warning, before it reaches 3×) | High | Medium | High | Add buffer to estimates for unknown tasks; prepare a fallback for complex tasks; review actual-vs-estimate weekly | Re-evaluate and split the task; reassign; **escalate to the stakeholder with options (A extend timeline vs B descope non-critical parts) and record the decision** | Ahmad Helaly | 28.06.2026 | 22.07.2026 | → | Estimation buffers in sprint-plan; **TODO:** track per-task actual vs estimate |
| R-11b | Team | A team member who is the **sole owner** of a critical area (e.g. infrastructure) **may be unavailable or unresponsive** on the team's online channels when an urgent issue needs them → the issue cannot be resolved because no one else has the access or knowledge. Residual of the [R-11 incident](#issue-log-occurred-problems); a concrete case of the key-person concentration first noted in R-06 | An urgent request to a member goes unanswered for >24 h on a working day, OR a critical area still has only one person who can act on it | High | Medium | High | Agree a reachability norm (acknowledge urgent pings within a set window on working days); document infrastructure/deployment procedures and share access so a second member can act; keep credentials in the team vault; name a backup owner for each critical area; route urgent asks with @mention + explicit deadline | Escalate to the whole team / mentor if the owner is unreachable; the backup owner acts using the documented procedures; reassign the blocked work | Roukaya Mohammed | 24.07.2026 | 24.07.2026 | ↑ | Architecture/deployment procedures documented ([architecture design](../project/architecture_design.md)); **TODO:** assign an infrastructure backup owner |

---

## Resolved / Closed Risks (Archive)

Risks that did **not** occur (prevented) or no longer apply. Kept for audit and traceability; they are **out** of the active register on purpose (mentor feedback: do not keep resolved items mixed with active ones).

| Risk ID | Category | Original Risk (may have happened) | Impact | Likelihood | Priority | Final Status | Resolution / Reason | Owner | Date Opened | Date Closed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-01 | External Dependency | IT Department may not grant access to the alumni email database before the sprint that needs it → auto-approval feature blocked, timeline could slip 1–2 sprints | High | Low | Medium | **Closed** (feature dropped) | The email-database auto-approval feature was removed from scope. Access to the IT-managed alumni email database is no longer needed, so this external dependency no longer applies | Aleksandr Kovalev | 13.04.2026 | 22.07.2026 |
| R-02 | Infrastructure | Database migration fails due to missing or corrupted backup → partial data loss, 4+ h restore, delays | High | Medium | High | **Resolved** (did not occur) | Migration to the university server completed with <30 min downtime. Pre-migration backup + staging dry-run + row-count and referential-integrity checks all passed ([architecture design §4.1–4.2](../project/architecture_design.md)). Ongoing data safety now covered by tiered Postgres backups | Ahmad Helaly | 13.04.2026 | 10.05.2026 |
| R-06 | Team | Ahmad leaves the project before completion → loss of PO/deployment/infra knowledge | Critical | Medium | Critical | **Resolved** (did not occur) | Ahmad confirmed he is staying for the full project duration. Residual key-person concentration is mitigated by documented architecture/deployment procedures and a shared credentials vault | Ahmad Helaly & Roukaya Mohammed | 13.04.2026 | 01.06.2026 |
| R-07b | Technical | Refactoring Flutter introduces regression bugs and stalls visible delivery → stakeholder confidence drops | High | Low | Medium | **Closed** (scope decision) | Team decided **not** to refactor and to extend the existing Flutter codebase instead, based on a cost comparison (131 h extend vs 182 h rewrite, [frontend-migration-decision.md](./frontend-migration-decision.md)). The active counterpart of this decision is **R-07a** | Ghadeer Akleh | 13.04.2026 | 07.06.2026 |

---

## Issue Log (Occurred Problems)

Risks that **already happened** and were handled. Historical record and source of lessons learned. `Customer Notified?` is tracked because informing stakeholders is part of handling an issue (mentor feedback).

| Issue ID | Original Category | What Happened | Impact | Root Cause | Resolution | Customer Notified? | Date | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-03 | External Dependency | Yandex Cloud account suspended due to expired payment card | Production downtime; users unable to access platform | Payment card expired; Yandex Cloud notification email landed in spam and was missed | Restored access; added backup payment method; set up Grafana balance alert; stored emergency-contact email | Yes — stakeholders notified via backup channel during the downtime | 01.05.2026 | Ahmad Helaly |
| R-09 | Meetings / Infrastructure | During a mentor presentation, Roukaya's microphone failed, so she could not present her part; the project was presented without her and Ghadeer delivered Roukaya's section in her place | Speaking parts had to be reassigned live; the presentation was completed but under a member down and with last-minute improvisation | Microphone / audio failure on the presenter's side | Ghadeer took over and presented Roukaya's part; the session was completed | Yes — occurred live in front of the mentors | 30.06.2026 | Majed Naser |
| R-11 | Team | Just before the MOSP presentation, a production server problem occurred, but Ahmad Helaly — the only team member with the infrastructure knowledge and server access to fix it — was unavailable and unresponsive on the team's online channels, so the problem could not be resolved promptly | The server issue stayed unresolved while the sole infrastructure owner was unreachable, right before a milestone presentation; the team was blocked and had to wait | Infrastructure knowledge and server access were concentrated in one person (key-person / bus-factor), with no available backup and no agreed reachability expectation for urgent issues | Handled once Ahmad became reachable; the team proceeded with the presentation | No — internal team issue | 30.06.2026 | Roukaya Mohammed |

### Lessons Learned

| Source | Lesson | Action Taken to Prevent Recurrence |
| --- | --- | --- |
| R-03 | Payment cards expire and provider emails can be missed or land in spam | Backup payment method; Grafana low-balance alert; monthly card-expiry check in the team calendar. Generalised to all paid dependencies as active risk **R-03b** |
| R-09 | A participant's mic / audio can fail at the worst moment — during a stakeholder-facing presentation — and take a presenter out of the session | Run a pre-session A/V check (each presenter's mic, audio, screen-share) before every mentor / stakeholder presentation; keep a backup mic / headset; keep a backup presenter briefed on every section so any part can be delivered if a member drops (as Ghadeer covered Roukaya's part). Ongoing risk tracked as active residual risk **R-09b** |
| R-11 | When infrastructure knowledge and access sit with one person, their unavailability at a critical moment (a server issue right before a milestone) blocks the whole team | Document infrastructure/deployment procedures and share access so a second member can act; name a backup owner for each critical area; agree a reachability expectation for urgent issues. Ongoing risk tracked as active residual risk **R-11b** |
| Process | A risk register only demonstrates management if it is reviewed on a stable cadence with evidence, and risks are kept separate from issues | Split into Active Register / Archive / Issue Log; added a machine-read priority matrix; added Date Opened / Trend / Evidence columns; every register change is logged in the [Review Log](#review-log). **Going forward**, each sprint retrospective ends with a "Risks reviewed: …" line and the Review Log is updated the same day, so the cadence is verifiable |

---

## Review Log

Records when the register was actually reviewed/updated, so the cadence is verifiable (dates match the repository commit history for this file).

| Date | Reviewed By | Changes |
| --- | --- | --- |
| 13.04.2026 | Team | Initial risk register created |
| 08.05.2026 | Team | Updated after the Yandex Cloud incident (R-03 recorded as occurred) |
| 07.06.2026 | Team | Added R-07a / R-07b (refactor decision); closed/updated older risks |
| 28.06.2026 | Team | Status updates; markdown fixes |
| 22.07.2026 | Team | Restructured after mentor feedback: separated Active Register / Archive / Issue Log; machine-read priority matrix; added Date Opened, Trend, Mitigation Evidence; added customer-escalation steps; reframed R-08/R-09/R-10 as forward-looking with leading-indicator triggers; split R-03 into occurred issue + residual risk R-03b; logged the mentor-presentation microphone failure (Roukaya) as the R-09 incident (Issue Log) and split off its active residual risk R-09b; corrected each risk's Date Opened to match the commit that first introduced it (R-07a/b 08.05→origin 13.04, R-08/R-09 07.06, R-10 28.06); standardised all dates to DD.MM.YYYY; added fixed Impact and Likelihood scales so matrix inputs are objective; re-scored R-04 against the new scale (load test still pending = weak controls → Likelihood Low→Medium, Priority High→Critical); closed R-01 (email-database auto-approval feature dropped from scope) and moved it to the Archive |
| 24.07.2026 | Team | Logged the pre-MOSP server incident (30.06.2026, Ahmad unavailable) as issue R-11 and opened its residual risk R-11b (key-person unavailability / online unresponsiveness). Filled Mitigation Evidence: R-05 → [functional requirements](../requirements/functional.md), R-08 → sprint meeting notes ([sprint-17 client meeting](../sprints/sprint-17/client-meeting.md)); standardised the remaining open items (R-04, R-09b, R-10, R-11b) to a consistent **TODO:** marker with a legend |
