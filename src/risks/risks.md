# Risks

## Status Legend

| Status | Meaning |
| --- | --- |
| **Active** | Risk is still possible; being monitored weekly |
| **Resolved** | Risk did NOT happen; prevented or no longer relevant |
| **Occurred** | Risk DID happen; incident was handled |
| **Closed** | Risk no longer applicable (scope changed, feature canceled, etc.) |

## Priority Legend

| Priority | Meaning |
| --- | --- |
| **Critical** | High Impact + High Likelihood → act immediately |
| **High** | High Impact + Medium Likelihood → plan this sprint |
| **Medium** | Medium Impact + Medium Likelihood → monitor weekly |
| **Low** | Low Impact + Low Likelihood → review monthly |

## Risk Identification Process

Risks are identified through:

1. **Bi-Weekly retrospectives** — team members share concerns and observations
2. **Sprint planning reviews** — tasks that are consistently delayed or unclear
3. **Stakeholder meeting notes** — new requests or changing priorities
4. **Technical design reviews** — architectural decisions with unknown consequences
5. **Historical data** — risks that occurred in previous semesters

Each risk is assigned an **Owner** who is responsible for monitoring and mitigation.
Risks are reviewed (15 min) and updated based on current project status.

---

## Risks Table

| Risk ID | Category | Description | Trigger | Impact | Likelihood | Priority | Mitigation (Preventive) | Contingency (Reactive) | Owner | Status | Last Review |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-01 | External Dependency | IT Department **does not grant** access to alumni email database before sprint → auto-approval feature is blocked, timeline slips by 1-2 sprints | Sprint planning begins with no confirmed access | High | Low | Medium | Request access 4 weeks before development begins; escalate to project mentor if no response within 1 week | Implement Google Sheets manual import as workaround; notify stakeholders of limitation and revised timeline | Aleksandr Kovalev | Active | 2026-06-27 |
| R-02 | Infrastructure | Database **migration fails** due to missing or corrupted backup → event history and user data is partially lost, restore takes 4+ hours, team delays | Migration initiated without verified backup | High | Medium | High | Create full database backup before migration; store backup in S3 bucket separate from both source and target servers; verify backup integrity before proceeding | Stop migration immediately; restore database from S3 backup on target server; if backup corrupted, take new snapshot of source server and retry; communicate delay to team | Ahmad Helaly | Active | 2026-06-27 |
| R-03 | External Dependency | Yandex Cloud account **suspended** due to expired payment card → production downtime, users unable to access platform, negative user experience | Payment notification email ignored or missed | Critical | Medium | High | Add backup payment method to account; set up Grafana alert for account balance below threshold; store emergency contact email for Yandex Cloud notifications | Contact Yandex Cloud support to restore access; provide alternative payment method; if downtime exceeds 1 hour, communicate status to stakeholders via backup channel | Ahmad Helaly | Occurred | 2026-05-01 |
| R-04 | Infrastructure | Production server **downtime** during alumni event → users unable to register or participate, negative user experience, reputation damage | Monitoring alert triggers; users report inability to access platform | Critical | Low | High | Load test server before event; temporarily scale up cloud resources for event duration; set up Telegram uptime alerts with 1-minute check interval | Restart Docker services via documented procedure; if restart fails, restore database from latest S3 backup | Ahmad Helaly | Active | 2026-06-27 |
| R-05 | Scope | Stakeholder requests **major new feature** during feature freeze → scope creep forces team to choose between overtime, quality drop, or missed deadline | Client meeting includes phrase "could we also add..." | High | Medium | High | Define and communicate feature freeze date to stakeholder at project start; document all approved features with explicit sign-off; include buffer time in timeline for minor adjustments | Present effort estimate and timeline impact before agreeing to any change; offer to add feature in post-delivery phase 2; if stakeholder insists, request formal prioritization of existing features to remove (one out, one in) | Roukaya Mohammed | Active | 2026-06-27 |
| R-06 | Team | Ahmad **leaves** project before completion → loss of PO knowledge, deployment procedures, and infrastructure context; team struggles to continue | Ahmad confirms early graduation date that falls before project end date | Critical | Medium | High | Document all backend architecture, deployment procedures, and infrastructure setup so any developer can understand and continue work; store all credentials in shared team vault | Reallocate responsibilities: Ghadeer handles client and planning; Majed handles backend and deployment using documentation; reduce remaining scope | Ahmad Helaly & Roukaya Mohammed | Resolved - Ahmad confirmed he is staying for the full project duration | 2026-06-01 |
| R-07a | Technical | **NOT refactoring** Flutter → technical debt accumulates, features take 5x longer to implement, team morale decreases, complete rewrite becomes necessary | Time to add simple feature exceeds **8 hours** (was 2 hours); OR Flutter-specific bug fix takes >**4 hours**; OR developer frustration >7/10 for 2 sprints | High | High | Critical | Track "debt files" (top 10 worst files); allocate **1 hour/day** for incremental improvements; enforce code reviews for changes to problematic files; measure actual vs estimated hours per task weekly | Declare "technical debt sprint" (stop new features for **8 hours** of focused refactoring); if still unsustainable → escalate to rewrite in React | Ghadeer Akleh | Active | 2026-06-27 |
| R-07b | Technical | **Refactoring** Flutter → regression bugs appear across existing features; delivery slips with no visible progress for stakeholders; stakeholder confidence drops | Team estimates refactoring requires >**16 hours**; OR stakeholder asks "what have we delivered?" for 2 consecutive days | High | Low | Medium | Limit refactor to **8 hours max** if approved; run full regression tests before and after; refactor gradually (1 hour/day over 2 weeks) instead of one big bang | Rollback to pre-refactor branch immediately if critical bugs appear (**<15 min** rollback); communicate **delay** to stakeholders immediately | Ghadeer Akleh | Resolved - team decided NOT to refactor. See R-07a for active risk | 2026-06-01 |
| R-08 | Team | Online meetings **less effective** than in-person → decisions take longer to make, misunderstandings increase, action items remain unclear, productivity drops | Meeting runs over time by >20%; action items unclear; attendees multitask (cameras off, not responding); same issue discussed in multiple meetings | Medium | Medium | Medium | Require cameras on during key discussions; assign meeting facilitator; write decisions and action items in chat during meeting; keep meetings under 45 min | Re-hold critical discussions asynchronously (written thread); Roukaya follows up with each member individually; record meeting for absentees | Roukaya Mohammed | Active | 2026-06-27 |
| R-09 | Infrastructure | Telemost **technical issues** (connection, audio, screen share) → wasted time, missed context, decisions delayed, meeting ineffective | Meeting starts 10+ minutes late due to technical issues; participants cannot share screen; audio cuts out during important decisions | Low | Medium | Low | Have backup platform (Zoom); ask participants to join 2 minutes early; test link before meeting | Switch to backup platform; record meeting for those who missed; summarize decisions in writing | Majed Naser | Active | 2026-06-27 |
| R-10 | Team | Critical tasks **drag on for weeks** beyond estimate → team momentum is lost, dependent tasks blocked, morale drops, deadlines slip | Task exceeds initial estimate by **3x**; task is discussed in 3+ sprint reviews without completion | High | Medium | High | Add **buffer** to estimates for unknown tasks; prepare fallback plan for complex tasks; escalate if task exceeds estimate by 50% | Re-evaluate task and split into smaller pieces; reassign to another team member; descope non-critical parts | Ahmad Helaly | Active | 2026-06-27 |

---

## Occurred Risks (Issues / Problems)

This table lists risks that **have already happened** and were handled. They are kept here for historical reference and lessons learned.

| Risk ID | Original Category | What Happened | Impact | Root Cause | Resolution | Date | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R-03 | External Dependency | Yandex Cloud account suspended due to expired payment card | Production downtime; users unable to access platform | Payment card expired; notification email from Yandex Cloud went to spam folder and was missed | Added backup payment method; set up Grafana alert for account balance below threshold; stored emergency contact email for Yandex Cloud notifications | 2026-05-01 | Ahmad Helaly |

### Lessons Learned from Occurred Risks

| Risk ID | Lesson | Action Taken to Prevent Recurrence |
| --- | --- | --- |
| R-03 | Payment cards expire; email notifications from cloud providers can be missed or land in spam | Added backup payment method; Grafana alert for low balance; monthly card expiry check added to team calendar |
