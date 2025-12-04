# Bakalar

A Dockerized Angular application (CLI 17.0.7) for frequency response analysis and plotting tools.

**Access Note:** Login requires LDAP authorization with a valid `@stuba.sk` email (students/teachers only).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start with Docker](#quick-start-with-docker)
- [Development without Docker](#development-without-docker)
- [Accessing the App](#accessing-the-app)

## Prerequisites

Install these tools before starting:

- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Git](https://git-scm.com/downloads)
- PostgreSQL (optional, for non-Docker DB setup)

## Quick Start with Docker

This automates building and running the full stack: Angular frontend (FE), Node.js backend (BE), and PostgreSQL database (DB).

1. Clone the repository:

   ```bash
   git clone https://github.com/Shotgunxq/bp.git
   cd bp
   ```

2. Launch everything:

   ```bash
   docker-compose build
   ```

Docker handles dependency installation, builds, and service orchestration.

## Development without Docker

Run components separately for local development.

1. Clone the repository (if not done):

```
git clone https://github.com/Shotgunxq/bp.git
cd bp
```

2. Install frontend dependencies (uses `--legacy-peer-deps` for Math/LaTeX libraries):

```
npm ci --legacy-peer-deps

```

3. Start the Angular frontend:

```
ng serve
```

- Served at `http://localhost:4200`.

4. In a new terminal, start the Express backend:

```
node server
```

5. Start PostgreSQL DB separately (via Docker):

```
docker-compose up postgres-db

```

- Uses `postgres:17` image with:
  - User: `postgres`
  - Password: `postgres123`
  - DB: `myappdb`
  - Port: `5432`
  - Volumes: `pgdata` (persistent) + `./scripts/db` for init scripts.
- Full service config (from `docker-compose.yml`):
  ```
  postgres-db:
    container_name: postgres-db
    image: postgres:17
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres123
      POSTGRES_DB: myappdb
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./scripts/db:/docker-entrypoint-initdb.d
  ```

## Accessing the App

- With Docker: `http://localhost/`
- Frontend dev server: `http://localhost:4200`

Stop services with `Ctrl+C` (Docker) or `docker-compose down`.
