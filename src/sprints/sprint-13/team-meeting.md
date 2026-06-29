# Sprint 13 - Team Meeting

- Date: Following the [June 5th client meeting](./client-meeting.md).
- Purpose: divide the prioritised scope from the client meeting between team members and lock in testing checkpoints.

## Work assignments

The team agreed on the following ownership for the deliverables that came out of the client meeting:

| Track | Owner | Notes |
| --- | --- | --- |
| Migration · verification | Ahmad Helaly | Single owner so the rest of the team can work in parallel. |
| University mail · password recovery | Ahmad Helaly | Follow-up on the SSO / breach discussion from the client meeting. |
| Backend — User Profile | Ahmad Helaly | Schema and endpoint changes that the redesigned profile needs. |
| Profile redesign · badges | Roukaya Mohammed | Covers [FR10](../../requirements/functional#user-profile) end-to-end (mockups, mobile UI, badge popup). |
| Notifications | Roukaya Mohammed | New event · followed-user · event-changed · creator-on-join ([FR6](../../requirements/functional#event-management), [FR26 / FR27](../../requirements/functional#notifications)). |
| Follow feature — frontend | Ghadeer Akleh | Mobile UI for follow flow, follower / following list, follow-location. |
| Follow feature — backend | Majed Naser | API for mutual follow, follow-location, activity feed. |
| Bugs — frontend | Ghadeer Akleh | Standing bucket for any UI defects surfaced this sprint. |
| Bugs — backend | Majed Naser | Standing bucket for backend defects. |
| Testing | Aleksandr Kovalev | Sprint-13 test pass; checkpoints below. |
| Project management | All | Shared facilitation, board hygiene, ceremonies. |
| Reporting | All | Each owner writes the report section for their track. |

## Testing checkpoints

Alex runs the test pass against the merged work and delivers a written report at each checkpoint so blockers surface early instead of at end-of-sprint:

| Day | Deliverable |
| --- | --- |
| Tuesday | First test report (covers merged work to date). |
| Thursday | Second test report. |
| Sunday | Third test report. |
| Monday | Sprint test summary — feeds into the team retrospective. |

## Notes

- The follow feature is owned end-to-end (FE + BE) so the contract between Ghadeer and Majed stays tight; both sync on the API shape before Ghadeer starts wiring it up.
- The bug buckets are intentionally separate from the feature tracks so a hot-fix doesn't block someone else's planned work.
- Profile redesign and notifications are scoped together under Roukaya since the celebratory popup and the notification copy share UI primitives.
