# ALUMAP — Full Sprint Plan (20 Sprints)

**Period:** Feb 4, 2026 – Jul 28, 2026  
**Team:** Ahmad Helaly, Majed Naser, Roukaya Mohammed, Ghadeer Akleh, Aleksandr Kovalev  
**Sprint duration:** 1 week

> Sprints 1–12 are reconstructed from meeting notes and retrospectives.
> Sprints 13–20 are planned forward from the milestone roadmap.
> A 2-week university spring break falls between Sprints 9 and 10 (Apr 8–21) and is not counted as sprint time.

---

## Milestone Map

| Milestone | Dates | Sprints |
|---|---|---|
| M1 — Infrastructure Migration | Feb 4 – Mar 17 | 1–6 |
| M2 — Platform Stability & Security | Mar 18 – May 12 | 7–12 |
| Bridge — Enhancements & Parity | May 13 – Jun 1 | 13–15 |
| M3 — Social & Engagement Features | Jun 2 – Jun 23 | 16–18 |
| M4 — Final Stabilization | Jun 24 – Jul 28 | 19–20 |

---

## M1 — Infrastructure Migration | Feb 4 – Mar 17

*Milestone bullets: Infrastructure Migration · DB migration ready · CI/CD pipeline Implemented*

---

### Sprint 1 | Feb 4–10 — Infrastructure Migration (Planning)

**Goal:** Establish the team, document the platform's known issues, and initiate server access.

**Deliverables:**

- First client meeting held; main goal and user roles documented
- Technical issues catalogued (broken password recovery, OTP not sending, login requires admin approval)
- University IT department contacted for server VM provisioning
- GitHub Project board created; Sprint 1 tasks populated

**Success Criteria:**

- Each team member has a documented role and responsibility
- Known technical issues are filed as tickets with severity labels
- IT department contact is acknowledged in writing
- Task board is live and visible to all team members

---

### Sprint 2 | Feb 11–17 — Infrastructure Migration (Server Provisioning)

**Goal:** Provision the university server and initialise the container orchestration environment.

**Deliverables:**

- Ansible playbooks written for base server setup (Docker, UFW, system packages)
- Docker Swarm initialised; `iu_alumni_network` overlay network created
- SSH key-based access configured and password authentication disabled
- Requirements documentation started (use cases, event fields, feature list)

**Success Criteria:**

- `ansible-playbook` runs to completion with zero task failures on the target server
- `docker node ls` shows the Swarm manager node in a healthy state
- SSH key login confirmed; root password login rejected
- At least 5 use cases drafted and reviewed with the team

---

### Sprint 3 | Feb 18–24 — DB Migration Ready (Staging Trial)

**Goal:** Validate the full database migration procedure on staging before touching production.

**Deliverables:**

- `pg_dump` taken from source server and stored in an independent location
- `pg_restore` executed on the staging database instance
- Pre-migration row-count baseline recorded per table
- User profile spec finalised with client (graduation year, `show_location`, badge placeholder)

**Success Criteria:**

- Staging restore completes with zero FK violations
- Row counts match 100% between source and staging
- Field-level spot check on 5% of alumni records shows zero data corruption
- Profile spec document approved by client in meeting

---

### Sprint 4 | Feb 25–Mar 3 — DB Migration Ready (Live Cutover)

**Goal:** Execute the live database migration from the old server to the university server.

**Deliverables:**

- Production `pg_dump` taken and securely transferred to the university server
- `pg_restore` executed and validated on the live PostgreSQL 16 instance
- Additive Alembic migrations applied on top of the restored schema
- Rollback procedure rehearsed: database wiped and re-restored from backup

**Success Criteria:**

- 100% row-count match per table post-restore
- Zero FK violations confirmed via `pg_catalog` constraint check
- `alembic current` matches the expected revision; no migration conflicts
- Rollback dry-run completes in under 30 minutes

---

### Sprint 5 | Mar 4–10 — CI/CD Pipeline (Build & Registry)

**Goal:** Automate Docker image builds and publish them to GHCR on every push.

**Deliverables:**

- GitHub Actions CI workflow: lint, build, tag image with commit SHA, push to GHCR
- Docker Swarm stack files for all services committed to the infra repository
- Image pull confirmed from the university server
- Backend image response format fixed: images served as URLs, not raw bytes

**Success Criteria:**

- Push to `develop` triggers CI; image is built, tagged, and pushed to GHCR within 5 minutes
- University server can `docker pull` from GHCR without authentication errors
- All service images (backend, frontend, mobile) build successfully in CI with no lint failures
- Event images load correctly in both Android and Telegram Mini App

---

### Sprint 6 | Mar 11–17 — CI/CD Pipeline (Deployment & Observability)

