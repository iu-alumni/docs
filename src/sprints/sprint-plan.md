# ALUMAP — Full Project Sprint Plan (Sprints 1–20)

**Period:** Feb 4, 2026 – Jul 28, 2026  
**Team:** Ahmad Helaly, Majed Naser, Roukaya Mohammed, Ghadeer Akleh, Aleksandr Kovalev

Sprints 1–11 are reconstructed from meeting notes and retrospectives.  
Sprints 12–20 are planned forward from the milestone roadmap.

---

## Milestone Map

| Milestone | Dates | Primary Deliverable |
|---|---|---|
| M1 — Infrastructure Migration | Feb 4 – Mar 17 | Platform running on university server |
| M2 — Platform Stability & Security | Mar 18 – May 12 | Stable, secure, fully authenticated platform |
| M3 — Social & Engagement Features | Jun 2 – Jun 23 | Follow, Notifications, Badges |
| M4 — Final Stabilization | Jun 24 – Jul 28 | Handover-ready, production-validated system |

---

## Sprint 1 — Feb 4–10 | Project Kickoff & Requirements Gathering

**Primary goal:** Establish project scope, team structure, and access to existing codebase.

### Tasks

- Conduct first client meeting; document main goal (increase user numbers) and user roles
- Identify current technical issues (broken password recovery, OTP not sending, login requires admin)
- Contact university IT department about server migration
- Request access to previous team's repositories
- Set up GitHub Project board and assign team roles

### Success Criteria

- Feature list drafted and shared with client for review
- GitHub Project board live with at least all known issues logged
- Email sent to IT department and previous team requesting access
- Team roles formally assigned (lead, backend, frontend, mobile, infra)

---

## Sprint 2 — Feb 11–17 | Migration Planning & Requirements Documentation

**Primary goal:** Unblock migration and produce formal requirements documentation.

### Tasks

- Resolve SSH access blocker (escalate to mentor/client, explore VPN, delegate to IT)
- Draft use case diagrams and document event types with required fields
- Define success metrics with specific numerical thresholds
- Document inherited requirements from previous team
- Investigate fresh-start vs. existing codebase trade-off

### Success Criteria

- IT department response received and SSH path confirmed or alternative agreed
- Use cases documented for: auth, event creation, profile management, map, moderation
- Success metrics defined (e.g., ≥ 10 events, ≥ 3 unique attendees per event)
- Decision on codebase approach (migrate vs. rewrite) documented with rationale

---

## Sprint 3 — Feb 18–24 | Profile & Event Spec + Server Provisioning

**Primary goal:** Define detailed profile and event requirements; begin server provisioning.

### Tasks

- Conduct client meeting; clarify profile structure (graduation year, badges, privacy toggle)
- Define event fields: title, description, location, date/time, cost, cover image, creator Telegram alias
- Clarify user validation process (Digital Profile check) and impersonation risk
- Begin provisioning university VM with Ansible playbooks
- Document waiting-list and engagement metric requirements

### Success Criteria

- Profile spec complete: graduation year, biography, city/country, Telegram alias, avatar, `show_location` toggle
- Event spec complete: all required fields documented including cost and contact info
- University VM accessible via SSH and base OS configured
- User validation flow documented including known impersonation risk

---

## Sprint 4 — Feb 25–Mar 3 | CI/CD Pipeline Implementation

**Primary goal:** Automate deployment end-to-end so every future migration step is scripted and repeatable.

### Tasks

- Implement GitHub Actions CI workflow (lint + tests on PR)
- Implement GitHub Actions CD workflow (build Docker image → push to GHCR → SSH deploy)
- Configure Docker Swarm on university VM with overlay network `iu_alumni_network`
- Set all services to `restart_policy: condition: any`
- Conduct staging dry run of deployment pipeline

### Success Criteria

- CI: every PR runs lint and tests automatically; failing PRs are blocked from merge
- CD: a push to `develop` automatically builds, tags (`ghcr.io/…:{SHA}`), and deploys
- Docker Swarm stack running with all services reachable by container name
- Staging dry run completed with documented step-by-step timings

