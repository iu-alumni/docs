# ALUMAP Sprint Plan — 20 Sprints

**Period:** Feb 4 – Jul 28, 2026 | **Sprint length:** 1 week  
**Team:** Ahmad Helaly · Majed Naser · Roukaya Mohammed · Ghadeer Akleh · Aleksandr Kovalev

> University spring break falls between Sprints 9 and 10 (Apr 8–21) and is not counted as sprint time.

---

## Milestone Overview

| Milestone | Dates | Sprints |
|---|---|---|
| M1 — Infrastructure Migration | Feb 4 – Mar 17 | 1–6 |
| M2 — Platform Stability & Security | Mar 18 – May 12 | 7–12 |
| Bridge | May 13 – Jun 1 | 13–15 |
| M3 — Social & Engagement Features | Jun 2 – Jun 23 | 16–18 |
| M4 — Final Stabilization | Jun 24 – Jul 28 | 19–20 |

---

## M1 — Infrastructure Migration | Feb 4 – Mar 17

---

## Sprint 1 | Feb 4–10 — Infrastructure Migration (Part 1)

**Goal:** Establish the team, document all known platform failures, and initiate server procurement with the IT department.

This sprint, the team conducts the first client meeting to capture the full scope of existing failures: broken password recovery, OTP codes not reaching alumni email addresses, and every new registration requiring manual admin approval. The team requests a university server VM from IT and configures the GitHub Project board as the official task tracker. Each team member is assigned a domain of ownership, and all known issues are logged as tickets with severity labels, forming the backlog that will drive sprint work through M1.

**Tasks:**

- Conduct first client meeting; produce a prioritised backlog of bugs and features
- Request university server access from the IT department; assign team roles and areas of ownership
- Configure GitHub Project board with Sprint 1 tasks and open-bug tickets with severity labels

**Success Criteria:**

- Prioritised backlog of at least 10 items committed to the project board
- IT department has acknowledged the server request in writing
- Each team member has a documented role; GitHub Project board is live with sprint tasks

---

## Sprint 2 | Feb 11–17 — Infrastructure Migration (Part 2)

**Goal:** Provision the university server and initialise the Docker Swarm container environment.

This sprint, the team writes Ansible playbooks to configure the server with Docker, UFW, and required system packages, ensuring the provisioning is idempotent and repeatable for any future server move. Docker Swarm is initialised and the `iu_alumni_network` overlay network created, giving all platform services a shared internal network without exposing them directly to the internet. The team also drafts the initial requirements set — use cases, event data fields, and a prioritised feature list — providing the scope document the client will review at the next meeting.

**Tasks:**

- Write and apply Ansible playbooks for Docker, UFW, and base server configuration; initialise Docker Swarm
- Harden SSH: key-based authentication only, root login disabled
- Draft requirements: use cases, event fields, and prioritised feature list for client review

**Success Criteria:**

- `ansible-playbook` completes with zero task failures; `docker node ls` shows Swarm manager healthy
- SSH key login confirmed; password and root login rejected from the network
- At least 5 use cases and a feature priority list reviewed with the team

---

## Sprint 3 | Feb 18–24 — DB Migration Ready (Part 1)

**Goal:** Validate the full database restore procedure on a staging environment before any production change.

This sprint, the team takes a `pg_dump` from the Yandex Cloud production server and executes a full `pg_restore` on the university staging instance, then verifies the result with a row-count comparison per table and a spot-check on a 5% sample of alumni records. This rehearsal establishes the exact commands, timing, and failure criteria the team will use during the live cutover, reducing the risk of data loss identified in R-02. The team also finalises the user profile specification — graduation year labels, `show_location` toggle, badge placeholder — with the client, so data model decisions are locked before any application code is migrated.

**Tasks:**

- Execute `pg_dump` from source server; store securely off-host; run `pg_restore` on staging and validate row counts
- Perform field-level spot check on a 5% sample of alumni records for data integrity
- Finalise user profile spec with client (graduation year, `show_location` toggle, badge placeholder)

**Success Criteria:**

- Staging restore completes with zero FK violations and 100% row-count match per table
- Spot check confirms zero data corruption or truncation on sampled records
- Profile spec signed off by client and committed to the docs repository

---

## Sprint 4 | Feb 25–Mar 3 — DB Migration Ready (Part 2)

**Goal:** Execute the live database migration from the old server to the university server.

