# Functional Requirements

## Infrastructure & Migration

- [x] **FR1**: Migrate all services and data from external servers to university servers with small to zero downtime (< 1 hr downtime)
- [x] **FR2-a**: Ensure all functionalities remain operational post-migration with matching or improved performance metrics on telegram mini app
- [x] **FR2-b**: Ensure all functionalities remain operational post-migration with matching or improved performance metrics on mobile application

## Authentication & User Management

- [ ] **FR3**: Implement secure password recovery functionality allowing users to reset forgotten passwords via email or telegram
- [x] **FR4**: Fix email verification process to ensure reliable user email approval during registration

## Event Management

- [x] **FR5**: Fix and optimize event creation workflow with proper validation and error handling
- [ ] **FR6**: Send automatic notifications upon event creation to relevant users

## Maps & Location Services

- [ ] **FR7**: Implement automated map functionality with automatic location update every month with optional manual intervention
<!-- - [ ] **FR10**: Enable accurate location pinning for events and venues with search and filter capabilities -->

## Social Features

- [ ] **FR8**: Add follow request feature enabling users to send, accept, and reject connection requests
- [ ] **FR9**: Implement notification system for follow activities (requests, accepts, new followers)
<!-- - [ ] **FR10**: Provide privacy settings for follow preferences with followers/following management lists -->

## User Interface & Experience

- [ ] **FR10**: Redesign user profile with modern, intuitive layout displaying user information, events, and followers
<!-- - [ ] **FR16**: Enable edit profile functionality with media gallery integration -->
- [ ] **FR11**: Ensure consistent design language across platforms

## Cross-Platform Requirements

- [ ] **FR12**: Maintain all features on both mobile application and Telegram Mini App platforms
- [ ] **FR13**: Ensure consistent user experience and synchronized data across platforms
- [ ] **FR14**: Implement platform-specific optimizations where necessary to enhance performance and usability
- [x] **FR15**: Conduct regular testing on both platforms to maintain feature parity

<!-- ## Performance & Quality Metrics

- [ ] **FR22**: Achieve zero critical bugs per feature post-implementation
- [ ] **FR23**: Maintain user satisfaction score of 4/5 or higher
- [ ] **FR24**: Achieve cross-platform consistency score of 90% or higher -->

<!-- features elicitated by the previous team -->

<!-- ## Alumni Profile Management -->

<!-- - [ ] **FR16**: Allow administrators to create, edit, and view alumni profiles with full CRUD operations on alumni data -->
<!-- - [ ] **FR16**: Enable admins to keep alumni records up-to-date including contact information and graduation year -->

## Alumni Search & Filtering

- [ ] **FR16**: Provide search and filter functionality for admins to quickly locate specific alumni records by name, graduation year, and other relevant criteria

## Data Import/Export

- [x] **FR17**: Enable bulk importing of alumni data from CSV file format
- [x] **FR18**: Provide functionality to export alumni and event data for backup purposes or external analysis

## Event Listing & Browsing

- [x] **FR19**: Display a list of upcoming events to alumni users with sorting and filtering options by date, and location
- [x] **FR20**: Allow alumni to view detailed information of selected events including date, venue, donation, and description to facilitate participation decisions

## Email Notifications

- [x] **FR21**: Implement automated email notification system for key triggers including event registration confirmations, event reminders, and announcements

## User Roles & Permissions

- [ ] **FR22**: Support distinct user roles with appropriate access levels including Admin users with full management capabilities for alumni data and events, and Alumni users with limited access focused on event registration only

## Reports Generation

- [ ] **FR23**: Enable administrators to generate comprehensive reports including event attendance tracking and alumni participation summaries

<!-- ## User & Event Validation -->

<!-- - [ ] **FR26**: Implement validation mechanisms for user registration and event planning with flexibility for either automatic validation or manual approval at admin discretion -->

<!-- ## Performance & Quality Metrics

- [ ] **FR22**: Achieve zero critical bugs per feature post-implementation
- [ ] **FR23**: Maintain user satisfaction score of 4/5 or higher
- [ ] **FR24**: Achieve cross-platform consistency score of 90% or higher -->