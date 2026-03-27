# Seek — Installation & Deployment Guide

## Table of Contents
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [VPS / Production Deployment](#vps--production-deployment)
- [Post-Deploy: Install Language Runtimes](#post-deploy-install-language-runtimes)
- [Environment Variables Reference](#environment-variables-reference)
- [Maintenance](#maintenance)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Docker | 24+ | Required |
| Docker Compose | v2 plugin | `docker compose` (not `docker-compose`) |
| Git | Any | For cloning the repo |
| Node.js | 18+ | Local dev only — not needed on VPS |

---

## Local Development

### 1. Clone the repo
```bash
git clone https://github.com/MasoodZaf/Seek.git
cd Seek
```

### 2. Configure environment
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` — the defaults work for local development as-is.

### 3. Start all containers
```bash
docker compose up -d --build
```

### 4. Install Piston language runtimes
```bash
docker cp backend/scripts/installPistonPackages.js seek-backend:/tmp/installPistonPackages.js
docker exec seek-backend node /tmp/installPistonPackages.js
```

This installs all 13 language compilers (JavaScript, Python, TypeScript, Java, C++, C, Go, Rust, C#, PHP, Ruby, Kotlin, Swift). Takes ~10 minutes on first run.

### 5. Open the app
```
http://localhost:3000
```

---

## VPS / Production Deployment

### Step 1 — Install Docker on the server

SSH into your VPS (via web console or SSH) and run:

```bash
curl -fsSL https://get.docker.com | sh
systemctl start docker
systemctl enable docker
docker --version   # confirm installed
```

### Step 2 — Clone the repository
```bash
git clone https://github.com/MasoodZaf/Seek.git /opt/seek
cd /opt/seek
```

### Step 3 — Configure production environment
```bash
nano backend/.env
```

Make these changes from the defaults:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb://mongo:27017/seek` |
| `ALLOWED_ORIGINS` | `http://YOUR_SERVER_IP:3000` |
| `FRONTEND_URL` | `http://YOUR_SERVER_IP:3000` |
| `PISTON_BASE_URL` | `http://seek-piston:2000` |
| `COOKIE_SECURE` | `false` *(HTTP only — set `true` if using HTTPS)* |
| `COOKIE_SAMESITE` | `lax` |

Add these two lines at the bottom if not present:
```
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
```

> **Important:** If you add HTTPS later, change `COOKIE_SECURE=true` and `COOKIE_SAMESITE=strict`.

### Step 4 — Open firewall ports
```bash
ufw allow 3000/tcp
ufw allow 5001/tcp
```

### Step 5 — Build and start
```bash
docker compose up -d --build
```

All 4 containers will start:

| Container | Role | Port |
|-----------|------|------|
| `seek-frontend` | React app + Nginx proxy | 3000 |
| `seek-backend` | Node/Express API | 5001 → 5002 |
| `seek-mongo` | MongoDB database | internal only |
| `seek-piston` | Code execution sandbox | internal only |

### Step 6 — Install language runtimes
```bash
docker cp backend/scripts/installPistonPackages.js seek-backend:/tmp/installPistonPackages.js
docker exec seek-backend node /tmp/installPistonPackages.js
```

### Step 7 — Verify
```bash
docker ps
```

All containers should show `Up` / `healthy`. Open:
```
http://YOUR_SERVER_IP:3000
```

---

## Post-Deploy: Install Language Runtimes

If you ever need to reinstall Piston language packages (e.g. after wiping the `piston_packages` volume):

```bash
docker cp backend/scripts/installPistonPackages.js seek-backend:/tmp/installPistonPackages.js
docker exec seek-backend node /tmp/installPistonPackages.js
```

Installed languages and versions:

| Language | Version |
|----------|---------|
| JavaScript | 18.15.0 |
| Python | 3.10.0 |
| TypeScript | 5.0.3 |
| Java | 15.0.2 |
| C++ | 10.2.0 |
| C | 10.2.0 |
| Go | 1.16.2 |
| Rust | 1.68.2 |
| C# (.NET) | 5.0.201 |
| PHP | 8.2.3 |
| Ruby | 3.0.1 |
| Kotlin | 1.8.20 |
| Swift | 5.3.3 |

---

## Environment Variables Reference

### Backend (`backend/.env`)

```env
# Server
NODE_ENV=production
PORT=5002

# Database (Docker internal hostname)
MONGODB_URI=mongodb://mongo:27017/seek

# JWT — generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=<64-char random hex>
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=<different 64-char random hex>
JWT_REFRESH_EXPIRE=30d
COOKIE_EXPIRE=7

# Cookies — use false for HTTP, true for HTTPS
COOKIE_SECURE=false
COOKIE_SAMESITE=lax

# CORS
ALLOWED_ORIGINS=http://YOUR_IP:3000
FRONTEND_URL=http://YOUR_IP:3000

# Piston (Docker internal hostname)
PISTON_BASE_URL=http://seek-piston:2000

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Code execution
CODE_EXECUTION_TIMEOUT=5000
MAX_CODE_LENGTH=10000

# Logging
LOG_LEVEL=info
```

### Generating new JWT secrets
```bash
node -e "const c=require('crypto'); console.log('JWT_SECRET='+c.randomBytes(64).toString('hex')); console.log('JWT_REFRESH_SECRET='+c.randomBytes(64).toString('hex'));"
```

---

## Maintenance

### Pull latest code and redeploy
```bash
cd /opt/seek
git pull
docker compose build
docker compose up -d --force-recreate
```

### Rebuild a single service
```bash
docker compose build backend
docker compose up -d --force-recreate backend
```

### View logs
```bash
docker logs seek-backend -f
docker logs seek-frontend -f
docker logs seek-piston -f
```

### Restart all containers
```bash
docker compose restart
```

### Stop everything
```bash
docker compose down
```

### Stop and wipe all data (destructive)
```bash
docker compose down -v   # removes volumes including database
```

---

## Troubleshooting

### Login loops back after onboarding
Cookies set with `secure: true` require HTTPS. On HTTP servers set:
```
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
```
Then rebuild: `docker compose build backend && docker compose up -d --force-recreate backend`

### Code execution returns "service unavailable"
Piston's `isolate` sandbox requires the container to run privileged. Check `docker-compose.yml` has `privileged: true` on the piston service and does **not** have `no-new-privileges:true` (this breaks the setuid sandbox).

### TypeScript errors: "Cannot find name 'Map'"
The backend automatically prepends ES2015–ES2020 lib directives to TypeScript submissions. If this happens, ensure you're running the latest backend image.

### Go/Rust blocked with "dangerous operations"
Security pattern checks are restricted to JavaScript/TypeScript only. Other languages run inside Piston's sandbox. If seeing this error, ensure you're on the latest backend image.

### Docker daemon not starting
```bash
systemctl status docker
systemctl start docker
journalctl -u docker -n 50   # view error logs
```

### Port already in use
```bash
lsof -i :3000    # find what's using port 3000
lsof -i :5001
```

### Check all container statuses
```bash
docker compose ps
docker stats     # live CPU/memory usage
```