This sprint, the team performs the live cutover: a production `pg_dump` is taken, securely transferred to the university server, and restored into the live PostgreSQL 16 instance, followed by additive Alembic migrations on top of the restored schema. Immediately after restore, the team runs the same row-count and FK constraint validation procedure established in Sprint 3 to confirm zero data loss before any traffic is re-routed. A full rollback dry-run — wiping the target database and re-restoring from backup — is executed in a controlled test to confirm the team can recover within 30 minutes if the live cutover were to fail.

**Tasks:**

- Execute production `pg_dump` → secure transfer → `pg_restore` on the university server with row-count validation
- Apply all pending Alembic migrations; verify `alembic current` matches expected revision
- Execute rollback dry-run: wipe and re-restore from backup, confirm recovery in under 30 minutes

**Success Criteria:**

- 100% row-count match per table and zero FK violations confirmed post-restore
- `alembic current` matches expected head revision with no conflicts
- Rollback dry-run completes successfully in under 30 minutes

---

## Sprint 5 | Mar 4–10 — CI/CD Pipeline Implemented (Part 1)

**Goal:** Automate Docker image builds and publish them to GHCR on every push to `develop`.

This sprint, the team writes the GitHub Actions CI workflow that lints, builds, and pushes Docker images tagged with the commit SHA to GHCR, replacing the previous team's manual build process entirely. Docker Swarm stack files for all services are committed to the infra repository, making every deployment configuration tracked in version control. The team also fixes the event image response format — a regression introduced during migration where the backend was returning raw image bytes instead of URLs — which was causing event photos to fail to load on both the Android app and the Telegram Mini App.

**Tasks:**

- Write GitHub Actions CI workflow: lint → build → tag with commit SHA → push to GHCR
- Commit Docker Swarm stack files for all services to the infra repository
- Fix event image backend response: serve images as URLs, not raw bytes; verify on both clients

**Success Criteria:**

- Push to `develop` triggers CI; image built, tagged, and pushed to GHCR within 5 minutes
- All service stack files tracked in version control; `docker stack deploy` executes from them without manual edits
- Event images load correctly on both Android and Telegram Mini App

---

## Sprint 6 | Mar 11–17 — CI/CD Pipeline Implemented (Part 2)

**Goal:** Automate production deployment and stand up the Prometheus and Grafana monitoring stack.

This sprint, the team closes the CI/CD loop by adding a CD stage that SSH-deploys to the university server via `appleboy/ssh-action` on every push to `main`, making the pipeline fully end-to-end with zero manual steps. Prometheus, Grafana, Node Exporter, and Postgres Exporter are deployed into the Swarm alongside the platform services, and four dashboards are provisioned to provide continuous visibility into service health. DNS is updated to the final production domain and all services are confirmed reachable, completing M1.

**Tasks:**

- Add CD stage to GitHub Actions: SSH into the university server and run `docker stack deploy` on push to `main`
- Deploy Prometheus, Grafana, Node Exporter, and Postgres Exporter into the Swarm; provision four dashboards with at least one alert
- Update DNS to production domain; verify all service health endpoints return 200

**Success Criteria:**

- Push to `main` results in a running updated container on the server with zero manual steps
- Prometheus scrapes all four targets at a 15-second interval; Grafana accessible at `grafana.{DOMAIN}`
- All service health endpoints return 200 within 60 seconds of `docker stack deploy`

---

## M2 — Platform Stability & Security | Mar 18 – May 12

---

## Sprint 7 | Mar 18–24 — Platform Stability & Security (Part 1)

**Goal:** Verify all platform features on the university server and formally decommission the old Yandex Cloud server.

This sprint, the team runs a full manual regression sweep across authentication, events, profiles, and the map on the new server, assigning P0/P1/P2 severity to every discovered issue. Several regressions surface from the migration — the CI runner not picking up jobs, city-based filtering returning wrong results, and the Flutter app still pointing to the old backend URL — and these are all prioritised as P1 or P0. The Yandex Cloud server is shut down with client approval at the end of the sprint, and a post-mortem is committed to the docs repository documenting the migration timeline, root causes of discovered issues, and preventive measures.

**Tasks:**

- Execute a full manual regression test across all features (auth, events, profiles, map); assign severity to every issue
- Shut down the Yandex Cloud server with client approval; confirm zero traffic is still routed to it
- Write and commit a migration post-mortem (root cause, timeline, preventive measures) to the docs repository

**Success Criteria:**

