# Infrastructure

The infrastructure is a **single-server Docker Swarm** deployment managed through **Ansible** for server provisioning, **GitHub Actions** for CI/CD, and **Terraform** for GitHub repository and environment configuration.

## Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Orchestration** | Docker Swarm | Container scheduling, networking, restarts |
| **Provisioning** | Ansible | Idempotent server setup (Docker, UFW, Fail2ban) |
| **IaC (GitHub)** | Terraform (GitHub provider) | Repo settings, branch protection, environments, secrets |
| **CI/CD** | GitHub Actions | Lint, build, deploy workflows |
| **Reverse Proxy** | Nginx | SSL termination, subdomain routing |
| **SSL** | Certbot / Let's Encrypt | Auto-renewed TLS certificates |
| **Metrics** | Prometheus + Grafana | Monitoring and dashboards |
| **Container Registry** | GitHub Container Registry (GHCR) | Docker image storage |

## Infrastructure Topology

```mermaid
graph TB
    INTERNET[Internet] --> NGINX[Nginx :80/:443<br/>SSL Termination]

    subgraph DockerSwarm ["Docker Swarm — Overlay Network (iu_alumni_network)"]
        NGINX

        subgraph AppServices ["Application Services"]
            BE[Backend<br/>FastAPI :8080]
            FE[Frontend<br/>Nuxt SSR :3000]
            MOB[Mobile Web<br/>Flutter :80]
        end

        subgraph Monitoring
            PROM[Prometheus :9090]
            GRAF[Grafana :3000]
            NODE_EXP[Node Exporter :9100]
            PG_EXP[Postgres Exporter :9187]
        end

        subgraph Data
            PG[(PostgreSQL 16 :5432)]
            PG_BACKUP[Postgres Backup<br/>daily/weekly/monthly]
        end

        PORT[Portainer :9000]
    end

    NGINX --> BE
    NGINX --> FE
    NGINX --> MOB
    NGINX --> GRAF
    NGINX --> PORT
    PROM --> BE
    PROM --> NODE_EXP
    PROM --> PG_EXP
    PROM --> GRAF
    PG_EXP --> PG
    BE --> PG
    PG_BACKUP --> PG
```

## Domain Routing

| Subdomain | Service | Internal Target |
|-----------|---------|----------------|
| `alumni.example.com` | Frontend (Nuxt SSR) | `frontend:3000` |
| `api.alumni.example.com` | Backend (FastAPI) | `backend:8080` |
| `mobile.alumni.example.com` | Mobile Web (Flutter) | `mobile:80` |
| `grafana.alumni.example.com` | Grafana dashboards | `grafana:3000` |
| `portainer.alumni.example.com` | Docker Swarm UI | `portainer:9000` |

All HTTP traffic is redirected to HTTPS. TLS terminates at Nginx using Let's Encrypt certificates.

## Services Inventory

| Service | Image | Resources | Persistence |
|---------|-------|-----------|-------------|
| nginx | `nginx:alpine` | 0.5 CPU / 256 MB | nginx configs volume |
| certbot | `certbot/certbot` | — | `/data/certbot/` |
| postgres | `postgres:16` | pinned to manager | `/data/postgres/` |
| postgres-backup | `prodrigestivill/postgres-backup-local:16` | — | `/data/backups/` |
| portainer | `portainer/portainer-ce:latest` | — | portainer data volume |
| prometheus | `prom/prometheus:v2.52.0` | pinned to manager | `/data/prometheus/` (30-day retention) |
| grafana | `grafana/grafana:11.0.0` | — | grafana provisioning configs |
| node-exporter | `prom/node-exporter:v1.8.0` | global (all nodes) | — |
| postgres-exporter | `prometheuscommunity/postgres-exporter:v0.15.0` | — | — |

## CI/CD Pipeline

```mermaid
flowchart TD
    PUSH[Push to branch] --> PR[Pull Request opened]
    PR --> CI_LINT["CI: lint + test<br/>(GitHub Actions)"]
    CI_LINT --> BUILD["Build Docker image<br/>tag: ghcr.io/org/app:{SHA}"]
    BUILD --> PUSH_GHCR[Push to GHCR]
    PUSH_GHCR --> DEPLOY_TEST["Deploy to Testing<br/>SSH → docker stack deploy"]

    PR --> MERGE[Merge to main]
    MERGE --> DEPLOY_PROD["Deploy to Production<br/>SSH → docker stack deploy"]
```

