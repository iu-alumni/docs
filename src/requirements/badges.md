# Badges — catalog and progress

Single source of truth for what badges exist, what data they need, and which are shipped.

Implementation tickets live on the [org project board](https://github.com/orgs/iu-alumni/projects/3) under the `[badges]` prefix. Mockups in [`iu-alumni-frontend/mockups/`](https://github.com/iu-alumni/iu-alumni-frontend/tree/main/mockups).

## Status legend

- ☐ Not started
- ◐ In progress
- ☑ Shipped
- ⛔ Blocked on new feature (see "Blocked badges" section)

---

## Shipped & active (P1 — work against current schema)

Backend [iu-alumni-backend#98](https://github.com/iu-alumni/iu-alumni-backend/pull/98) ships the schema + evaluator + API + triggers. Mobile [iu-alumni-mobile#125](https://github.com/iu-alumni/iu-alumni-mobile/pull/125) ships the badges section on the profile screen.

| Status | Badge | Tier | How to earn |
|---|---|---|---|
| ☑ | **Pioneer** | special | Among the first 100 alumni to pin their location on the map (i.e. flip `show_location = true`). |
| ◐ | **Local Legend** | gold | Most events attended in a single city in a given year. Awarded once per city per year by a yearly job. *Catalog row + leaderboard strategy stub shipped; yearly cron deferred to a follow-up PR (ticket #6).* |
| ☑ | **Founding Host** | gold | Created the first event in a city. Repeats per city via `extra: {city}` metadata. |
| ☑ | **Networker** | bronze | Attended 5+ alumni events. |
| ☑ | **Host with the most** | silver | Organized 3+ events in different cities. |
| ☑ | **Rainmaker** | silver | An event you created had 20+ attendees. |
| ☑ | **Cross-city commuter** | bronze | Attended an event in a city different from your home city. |
| ☑ | **Innopolis OG** | gold | Graduated from one of the first cohorts (2014–2019). |
| ◐ | **Open Source Contributor** | silver | Contributed to the platform's open-source codebase. *Manual admin award.* *Catalog row shipped; admin-award endpoint deferred to a follow-up PR (ticket #9).* |
| ☑ | **Profile Pro** | bronze | Completed all profile fields: photo, location, biography, graduation year, Telegram. |
| ☑ | **Badge Collector** | gold | Earned 10+ badges. Recursive trigger guarded against self-loop. |
| ◐ | **Suggestion Box** | special | Submitted a badge or feature idea that got implemented. *Manual admin award.* *Catalog row shipped; admin-award endpoint deferred to a follow-up PR (ticket #9).* |

---

## Blocked badges (P2 — need new infrastructure)

Each row notes the **minimum new data/feature** needed before the badge can ship. Once the dependency lands, the badge itself is a ~2-hour add on top.

| Status | Badge | Tier | How to earn | Blocked on |
|---|---|---|---|---|
| ⛔ | **Last minute hero** | bronze | Joined an event less than 1h before it started. | Recording **join timestamp** when user is added to `events.participants_ids` (currently no timestamp stored). |
| ⛔ | **BS Club** | bronze | Reflects a Bachelor's degree from Innopolis. *Only highest-degree badge shows on main profile.* | `alumni.highest_degree` enum (`bachelor / master / phd`). |
| ⛔ | **MS Club** | silver | Reflects a Master's degree. *See BS Club note.* | Same as BS Club. |
| ⛔ | **PhD Circle** | gold | Reflects a PhD. *See BS Club note.* | Same as BS Club. |
| ⛔ | **Startup Founder** | gold | Added a company you founded to your profile. | New `user_companies` table (or equivalent) with `is_founder` flag. |
| ⛔ | **Streak Star** | silver | Logged into ALUMAP for 14 days straight. | `user_daily_activity` tracking table + auth-middleware upsert. |
| ⛔ | **Star** | silver | Your profile was viewed by other alumni 50+ times. | `profile_views` table (idempotent per viewer per day) + denormalized counter. |
| ⛔ | **Paparazzi** | silver | Uploaded event photos from 2+ different alumni meetups. | **Event photo upload feature** (does not exist). |
| ⛔ | **Reminiscence** | bronze | Uploaded a photo from Innopolis University days. | Same as Paparazzi. |
| ⛔ | **New Year's Drunk Dial** | special seasonal | Logged in on Jan 1st. | `user_daily_activity` (same as Streak Star) + seasonal evaluation strategy. |
| ⛔ | **Bug Spotter** | bronze | First bug report submitted. | **In-app bug-report system** (does not exist). |
| ⛔ | **Verified Reporter** | silver | 3 confirmed bug reports accepted by the dev team. | Same as Bug Spotter. |

---

## Caveats on the doable badges

These are pragmatic interpretations that ship now and can be refined later.

- **Location is a free-text string**, not an FK to the `cities` table. Local Legend, Founding Host, and Cross-city commuter all use exact-match string comparison (lowercased + trimmed). Future improvement: link `events.location` to `cities`.
- **No `events.created_at`**, so "Founding Host" uses the earliest `events.datetime` (the event's scheduled date) as a proxy for "first event in city."
- **"Pioneer" = first 100 alumni to flip `show_location = true`**, since that's the closest existing field to "pinned on map."

---

## How to update this page

When a badge ships:

1. Move the row from `☐` → `☑`.
2. Add a link in the row to the merged PR(s) that shipped it.
3. If shipping a previously-blocked badge: move it from the **Blocked** table into the **Shipped & active** table, and note the dependency PR that unblocked it.

When adding a new badge to the catalog:

1. Add the row in the right table (shipped vs. blocked).
2. Add the implementation ticket to the [org project board](https://github.com/orgs/iu-alumni/projects/3) with the `[badges]` prefix.

---

## Design references

- Profile screen with badges + projects (v2 layout): `iu-alumni-frontend/mockups/06-profile-v2-combined.png`
- Locked badges row: `iu-alumni-frontend/mockups/11-badges-locked.png`
- Badge earned popup: `iu-alumni-frontend/mockups/10-badge-earned-popup.png`
- Profile viewed as another user (with Follow): `iu-alumni-frontend/mockups/09-profile-v6-plus-follow.html`