- Every core feature passes a smoke test on the university server; all failures have a filed ticket with severity
- Zero P0 bugs remain open at end of sprint
- Old server is fully decommissioned and the post-mortem is merged into docs

---

## Sprint 8 | Mar 25–31 — Platform Stability & Security (Part 2)

**Goal:** Harden the server security perimeter and automate TLS renewal and database backups.

This sprint, the team configures UFW to allow only ports 22, 80, and 443, and deploys Fail2ban to block IPs after 5 failed SSH attempts — protecting the publicly reachable server from brute-force attacks. Certbot is deployed as a sidecar container set to renew Let's Encrypt certificates every 12 hours automatically, eliminating the risk of a certificate expiry causing a full service outage. A tiered PostgreSQL backup container is deployed that takes daily, weekly, and monthly snapshots and stores them off-host, directly addressing the data-loss risk R-02 with a recoverable backup chain.

**Tasks:**

- Configure UFW (allow 22/80/443 only) and deploy Fail2ban (5 failed attempts → 3600-second IP block)
- Deploy Certbot sidecar for automatic TLS certificate renewal every 12 hours
- Deploy tiered PostgreSQL backup container (7 daily, 4 weekly, 6 monthly snapshots) with off-host storage

**Success Criteria:**

- Port scan confirms no unexpected open ports; Fail2ban test blocks a probing IP within seconds
- Certbot renews a test certificate without manual intervention; no certificate expiry alert triggered
- Daily backup snapshot created; restore from backup to staging completes in under 30 minutes

---

## Sprint 9 | Apr 1–7 — Fixing Migration-related Repercussions (Part 1)

**Goal:** Resolve the CI pipeline failures and the highest-impact client-facing regressions caused by the migration.

This sprint, the team diagnoses and fixes the GitHub Actions runner not picking up jobs — a blocker that has prevented all automated testing and forced manual deployments since the server move. The city-based user listing endpoint is fixed to return correct results, and the donation link is added to the event detail screen on both clients per the client's Sprint 4 request. A downtime incident report is written and committed, documenting the root cause and prevention plan for any future team that inherits the platform.

**Tasks:**

- Diagnose and fix the GitHub Actions runner not picking up jobs; verify automated pipeline end-to-end
- Fix city-based user listing endpoint (`GET /profile/users?city=X`) to return correct results
- Add donation link to the event detail screen on both Android and Telegram Mini App; commit incident report

**Success Criteria:**

- CI pipeline triggers and completes successfully on push to both `develop` and `main`
- City filter returns correct alumni for at least 3 different city values verified against test data
- Donation link renders and opens correctly in an external browser on both clients

---

> **University spring break: Apr 8–21 — no sprint**

---

## Sprint 10 | Apr 22–28 — Fixing Migration-related Repercussions (Part 2)

**Goal:** Close all remaining migration regressions and restore password recovery as a working feature.

This sprint, the team delivers working end-to-end password recovery — broken since before the project started, flagged in the first client meeting on Feb 4, and still unresolved at the mentor meeting on Apr 28. All remaining P0 and P1 regression tickets are closed before the sprint ends, giving the team a clean backlog going into OTP work. A Prometheus alert is also configured and validated in a controlled test: killing any service container should trigger a notification within 15 seconds, confirming that the monitoring stack will detect real production failures and not just report metrics during normal operation.

**Tasks:**

- Implement end-to-end password recovery: email link → reset form → new password accepted on login
- Configure and validate Prometheus alert: service endpoint down for more than 15 seconds fires a notification
- Close all remaining P0 and P1 migration regression tickets; confirm with client that the platform feels stable

**Success Criteria:**

- Password reset email received within 30 seconds; link expires after 1 hour; new password accepted on login
- Kill-container test fires the Prometheus alert; service recovers within Docker Swarm restart window (< 30 s)
- Zero P0 or P1 migration regression tickets remain in the backlog

---

## Sprint 11 | Apr 29–May 5 — OTP Implementation (Part 1)

**Goal:** Implement email-based one-time password as a second authentication factor.

This sprint, the team builds the two-phase email OTP login protocol: `POST /auth/login` returns a session token and an `otp_required` flag, and only after the 6-digit code is validated via `POST /auth/login-otp` does the server issue a JWT. Gmail SMTP is integrated to deliver OTP codes to alumni email addresses, and all codes are enforced as single-use with a 10-minute expiry — preventing a leaked session token or code from remaining valid indefinitely. This completes the first half of FR3 and directly addresses the OTP reliability issues reported in client meetings by alumni attempting to register.

