# System Overview

The IU Alumni platform is a multi-component web and mobile system that connects Innopolis University graduates. It consists of four main components: a REST API backend, an admin web portal (frontend), a cross-platform mobile app, and a server infrastructure layer.

## Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend** | Python / FastAPI | REST API, business logic, database, integrations |
| **Frontend** | Nuxt 3 / Vue 3 | Admin portal (user & event management) |
| **Mobile** | Flutter / Dart | Alumni-facing mobile app (iOS, Android, Web) |
| **Infrastructure** | Docker Swarm / Ansible / Terraform | Server provisioning, orchestration, CI/CD |

## High-Level Architecture

```mermaid
graph TB
    subgraph Clients
        MOB[Mobile App<br/>Flutter]
        WEB[Admin Portal<br/>Nuxt 3]
        TG[Telegram Bot<br/>Webhook]
    end

    subgraph Server ["Server (Docker Swarm)"]
        NGINX[Nginx<br/>Reverse Proxy + SSL]

        subgraph AppServices ["Application Services"]
            BE[Backend<br/>FastAPI :8080]
            FE[Frontend<br/>Nuxt SSR :3000]
            MOBILE_WEB[Mobile Web<br/>Flutter Web :80]
        end

        subgraph Infra ["Infrastructure Services"]
            PG[(PostgreSQL 16)]
            PROM[Prometheus]
            GRAF[Grafana]
            PORT[Portainer]
        end
    end

    subgraph External
        SMTP[SMTP Server<br/>Gmail]
        TGAPI[Telegram Bot API]
        GHCR[GitHub Container Registry]
    end

    MOB -->|HTTPS REST| NGINX
    WEB -->|HTTPS REST| NGINX
    TG -->|Webhook POST| NGINX
    NGINX --> BE
    NGINX --> FE
    NGINX --> MOBILE_WEB
    NGINX --> GRAF
    NGINX --> PORT

    BE --> PG
    BE -->|SMTP| SMTP
    BE -->|Bot API| TGAPI
    PROM -->|scrape /metrics| BE
    PROM --> GRAF
```

## Domain Routing

```mermaid
graph LR
    DNS["DNS Records<br/>(A record → server IP)"]

    DNS --> ROOT["alumni.example.com<br/>→ Frontend (Nuxt)"]
    DNS --> API["api.alumni.example.com<br/>→ Backend (FastAPI)"]
    DNS --> MOBILE["mobile.alumni.example.com<br/>→ Mobile Web (Flutter)"]
    DNS --> GRAFANA["grafana.alumni.example.com<br/>→ Grafana Dashboards"]
    DNS --> PORTAINER["portainer.alumni.example.com<br/>→ Portainer UI"]
```

## Data Flow: User Authentication

```mermaid
sequenceDiagram
    actor User
    participant App as Mobile / Frontend
    participant API as Backend (FastAPI)
    participant DB as PostgreSQL
    participant Email as SMTP

    User->>App: Enter email + password
    App->>API: POST /auth/login
    API->>DB: Query alumni by email
    DB-->>API: Alumni record
    API->>API: Verify password (bcrypt)
    API-->>App: JWT access_token (1 year)
    App->>App: Store token (secure storage)

    Note over App,API: Subsequent requests

    App->>API: GET /profile (Bearer token)
    API->>API: Validate JWT, extract user
    API->>DB: Fetch user data
    DB-->>API: User record
    API-->>App: Profile response
```

## CI/CD Flow

```mermaid
flowchart TD
    DEV[Developer pushes to branch] --> PR[Open Pull Request]
    PR --> CI[GitHub Actions CI<br/>lint + test]
    CI --> BUILD[Build Docker image<br/>tag: git SHA]
    BUILD --> GHCR[Push to GHCR]
    GHCR --> DEPLOY_TEST[Deploy to Testing<br/>via SSH + Docker Swarm]
    PR --> MERGE[Merge to main]
    MERGE --> DEPLOY_PROD[Deploy to Production<br/>via SSH + Docker Swarm]
```

## Cross-Cutting Concerns

| Concern | Solution |
|---------|----------|
| **Authentication** | JWT Bearer tokens (HS256, 1-year expiry) |
| **Email Verification** | 6-digit OTP codes via SMTP |
| **Notifications** | Telegram Bot API (event reminders) |
| **Metrics** | Prometheus + Grafana (FastAPI, PostgreSQL, Node) |
| **SSL/TLS** | Let's Encrypt via Certbot (auto-renewed every 12h) |
| **Secrets** | GitHub Actions environment secrets → server `.env` |
| **Container Registry** | GitHub Container Registry (GHCR) |
| **Database Migrations** | Alembic (auto-applied on container start) |