---

## Sprint 5 — Mar 4–10 | DB Migration Ready

**Primary goal:** Produce a validated, restorable PostgreSQL backup and confirm data integrity pipeline.

### Tasks

- Execute `pg_dump` on Yandex Cloud source database
- Restore to university server via `pg_restore`; compare row counts per table
- Run field-level sampling script on 5% of alumni records (email, graduation_year, is_verified)
- Validate all FK constraints via `pg_catalog` queries post-restore
- Document rollback gate procedure (`scripts/restore-db.sh`)

### Success Criteria

- 100% row-count match across all tables
- Zero FK violations post-restore
- 5% alumni field-level sample passes with no discrepancies
- Rollback procedure rehearsed on staging and documented
- `pg_dump` → `pg_restore` round-trip takes < 30 minutes (bounds live window)

---

## Sprint 6 — Mar 11–17 | Infrastructure Migration — Live Cutover

**Primary goal:** Complete the live migration from Yandex Cloud to the university server with ≤ 1 hour downtime.

### Tasks

- Execute scripted cutover using `deploy.sh` + Ansible playbook
- Run automated health checks (`curl` against all endpoints) before DNS switch
- Update DNS records; monitor propagation via Grafana + Prometheus alerts
- Decommission Yandex Cloud services after new server verified
- Write post-migration incident report

### Success Criteria

- Cumulative downtime ≤ 1 hour; no single service interruption > 15 minutes
- All health checks pass before DNS switch; DNS updated only after checks are green
- Prometheus alerts confirm all endpoints reachable within 15 s of coming up
- Post-migration report written documenting actual vs. planned timings
- Previous team's servers shut down (or handover email sent)

---

## Sprint 7 — Mar 18–24 | Fixing Migration-Related Repercussions

**Primary goal:** Restore full pre-migration feature functionality on the new server.

### Tasks

- Fix GitHub Actions runner not picking up jobs post-migration
- Fix event images still pointing to old backend URL
- Restore password recovery link functionality
- Fix user listing broken for specific city filter
- Update all application version references to new backend base URL
- Verify Telegram bot long-polling reconnects after server restart

### Success Criteria

- GitHub Actions CI/CD pipeline executes successfully end-to-end on new server
- Event images load from new GHCR-backed URLs in all clients
- Password recovery email arrives within 30 s and link is valid for ≥ 1 hour
- City-filtered user list returns correct results
- Zero P1 bugs from migration-related breakage remaining open at sprint end

---

## Sprint 8 — Mar 25–31 | Platform Stability & Security — Phase 1

**Primary goal:** Stabilise the platform under real user traffic; harden network perimeter.

### Tasks

- Configure UFW: allow only ports 22, 80, 443
- Install and configure Fail2ban: block IPs after 5 failed SSH attempts for 3 600 s
- Configure Let's Encrypt + Certbot sidecar (auto-renew every 12 hours)
- Deploy Prometheus + Grafana monitoring stack; create alert on error rate > 0.1% per 5-min window
- Set up Node Exporter and Postgres Exporter; provision four Grafana dashboards

### Success Criteria

- UFW rules active; `nmap` scan from external host shows only ports 22, 80, 443 open
- Fail2ban bans a test IP after 5 failed SSH attempts; ban releases after 3 600 s
- HTTPS working on all subdomains with valid Let's Encrypt certificate
- Grafana alert fires within 15 s of a test endpoint going down
- All four dashboards showing live data (backend latency, host metrics, DB metrics, error rates)

---

## Sprint 9 — Apr 1–14 | OTP Implementation — Email OTP

**Primary goal:** Implement the email-based OTP second-factor authentication flow end-to-end.

### Tasks

- Implement `POST /auth/login` returning `{session_token, otp_required: true}` after password verification
- Implement `POST /auth/login-otp` consuming session token + 6-digit code → JWT
- Generate and store OTP codes in `login_codes` table with 10-minute expiry
- Integrate Gmail SMTP via `EmailService` to deliver OTP codes
- Implement `POST /auth/password-recovery` email token flow
- Update Flutter (Android + Web) and Nuxt 3 clients for new two-step login UI

