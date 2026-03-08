# Mobile App

The mobile application is built with **Flutter** and targets iOS, Android, and Web. It is the primary interface for alumni to browse events, manage their profiles, and interact with the platform.

## Tech Stack

| Category | Technology | Version |
| -------- | ---------- | ------- |
| **Language** | Dart | ^3.8+ |
| **Framework** | Flutter | ^3.32+ |
| **State Management** | flutter_bloc (Cubit) | ^9.0+ |
| **Navigation** | AutoRoute | ^9.3+ |
| **HTTP Client** | Dio | ^5.8+ |
| **Serialization** | Freezed + json_serializable | ^2.5, ^6.9 |
| **Error Handling** | fpdart (functional) | ^1.1+ |
| **Secure Storage** | flutter_secure_storage | ^9.2+ |
| **Local Database** | sqflite (mobile) | ^2.4+ |
| **Maps** | flutter_map | latest |
| **SVG Support** | flutter_svg | latest |
| **Analytics** | AppMetrica | native |
| **Code Generation** | build_runner + freezed_runner | latest |
| **Logging** | logger | ^2.5+ |

## 3-Layer Architecture

```mermaid
graph TB
    subgraph Presentation ["Presentation Layer (lib/presentation/)"]
        PAGES[Pages / Screens]
        WIDGETS[Reusable Widgets]
        CUBITS[Cubits / BLoC]
        ROUTER[AutoRoute Router]
    end

    subgraph Application ["Application Layer (lib/application/)"]
        REPOS[Repositories]
        DOMAIN[Domain Models<br/>Freezed]
        MAPPERS[Mappers]
        REPORTER[Analytics Reporter]
    end

    subgraph Data ["Data Layer (lib/data/)"]
        GATEWAYS[Gateways / HTTP<br/>Dio]
        DATA_MODELS[Data Models<br/>Freezed + JSON]
        TOKEN[Token Manager<br/>Secure Storage]
        DB[Local DB<br/>sqflite]
    end

    CUBITS --> REPOS
    REPOS --> GATEWAYS
    REPOS --> MAPPERS
    MAPPERS --> DATA_MODELS
    MAPPERS --> DOMAIN
    GATEWAYS --> TOKEN
    GATEWAYS --> DB
```

## Project Structure

```text
lib/
├── main.dart                     # Entry point, system UI config
├── app.dart                      # MultiBlocProvider DI, MaterialApp, AutoRoute
├── data/
│   ├── gateways/                 # HTTP interfaces + Dio implementations
│   │   ├── auth_gateway.dart / _impl.dart
│   │   ├── events_gateway.dart / _impl.dart
│   │   ├── profile_gateway.dart / _impl.dart
│   │   ├── users_gateway.dart / _impl.dart
│   │   └── locations_gateway.dart / _impl.dart
│   ├── models/                   # JSON-mapped Freezed data models
│   ├── token/                    # TokenManager + secure storage persistence
│   ├── config/                   # API base URL config (web vs mobile)
│   ├── paths.dart                # API endpoint string constants
│   ├── secrets/                  # AppMetrica key loader
│   └── db/                      # sqflite DB manager
├── application/
│   ├── repositories/             # Business logic interfaces + implementations
│   │   ├── auth/
│   │   ├── events/               # With in-memory caching
│   │   ├── users/
│   │   ├── locations/
│   │   └── reporter/             # AppMetrica / Mock analytics
│   ├── models/                   # Domain models (Freezed)
│   │   ├── profile.dart
│   │   ├── event.dart
│   │   ├── cost.dart
│   │   └── ...
│   └── mappers/                  # DataModel → DomainModel converters
├── presentation/
│   ├── router/                   # AutoRoute config + generated routes
│   ├── blocs/                    # Cubits (one per feature)
│   ├── pages/                    # Screen widgets
│   ├── managers/                 # app_loading_manager.dart (startup orchestration)
│   └── common/
│       ├── constants/            # AppColors, AppTextStyles
│       └── widgets/              # Shared reusable widgets
└── util/
    └── logger.dart
```

## State Management: Cubit Pattern

Cubits are the lighter variant of BLoC — they emit states directly via functions instead of processing events.

### Generic LoadedState

```mermaid
stateDiagram-v2
    [*] --> Init: Cubit created
    Init --> Loading: load() called
    Loading --> Data: API success
    Loading --> Error: API failure
    Data --> Loading: reload() called
    Error --> Loading: retry() called
```

All Cubits use a sealed `LoadedState<T>` class:

```text
LoadedState<T>
├── LoadedStateInit()        — initial/idle
├── LoadedStateLoading()     — async operation in progress
├── LoadedStateData(T data)  — success with typed payload
└── LoadedStateError(String) — failure with message
```

### Cubit Inventory

| Cubit | Scope | Responsibility |
| ----- | ----- | -------------- |
| `AuthCubit` | Auth pages | Email/password login, validation |
| `RegistrationCubit` | Registration page | Registration form + API call |
| `EventsListCubit` | Global (root) | Load + cache event list |
| `ProfileCubit` | Global (root) | Load current user profile + participation |
| `ProfileEditingCubit` | Edit profile page | Update bio, photo, social links |
| `OneEventCubit` | Event detail page | Fetch event, join/leave |
| `RootPageCubit` | Root page | Bottom navigation tab index |
| `PinLocationsCubit` | Map page | Load event pins for map |
| `PasswordReset*Cubits` | Password reset pages | Request + confirm reset flow |

## Navigation (AutoRoute)

```mermaid
graph TD
    SPLASH[AppLoadingPage] -->|token present| ROOT[RootPage]
    SPLASH -->|no token| AUTH[AuthPage]

    AUTH --> SIGN_IN[SignInSubPage]
    AUTH --> REGISTER[RegistrationSubPage]
    AUTH --> CODE_VERIFY[CodeVerificationSubPage]
    AUTH --> OTP_REQ[OtpRequestSubPage]
    AUTH --> OTP_VERIFY[OtpVerifySubPage]
    AUTH --> PWD_RESET[PasswordResetPage]

    ROOT --> EVENTS_TAB[EventsListPage]
    ROOT --> MAP_TAB[MapPage]
    ROOT --> PROFILE_TAB[ProfilePage]

    EVENTS_TAB --> EVENT_DETAIL[EventDetailPage]
    EVENTS_TAB --> EVENT_EDIT[EventEditingPage]
    PROFILE_TAB --> PROFILE_EDIT[ProfileEditingPage]
    PROFILE_TAB --> OTHER_PROFILE[OtherUserProfilePage]
```

## Dependency Injection

Dependencies are wired at app startup in `app.dart` using Flutter's `MultiBlocProvider`:

```mermaid
flowchart TD
    APP[app.dart<br/>MultiBlocProvider] --> DIO[Dio<br/>HTTP client]
    APP --> TOKEN[TokenManager<br/>Secure Storage]
    APP --> GATEWAYS[Gateways<br/>auth, events, profile, users, locations]
    APP --> REPOS[Repositories<br/>auth, events, profile, locations, reporter]
    APP --> CUBITS[Cubits<br/>provided to widget tree]
    DIO --> TOKEN
    GATEWAYS --> DIO
    REPOS --> GATEWAYS
    CUBITS --> REPOS
```

Services are accessed via `context.read<T>()` throughout the widget tree.

## Data Flow: Load Events

```mermaid
sequenceDiagram
    participant UI as EventsListPage
    participant Cubit as EventsListCubit
    participant Repo as EventsRepository
    participant GW as EventsGateway (Dio)
    participant API as FastAPI Backend

    UI->>Cubit: load()
    Cubit->>Cubit: emit(LoadedStateLoading)
    Cubit->>Repo: getEvents()
    Repo->>GW: fetchEvents()
    GW->>API: GET /events
    API-->>GW: JSON list
    GW-->>Repo: List<EventDataModel>
    Repo->>Repo: map to List<EventModel>
    Repo-->>Cubit: List<EventModel> (cached)
    Cubit->>Cubit: emit(LoadedStateData(events))
    Cubit-->>UI: rebuild with event list
```

## Error Handling Strategy

The app uses **fpdart** `Either<L, R>` types in the repository layer:

- `Right<EventModel>` — success path
- `Left<AppError>` — typed error (network failure, auth error, not found, etc.)

Cubits pattern-match on `Either` to emit `LoadedStateData` or `LoadedStateError`.

## Analytics

The analytics reporter is abstracted behind an interface:

| Implementation | When Used |
| -------------- | --------- |
| `ReporterAppMetrica` | Production builds (uses AppMetrica SDK) |
| `ReporterMock` | Testing / development (no-op) |

## Platform Notes

| Platform | Config Source | Token Storage |
| -------- | ------------- | ------------- |
| **Android / iOS** | App environment | `flutter_secure_storage` (Keychain/Keystore) |
| **Web** | `window.apiBaseUrl` injected at build time | Browser secure storage |
