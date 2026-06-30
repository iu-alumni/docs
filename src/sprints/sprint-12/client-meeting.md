# Sprint 12 - Client meeting summary

- Date: June 5th, 2026
- First client meeting of the new semester; agenda is a follow-up on items
  discussed last semester.

## Agenda

- Migration follow-up
- Profile redesign — badges spec
- Projects / donations feature
- Follow feature
- SSO and the recent email security breach
- Pre-approval / registration UX
- Admin notification chat after migration
- Diversified user types (graduates vs. "Alumni Friends")

## Migration

- Owned end-to-end by one teammate this sprint so the rest of the team can
  pursue the new features in parallel.

## Profile redesign — badges

- The whole catalog (earned + unearned) should be visible on the profile so
  alumni see what's possible and feel encouraged to chase the locked ones.
- Badges are for **everyone**, no ranking. The app should feel peer-to-peer,
  small-scale social, not leaderboards.
- Every badge must come with **earning criteria and a time constraint**
  (e.g. *Host of the Year* could be threshold-based — "hosted 5+ events
  in the year" — rather than top-N).
- Client to come back next week with a brainstormed list of badge titles
  and their conditions. Anna will discuss it with engaged community members
  first so the list is more extensive.
- New idea: a badge for community members who help with **testing / bug
  reporting**. People earn it by submitting reports, the team gets feedback,
  win/win.

## Projects / donations

- New entity, separate from events. Alumni create a "project" (a cause) and
  others contribute money through a link-based payment (same Tinkoff-style
  approach used today, since there is still no legal entity).
- Example causes: Alumni Lounge Zone, scholarships, planting trees.
- Each project should expose:
  - Banner / cover image
  - Title + free-text description (what / why)
  - "Contribute" button → payment link
  - Owner contact field so contributors can reach out with questions
- Contributors are **logged** against the project so we can see who supported
  it. Possible badge for contributing.
- Anna will send a written list of exact fields she wants captured per project.

## Follow feature

- **Mutual** follow: A sends a request → B accepts → both can see each
  other's activity (events created/attended, location updates, posts).
- A request that hasn't been accepted does not yet expose activity.
- Users can also **follow a location** (e.g. "follow Innopolis") and get
  notified about events in that city.
- Notification system is two-sided:
  1. Activity from people you follow
  2. Activity in your declared live-in city (with reasonable groupings — e.g.
     Kazan and Innopolis can be treated as one bucket; Germany is its own).
- Follow feature is prioritized **last** — implemented at the end of the
  sprint plan if there's time after the rest.

## SSO and the email security breach

- University suffered an email breach: a graduate's address was compromised
  and used to send phishing. Security team is still cleaning up; restrictions
  on the alumni portal remain. They want to **minimize use of university
  emails** (verification mails, etc.) and recommended switching the app to
  SSO as a mitigation.
- This isn't a hard demand — the security engineer phrased it as a
  suggestion. We can meet with him to discuss further if needed.
- Concerns raised:
  - **Non-graduates also have university SSO**, so SSO alone doesn't verify
    "this user is an alumnus." Manual approval would still be needed.
  - **Graduates lose access** to their accounts a few months after leaving
    (password rotation policy, IT can't help once you're no longer enrolled).
    Roukaya confirmed she hit this herself while in Sochi. Same problem as
    the email-verification flow.
- Action: Anna will mediate / connect Hilali with the security engineer.

## Pre-approval / registration UX

- Current flow blocks unapproved users at registration with an error — bad
  first impression for anyone curious about the app.
- Proposal: let new users register and **browse** immediately, but restrict
  write actions (e.g. cannot create their own events) until an admin approves.
- Roukaya noted that an existing feature lets the team upload a list of
  alumni from a spreadsheet (CSV) to auto-approve matches. It exists in code
  but may never have been fully used. Worth wiring it back up.
- Open question: can the team get a **list of all graduates** from the
  university? Previous request was rejected as confidential. Anna will check
  again with her colleagues — if it's obtainable, approval can be automated.

## Admin notification bot

- The Telegram bot that pinged admins on new registrations stopped working
  after the migration.
- Anna is leaving the Alumni Relations role, so the bot's current single
  recipient is going away too.
- Options discussed:
  1. Drop the bot entirely.
  2. Reuse the bot but make the recipient configurable — a dedicated admin
     (the person who replaces Anna) receives the notifications and approves
     from the admin panel.
- Decision deferred; team will pick whichever is simpler.

## Diversified user types — "Alumni Friends"

- The platform currently treats every user as a graduate and forces a
  graduation year. That breaks down for:
  - University **staff** (e.g. people in the alumni office, IT staff who
    engage with the community).
  - **Drop-outs** who stayed close to the community and contribute.
- These users are referred to internally as **Alumni Friends**. They should
  be:
  - Verifiable through a manual path (they are few; no automation needed).
  - Visibly distinct in the UI — clearly labelled as "Alumni Friend" instead
    of showing a graduation year.
  - Allowed to add a free-text bio explaining how they relate to the
    community.

## Prioritization for the sprint

In this order:

1. Migration (in parallel, single owner)
2. Registration fixes + pre-approval UX
3. Profile redesign (incl. badges)
4. Donations / Projects feature
5. General bug fixes
6. Follow feature — only if time remains after the above

## Action items

- **Anna** sends the brainstormed badge list (titles, criteria, time
  constraints) next week.
- **Anna** sends the required fields for the Project entity (banner, text,
  contact, payment link, etc.).
- **Anna** asks her colleagues whether the team can obtain a list of all
  graduates for auto-approval.
- **Anna** connects the team (Helaly) with the IT security engineer to
  discuss SSO and the breach mitigations.
- **Team** wires up CSV-based pre-approval and reconsiders the admin bot.
- **Team** introduces an Alumni Friend user type with a manual verification
  path and a distinct profile label.
