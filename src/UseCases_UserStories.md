# Alumni Community Platform  
## Functional Use Case & User Story Document  

---

# 1. System Overview

The Alumni Community Platform is a social event-oriented application designed to:

- Enable alumni to create and participate in events
- Provide a shared dashboard of upcoming events worldwide
- Support mutual following between members
- Notify users about events attended by people they follow
- Allow controlled administration through warnings and event cancellation
- Support limited-capacity and condition-based events (e.g., sports games)

The platform promotes engagement while maintaining community standards through admin oversight and event logging.

---

# 2. Actors

## 2.1 Regular User (Alumni Member)

- Create events  
- Join or cancel participation  
- Follow/unfollow other users (mutual follow required)  
- Receive push notifications  
- Set notification preferences  
- View dashboard and profiles  
- Access Telegram contact information  

## 2.2 Admin

- Issue warnings to members  
- Cancel events  
- Remove members from events  
- Suspend/cancel user accounts for rule violations  
- View event creation logs  

---

# 3. Functional Interfaces

1. Personal Account & Profile Interface  
2. Event Creation & Scheduling Interface  
3. Dashboard Interface  
4. Notification System  
5. Administration Interface  

---

# 4. Use Cases

---

## UC-01: User Registration & Gender Verification

**Actor:** User  
**Precondition:** User does not have an account  
**Postcondition:** User account created with verified gender  

### Main Flow:

1. User registers.  
2. User provides required information:  
   - Name  
   - Graduation year  
   - Program  
   - Gender  
3. System verifies and stores gender.  
4. Account is activated.  

**Notes:**  
Gender is verified at account creation and used for event conditions but does not automatically restrict participation.

---

## UC-02: View and Manage Personal Profile

**Actor:** User  
**Precondition:** User is logged in  
**Postcondition:** Profile information updated or viewed  

### Main Flow:

1. User accesses profile page.  
2. User views:  
   - Graduation year  
   - Program  
   - Achievements (unlocked via event participation)  
   - Telegram contact  
3. User edits permitted fields.  

**Business Rules:**

- Users cannot directly message each other.  
- Telegram contact sharing is optional.  

---

## UC-03: Mutual Follow Between Users

**Actor:** User  

### Main Flow:

1. User A sends follow request to User B.  
2. User B accepts.  
3. Mutual follow relationship is established.  

**Postcondition:**

- Both users can receive event-related notifications based on each other's activity.  

---

## UC-04: Create Event

**Actor:** User  
**Precondition:** User is logged in  
**Postcondition:** Event is published and logged  

### Main Flow:

1. User selects "Create Event".  
2. User provides:  
   - Title  
   - Description  
   - Location (Country, Territory)  
   - Date & Time  
   - Participant limit (optional)  
   - Optional gender condition (description-based)  
3. User submits event.  
4. System logs:  
   - Creator  
   - Timestamp  
5. Event becomes publicly visible on dashboard.  

**Business Rules:**

- No private events.  
- No event categories.  
- Admins cannot edit events.  
- Only admins can cancel events.  

---

## UC-05: Join Event

**Actor:** User  
**Precondition:** Event exists  

### Main Flow:

1. User selects event.  
2. User selects “Join”.  
3. If spots are available:  
   - User is registered as participant.  
4. If event is full:  
   - User is added to waitlist.  

### Alternate Flow – Cancel Participation:

1. User selects “Cancel Participation”.  
2. Spot becomes available.  
3. First waitlisted user is promoted.  

**Business Rules:**

- No “Interested” status.  
- Users are either joined or not.  
- Organizers can remove participants manually.  

---

## UC-06: Dashboard – View Upcoming Events

**Actor:** User  

### Main Flow:

1. User logs in.  
2. Dashboard displays:  
   - All upcoming events worldwide  
   - Events in user-preferred territories  
3. Events are sorted by date.  

---

## UC-07: Push Notification System

**Actor:** System  

### Trigger Conditions:

- A followed user joins an event  
- An event in preferred territory is created  
- An event the user joined is approaching  

### Main Flow:

1. Trigger condition occurs.  
2. System checks user preferences.  
3. Push notification is sent.  

### User Preferences Include:

- Notify for events attended by followers  
- Notify for events in selected locations  
- Notify for upcoming events user joined  

---

## UC-08: Admin Issues Warning

**Actor:** Admin  

### Main Flow:

1. Admin reviews user behavior.  
2. Admin selects “Issue Warning”.  
3. System logs warning.  
4. User receives notification.  

**Postcondition:**

- Warning stored in user record.  

---

## UC-09: Admin Cancels Event

**Actor:** Admin  

### Main Flow:

1. Admin selects event.  
2. Admin selects “Cancel Event”.  
3. Event status updated to Cancelled.  
4. Participants receive push notification.  

---

## UC-10: Admin Cancels User Account

**Actor:** Admin  

### Main Flow:

1. Admin reviews repeated violations.  
2. Admin suspends or cancels account.  
3. User loses access.  

---

# 5. Special Use Case (High Priority)

## UC-11: Limited-Capacity, Gender-Specific Football Event

This use case reflects explicit client requirements and must be supported by the system.

### Example: Alumni Football Match Event

**Actor:** Event Creator (User)  
**Supporting Actors:** Participants, Admin  

### Preconditions:

- Event creator is logged in.  
- Gender is verified in all user profiles.  

### Main Flow:

1. Creator selects “Create Event”.  
2. Creator sets:  
   - Title: “Alumni Football Match”  
   - Participant limit: 14 players  
   - Location & Date  
   - Description includes:  
     - “Male players only”  
     - “Must bring sports gear”  
3. Event is published.  
4. Users join.  
5. Once 14 participants are reached:  
   - Additional users are placed on waitlist.  

### Special Handling Rules:

- Gender restriction is description-based (optional feature).  
- System does NOT automatically block registration.  
- Organizer may remove participants who do not meet conditions.  
- Admin may issue warnings if restriction violates community policy.  
- Participation slots are strictly enforced.  
- Waitlist auto-promotes when a participant cancels.  

### Alternate Flow – Organizer Removes Participant:

1. Organizer detects mismatch (e.g., condition not met).  
2. Organizer removes participant.  
3. Spot becomes available.  
4. First waitlisted member is promoted.  

### Business Justification:

The platform must support:  

- Limited capacity events  
- Conditional participation (sports, competitions, skill-based activities)  
- Gender-specific events when required  
- Manual enforcement by organizer  

This flexibility ensures sports, competitions, and structured activities are supported.

---

# 6. User Stories (Agile Format)

## US-01 – Event Creation

As a user,  
I want to create an event with a participant limit,  
So that I can organize structured activities.  

## US-02 – Join Event

As a user,  
I want to join an event directly,  
So that I can participate without approval delays.  

## US-03 – Waitlist

As a user,  
I want to be placed on a waitlist when an event is full,  
So that I still have a chance to participate.  

## US-04 – Follow Notifications

As a user,  
I want to receive notifications when someone I follow joins an event,  
So that I can join events my network is attending.  

## US-05 – Territory Preferences

As a user,  
I want to receive notifications for events in selected locations,  
So that I stay informed about relevant events.  

## US-06 – Admin Governance

As an admin,  
I want to issue warnings to rule-breaking users,  
So that community standards are maintained.  

## US-07 – Event Cancellation by Admin

As an admin,  
I want to cancel inappropriate events,  
So that platform integrity is preserved.  

## US-08 – Gender-Specific Sports Event

As an event organizer,  
I want to create a football event with limited players and gender-specific participation,  
So that I can organize fair and structured sports activities.  

---

# 7. System Logging Requirements

The system must log:

- Event creation  
- Event cancellation  
- Warnings issued  
- Account cancellations  
- Participant removals  

Logs must include:

- Actor  
- Timestamp  
- Action performed  

---

# 8. Key Constraints

- No private events  
- No event categories  
- No messaging feature  
- Gender restriction optional and description-based  
- Admins cannot edit events  
- Only admins can cancel events  
- All events visible globally