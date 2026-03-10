# Sprint 0 — Client Meeting

- Date: February 4th, 2026
- [Meeting Link](https://drive.google.com/file/d/1wrmXPSBCF37bjof5wx5SgAyauZi53INE/view?usp=drive_link)
- Attendees: All team members, Anna (the client)

## Meeting Summary

### Main Goal

Increase the number of app users

### User Roles

- Alumni: Core users who can create events (with filter considerations)
- Alumni-Friend (319): Naming to be refined
- Admin: Responsible for event approvals

### Payment & Donations

- Payment system to be implemented for donations
- Need to determine money collection mechanism (IP account or alternative solution)

### Profile Improvements

- Enhance alumni personal pages
- Add achievements section
- More details needed on profile requirements

### Technical Issues

#### Current Problems

- Password recovery not functioning
- OTP codes not being sent to email
- Login process requires admin approval

#### Migration Requirements

- Need to connect with university IT department
- Migrate CI/CD deployment
- Migrate database and everything to Innopolis University servers

## Discussion Points & Questions

### Platform Considerations

- Need for iOS application vs. Telegram bot focus
- Telegram limitations: message overload, information gets lost in channels

### Authentication Questions

- Password recovery process
- OTP delivery issues

## TODO

### FAQ Addition

Add the following to FAQ section:

**Q: Can't remember my password from the IU email. How can I solve this?**  
A: If you have forgotten or lost your password for @innopolis domain, please request one from [it@innopolis.ru](mailto:it@innopolis.ru), and they will send password recovery instructions to you. The alumni mailbox is not blocked, you can use it without an expiration date.

## Blockers

- Database migration pending IT department contact
- Authentication system needs fixing before launch
- Payment collection mechanism needs clarification