### Success Criteria

- Email OTP delivered ≤ 30 s (measured over 100 real sends)
- OTP codes expire correctly: codes older than 10 min rejected with 401
- Session tokens cannot be reused after OTP confirmed (`used=true`)
- Password recovery email arrives and link is valid; tested on both clients
- P95 login latency ≤ 2 s under 50 concurrent users (Locust test)

---

## Sprint 10 — Apr 15–28 | OTP Implementation — Telegram OTP + Auth Reliability

**Primary goal:** Implement Telegram OTP login and validate authentication reliability targets.

### Tasks

- Implement Telegram OTP: send 6-digit code to linked Telegram account via bot long-polling
- Ensure all three auth paths (password, email OTP, Telegram OTP) converge on `create_access_token()`
- Set up synthetic login probe: cron job tests login every 1 minute; failures alert admin Telegram chat
- Implement `is_banned` check on every authenticated request
- Run chaos test: kill PostgreSQL container during login; verify 503 response and recovery < 30 s
- Batch-analyse 100 OTP delivery timestamps; confirm P95 ≤ 30 s email, ≤ 10 s Telegram

### Success Criteria

- Telegram OTP delivered ≤ 10 s in P95 measured over ≥ 50 test sends
- Login success rate ≥ 99.9% over 1-week Prometheus window (all three auth methods combined)
- Synthetic login probe running continuously; Telegram alert fires within 2 min of auth failure
- Banned accounts blocked on every request (verified by integration test)
- Chaos test: backend returns structured 503 (not crash); recovers within 30 s (Swarm restart)

---

## Sprint 11 — Apr 29–May 5 | Admin Portal & Event Moderation

**Primary goal:** Give the Alumni Office a fully functional moderation workflow in the admin portal.

### Tasks

- Implement event approval queue: admins approve / decline / delete pending events
- Implement global auto-approve toggle for events
- Implement ban / unban and verify / unverify alumni in admin portal
- Implement allowed-email list upload for auto-approval of registrations
- Improve admin portal performance: bulk search, filter, and export of alumni records
- Gather client feedback; address complaint that progress is too slow

### Success Criteria

- Admin can approve and decline events from a single queue view; status changes reflected in feed ≤ 5 s
- Auto-approve toggle persists across server restarts and takes effect immediately
- Ban/unban and verify/unverify actions reflected on next authenticated request (no cache stale state)
- Email allowlist CSV upload processes ≥ 1 000 rows without timeout
- Client acknowledges in next meeting that event and moderation workflows are functional

---

## Sprint 12 — May 6–12 | Profile Improvements & Pre-Feature Polish

**Primary goal:** Deliver the user profile redesign and close all known P1/P2 bugs before the feature phase.

### Tasks

- Add graduation year label to alumni profiles (sourced from registration field)
- Implement `show_location` privacy toggle: excluded alumni not shown on map or user list
- Implement profile page with biography, city/country, Telegram alias, and avatar upload
- Set up tiered PostgreSQL backups: daily (7-day retention), weekly (4-week), monthly (6-month)
- Run full Locust load test (50 concurrent users); confirm P95 ≤ 2 s on all critical paths
- Close all P1 and P2 bugs; document any accepted P3 deferrals

### Success Criteria

- Graduation year visible on alumni profiles and filterable in admin alumni list
- `show_location=false` alumni absent from map pins and public user lists
- Avatar upload, bio edit, and profile view working on both Android and Telegram Mini App
- Tiered backups verified: `pg_dump` files present in backup volume for all three tiers
- Locust P95 ≤ 2 s; inter-platform variance ≤ 500 ms (Android vs. Flutter Web)
- Zero P1 bugs open at sprint end

---

## Sprint 13 — May 13–19 | Alumni Location Map

**Primary goal:** Implement the live alumni location map with privacy-respecting aggregated city pins.

### Tasks

