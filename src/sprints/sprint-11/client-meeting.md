# Sprint 11 - Client meeting summary

- Date: May 5th, 2026

## Agenda

- Migration status update
- Bug fixes and reporting process
- Donation feature details
- Logistics for the annual alumni meeting and end-of-semester presentation

## Current status client comments

- Migration is mostly done; testing this week. App still not on university servers — GitHub Actions runner on the third VM doesn't pick up jobs and Helaly has been stuck on it for weeks
- Ahmad went to the IT department in person; Anna offered to come along to escalate
- New APK is built and points to the new backend, but can't be uploaded to RuStore yet — needs a signing key held by Kamil from the previous team, who is on vacation and will share it end of week (May 10-14)
- Alternative path (uploading as a brand new app) was rejected because we will lose existing users which is important for credibility with the alumni

## Bug fixes

- Event photos bug fixed (waiting to deploy)
- OTP/email code issue: works on team's side, can't reproduce the report from Anna's colleagues
- Going forward: users reporting bugs should send screenshots and the exact steps, since team can't reproduce on their university emails
- Current email filtering is simple (just checks the address ends in the university domain) — colleagues/employees technically can register too

## Donation feature

- Anna wants: configurable fixed amount per donation (e.g., 500 rubles per tree), optional fields to capture donor name / Telegram for follow-up
- Concrete example: she's buying trees for the May alumni meeting; people who donate should be reachable so she can invite them to plant their tree
- Approach: standard donation link out (Tinkoff/Sberbank), plus a form layer in the app to capture name and contact before the redirect

## Annual alumni meeting (May 23-24)

- Team is invited; Anna will print badges
- Funding was cut significantly this year (~4-5× less than promised); donation feature is now more relevant than ever
- Anna will mention the app during the grand opening — ideally the app should be on university servers by then

## End-of-semester presentation

- Anna asked if clients will attend the final presentation — team confirmed some clients may join
- Anna says she's satisfied with how the team handles problems and stays responsive, even if migration has dragged on
- Summer semester (~6-7 weeks starting in June) is expected to be much more productive

## Action items

- Coordinate with Anna this week to visit the IT department together
- Wait on Kamil for the RuStore signing key
- Plan donation feature work in parallel with finishing migration
