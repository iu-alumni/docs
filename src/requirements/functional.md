# Functional Requirements

## Authentication & User Management

- [x] **FR3**: Implement secure password recovery functionality allowing users to reset forgotten passwords via email or telegram [issued](../sprints/sprint-1/client-meeting.md)
- [x] **FR4**: Fix email verification process to ensure reliable user email approval during registration [issued](../sprints/sprint-1/client-meeting.md)

## Event Management

- [x] **FR5**: Fix and optimize event creation workflow with proper validation and error handling [issued](../sprints/sprint-2/client-meeting.md)
- [ ] **FR6**: Send automatic notifications upon event creation to relevant users (e.g., followers, location-based notifications) [issued](../sprints/sprint-2/client-meeting.md), [reaffirmed](../sprints/sprint-12/client-meeting.md), [narrowed](../sprints/sprint-17/client-meeting.md#notifications)

  **Superseded in part — Sprint 17.** The client agreed to deliver notifications as an **in-app panel** the user pulls, rather than a push fired at event-creation time, and Telegram bot DM is no longer a usable channel while [server restrictions block bot messages](../sprints/sprint-17/client-meeting.md#telegram-restrictions). What shipped under that agreement is [FR28](#notifications) — matched on the alumnus's **profile city** rather than on follows, and surfacing events ~1 week ahead rather than at creation. The follower-driven rules below remain open: they depend on the Follow feature ([FR8](#social-features)), which the client deprioritised in the same meeting (The team has done it but the merge was not done by the time of EOSP).

  **Definition of success**

  When a new event is approved and published, every alumnus matching at least one of the rules below receives exactly one notification.

  Who is notified
  - [ ] Alumni who **follow the event's creator** (via FR8 mutual-follow).
  - [ ] Alumni who **declared the event's city as their live-in city** in their profile (The exception is for Innopolis and Kazan sharing one bucket).

  Delivery
  - [ ] In-app notification panel.
  - [ ] No duplicates: an alumnus matching multiple rules still gets exactly one notification per event.

  Edge cases
  - [ ] The creator themselves is never notified about their own event.
  - [ ] Notifications fire only for events with `approved = true`. Drafts and pending-moderation events do not trigger anything.

## Maps & Location Services

- [ ] **FR7**: Implement automated map functionality with automatic location update every month with optional manual intervention [issued](../sprints/sprint-2/client-meeting.md) (out of scope)
<!-- - [ ] **FR10**: Enable accurate location pinning for events and venues with search and filter capabilities -->

## Social Features

- [ ] **FR8**: Add follow request feature enabling users to send, accept, and reject connection requests [issued](../sprints/sprint-2/client-meeting.md), [refined](../sprints/sprint-12/client-meeting.md)

  **Definition of success**

  - [ ] User can send a follow request to another alumnus; the request is **pending** until the recipient accepts or rejects.
  - [ ] Mutual visibility: once accepted, both users see each other's activity (created/joined events, profile updates).
  - [ ] Recipient sees pending requests in a dedicated list and can accept or reject each one.
  - [ ] User can **follow a city/location** directly (no confirmation needed — locations don't accept/reject).
  - [ ] User declares a **live-in city** in their profile; defaults the location-notifications bucket (FR6).
  - [ ] User can unfollow a person or a location at any time from their followers/following management screen.
  - [ ] Followers / Following counters appear on the profile (UI covered by [FR10](#user-profile)).

- [ ] **FR9**: Implement notification system for follow activities (requests, accepts, new followers) [issued](../sprints/sprint-2/client-meeting.md), [refined](../sprints/sprint-12/client-meeting.md)

  **Definition of success**

  An alumnus receives a notification when:
  - [ ] Someone sends them a follow request.
  - [ ] Their follow request is accepted.
  - [ ] A user they follow **creates a new event** (also covered by FR6 from the creator-follower path).
  - [ ] A user they follow **joins an event** (the canonical "stalker-friendly" social signal mentioned in the meeting).
  - [ ] A user they follow updates their profile significantly (new badge earned, new bio) — *optional, opt-out by default*.

  Delivery + control
  - [ ] In-app notification panel + Telegram bot DM.
  - [ ] Each category is independently mutable in user settings (e.g. opt out of "X joined an event" without losing request notifications).
<!-- - [ ] **FR10**: Provide privacy settings for follow preferences with followers/following management lists -->

## User Profile

- [x] **FR10**: Provide a user profile screen that displays personal information, events created and participated, badges, and followers/following counts [issued](../sprints/sprint-3/client-meeting.md)
  - The look-and-feel and "intuitive layout" aspects are tracked as [QAS102 — Intuitive Profile Redesign](./quality-attributes.md#qas102) under Quality Requirements.

  **Approved designs**

  Profile-with-Badges-and-Projects (v2), the badges section (earned + locked with tap-for-info), and the badge-earned celebratory popup were reviewed and approved by the client. Approval evidence below is the client's Telegram record.

  **Definition of done**

  FR10 is considered done when every item below holds true on both the mobile app and the Telegram Mini App, against the agreed design with the client.

  Layout & identity
  - [x] Top app bar shows back navigation, "Profile" title, and the contextual action (Edit on own profile, overflow menu on another user's profile).
  - [x] Avatar centered with the brand-yellow ring; falls back gracefully when no image is set.
  - [x] Display name and graduation group (e.g. "BS-19") render below the avatar.

  Content sections (in this order)
  - [x] Biography paragraph.
  - [x] **Badges** — horizontal scroll, earned tiles with tiered gold/silver/bronze rings, locked tiles with dashed gray ring, lock chip, mini progress bar, and tap-for-info icon. Full catalog, criteria, and per-badge implementation status live in [Badges Catalog & Status](./badges.md). *(Covered by [`backend#98`](https://github.com/iu-alumni/iu-alumni-backend/pull/98) and [`mobile#125`](https://github.com/iu-alumni/iu-alumni-mobile/pull/125).)*
  - [x] **Participated events** — horizontal scroll of event cards.
  - [x] **Created events** — same pattern, only shown on own profile.
  - [x] **Projects** — "Created projects" (any status) and "Contributed projects" (approved only) sections on the profile. Backend contract landed in [`backend#132`](https://github.com/iu-alumni/iu-alumni-backend/pull/132) (`GET /projects/owner`, `GET /projects/contributed[/{alumni_id}]`); mobile UI tracked in [`mobile#147`](https://github.com/iu-alumni/iu-alumni-mobile/issues/147). Full spec under [FR24](#payment--donations).
  - [x] **Followers / Following counters** — rendered under the identity row; gated on [FR8](#social-features).

  Interactions
  - [x] Tapping the edit button opens the edit-profile flow.
  - [x] Tapping a badge's `(i)` icon (hover on web, long-press on mobile) shows the badge description and earning criteria.
  - [x] Newly-earned badges trigger the celebratory popup the moment they unlock, from any tab.

## Alumni Search & Filtering

- [x] **FR16**: Provide search and filter functionality for admins to quickly locate specific alumni records by name, graduation year, and other relevant criteria

## Data Import/Export

- [x] **FR17**: Enable bulk importing of alumni data from CSV file format
- [x] **FR18**: Provide functionality to export alumni and event data for backup purposes or external analysis

## Event Listing & Browsing

- [x] **FR19**: Display a list of upcoming events to alumni users with sorting and filtering options by date, and location
- [x] **FR20**: Allow alumni to view detailed information of selected events including date, venue, donation, and description to facilitate participation decisions

## Notifications

- [x] **FR21**: Implement automated email notification system for key triggers including event registration confirmations, event reminders, and announcements

- [ ] **FR26**: Notify joined participants when an event they have joined changes [issued](../sprints/sprint-12/client-meeting.md)

  **Definition of success**

  Triggers — any of:
  - [ ] Event is **cancelled** (approved → cancelled, or hard-delete).
  - [ ] Event **time** changes (date or start time).
  - [ ] Event **location** changes (city, venue, or online/offline flag).
  - [ ] Event **description** or **cover image** changes substantially (substantive edit, not a typo fix — left to the editor's judgement / a "notify participants" checkbox).

  Recipients
  - [ ] Every alumnus listed in `events.participants_ids` at the time of the change.

  Delivery
  - [ ] In-app notification panel + Telegram bot DM.
  - [ ] Successive changes within ~5 min are bundled into a single message so a quick burst of edits doesn't spam attendees.
  - [ ] Cancellation is **always** delivered immediately, never batched.

- [ ] **FR27**: Notify event creators when their event's participation changes [issued](../sprints/sprint-12/client-meeting.md)

  **Definition of success**

  - [ ] Creator receives a notification when an alumnus **joins** their event.
  - [ ] Creator receives a notification when an alumnus **leaves** their event.
  - [ ] High-volume bursts are bundled (e.g. "5 new participants in the last hour") so popular events don't spam the creator.
  - [ ] Delivery: in-app notification panel + Telegram bot DM.
  - [ ] Creator can mute these per-event from the event detail screen.

- [x] **FR28**: Show each alumnus an in-app panel of approved events happening about a week out that are relevant to them ("upcoming events near you") [issued](../sprints/sprint-17/client-meeting.md#notifications). *(Implemented in [`backend#142`](https://github.com/iu-alumni/iu-alumni-backend/issues/142) and [`mobile#150`](https://github.com/iu-alumni/iu-alumni-mobile/issues/150).)*

  Agreed with the client in [Sprint 17](../sprints/sprint-17/client-meeting.md#notifications) as the practical alternative to Telegram-delivered notifications, and implementable on both platforms at once. Narrows [FR6](#event-management).

  **Definition of success**

  Who is notified
  - [x] For an **in-person** event, alumni whose **profile city** is the event's city. Innopolis and Kazan are treated as **one bucket** — an alumnus living in either is notified about events in both.
  - [x] For an **online** event, **every** alumnus, regardless of their profile city or whether they have set one at all — an online event has no physical "nearby".
  - [x] The **event's creator is never notified about their own event**, and neither is anyone already listed as a participant — for in-person and online events alike.
  - [x] Only events that are **approved** and **~6.5–7.5 days away** match. Unapproved events and events outside that window never appear.

  Delivery
  - [x] A **bell** on the events dashboard, right of "Create", carrying an unread indicator that appears without the panel having to be opened first.
  - [x] Tapping the bell opens a **full-screen panel**, newest first; each row is compact by default and expands in place to reveal event name, date, time, and location.
  - [x] Empty state shows a clear "no notifications" message.
  - [ ] Behaviour verified identical in the **Telegram Mini App** — expected to come for free, as it is the same Flutter web build, but not yet confirmed (open acceptance criterion in [`mobile#150`](https://github.com/iu-alumni/iu-alumni-mobile/issues/150)).

  Read state
  - [x] Matches are computed **live at request time** from the events table and the requesting user's profile — no per-event storage, no background job.
  - [x] Read/unread is a **single per-user cursor** (a timestamp on the alumni record recording the last panel view), not a row per notification.
  - [x] **Opening the panel is what marks notifications read** — there is no separate "mark as read" action. The unread indicator clears immediately and stays cleared on return to the dashboard.
  - [x] The unread-count endpoint **never** advances the cursor; only the list endpoint does.
  - [x] An event that entered the window after the user's last view still shows as unread, even alongside already-seen events in the same response.

  Not included

  - OS-level / push notifications — this requirement is the in-app panel only.
  - Telegram bot DM — blocked by [server restrictions](../sprints/sprint-17/client-meeting.md#telegram-restrictions).
  - Admin-portal (frontend) changes.
  - Follower-driven notifications, which stay with [FR6](#event-management) / [FR9](#social-features) pending [FR8](#social-features).

## User Roles & Permissions

- [x] **FR22**: Support distinct user roles with appropriate access levels including Admin users with full management capabilities for alumni data and events, and Alumni users with limited access focused on event registration only [issued](../sprints/sprint-1/client-meeting.md), [expanded](../sprints/sprint-12/client-meeting.md)

  **Definition of success**

  Roles supported
  - [x] **Admin** — full management of alumni records, events, badges, projects.
  - [x] **Alumni** — graduates. Required to provide a graduation year. Default role after manual approval.
  - [x] **Alumni Friend** *(new — per [sprint-12 client meeting](../sprints/sprint-12/client-meeting.md))* — university staff, drop-outs who stayed in the community, and other non-graduate community members. Verified manually. **No graduation year**; their profile shows an "Alumni Friend" chip in lieu of the school-year tag, plus a free-text bio describing their relationship to the community.

  Distinctions in the UI
  - [x] Alumni Friends are visibly distinct on profile cards and lists — mobile renders an `Icons.groups` "Alumni Friend" chip on the profile header in place of the graduation-year tag; the admin portal shows a yellow **Friend** pill on the users list and detail pages.
  - [x] Admin panel exposes the Alumni Friend type for verification and editing — the user detail page has a role dropdown (`Alumni ⇄ Alumni Friend`) that hits `POST /admin/verify { email, role }`; the backend clears `graduation_year` server-side when the role becomes `alumni_friend`.

  Surface coverage
  - [x] **Backend** — `alumni.role` enum (`alumni | alumni_friend`), nullable `graduation_year`, register-schema cross-field validator, admin verify role override. [`backend#171`](https://github.com/iu-alumni/iu-alumni-backend/pull/171).
  - [x] **Mobile** — segmented role picker on the registration form (hides the graduation-year picker when Alumni Friend is selected), "Alumni Friend" chip on the profile header, and an explainer note in place of the year picker on the edit form. [`mobile#163`](https://github.com/iu-alumni/iu-alumni-mobile/pull/163).
  - [x] **Admin portal** — yellow **Friend** chip on the `/users` list rows, "Alumni Friend" pill + role dropdown on the user detail page. [`frontend#84`](https://github.com/iu-alumni/iu-alumni-frontend/pull/84).


## Payment & Donations

- [x] **FR24**: Alumni-created **Projects** with admin approval, a link-based donate action, and a self-reported raised-total that drives a public progress bar. Verified payment integration is deferred to FR24-b. [issued](../sprints/sprint-6/client-meeting.md), [scoped](../sprints/sprint-12/client-meeting.md)

  Per the sprint-12 client meeting, "Projects" are a **separate entity from events** — a cause alumni create that others rally around (examples: Alumni Lounge Zone, scholarships, planting trees). v1 ships the full lifecycle without money changing hands so the UX loop is testable this sprint; payment integration is a follow-up (see FR24-b).

  Project entity fields
  - [x] Cover image (base64, optional — same convention as events)
  - [x] Title (required)
  - [x] Free-text description (required)
  - [x] Donation link (required, http/https) — external URL (Tinkoff, etc.) opened when contributors tap Donate
  - [x] Goal amount (required, positive integer, ₽)
  - [x] Raised amount (₽, sums self-reported donations from `POST /projects/{id}/donations`)
  - [x] Contributors (`contributors_ids[]`) and owner (implicit — the creator; contactable via their profile / Telegram)

  Lifecycle
  - [x] Any authenticated alumnus can create a project. It starts as **pending** (`approved = null`) and is invisible to non-owners.
  - [x] **Admin approval** is required before the project appears in the public list. Admin can approve, decline, or send back to pending (`POST /admin/projects/{approve,decline,unapprove}/{id}`).
  - [x] Project owner can edit details. Editing the title, description, or cover of an approved project resets it to pending so the change goes through review again.
  - [x] Owner or admin can delete a project.

  Contribute / retract (v1 = click-based, no payment)
  - [x] Any authenticated alumnus can mark themselves as a contributor to an **approved** project (`POST /projects/{id}/contributors`). Idempotent — duplicate call → 400. Admins cannot contribute.
  - [x] Any contributor can retract (`POST /projects/{id}/contributors/remove`).
  - [x] Contributor count is derived from `contributors_ids` — no separate contributions table in v1.

  Backend coverage: [`backend#132`](https://github.com/iu-alumni/iu-alumni-backend/pull/132) delivers the schema (Alembic `d1e2f3a4b5c6`), the seven CRUD endpoints, the two contribute endpoints, the four admin endpoints, and 28 pytest cases. Mobile UI is tracked in [`mobile#144`](https://github.com/iu-alumni/iu-alumni-mobile/issues/144)–[`#147`](https://github.com/iu-alumni/iu-alumni-mobile/issues/147); admin portal in [`frontend#76`](https://github.com/iu-alumni/iu-alumni-frontend/issues/76).

- [ ] **FR24-b**: Link-based payment processing on the Contribute action (Tinkoff or equivalent) so contributions carry money. Deferred from FR24 v1. Needs a separate `contributions` table with `contributor_id`, `project_id`, `amount`, `currency`, `paid_at`, `payment_ref`. Provider choice + legal review (no legal entity) tracked separately.

- [x] **FR25**: Allow admins to track donators and payments associated with projects for reporting purposes. [issued](../sprints/sprint-11/client-meeting.md), [scoped](../sprints/sprint-12/client-meeting.md)

  **Definition of success** — pre-conditions on FR24-b (real payments). Until then, "contributors" are self-reported clicks and the reporting view is a headcount only.

  - [x] Each contribution is logged with: contributor user id, project id, amount (when available), timestamp.

  What v1 already covers
  - [x] Contributor list per project — derived from `contributors_ids`; exposed by [`backend#132`](https://github.com/iu-alumni/iu-alumni-backend/pull/132).
  - [x] Contributor count per project — shown in the mobile card / details screen and in the admin table + side-panel ([`mobile#148`](https://github.com/iu-alumni/iu-alumni-mobile/pull/148), [`frontend#77`](https://github.com/iu-alumni/iu-alumni-frontend/pull/77)).
  - [x] Raised total per project — "₽X raised of ₽Y" plus progress bar in mobile and admin surfaces; totals in the admin side-panel ([`backend#148`](https://github.com/iu-alumni/iu-alumni-backend/pull/148), [`mobile#148`](https://github.com/iu-alumni/iu-alumni-mobile/pull/148), [`frontend#77`](https://github.com/iu-alumni/iu-alumni-frontend/pull/77)).