**Tasks:**

- Implement two-phase OTP protocol: `/auth/login` → session token; `/auth/login-otp` → JWT on valid code
- Integrate Gmail SMTP for OTP delivery; enforce 10-minute expiry and single-use on all codes
- Verify email OTP login end-to-end on both Android and Telegram Mini App

**Success Criteria:**

- Email OTP delivered within 30 seconds (P95) under normal load
- Expired or already-used codes return a structured 401; fresh valid codes succeed on first use
- OTP login works end-to-end on both Android and Telegram Mini App without client changes

---

## Sprint 12 | May 6–12 — OTP Implementation (Part 2)

**Goal:** Implement Telegram OTP and add authentication reliability monitoring to close M2.

This sprint, the team extends the Telegram bot — already running as a background task in the backend process — to deliver 6-digit login codes on request, completing the third authentication path alongside password and email OTP. A synthetic login probe cron job is deployed that tests all three auth paths every minute and fires a Prometheus alert if any path fails, providing continuous, measurable evidence against the QAS-B reliability target. All three authentication paths converge on a single `create_access_token()` call, ensuring consistent JWT properties across all login methods.

**Tasks:**

- Implement Telegram OTP bot handler; verify all three auth paths converge on `create_access_token()`
- Deploy synthetic login probe cron job: test each auth path every minute; alert on any failure
- Configure Prometheus alert: login error rate above 0.1% over 5 minutes → Telegram notification to admin

**Success Criteria:**

- Telegram OTP delivered within 10 seconds (P95)
- ≥ 99.9% login success rate for valid credentials over a 24-hour observation window
- Synthetic probe reports zero failures over 24 consecutive hours; chaos test (kill PostgreSQL) returns a structured 503

---

## Bridge | May 13 – Jun 1

---

## Sprint 13 | May 13–19 — Alumni Location Map

**Goal:** Deliver the opt-in alumni location map with server-side city-level aggregation.

This sprint, the team implements `GET /profile/map` returning city-level pins `[{city, lat, lon, count}]` for all alumni who have set `show_location = true`, with a composite database index on `(show_location, location)` to keep the query fast as the alumni directory grows. The `show_location` privacy toggle is added to the profile settings screen on both clients, giving alumni explicit opt-in control over whether they appear on the map. The map is rendered with pins, pan, and zoom on both Android and Telegram Mini App, meeting the QAS-F requirement of a full map load in under 3 seconds.

**Tasks:**

- Implement `GET /profile/map` with city aggregation; add Alembic migration for the composite DB index
- Add `show_location` toggle to profile settings on both Android and Telegram Mini App
- Render the interactive map (pins, pan, zoom) on both clients; performance-test to QAS-F threshold

**Success Criteria:**

- Map loads in under 3 seconds with 50–500 alumni in the database; pan and zoom respond in under 1 second
- Alumni with `show_location = false` are absent from the map endpoint response
- All aggregation is server-side; zero client-side geocoding calls

---

## Sprint 14 | May 20–26 — Profile Improvements & Admin Moderation

**Goal:** Add graduation-year labels to profiles and deliver admin ban and verify controls with an audit log.

This sprint, the team includes graduation year in the profile API response and displays it on profile cards in both clients, closing a client request from Sprint 1. Admin ban/unban and verify/unverify actions are implemented in the admin portal, with immediate enforcement: a banned user receives a 403 on all subsequent authenticated requests without needing to be logged out manually. Every moderation action is recorded in an audit table with timestamp and admin email, giving the Alumni Office a full trail of all membership decisions — a prerequisite before social features like follow and badges can be safely shipped.

**Tasks:**

- Add graduation year to the profile API response; display it on profile cards in both clients
- Implement admin ban/unban and verify/unverify in the admin portal; enforce ban on all authenticated endpoints immediately
- Log every moderation action with timestamp and admin email in a dedicated audit table; expose it as queryable in the admin portal

**Success Criteria:**

- Graduation year visible on profile cards without an extra API call
- Ban enforced within one request after the admin action; verified status reflected on the profile within 5 seconds
- Audit log entries queryable from the admin portal with accurate timestamps

---

## Sprint 15 | May 27–Jun 2 — Feature Parity & Admin Event Moderation

**Goal:** Confirm cross-platform feature parity and complete admin event controls before M3 begins.