**Goal:** Automate deployment to production and stand up the monitoring stack.

**Deliverables:**

- `docker stack deploy` triggered via `appleboy/ssh-action` in the CD workflow
- Prometheus, Grafana, Node Exporter, and Postgres Exporter running in the Swarm
- Four pre-provisioned Grafana dashboards live
- DNS updated; all services reachable at their final domain

**Success Criteria:**

- End-to-end pipeline: push to `main` → running container on server, zero manual steps
- Prometheus scrapes all four targets at a 15-second interval
- Grafana accessible at `grafana.{DOMAIN}`; at least one alert rule active
- All service health endpoints return 200 within 60 seconds of `docker stack deploy`

---

## M2 — Platform Stability & Security | Mar 18 – May 12

*Milestone bullets: Platform Stability & Security · Fixing Migration-related repercussions · OTP Implementation*

---

### Sprint 7 | Mar 18–24 — Platform Stability (Regression & Verification)

**Goal:** Confirm all platform features work on the university server; triage every regression.

**Deliverables:**

- Manual regression test across all features (auth, events, profiles, map)
- Bug triage list with P0/P1/P2 severity assigned to every issue
- Old Yandex Cloud server shut down with client approval
- Migration post-mortem document written and committed to the docs repo

**Success Criteria:**

- Every existing feature passes a smoke test on the university server
- Zero P0 bugs remain open at end of sprint
- Old server is fully decommissioned; no traffic routed to it
- Post-mortem committed; includes root cause, timeline, and preventive measures

---

### Sprint 8 | Mar 25–31 — Platform Security (Network Hardening & Backups)

**Goal:** Harden the server security perimeter and automate TLS and database backups.

**Deliverables:**

- UFW configured: only ports 22, 80, and 443 allowed; all others blocked
- Fail2ban installed: 5 failed SSH attempts → 3600-second IP block
- Certbot sidecar deployed; auto-renews Let's Encrypt certificates every 12 hours
- Tiered PostgreSQL backup container running (7 daily, 4 weekly, 6 monthly snapshots)

**Success Criteria:**

- `ufw status` confirms correct rules; port scan shows no unexpected open ports
- Fail2ban test: 5 rapid failed SSH attempts trigger a block logged in `/var/log/fail2ban.log`
- Certbot renews a test certificate successfully without manual intervention
- Daily backup snapshot created; restore to staging completes in under 30 minutes

---

### Sprint 9 | Apr 1–7 — Fixing Migration Repercussions (CI & Client Bugs)

**Goal:** Resolve all migration-caused regressions in the CI pipeline and client-facing features.

**Deliverables:**

- GitHub Actions runner bug diagnosed and fixed (jobs not being picked up)
- City-based user listing endpoint (`GET /profile/users?city=X`) fixed
- Donation link added to the event detail screen on both clients
- Downtime incident report written (root cause, timeline, prevention)

**Success Criteria:**

- CI pipeline triggers and completes successfully on push to `develop` and `main`
- City filter returns correct results; verified against a test dataset
- Donation link renders on the event detail screen and opens in an external browser
- Incident report merged into the docs repo

---

> **Spring break: Apr 8–21 — no sprint**

---

### Sprint 10 | Apr 22–28 — Fixing Migration Repercussions (Auth & Recovery)

**Goal:** Restore password recovery and verify all auth-related migration fixes are complete.

**Deliverables:**

- Password recovery flow working end-to-end (email link → reset → login)
- All application client versions updated to current releases
- Prometheus alert configured: fires if any service endpoint is down for more than 15 seconds
- Zero P0 or P1 migration regression bugs remaining in the backlog

**Success Criteria:**

- User receives reset email within 30 seconds; link expires after 1 hour; new password accepted on login
- Prometheus alert fires in a kill-container test; service recovers within Docker Swarm restart window (< 30 s)
- No migration-related bugs remain at P0 or P1 severity
- Client confirms the platform feels stable in the weekly meeting

---

### Sprint 11 | Apr 29–May 5 — OTP Implementation (Email OTP)

**Goal:** Implement email-based one-time password as a second authentication factor.

**Deliverables:**

- `POST /auth/login` returns `{session_token, otp_required: true}` when OTP is enabled
- `POST /auth/login-otp` validates the 6-digit code and issues a JWT
- OTP codes expire after 10 minutes; single-use enforced (`used = true` on consumption)
- Gmail SMTP integration delivering OTP codes to alumni email addresses

**Success Criteria:**

- Email OTP delivered within 30 seconds (P95) under normal conditions (QAS-B)
- Expired or already-used codes return a structured 401 response
- OTP login flow works end-to-end on both Android and Telegram Mini App
- `login_codes` table indexed on `token`; expired records cleaned up by a scheduled job

