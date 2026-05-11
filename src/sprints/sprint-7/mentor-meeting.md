# Sprint 7 - Mentor meeting summary

- Date: April 6th, 2026

## Agenda

- Discuss the Flutter → React/Vue refactoring decision
- Status of university VMs and migration
- Risk management and team meetings

## Current status mentor comments

- The team is considering replacing Flutter with React in a web-view because nobody on the team knows Flutter
- Mentor wants numbers behind this decision, not just preference — how many hours saved vs hours invested?
- Risk: Helaly leaves at the end of the semester. If we refactor, can the rest of the team support what he built?
- "Convince me as a critical client that this isn't just inventing tasks to delay the project"

## Server and migration status

- App is currently pointing at our own (Yandex) servers; university VMs still not connected externally
- Last week the server went down because Helaly's Yandex balance ran out — exactly the reason we need to migrate to university
- Third VM has been provisioned and the GitHub runner is set up; Helaly still needs to finish testing it
- Plan: migrate to university servers ASAP, then decide refactor separately

## Estimation and tracking

- Individually we over- and underestimate, but as a team it might balance out — that's fine if we can show it
- Roukaya should look at estimated vs actual per team member and per sprint, and present trends
- Right now we don't really take the estimation gap seriously because there's no pressure
- For the presentation: show the trend across sprints and what decisions we made based on it

## Risk management

- Currently risks are discussed verbally in team meetings, not tracked in the repo
- A decision like "refactor to React" should itself come out of risk analysis — but we didn't do that
- Need a risk table in the repo

## Meetings and notes

- Team meetings are weekly, ~1 hour, sometimes 3 hours, organized by topic
- Meeting notes are written but mostly shared in Telegram, not the repo — so old notes are hard to find
- Mentor: put notes in the repo so they are searchable later

## Action items

- Mentor will hold individual meetings with each team member, then a full team meeting later in the week
- Build a numbers-based justification for the refactoring decision before any work starts on it
