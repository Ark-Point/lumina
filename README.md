## Lumina Backend (Turbo Monorepo)

### Monorepo Structure & Responsibilities

```text
apps/
  api/         # REST API (NestJS)
  scheduler/   # Scheduled/Cron jobs (NestJS)
  worker/      # Queue/Worker services (NestJS / BullMQ)

packages/
  config/         # Shared configuration utilities (env, etc.)
  database/       # Database repository layer
  evm-contracts/  # EVM contract logic/configuration
  redis/          # Redis wrapper/utilities

docker-compose.yml  # Local Postgres & Redis containers
env.example         # Example environment variables (copy before use)
```

---

### Requirements

- Node.js (v24.8.0), npm
- Docker & Docker Compose

---

### Quick Start for Local Development

1. Install dependencies

```bash
npm install
```

2. Create your environment file

```bash
cp env.example env.local
```

- Open `env.local` and adjust values according to your local setup.
- Make sure the values below match those defined in `docker-compose.yml`.

```bash
# Common
NODE_ENV=local
TZ=Asia/Seoul

# Ports / Origins (replace with desired values if needed)
PORT=8001
APP_ORIGIN=http://localhost:3000
API_ORIGIN=http://localhost:8001
ALLOWED_CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_TYPE=postgres
DATABASE_HOST= # DB host
DATABASE_PORT= # DB port
DATABASE_USER= # DB user
DATABASE_PASSWORD= # DB password
DATABASE_NAME= # DB name
DATABASE_LOGGING=false

# Redis
REDIS_HOST= # Redis host
REDIS_PORT= # Redis port
REDIS_DB=0

# Scheduler env
## Temporary value — to be updated later
CRON_TVL=*/1 * * * * *
```

3. Start infrastructure services (Database / In-memory Cache)

```bash
docker compose up -d
```

4. Run apps using Turbo

```bash
# Development mode (run all apps in parallel)
npm run dev

# Build and start
npm run build && npm start
```

---

### Useful Commands

| Task        | Command         |
| ----------- | --------------- |
| Development | `npm run dev`   |
| Build       | `npm run build` |
| Start       | `npm start`     |
| Lint        | `npm run lint`  |
| Clean       | `npm run clean` |

---

### Notes

- Postgres and Redis run on ports `5432` and `6379` respectively by default. If ports are occupied by other processes, either update the ports in `docker-compose.yml` or stop the conflicting services.
- Each app (`apps/api`, `apps/scheduler`, `apps/worker`) uses shared packages located under `packages/*`. Turbo automatically detects changes and only rebuilds/restarts affected workspaces.