This sprint, the team implements the admin event moderation queue — approve, decline, and delete pending events — ensuring alumni cannot see events before an admin has reviewed them. An allowed-email CSV upload is delivered that auto-approves registrations matching uploaded addresses, addressing FR17 (bulk CSV import) and removing the need for manual per-registration review by the Alumni Office. A full feature parity checklist is completed for all core features across Android and Telegram Mini App, and any gap above 5% is resolved before M3 begins, since parity gaps are far cheaper to fix before social features are layered on top.

**Tasks:**

- Implement admin event moderation queue: approve, decline, and delete pending events
- Implement allowed-email CSV upload (FR17): auto-approve registrations matching uploaded addresses
- Complete a feature parity checklist for all core features across Android and Telegram Mini App; resolve any identified gaps

**Success Criteria:**

- Event approval or rejection reflected in the public feed within 5 seconds of admin action
- CSV upload of 500 emails processes in under 5 seconds; matching registrations auto-approved
- ≥ 95% of core features functionally consistent across both platforms; data written on one platform visible on the other within 5 seconds

---

## M3 — Social & Engagement Features | Jun 2 – Jun 23

---

## Sprint 16 | Jun 3–9 — Follow Feature

**Goal:** Allow alumni to follow each other and surface activity from followed users in a personalised feed.

This sprint, the team implements `POST /profile/follow/{user_id}` and `DELETE /profile/follow/{user_id}`, stores the relationship in a follows table, and displays follower and following counts on profile screens in both clients. An activity feed is built that shows events created or joined by followed alumni, giving users a lightweight personalised view of platform activity without requiring a full social graph. The feature is kept intentionally scoped to events — not status posts or comments — to stay within the team's size constraint (BC1) while delivering the core alumni-discovery value the client described in Sprint 2.

**Tasks:**

- Implement follow/unfollow API endpoints and persist the relationship in a follows table
- Display follower and following counts on profile screens in both Android and Telegram Mini App
- Build an activity feed showing events created or joined by followed alumni; verify parity on both platforms

**Success Criteria:**

- Follow and unfollow persist in the database and are reflected on both clients within 5 seconds
- Follower count is consistent across both platforms
- Activity feed shows only events from followed alumni; data is consistent across both platforms

---

## Sprint 17 | Jun 10–16 — Notification System

**Goal:** Deliver Telegram notifications for event reminders and admin-driven status changes.

This sprint, the team extends the existing Telegram bot to send a reminder to all registered attendees 24 hours before each event starts, notifies event creators when an admin approves or rejects their event, and notifies alumni when their verification status changes. Per-user opt-out preferences are stored and enforced on every notification dispatch — alumni who have not linked their Telegram account or who have opted out must receive no messages regardless of what triggered the notification. All notification delivery events are logged and a Grafana alert is configured to fire if the delivery failure rate exceeds 1%.

**Tasks:**

- Implement event reminder scheduler: send Telegram message to all attendees 24 hours before event start
- Send admin approval/rejection and verification-change notifications to affected alumni; enforce per-user opt-out
- Log all notification dispatch events; configure Grafana alert for delivery failure rate above 1%

**Success Criteria:**

- Event reminder delivered within 10 seconds of the scheduled trigger time
- Opted-out users receive zero messages of the opted-out type over a 24-hour observation window
- Grafana alert fires correctly in a controlled delivery-failure test

---

## Sprint 18 | Jun 17–23 — User Badges

**Goal:** Implement an automatic achievement badge system with at least four badge types.

This sprint, the team implements four badge types — Attended 5 Events, Organised an Event, Early Adopter, and Verified Alumni — each awarded automatically when the qualifying condition is met by any alumni in the system. Badge data is included directly in the profile API response without a separate call, keeping the profile screen within the QAS-A P95 target. An admin portal interface allows administrators to manually grant or revoke any badge, and badge fields are included in the alumni CSV export so the Alumni Office can track engagement in external reporting.

**Tasks:**

- Implement four badge types with automatic awarding on qualifying condition; cover all award triggers with unit tests
- Include badge data in the profile API response without a separate API call; render badges on the profile screen in both clients
- Add admin grant/revoke interface to the admin portal; include badge fields in the alumni CSV export

**Success Criteria:**

- All four badge types trigger correctly on their qualifying condition, covered by passing unit tests
- Badge data arrives in the profile response without a separate API call; renders correctly on both platforms
- Admin grant and revoke are reflected on the profile within one page reload; badge field present in CSV export