---

### Sprint 12 | May 6–12 — OTP Implementation (Telegram OTP & Auth Reliability)

**Goal:** Implement Telegram OTP login and complete authentication reliability monitoring.

**Deliverables:**

- Telegram bot sends a 6-digit OTP to the linked account on login request
- All three auth paths (password, email OTP, Telegram OTP) converge on `create_access_token()`
- Synthetic login probe cron job deployed: test login attempted every minute
- Prometheus alert: error rate on `POST /auth/login` exceeds 0.1% over 5 minutes → Telegram notification to admin

**Success Criteria:**

- Telegram OTP delivered within 10 seconds (P95) (QAS-B)
- ≥ 99.9% login success rate for valid credentials over a 24-hour observation window (QAS-B)
- Synthetic probe reports zero failures over 24 hours
- Chaos test: killing the PostgreSQL container returns a structured 503; service recovers in under 30 seconds

---

## Bridge — Enhancements & Parity | May 13 – Jun 1

*Covers the gap between M2 and M3: profile improvements, admin controls, and feature parity verification.*

---

### Sprint 13 | May 13–19 — Alumni Location Map

**Goal:** Deliver the opt-in alumni location map with server-side aggregation.

**Deliverables:**

- `GET /profile/map` returns `[{city, lat, lon, count}]` for verified alumni where `show_location = true`
- Composite DB index on `(show_location, location)` deployed via Alembic migration
- `show_location` privacy toggle functional in profile settings on both clients
- Map renders pins with pan and zoom on both Android and Telegram Mini App

**Success Criteria:**

- Map initial load completes in under 3 seconds with 50–500 alumni in the database (QAS-F)
- Pan and zoom interactions respond in under 1 second
- Alumni with `show_location = false` are absent from the map endpoint response
- All aggregation is server-side; zero client-side geocoding calls are made

---

### Sprint 14 | May 20–26 — Profile Improvements & Admin Moderation

**Goal:** Add graduation-year labels to profiles and deliver admin ban and verify controls.

**Deliverables:**

- Graduation year displayed on profile cards in both clients (included in profile API response)
- Admin can ban/unban and verify/unverify any alumnus from the admin portal
- Audit log: every ban/unban/verify action recorded with timestamp and admin email
- Banned users receive a 403 on all authenticated API requests immediately after the action

**Success Criteria:**

- Graduation year visible on profile cards without an extra API call
- Ban enforced within one request after the admin action (checked on every JWT-authenticated call)
- Audit log entries are queryable from the admin portal; timestamps accurate to the second
- Verify/unverify reflected on the user's profile within 5 seconds on both platforms

---

### Sprint 15 | May 27–Jun 2 — Admin Portal Completion & Feature Parity Verification

**Goal:** Complete admin event moderation tools and confirm cross-platform feature parity before M3.

**Deliverables:**

- Allowed-email CSV upload endpoint: uploaded emails auto-approve matching registrations
- Event moderation queue: admin can approve, decline, or delete pending events
- Feature parity checklist completed for all KF1–KF7 features across both platforms
- All parity gaps either resolved or documented with an owner and an ETA

**Success Criteria:**

- CSV upload of 500 emails processes in under 5 seconds
- Event approval or rejection reflected in the public feed within 5 seconds of admin action
- ≥ 95% of core features functionally consistent across Android and Telegram Mini App (QAS-C)
- Data written on one platform appears on the other within 5 seconds (QAS-C)

---

## M3 — Social & Engagement Features | Jun 2 – Jun 23

*Milestone bullets: Follow Feature · Notification System · User Badges*

---

### Sprint 16 | Jun 3–9 — Follow Feature

**Goal:** Allow alumni to follow each other and surface activity from followed users.

**Deliverables:**

- `POST /profile/follow/{user_id}` and `DELETE /profile/follow/{user_id}` endpoints implemented
- Follower and following counts displayed on the profile screen in both clients
- Activity feed shows events created or joined by followed alumni
- Follow feature fully available on both Android and Telegram Mini App

**Success Criteria:**

- Follow and unfollow persist in the database and reflect on both clients within 5 seconds
- Follower count is consistent across both platforms with no caching drift
- Activity feed shows only events from followed alumni; non-followed alumni events do not appear
- Feature parity confirmed on both platforms before the sprint is closed

---

### Sprint 17 | Jun 10–16 — Notification System

**Goal:** Deliver structured Telegram notifications for event reminders and admin-driven events.

**Deliverables:**

- Telegram reminder sent to all registered attendees 24 hours before event start time
- Notification sent to event creator on admin approval or rejection
- Notification sent on manual account verification status change
- Per-user notification opt-out preferences stored in the database and enforced

