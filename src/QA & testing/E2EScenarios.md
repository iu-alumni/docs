# E2E Test Scenarios - ALUMAP

## Test Case 1: User Registration → Login (autoapproval off) — [Issue](https://github.com/iu-alumni/iu-alumni-backend/issues/118)

**Steps:**

1. Open registration screen
2. Enter valid email, first name, last name, password, tg alias, graduation year.
3. Click Register.
4. Verify redirect to login screen.
5. Login with created credentials.
6. Verify redirect to events page.

**Negative cases:**

- Register with existing email → error message "User with this email already exists"
- Login with wrong password → error message  "Wrong password or login"
- Login with unregistered email → error message "User not found"
- Empty fields → validation errors "Please, specify all fields to complete the verification"

---

## Test Case 2: Create Event (autoapprove event ON) — [Issue](https://github.com/iu-alumni/iu-alumni-backend/issues/119)

**Steps:**

1. Login as user
2. Navigate to Events screen
3. Click "Create Event"
4. Fill all required fields (title, description, date, location)
5. Click "post event"
6. Refresh the page
7. Find created event in list of events.

**Negative cases:**

- Create event with empty required fields → validation

---

## Test Case 3: Map Loading — [Issue](https://github.com/iu-alumni/iu-alumni-backend/issues/135)

**Steps:**

1. Login as user
2. Go to map page
3. Verify map loads within 5 seconds

---

## Test Case 4: Admin Panel – Approve Event (autoapprove off) — [Issue](https://github.com/iu-alumni/iu-alumni-backend/issues/136)

**Precondition:**

1. Event created.

**Steps:**

1. Login to admin panel
2. Go to events page
3. Select a pending event
4. Click "View Details"
5. Click "Approve"
6. Verify event status changes to "approved"

---

## Test Case 5: Empty Fields Validation (All Forms) — [Issue](https://github.com/iu-alumni/iu-alumni-backend/issues/137)

**Tested forms:**

- Registration (email, name, password, graduation year)
- Create Event (title, description, date, location)

**Steps (for each form):**

1. Open form
2. Click submit with all fields empty
3. Verify validation messages for each field
4. Fill only one field (others empty)
5. Verify validation messages for empty fields only
6. Fill all fields with valid data
7. Verify no validation messages, form submits

---

## Test Case 6: Edit Profile — [Issue](https://github.com/iu-alumni/iu-alumni-backend/issues/138)

**Steps:**

1. Login as user
2. Go to profile page
3. Click "Edit"
4. Update name
5. Save
6. Verify new name appears on profile

**Negative cases:**

- Empty fields → validation

---

## Test Case 7: Admin – Verify / Ban User — [Issue](https://github.com/iu-alumni/iu-alumni-backend/issues/138)

**Steps:**

1. Login to admin panel
2. Navigate to "Users" list
3. Find unverified user
4. Click "Verify"
5. Verify user status changes to "verified"
6. Find a different user
7. Click "Ban"
8. Confirm ban
9. Try to login as banned user
10. Verify error message "Account banned"

---

## Test Case 8: View Event Details — [Issue](https://github.com/iu-alumni/iu-alumni-backend/issues/138)

**Steps:**

1. Login as regular user
2. Navigate to Events screen
3. Click on an existing event
4. Verify details screen shows:
   - Title
   - Description
   - Date and time
   - Location
   - Current participants count
   - Creator name
5. If user is creator → "Edit" button visible
6. If user is not creator → "Participate" button visible
