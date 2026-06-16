# Sprint 12 - Team & Client Meeting Summary

- Date: June 5th, 2026

## Priority Tasks

- Continue working on the reverse proxy/server migration.

  - Migration was deployed to the test environment but is not yet working due to proxy/traffic routing issues.
  - Production migration is postponed until testing is successful to avoid breaking the live system.
- Focus on profile redesign.
- Fix existing bugs.
- The follow feature is considered low priority and may be postponed.

## Notifications

- Notifications are a high-priority request from Anna.
- Notification requirements were not specified in detail.
- Proposed approach:

  - Send notifications through the Telegram bot.
  - Notify users about event updates and potentially new events.
  - This is considered simpler and more practical than implementing mobile push notifications.

## Registration & Verification

- Investigate the feasibility of integrating registration with university data.
- Current independent registration may remain if integration is not practical.
- Email verification should remain mandatory.
- Alumni approval should be separated from email verification.
- Alumni verification should remain manual unless the university can provide an alumni database/spreadsheet for automation.
- Anna should be asked whether such a list can be provided.

## Roles & User Types

- Introduce user roles during registration:

  - Alumni
  - Alumni Friend
- Alumni Friends would require manual verification through the admin panel.
- Additional staff/team roles may be required in the future.

## Projects & Donations

- Add a new **Projects** section separate from Events.
- Each project should include:

  - Description
  - Donation link
- Users can donate to projects.
- Project creation permissions are still unclear and need clarification (likely restricted to university staff/admins).

## Admin Panel

- Check whether administrators need notifications about new user registrations.

## Project Management

- Clean up the project dashboard:

  - Close outdated tasks.
  - Keep active bugs and reported issues.
  - Create fresh tickets for new features and future work.
- Update sprint dates and statuses.

## Sprint & Reporting

- Sprints will run from **Monday to Sunday**.
- Progress reports are expected regularly.