**Success Criteria:**

- Event reminder delivered within 10 seconds of the scheduled trigger time (QAS-B)
- Approval/rejection notification received by the creator within 30 seconds of admin action
- Users who opt out of a notification type receive zero messages of that type over a 24-hour check
- Notification dispatch is logged; Grafana alert fires if the delivery failure rate exceeds 1%

---

### Sprint 18 | Jun 17–23 — User Badges

**Goal:** Implement an automatic achievement badge system with at least four badge types.

**Deliverables:**

- Four badge types implemented: Attended 5 Events, Organised an Event, Early Adopter, Verified Alumni
- Badges awarded automatically by the backend when the qualifying condition is met
- Badge data included in the profile API response; rendered on the profile screen in both clients
- Admin can manually grant or revoke any badge from the admin portal

**Success Criteria:**

- All four badge types trigger correctly on their qualifying condition, covered by unit tests
- Badge data arrives in the profile response without a separate API call
- Admin grant and revoke are reflected on the user profile within one page reload
- Badge field is included in the alumni CSV export from the admin portal

---

## M4 — Final Stabilization | Jun 24 – Jul 28

*Milestone bullets: Preparing transition to a different team · Finalizing documentation · Production ready*

---

### Sprint 19 | Jun 24–Jul 7 — Preparing Transition to a Different Team

**Goal:** Stabilise all features and equip the next team to operate the platform independently.

**Deliverables:**

- Full production regression test pass across all features
- Runbook written: deploy from scratch, rollback a release, restore the database, rotate secrets
- Handover README in the infra repo; single-command deploy verified by someone outside the team
- Monitoring alert coverage reviewed and tuned: auth error rate, endpoint P95, disk usage, DB connection count

**Success Criteria:**

- Zero P0 or P1 bugs remain open at the end of the sprint
- A person unfamiliar with the project successfully deploys from scratch following only the runbook
- All four Grafana alert rules trigger correctly in controlled test scenarios
- Daily backup snapshot restores to staging in under 30 minutes

---

### Sprint 20 | Jul 8–28 — Finalizing Documentation & Production Ready

**Goal:** Deliver complete documentation, confirm production readiness, and hand over the platform.

**Deliverables:**

- All docs repo sections complete and passing markdownlint CI (requirements, technical, sprints, QA, architecture)
- Post-project metrics report: events created, alumni registered, uptime percentage, P95 latency over the full project period
- Official handover meeting held with the client and a next-team representative
- All credentials, secrets, and repository access transferred; current team access revoked

**Success Criteria:**

- Every documentation page passes markdownlint CI with zero warnings
- Next-team representative confirms they can operate the platform independently after the handover session
- Production uptime ≥ 99.5% over the final 30-day observation window (QAS-B)
- Client provides written sign-off confirming the platform is production-ready
- Zero credentials or admin access retained by the current team after handover

---

## Summary Table

| Sprint | Dates | Phase | Primary Goal |
|---|---|---|---|
| 1 | Feb 4–10 | M1 | Infrastructure migration planning & team setup |
| 2 | Feb 11–17 | M1 | Server provisioning & Docker Swarm initialisation |
| 3 | Feb 18–24 | M1 | DB migration staging trial & profile spec |
| 4 | Feb 25–Mar 3 | M1 | DB migration live cutover & validation |
| 5 | Mar 4–10 | M1 | CI/CD build pipeline & GHCR image publishing |
| 6 | Mar 11–17 | M1 | CI/CD deployment automation & observability stack |
| 7 | Mar 18–24 | M2 | Post-migration regression testing & verification |
| 8 | Mar 25–31 | M2 | Network security hardening & automated backups |
| 9 | Apr 1–7 | M2 | Fix migration repercussions (CI runner, city filter, donation link) |
| — | Apr 8–21 | — | University spring break |
| 10 | Apr 22–28 | M2 | Fix migration repercussions (password recovery, auth) |
| 11 | Apr 29–May 5 | M2 | Email OTP implementation |
| 12 | May 6–12 | M2 | Telegram OTP & authentication reliability |
| 13 | May 13–19 | Bridge | Alumni location map |
| 14 | May 20–26 | Bridge | Profile improvements & admin moderation |
| 15 | May 27–Jun 2 | Bridge | Admin portal completion & feature parity verification |
| 16 | Jun 3–9 | M3 | Follow feature |
| 17 | Jun 10–16 | M3 | Notification system |
| 18 | Jun 17–23 | M3 | User badges |
| 19 | Jun 24–Jul 7 | M4 | Transition preparation & stabilisation |
| 20 | Jul 8–28 | M4 | Documentation finalisation & production handover |
