# Frontend (Admin Portal)

The frontend is a **Nuxt 3** server-side rendered admin portal. It is exclusively for administrators to manage alumni users, events, and platform settings. End-users (alumni) do not use this portal directly.

## Tech Stack

| Category | Technology | Version |
| ---------- | ----------- | --------- |
| **Framework** | Nuxt 3 | latest |
| **UI Library** | Vue 3 | latest |
| **Language** | TypeScript | latest |
| **Package Manager** | pnpm | 10.4+ |
| **HTTP Client** | Axios | 1.8+ |
| **State Management** | Pinia | 3.0+ |
| **CSS Framework** | Tailwind CSS | latest |
| **Component Library** | shadcn-nuxt / Reka UI | 1.0+ / 2.0+ |
| **Icons** | Lucide Vue Next + Heroicons | latest |
| **Code Quality** | ESLint + Prettier + Husky | latest |
| **Bundler** | Vite (bundled with Nuxt 3) | — |

## Architecture Overview

```mermaid
graph TD
    subgraph Browser
        PAGES[Pages<br/>pages/*.vue]
        LAYOUTS[Layouts<br/>layouts/*.vue]
        COMPONENTS[Components<br/>components/**/*.vue]
        STORES[Pinia Stores<br/>store/*.ts]
        APILAYER[API Layer<br/>api/*.ts]
    end

    subgraph Plugins
        AUTH_PLUGIN[auth.client.ts<br/>reactive auth state + middleware]
        API_PLUGIN[api.ts<br/>Axios baseURL]
    end

    subgraph Backend
        REST[FastAPI REST API]
    end

    PAGES --> LAYOUTS
    PAGES --> COMPONENTS
    PAGES --> STORES
    STORES --> APILAYER
    APILAYER --> REST
    AUTH_PLUGIN --> PAGES
    API_PLUGIN --> APILAYER
```

## Project Structure

```text
iu-alumni-frontend/
├── pages/
│   ├── index.vue           # Login page (/)
│   ├── users/
│   │   ├── index.vue       # User management dashboard
│   │   └── [id].vue        # User detail / editor
│   └── events/
│       ├── index.vue       # Event management dashboard
│       └── [id].vue        # Event detail + participants
├── store/
│   ├── users.ts            # User list, ban/verify state
│   └── events.ts           # Event list, approval state
├── api/
│   ├── index.ts            # Axios instance (token interceptor)
│   ├── auth.ts             # Login, import alumni, add admin
│   ├── users.ts            # User CRUD, ban, verify
│   └── events.ts           # Event CRUD, approve, participants
├── components/
│   ├── common/             # 14 shared UI components
│   ├── user/               # User-specific components
│   ├── event/              # Event-specific components
│   └── ui/toast/           # shadcn Toast system
├── layouts/
│   ├── default.vue         # Main layout (with nav header)
│   └── login.vue           # Minimal layout for login page
├── plugins/
│   ├── auth.client.ts      # Auth state, middleware, redirects
│   └── api.ts              # Configure Axios base URL
├── types/
│   └── index.ts            # TypeScript types (User, Event, etc.)
└── nuxt.config.ts          # Nuxt configuration
```

## Routing

Nuxt 3's **file-based routing** automatically generates routes from the `pages/` directory:

```mermaid
graph LR
    ROOT["/"] --> LOGIN[index.vue<br/>login layout]
    ROOT --> USERS["/users"] --> USERS_LIST[users/index.vue]
    ROOT --> USERS_ID["/users/:id"] --> USER_DETAIL["users/[id].vue"]
    ROOT --> EVENTS["/events"] --> EVENTS_LIST[events/index.vue]
    ROOT --> EVENT_ID["/events/:id"] --> EVENT_DETAIL["events/[id].vue"]

    subgraph Protected [Protected Routes]
        USERS_LIST
        USER_DETAIL
        EVENTS_LIST
        EVENT_DETAIL
    end
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant Admin
    participant Page as Login Page
    participant Plugin as auth.client.ts
    participant Store as localStorage
    participant API as Backend API

    Admin->>Page: Enter email + password
    Page->>API: POST /auth/login
    API-->>Page: {access_token: JWT}
    Page->>Plugin: $auth.login(token)
    Plugin->>Store: localStorage.setItem('token', JWT)
    Plugin->>Plugin: useState('authToken') updated
    Plugin->>Admin: Redirect to /users

    Note over Admin,API: Subsequent API calls
    Plugin->>API: Axios interceptor injects<br/>Authorization: Bearer {token}

    Note over Admin,API: Logout
    Admin->>Plugin: $auth.logout()
    Plugin->>Store: localStorage.removeItem('token')
    Plugin->>Admin: Redirect to /
```