### Workflow Files

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | PR / push to main | Lint YAML, Ansible, shell; validate Docker configs |
| `setup-server.yml` | Manual / Ansible file changes | Run Ansible playbook to provision server |
| `deploy.yml` | Push to main (infra files changed) | Redeploy infrastructure stack |
| `deploy-service.yml` | Reusable workflow | Deploy a specific app service (backend, frontend, mobile) |
| `update-env.yml` | Manual dispatch | Update server `.env` without full redeploy |
| `mobile.yml` | Manual / `repository_dispatch` | Build Flutter web + deploy |

### Deployment Detail (per service)

```mermaid
sequenceDiagram
    participant GH as GitHub Actions
    participant GHCR as Container Registry
    participant SERVER as Linux Server

    GH->>GH: Build Docker image
    GH->>GHCR: docker push ghcr.io/org/app:{SHA}
    GH->>SERVER: SSH connect
    SERVER->>SERVER: Load /home/deploy/iu-alumni/.env
    SERVER->>SERVER: docker stack deploy -c docker-stack.yml {stack_name}<br/>with IMAGE={SHA}
    SERVER->>GHCR: docker pull image
    SERVER->>SERVER: Rolling update (Swarm)
```

## Server Provisioning (Ansible)

```mermaid
flowchart TD
    GH[GitHub Actions<br/>setup-server.yml] --> ANSIBLE[Ansible Playbook<br/>setup-server.yml]

    subgraph Ansible Tasks
        APT[Update apt packages]
        DOCKER[Install Docker CE<br/>+ Docker Compose plugin]
        SWARM[docker swarm init]
        UFW[Configure UFW<br/>allow 22, 80, 443]
        F2B[Install + configure fail2ban<br/>SSH brute-force protection]
        DIRS[Create deploy directories<br/>/home/deploy/iu-alumni/]
        ENV[Write .env from Jinja2 template<br/>all secrets injected]
        ZSH[Install Zsh + Oh My Zsh<br/>for deploy user]
    end

    ANSIBLE --> APT --> DOCKER --> SWARM --> UFW --> F2B --> DIRS --> ENV --> ZSH
```

The playbook is **idempotent** — safe to re-run at any time (e.g., after adding a new secret).

## Terraform: GitHub Repository Management

Terraform manages GitHub configuration as code:

```mermaid
graph LR
    TF[Terraform<br/>terraform/github/] --> REPOS[repos.tf<br/>repo settings + branch protection]
    TF --> ENVS[environments.tf<br/>GitHub Environments + secrets]
    TF --> VARS[variables.tf<br/>all 30+ secret variables]

    REPOS --> GH_REPO[GitHub Repos<br/>backend, frontend, mobile, infra]
    ENVS --> TESTING[testing environment<br/>auto-deploy, no approval]
    ENVS --> PROD[production environment<br/>manual approval required]
```

**Repository enforcement:**
- Squash-merge only
- Auto-delete head branches on merge
- Required status checks before merging to `main`
- Branch deletion protection

## Monitoring Stack

```mermaid
graph LR
    BE[Backend :8080/metrics] --> PROM
    NODE[Node Exporter :9100] --> PROM
    PG_EXP[Postgres Exporter :9187] --> PROM[Prometheus<br/>15s scrape interval<br/>30-day retention]
    PROM --> GRAF[Grafana<br/>grafana.example.com]

    subgraph Dashboards
        GRAF --> D1[FastAPI metrics]
        GRAF --> D2[PostgreSQL health]
        GRAF --> D3[Node resources<br/>CPU, disk, memory]
        GRAF --> D4[Prometheus overview]
    end
```

## Environment Structure

| Property | Testing | Production |
|----------|---------|-----------|
| **Branch** | `develop` | `main` |
| **Deploy trigger** | Auto on push | Auto on merge to main |
| **Approval required** | No | Yes (manual) |
| **Domain** | configurable via secrets | configurable via secrets |
| **Secrets** | Separate set | Separate set |

## Security

| Layer | Mechanism |
|-------|-----------|
| **Firewall** | UFW — only ports 22, 80, 443 open |
| **Brute-force** | Fail2ban — 5 SSH failures → 3600s ban |
| **TLS** | Let's Encrypt (auto-renew every 12h via Certbot) |
| **Secrets** | GitHub Actions environment secrets → `.env` via Ansible |
| **Registry auth** | GHCR — GitHub token-based pull access |
| **Docker** | Overlay network (services not exposed to host by default) |

## Server Migration Pattern

The deployment is designed to be server-agnostic. To migrate to a new server:

1. Update `SERVER_HOST` GitHub secret to new server IP
2. Update DNS A-records to point to new IP
3. Trigger "Setup Server" GitHub Actions workflow
4. All services redeploy automatically — no code changes required