- Load city coordinates lookup table into PostgreSQL
- Implement `GET /profile/map` aggregating alumni by city (only `show_location=true`)
- Add composite index on `(show_location, location)` for map query performance
- Implement Flutter map widget (flutter_map) rendering city pins with alumni counts
- Connect map to backend; verify single JSON response (no client-side geocoding)
- Test map with 50–500 alumni records; measure initial load and pan/zoom latency

### Success Criteria

- Map initial load ≤ 3 s under normal network conditions (4G / Wi-Fi)
- Pan/zoom interactions ≤ 1 s
- Alumni with `show_location=false` are completely absent from map pins (verified by test)
- Map endpoint returns single JSON; no additional geocoding requests from client
- Map feature functionally identical on Android APK and Telegram Mini App

---

## Sprint 14 — May 20–26 | Event Management Enhancements & Telegram Reminders

**Primary goal:** Complete the full event lifecycle including cover images, cost field, and automatic Telegram event reminders.

### Tasks

- Add cost field and cover image upload to event creation form
- Implement automatic Telegram reminder sent to event participants before event date
- Add creator Telegram alias to event display
- Implement event registration (join/leave) with capacity tracking and waiting-list support
- Implement donation link field on event creation (prefilled amount; host sees donator info)
- Verify all event fields available and consistent across Android and Telegram Mini App

### Success Criteria

- ≥ 99.5% of valid event submissions persisted and visible in feed within 10 s
- Telegram reminder delivered to all registered participants; delivery ≤ 30 s
- Cover images render correctly on both platforms from GHCR-backed URLs
- Waiting-list correctly queues users when capacity is reached
- Donation link redirects correctly; host can see donator information in admin view
- Feature parity confirmed: all event fields visible on both Android and Telegram Mini App

---

## Sprint 15 — May 27–Jun 2 | Admin Portal Polish & Pre-Social-Feature Hardening

**Primary goal:** Finalise admin portal capabilities and ensure system is stable before the Social & Engagement phase.

### Tasks

- Add full audit trail to admin actions (ban, verify, approve event) with timestamp and actor
- Implement admin analytics dashboard view (event count, attendance, active users)
- Run cursor-based pagination on all remaining list endpoints not yet migrated
- Add GIN trigram indexes to support alumni full-text search in admin portal
- Execute full regression test across all features on both Android and Telegram Mini App
- Confirm Prometheus P95 tracking is live and within targets across all endpoints

### Success Criteria

- Every admin action (ban, verify, approve) logged with timestamp, actor email, and target
- Admin dashboard shows event count, total alumni, and active-user metrics updated daily
- All list endpoints use cursor-based pagination; `EXPLAIN ANALYZE` shows no sequential scans on indexed tables
- Alumni full-text search returns results in ≤ 500 ms for up to 5 000 records
- Zero regressions found in regression test run; all QAS-A targets met on latest Grafana data

---

## Sprint 16 — Jun 3–9 | Follow Feature

**Primary goal:** Allow alumni to follow each other and surface followed alumni activity.

### Tasks

- Implement `POST /profile/{id}/follow` and `DELETE /profile/{id}/follow` endpoints
- Store follow relationships in `alumni_follows` table with index on `(follower_id, followee_id)`
- Display follower/following counts on alumni profiles
- Implement "following feed": list of recent events created or joined by followed alumni
- Notify (Telegram) when a followed alumnus creates a new event
- Update Flutter and Nuxt 3 clients to show follow button and counts

### Success Criteria

- Follow/unfollow reflected on both clients with no page reload required
- Follower and following counts accurate within 1 s of action (no stale cache)
- Following feed shows events from followed alumni sorted by recency; latency ≤ 2 s P95
- Telegram notification delivered ≤ 10 s when followed alumnus creates event
- Feature parity: follow functionality identical on Android and Telegram Mini App

---

## Sprint 17 — Jun 10–16 | Notification System

**Primary goal:** Build a unified notification system covering all platform events via Telegram and email.

### Tasks