## State Management (Pinia)

```mermaid
classDiagram
    class UsersStore {
        +users: User[]
        +bannedUsersIds: Set~string~
        +verifiedUsersIds: Set~string~
        +isUserBanned(id) bool
        +isUserVerified(id) bool
        +updateUsers(filters?)
        +getUserById(id)
        +changeUserBanStatus(id, ban)
        +changeUserVerificationStatus(id, verify)
    }

    class EventsStore {
        +events: Event[]
        +approvalSettings: EventApprovalSettings
        +getEventById(id) Event
        +updateEvents()
        +updateEvent(id, data)
        +deleteEvent(id)
        +listParticipants(id)
        +approveEvent(id)
        +declineEvent(id)
        +fetchApprovalSettings()
        +toggleAutoApprove()
    }

    class APILayer {
        +auth: login(), importAlumni(), addAdmin()
        +users: list(), getById(), ban(), verify()
        +events: list(), update(), approve(), decline()
    }

    UsersStore --> APILayer
    EventsStore --> APILayer
```

## API Integration

The `api/index.ts` module creates a shared Axios instance with two interceptors:

```mermaid
flowchart LR
    STORE[Pinia Store] --> API_MODULE[API Module<br/>api/*.ts]
    API_MODULE --> AXIOS[Axios Instance]
    AXIOS --> REQ_INT[Request Interceptor<br/>+ Authorization: Bearer token]
    REQ_INT --> BACKEND[FastAPI Backend]
    BACKEND --> RESP_INT[Response Interceptor<br/>error → toast notification]
    RESP_INT --> STORE
```

## Design Patterns

| Pattern | Where Used |
| --------- | ----------- |
| **Module Store (Pinia)** | Separate stores per domain (`users.ts`, `events.ts`) |
| **Derived State (Set)** | `bannedUsersIds` / `verifiedUsersIds` as `Set<string>` for O(1) lookups |
| **API Abstraction Layer** | `api/*.ts` modules isolate HTTP calls from components |
| **Request Interceptor** | Centralized auth token injection via Axios interceptor |
| **Response Interceptor** | Global error handling with toast notifications |
| **Reactive Auth State** | `useState('authToken')` — Vue 3 composable for cross-component state |
| **Cross-tab Logout** | `storage` event listener in `auth.client.ts` |
| **Computed Filtering** | Client-side search and filter computation (ban status, verification) |

## UI Component System

The frontend uses **shadcn-nuxt** (port of shadcn/ui to Vue), providing headless components styled with Tailwind CSS.

Custom Tailwind color palette:

| Token | Hex | Usage |
| ------- | ----- | ------- |
| `brandgreen` | `#40BA21` | Primary actions, highlights |
| `lightpink` | `#FF8591` | Danger/warning indicators |
| `darkpink` | `#BA2161` | Destructive actions |
| `darkgray` | — | Text |
| `lightgray` | — | Borders, backgrounds |

## Build & Tooling

| Script | Command | Purpose |
| -------- | --------- | --------- |
| `dev` | `nuxt dev` | Start dev server with HMR |
| `build` | `nuxt build` | Production SSR build |
| `generate` | `nuxt generate` | Static site generation |
| `lint` | `eslint --ext .ts,.vue --fix .` | Lint all TypeScript and Vue files |
| `format` | `prettier --write *.{vue,ts}` | Format code |
| `postinstall` | `nuxt prepare` | Generate `.nuxt/` typings |
