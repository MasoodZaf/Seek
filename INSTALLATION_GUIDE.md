# Seek Platform - Complete Installation Guide

![Seek Platform](https://img.shields.io/badge/Seek-Learning%20Platform-blue)
![Node](https://img.shields.io/badge/Node-%3E%3D18.0.0-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Required-green)
![Docker](https://img.shields.io/badge/Docker-Required-blue)

This comprehensive guide will walk you through installing all necessary dependencies, services, and servers to successfully run the Seek coding learning platform.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installing Core Dependencies](#installing-core-dependencies)
4. [Installing MongoDB](#installing-mongodb)
5. [Installing Docker](#installing-docker)
6. [Cloning the Repository](#cloning-the-repository)
7. [Environment Configuration](#environment-configuration)
8. [Installing Project Dependencies](#installing-project-dependencies)
9. [Building Docker Images](#building-docker-images)
10. [Database Setup](#database-setup)
11. [Running the Application](#running-the-application)
12. [Verification](#verification)
13. [Troubleshooting](#troubleshooting)
14. [Optional Services](#optional-services)

---

## Prerequisites

Before you begin, ensure you have the following:

- Command line/Terminal access
- Administrator/sudo privileges
- Stable internet connection
- At least 10GB of free disk space
- Basic knowledge of terminal commands

---

## System Requirements

### Minimum Requirements

- **OS**: macOS 10.15+, Windows 10+, or Linux (Ubuntu 20.04+)
- **RAM**: 8GB minimum (16GB recommended)
- **Disk Space**: 10GB free space
- **CPU**: 2 cores minimum (4 cores recommended)

### Software Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **MongoDB**: v5.0 or higher
- **Docker**: v20.10.0 or higher
- **Git**: v2.0 or higher

---

## Installing Core Dependencies

### 1. Install Node.js and npm

#### macOS (using Homebrew)

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js (includes npm)
brew install node@18

# Verify installation
node --version  # Should be v18.0.0 or higher
npm --version   # Should be v8.0.0 or higher
```

#### macOS (using Official Installer)

1. Download the installer from [nodejs.org](https://nodejs.org/)
2. Choose the LTS version (v18 or higher)
3. Run the installer and follow the prompts
4. Verify installation in terminal:
   ```bash
   node --version
   npm --version
   ```

#### Windows

1. Download the Windows installer from [nodejs.org](https://nodejs.org/)
2. Choose the LTS version (v18 or higher)
3. Run the installer with default settings
4. Open Command Prompt or PowerShell and verify:
   ```cmd
   node --version
   npm --version
   ```

#### Linux (Ubuntu/Debian)

```bash
# Update package index
sudo apt update

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Linux (Fedora/RHEL/CentOS)

```bash
# Install Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version
```

---

## Installing MongoDB

MongoDB is required for storing tutorials, user data, and learning progress.

### macOS

#### Using Homebrew

```bash
# Add MongoDB tap
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community@7.0

# Start MongoDB service
brew services start mongodb-community@7.0

# Verify MongoDB is running
mongosh --version
```

#### Start MongoDB on system startup

```bash
brew services start mongodb-community@7.0
```

#### Manually start MongoDB (when needed)

```bash
mongod --config /usr/local/etc/mongod.conf --fork
```

### Windows

1. **Download MongoDB**
   - Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select Windows platform
   - Download the MSI installer

2. **Install MongoDB**
   - Run the MSI installer
   - Choose "Complete" installation
   - Select "Install MongoDB as a Service"
   - Click "Install"

3. **Verify Installation**
   ```cmd
   mongod --version
   mongosh --version
   ```

4. **Start MongoDB Service**
   - MongoDB should start automatically as a service
   - Or manually start it via Services app (search for "Services" in Start menu)

### Linux (Ubuntu/Debian)

```bash
# Import MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Verify installation
mongod --version
```

### Verify MongoDB Connection

```bash
# Connect to MongoDB shell
mongosh

# You should see output like:
# Current Mongosh Log ID: ...
# Connecting to: mongodb://127.0.0.1:27017/

# Exit with:
exit
```

---

## Installing Docker

Docker is required for secure code execution in isolated containers.

### macOS

1. **Download Docker Desktop**
   - Visit [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
   - Download the appropriate version (Intel or Apple Silicon)

2. **Install Docker Desktop**
   - Open the downloaded `.dmg` file
   - Drag Docker to Applications folder
   - Launch Docker from Applications

3. **Verify Installation**
   ```bash
   docker --version
   docker-compose --version

   # Test Docker
   docker run hello-world
   ```

### Windows

1. **System Requirements**
   - Windows 10 64-bit: Pro, Enterprise, or Education (Build 19041 or higher)
   - Enable WSL 2 feature
   - Enable Virtualization in BIOS

2. **Install WSL 2** (if not already installed)
   ```powershell
   # Run as Administrator
   wsl --install
   ```

3. **Download Docker Desktop**
   - Visit [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
   - Download the installer

4. **Install Docker Desktop**
   - Run the installer
   - Follow installation wizard
   - Restart computer when prompted

5. **Verify Installation**
   ```cmd
   docker --version
   docker-compose --version

   # Test Docker
   docker run hello-world
   ```

### Linux (Ubuntu/Debian)

```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (to run without sudo)
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
# Then verify installation
docker --version
docker run hello-world
```

---

## Cloning the Repository

### 1. Install Git (if not already installed)

#### macOS
```bash
brew install git
```

#### Windows
Download from [git-scm.com](https://git-scm.com/download/win)

#### Linux
```bash
sudo apt-get install git  # Ubuntu/Debian
sudo yum install git      # Fedora/RHEL
```

### 2. Clone the Repository

```bash
# Navigate to your desired directory
cd ~/Documents  # or any directory you prefer

# Clone the repository
git clone https://github.com/YOUR_USERNAME/seek-platform.git

# Navigate into the project
cd seek-platform/Seek
```

**Note**: Replace `YOUR_USERNAME` with the actual GitHub username/organization.

---

## Environment Configuration

### 1. Root Directory Configuration

```bash
# From the Seek directory
cp .env.example .env
```

Edit `.env` with your preferred text editor:

```bash
# macOS/Linux
nano .env
# or
vim .env
# or
code .env  # if using VS Code

# Windows
notepad .env
```

Update the following values in `.env`:

```env
# Server Configuration
NODE_ENV=development
PORT=5001

# Database
MONGODB_URI=mongodb://localhost:27017/seek_dev
SQLITE_DB_PATH=./database.sqlite

# JWT & Security
# IMPORTANT: Generate secure keys for production!
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Code Execution
CODE_EXECUTION_TIMEOUT=5000
MAX_CODE_LENGTH=10000

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# CORS
CORS_ORIGIN=http://localhost:3000

# Docker
DOCKER_HOST=unix:///var/run/docker.sock

# Logging
LOG_LEVEL=info
```

### 2. Backend Configuration

```bash
# Navigate to backend directory
cd backend

# Copy example environment file
cp .env.example .env
```

Edit `backend/.env`:

```env
# Server Configuration
NODE_ENV=development
PORT=5001
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/seek
MONGODB_TEST_URI=mongodb://localhost:27017/seek_test

# JWT Configuration
# PRODUCTION: Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-generated-secret-here-at-least-64-characters-long
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=different-secret-from-jwt-secret-64-chars-long
JWT_REFRESH_EXPIRE=30d
COOKIE_EXPIRE=7

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Code Execution
CODE_EXECUTION_TIMEOUT=5000
MAX_CODE_LENGTH=10000

# Logging
LOG_LEVEL=info
LOG_FILE=logs/seek.log

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=.js,.py,.java,.ts,.html,.css

# AI Tutoring (Optional)
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-openai-api-key-here

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Generate Secure JWT Secrets** (for production):

```bash
# Run this command to generate a secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Run it again for the refresh secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Frontend Configuration

```bash
# Navigate to frontend directory (from backend)
cd ../frontend

# Copy example environment file
cp .env.example .env
```

Edit `frontend/.env`:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5001/api/v1

# Environment
REACT_APP_ENV=development

# Features
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_SENTRY=false

# External Services (Optional)
REACT_APP_SENTRY_DSN=
REACT_APP_GOOGLE_ANALYTICS_ID=

# Development
GENERATE_SOURCEMAP=true
DISABLE_ESLINT_PLUGIN=false
```

---

## Installing Project Dependencies

### Option 1: Install All Dependencies at Once (Recommended)

```bash
# From the Seek root directory
cd ..  # if you're in frontend, go back to Seek root
npm run install:all
```

This will install:
- Root workspace dependencies
- Backend dependencies
- Frontend dependencies

### Option 2: Install Dependencies Manually

```bash
# From the Seek root directory

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### Verify Installation

```bash
# Check that node_modules exists in all directories
ls -la node_modules
ls -la backend/node_modules
ls -la frontend/node_modules
```

---

## Building Docker Images

The application uses Docker containers to safely execute user code in multiple languages.

### Languages Supported

- Python
- JavaScript
- TypeScript
- Java
- C++
- C
- Go
- Rust
- C#
- PHP
- Ruby
- Kotlin

### Automatic Image Building

Docker images will be built automatically when you start the backend server for the first time. However, you can pre-build them:

```bash
# From the Seek root directory

# Start the backend once to trigger image building
cd backend
npm run dev
```

The backend will automatically:
1. Check for existing Docker images
2. Build any missing images
3. Cache the images for future use

You'll see output like:

```
[info]: 🐳 Initializing Docker execution service...
[info]: Building Docker image for python...
[info]: Building Docker image for javascript...
[info]: Building Docker image for typescript...
...
[info]: Docker execution service initialized
```

### Manual Image Building (Advanced)

If you want to rebuild images manually:

```bash
cd backend/docker

# Build individual language images
docker build -f Dockerfile.python -t seek-python-runner .
docker build -f Dockerfile.javascript -t seek-javascript-runner .
docker build -f Dockerfile.typescript -t seek-typescript-runner .
docker build -f Dockerfile.java -t seek-java-runner .
docker build -f Dockerfile.cpp -t seek-cpp-runner .
docker build -f Dockerfile.c -t seek-c-runner .
docker build -f Dockerfile.go -t seek-go-runner .
docker build -f Dockerfile.rust -t seek-rust-runner .
docker build -f Dockerfile.csharp -t seek-csharp-runner .
docker build -f Dockerfile.php -t seek-php-runner .
docker build -f Dockerfile.ruby -t seek-ruby-runner .
docker build -f Dockerfile.kotlin -t seek-kotlin-runner .
```

### Verify Docker Images

```bash
# List all Seek Docker images
docker images | grep seek

# You should see output like:
# seek-python-runner      latest    ...
# seek-javascript-runner  latest    ...
# seek-typescript-runner  latest    ...
# ...
```

---

## Database Setup

### 1. Verify MongoDB is Running

```bash
# Check MongoDB status
# macOS (if installed via Homebrew)
brew services list | grep mongodb

# Linux
sudo systemctl status mongod

# Or connect directly
mongosh
```

### 2. Create Database

The database will be created automatically, but you can create it manually:

```bash
# Connect to MongoDB
mongosh

# Switch to seek database
use seek

# Verify database
show dbs

# Exit
exit
```

### 3. Seed Database with Tutorials

The application comes with pre-built tutorials and challenges. Seed them:

```bash
# From the backend directory
cd backend

# Seed all tutorials
npm run seed:tutorials

# Seed learning games
npm run seed:games

# Seed challenges
npm run seed:challenges:100

# Seed database tutorials
npm run seed:databases

# Seed TypeScript and Java tutorials
npm run seed:typescript-java

# Or seed everything at once
npm run seed:all
```

You should see output like:

```
[info]: 🌱 Seeding tutorials database...
[info]: ✅ Successfully seeded X tutorials
[info]: 🎮 Seeding learning games...
[info]: ✅ Successfully seeded X games
...
```

### 4. SQLite Database

SQLite is used for user authentication and session management. It will be created automatically when you start the backend server.

Location: `backend/database.sqlite`

---

## Running the Application

### Option 1: Run Both Servers Concurrently (Recommended)

```bash
# From the Seek root directory
npm run dev
```

This will start:
- **Backend Server** on `http://localhost:5001`
- **Frontend Server** on `http://localhost:3000`

### Option 2: Run Servers Separately

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

### What You Should See

#### Backend Output

```
[info]: 📁 SQLite database connected successfully
[info]: 📊 Database tables synchronized
[info]: 🍃 MongoDB connected: localhost:27017
[info]: 📚 Database: seek_platform
[info]: Default users already exist
[info]: 🌱 Seeding tutorials database...
[info]: 📚 Found X existing tutorials, skipping seed
[info]: 🐳 Initializing Docker execution service...
[info]: Docker image seek-python-runner already exists
...
[info]: 🚀 Server running on port 5001
[info]: 📚 API Documentation: http://localhost:5001/api-docs
[info]: 🏥 Health Check: http://localhost:5001/health
[info]: 🌐 Environment: development
[info]: 🔌 WebSocket server initialized
```

#### Frontend Output

```
Compiled successfully!

You can now view seek-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled with X warnings
```

---

## Verification

### 1. Verify Backend

Open your browser or use curl:

```bash
# Health check
curl http://localhost:5001/health

# Should return: {"status":"ok","timestamp":"..."}

# API Documentation (open in browser)
open http://localhost:5001/api-docs
# Windows: start http://localhost:5001/api-docs
# Linux: xdg-open http://localhost:5001/api-docs
```

### 2. Verify Frontend

Open your browser:

```bash
# macOS
open http://localhost:3000

# Windows
start http://localhost:3000

# Linux
xdg-open http://localhost:3000
```

You should see the Seek platform login page.

### 3. Verify Database Connection

```bash
# Connect to MongoDB
mongosh

# Switch to seek database
use seek

# Check collections
show collections

# You should see collections like:
# - tutorials
# - users
# - progress
# - challenges
# - etc.

# Count tutorials
db.tutorials.count()

# Exit
exit
```

### 4. Test Code Execution

1. Log in to the platform (or create an account)
2. Navigate to a coding tutorial
3. Try running some code in the code editor
4. Verify that the output appears correctly

---

## Troubleshooting

### MongoDB Issues

#### Problem: MongoDB won't start

**macOS**:
```bash
# Check logs
tail -f /usr/local/var/log/mongodb/mongo.log

# Try restarting
brew services restart mongodb-community@7.0
```

**Linux**:
```bash
# Check status
sudo systemctl status mongod

# Check logs
sudo journalctl -u mongod

# Restart service
sudo systemctl restart mongod
```

#### Problem: Can't connect to MongoDB

```bash
# Check if MongoDB is listening
netstat -an | grep 27017

# Try connecting with full URI
mongosh "mongodb://localhost:27017"

# Check firewall settings (Linux)
sudo ufw status
sudo ufw allow 27017
```

### Docker Issues

#### Problem: Docker daemon not running

**macOS/Windows**:
- Open Docker Desktop application
- Wait for it to fully start (whale icon should be steady)

**Linux**:
```bash
# Start Docker service
sudo systemctl start docker

# Check status
sudo systemctl status docker
```

#### Problem: Permission denied when running Docker

**Linux**:
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in
# Or use newgrp
newgrp docker
```

#### Problem: Docker images fail to build

```bash
# Check Docker is working
docker run hello-world

# Clean up Docker
docker system prune -a

# Rebuild images manually
cd backend/docker
docker build -f Dockerfile.python -t seek-python-runner .
```

### Port Already in Use

#### Backend (Port 5001)

```bash
# Find process using port 5001
# macOS/Linux
lsof -i :5001

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=5002
```

#### Frontend (Port 3000)

```bash
# Find process using port 3000
# macOS/Linux
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or React will offer to use a different port automatically
```

### Node Module Issues

```bash
# Clear npm cache
npm cache clean --force

# Remove all node_modules
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules

# Remove package-lock files
rm package-lock.json
rm backend/package-lock.json
rm frontend/package-lock.json

# Reinstall
npm run install:all
```

### Environment Variables Not Loading

```bash
# Make sure .env files exist
ls -la .env
ls -la backend/.env
ls -la frontend/.env

# Check for syntax errors in .env files
cat backend/.env
cat frontend/.env

# Restart servers after changing .env files
```

---

## Optional Services

### OpenAI API (AI Tutoring)

The platform can use OpenAI's API for AI-powered tutoring features.

1. **Get API Key**
   - Sign up at [platform.openai.com](https://platform.openai.com)
   - Navigate to API Keys section
   - Create a new API key

2. **Configure**
   ```bash
   # Edit backend/.env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. **Restart Backend**
   ```bash
   cd backend
   npm run dev
   ```

### Sentry (Error Tracking)

Optional error tracking for production environments.

1. **Sign up** at [sentry.io](https://sentry.io)
2. Create a new project
3. Get your DSN
4. Add to `backend/.env` and `frontend/.env`:
   ```env
   SENTRY_DSN=your-sentry-dsn-here
   ```

### Email Service (Future Feature)

Configure SMTP settings in `backend/.env` for email features:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@seek.com
```

---

## Production Deployment

### Environment Variables

**IMPORTANT**: Generate secure secrets for production:

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate refresh secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Build Frontend

```bash
cd frontend
npm run build

# Serve the build folder with a static server
# or configure your web server to serve it
```

### Production Environment File

```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb://your-production-mongodb-uri
JWT_SECRET=your-secure-64-char-secret
JWT_REFRESH_SECRET=your-different-secure-64-char-secret
OPENAI_API_KEY=your-production-api-key
ALLOWED_ORIGINS=https://yourdomain.com
```

### Process Manager (PM2)

```bash
# Install PM2
npm install -g pm2

# Start backend with PM2
cd backend
pm2 start server.js --name seek-backend

# Start on system boot
pm2 startup
pm2 save
```

---

## Quick Reference

### Start Application

```bash
# From Seek root directory
npm run dev
```

### Stop Application

Press `Ctrl+C` in the terminal running the servers

### Restart Application

```bash
# Stop with Ctrl+C, then:
npm run dev
```

### Update Dependencies

```bash
# Update all packages
npm run install:all

# Or manually
cd backend && npm update
cd ../frontend && npm update
```

### Backup Database

```bash
# MongoDB backup
mongodump --db seek --out ./backup

# SQLite backup
cp backend/database.sqlite backend/database.sqlite.backup
```

### Restore Database

```bash
# MongoDB restore
mongorestore --db seek ./backup/seek

# SQLite restore
cp backend/database.sqlite.backup backend/database.sqlite
```

---

## Support

If you encounter issues not covered in this guide:

1. Check the [GitHub Issues](https://github.com/YOUR_USERNAME/seek-platform/issues)
2. Search for similar problems
3. Create a new issue with:
   - Your operating system
   - Node.js version (`node --version`)
   - MongoDB version (`mongod --version`)
   - Docker version (`docker --version`)
   - Complete error message
   - Steps to reproduce

---

## Next Steps

After successful installation:

1. **Create an account** on the platform
2. **Explore tutorials** - Start with beginner tutorials
3. **Try challenges** - Test your skills with coding challenges
4. **Customize settings** - Adjust your preferences
5. **Check API docs** - Visit http://localhost:5001/api-docs

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Credits

Built with:
- **Frontend**: React, TailwindCSS, Monaco Editor
- **Backend**: Node.js, Express, MongoDB, SQLite
- **Code Execution**: Docker, dockerode
- **AI**: OpenAI API

---

**Happy Coding! 🚀**