- Implement notification dispatch service routing to Telegram bot or Gmail SMTP based on user preference
- Define notification triggers: event approved, event reminder (24 h before), new follower, badge awarded, account verification status change
- Implement user notification preferences (opt-in/out per notification type)
- Log all notification dispatch attempts with timestamp and delivery status
- Batch-test 100 notification deliveries; measure P95 latency for each channel

### Success Criteria

- Email notifications delivered ≤ 30 s P95 across all trigger types
- Telegram notifications delivered ≤ 10 s P95 across all trigger types
- Opt-out preference respected: users with a notification type disabled receive zero messages of that type
- All dispatch attempts logged; delivery failures visible in Grafana within 15 s
- Zero duplicate notifications sent for a single trigger event

---

## Sprint 18 — Jun 17–23 | User Badges

**Primary goal:** Implement achievement badge system with automated awarding and profile display.

### Tasks

- Define badge types and award criteria (e.g., "Attended 5 Events", "Event Organiser", "Profile Complete", "Early Adopter")
- Implement badge-award service triggered on qualifying actions
- Store awarded badges in `alumni_badges` table; display on profile in both clients
- Allow admin to manually award or revoke badges via admin portal
- Announce badge award to recipient via notification system (Sprint 17 integration)

### Success Criteria

- At least 4 badge types defined with documented award criteria
- Badges auto-awarded within 5 s of triggering action (e.g., 5th event attendance confirmed)
- Badges visible on public alumni profiles in both Android and Telegram Mini App
- Admin can manually award/revoke any badge from the admin portal
- Badge award notification delivered to recipient via Telegram or email ≤ 30 s

---

## Sprint 19 — Jun 24–Jul 7 | Final Stabilization — Transition Preparation

**Primary goal:** Prepare all handover materials so the next student team can operate the platform independently from day one.

### Tasks

- Write operational runbook: daily operations, incident response, backup restore procedure (`scripts/restore-db.sh`), Swarm service restart, certificate renewal
- Document all GitHub secrets and environment variables; verify Terraform IaC captures all repository config
- Produce onboarding guide: clone repos → run locally → first deploy (target: < 2 hours for a new developer)
- Record or document the architecture overview for a developer with no prior context
- Conduct internal "handover simulation": a team member unfamiliar with a subsystem deploys it using only the docs

### Success Criteria

- Runbook covers: restore from backup, redeploy a single service, rotate `SECRET_KEY`, renew certificates manually
- New developer (handover simulation) can complete first deploy using docs alone in ≤ 2 hours
- All GitHub secrets documented (names, purpose, where to regenerate); Terraform state reflects current config
- Architecture overview doc reviewed and approved by all team members
- Zero verbal-only knowledge remains: every process covered by a written artifact

---

## Sprint 20 — Jul 8–28 | Finalizing Documentation & Production Ready

**Primary goal:** Validate all quality claims with evidence artifacts, finalise all documentation, and declare the platform production-ready for handover.

### Tasks

- Re-run Locust load test (50 concurrent users, 10 minutes): confirm P95 ≤ 2 s, platform variance ≤ 500 ms — save report as evidence artifact
- Verify authentication reliability: review 7-day Prometheus data; confirm login success rate ≥ 99.9%
- Execute regression test suite across all features on Android and Telegram Mini App; confirm ≥ 95% feature parity
- Confirm backup retention: daily, weekly, and monthly snapshots present and restorable
- Finalize all docs-site pages (technical, requirements, QA, risks, sprint pages, this plan)
- Tag final release version on all four repositories; write release notes
- Obtain formal sign-off from client (Alumni Office) that platform is accepted for production

### Success Criteria

- Locust P95 ≤ 2 s and variance ≤ 500 ms — evidence report committed to docs repo
- Prometheus 7-day login success rate ≥ 99.9% — Grafana screenshot saved as evidence
- Regression test passes with zero P1 regressions; feature parity checklist ≥ 95%
- Manual backup restore test succeeds end-to-end from latest daily snapshot
- All four repositories tagged with a stable release; CHANGELOG written
- Client provides written acceptance that the platform meets agreed requirements
- Next team can read docs and answer "is something broken?" in ≤ 60 s from Grafana alone
