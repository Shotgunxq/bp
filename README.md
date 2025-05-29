# Bakalar

A Dockerized Angular application generated with Angular CLI version 17.0.7.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Docker Setup](#docker-setup)
- [Running the Application](#running-the-application)
- [Development Server (Optional)](#development-server-optional)

## Prerequisites

Before you begin, ensure you have installed:

- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Git](https://git-scm.com/downloads)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Shotgunxq/bp.git
   cd bp
   ```

2. **Copy or download the Docker images archive** (if provided separately):

   ```bash
   # Place bp-images.tar in the project root or specify the path
   ```

## Docker Setup

1. **Load prebuilt Docker images**

   ```bash
   docker load -i bp-images.tar
   ```

2. **Build the application containers**

   ```bash
   docker-compose build
   ```

## Running the Application

Launch the application in detached mode:

```bash
docker-compose up -d
```

After the services start, the app will be accessible at:

```
http://localhost/
```

## Development Server (Optional)

To run the application without Docker:

```bash
npm ci --legacy-peer-deps    # install dependencies
npm run start                # start Angular frontend
```

- The frontend will be served at `http://localhost:4200/`.
- In a new terminal window, start the backend:

  ```bash
  node server
  ```

> **Note:** The database still requires Docker.

---