---

## M4 — Final Stabilization | Jun 24 – Jul 28

---

## Sprint 19 | Jun 24–Jul 7 — Preparing Transition to a Different Team

**Goal:** Equip the next team to operate and extend the platform independently, without relying on current team members.

This sprint, the team writes a handover runbook covering the four critical operations any on-call engineer must be able to execute: deploy from scratch, rollback a release, restore the database, and rotate secrets. The runbook is validated by having someone outside the current team perform a full deploy from scratch using only the document — if they succeed without asking questions, the runbook is sufficient. All Prometheus alert rules are reviewed and tuned against real failure scenarios, and a full production regression test is run to confirm zero P0 or P1 bugs are handed over.

**Tasks:**

- Write a handover runbook covering: deploy from scratch, rollback a release, restore the database, rotate secrets
- Validate the runbook with a dry-run performed by someone outside the current team; fix any gaps found
- Audit and tune all Prometheus alert rules; run full production regression test and close all P0/P1 bugs

**Success Criteria:**

- A person unfamiliar with the project deploys from scratch following only the runbook without asking for help
- All four alert rule categories (auth error rate, endpoint P95, disk, DB connections) fire correctly in controlled tests
- Zero P0 or P1 bugs open at the end of the sprint; daily backup restores to staging in under 30 minutes

---

## Sprint 20 | Jul 8–28 — Finalizing Documentation & Production Ready

**Goal:** Deliver complete documentation, hold the official handover meeting, and obtain client sign-off.

This sprint, the team completes all sections of the docs repository — requirements, technical overview, sprint records, QA reports, and architecture — and ensures every page passes markdownlint CI with zero warnings. A post-project metrics report is written covering events created, alumni registered, uptime percentage, and P95 latency trends over the full project period, giving the client concrete evidence of platform health rather than a verbal assurance. The handover meeting is held with the client and a next-team representative present; all credentials, secrets, and repository access are transferred and current team access is fully revoked, making the transition final.

**Tasks:**

- Complete all docs repo sections (requirements, technical, sprints, QA, architecture); pass markdownlint CI with zero warnings
- Write a post-project metrics report (events, registrations, uptime, P95 latency over the full project period)
- Hold the official handover meeting; transfer all credentials, secrets, and repository access; revoke current team access

**Success Criteria:**

- Every documentation page passes markdownlint CI with zero warnings
- Next-team representative confirms they can operate the platform independently after the handover session
- Production uptime ≥ 99.5% over the final 30-day observation window; client provides written sign-off
- Zero credentials or admin access retained by the current team after handover

---

## Summary

| Sprint | Dates | Milestone | Goal |
|---|---|---|---|
| 1 | Feb 4–10 | M1 | Infrastructure Migration (Part 1) |
| 2 | Feb 11–17 | M1 | Infrastructure Migration (Part 2) |
| 3 | Feb 18–24 | M1 | DB Migration Ready (Part 1) |
| 4 | Feb 25–Mar 3 | M1 | DB Migration Ready (Part 2) |
| 5 | Mar 4–10 | M1 | CI/CD Pipeline Implemented (Part 1) |
| 6 | Mar 11–17 | M1 | CI/CD Pipeline Implemented (Part 2) |
| 7 | Mar 18–24 | M2 | Platform Stability & Security (Part 1) |
| 8 | Mar 25–31 | M2 | Platform Stability & Security (Part 2) |
| 9 | Apr 1–7 | M2 | Fixing Migration-related Repercussions (Part 1) |
| — | Apr 8–21 | — | University spring break |
| 10 | Apr 22–28 | M2 | Fixing Migration-related Repercussions (Part 2) |
| 11 | Apr 29–May 5 | M2 | OTP Implementation (Part 1) |
| 12 | May 6–12 | M2 | OTP Implementation (Part 2) |
| 13 | May 13–19 | Bridge | Alumni Location Map |
| 14 | May 20–26 | Bridge | Profile Improvements & Admin Moderation |
| 15 | May 27–Jun 2 | Bridge | Feature Parity & Admin Event Moderation |
| 16 | Jun 3–9 | M3 | Follow Feature |
| 17 | Jun 10–16 | M3 | Notification System |
| 18 | Jun 17–23 | M3 | User Badges |
| 19 | Jun 24–Jul 7 | M4 | Preparing Transition to a Different Team |
| 20 | Jul 8–28 | M4 | Finalizing Documentation & Production Ready |
