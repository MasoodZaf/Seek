# 🚀 Seek Platform - Render.com Deployment Guide

This guide walks you through deploying the Seek coding learning platform on Render.com.

## 📋 Prerequisites

- GitHub account
- Render.com account (sign up at https://render.com)
- Your code pushed to GitHub

## 💰 Costs

**Monthly Estimate: $14/month** (can start with free tier for testing)

- Frontend: $7/month (Starter plan)
- Backend: $7/month (Starter plan)
- Database: **FREE** (500MB MongoDB)

**Free Tier Option:**
- Keep services on free tier (with cold starts after 15 min inactivity)
- External MongoDB Atlas (512MB free)

---

## 🎯 Deployment Steps

### Step 1: Prepare Your Repository

1. **Ensure all files are committed:**
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

2. **Files you should have:**
- ✅ `render.yaml` (root directory)
- ✅ `backend/Dockerfile`
- ✅ `frontend/Dockerfile`
- ✅ `frontend/nginx.conf`
- ✅ `.dockerignore` files

---

### Step 2: Deploy via Render Dashboard

#### Option A: Using Blueprint (Recommended - Infrastructure as Code)

1. **Go to Render Dashboard:**
   - Visit https://dashboard.render.com

2. **Create New Blueprint:**
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`

3. **Review Configuration:**
   - Backend service: `seek-backend`
   - Frontend service: `seek-frontend`
   - MongoDB database: `seek-mongodb`

4. **Apply Blueprint:**
   - Click "Apply"
   - Render will create all services automatically

#### Option B: Manual Setup

**Backend Service:**
1. Click "New +" → "Web Service"
2. Connect GitHub repository
3. Configure:
   - **Name:** `seek-backend`
   - **Environment:** Docker
   - **Dockerfile Path:** `./backend/Dockerfile`
   - **Region:** Oregon (or closest to you)
   - **Plan:** Starter ($7/month) or Free
   - **Branch:** main
   - **Health Check Path:** `/api/v1/health`

**Frontend Service:**
1. Click "New +" → "Web Service"
2. Connect GitHub repository
3. Configure:
   - **Name:** `seek-frontend`
   - **Environment:** Docker
   - **Dockerfile Path:** `./frontend/Dockerfile`
   - **Region:** Oregon
   - **Plan:** Starter ($7/month) or Free
   - **Branch:** main

**Database:**
1. Click "New +" → "MongoDB"
2. Configure:
   - **Name:** `seek-mongodb`
   - **Plan:** Starter (Free 500MB)
   - **Region:** Oregon

---

### Step 3: Configure Environment Variables

#### Backend Environment Variables

Go to Backend Service → "Environment" tab and add:

```
NODE_ENV=production
PORT=5001
MONGODB_URI=[Auto-populated from database]
JWT_SECRET=[Generate secure random string]
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
CODE_EXECUTION_TIMEOUT=5000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
CORS_ORIGIN=https://seek-frontend.onrender.com
DOCKER_HOST=unix:///var/run/docker.sock
```

**To generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Frontend Environment Variables

Go to Frontend Service → "Environment" tab and add:

```
REACT_APP_API_URL=https://seek-backend.onrender.com
REACT_APP_ENV=production
NODE_ENV=production
```

---

### Step 4: Enable Docker Access (For Code Execution)

⚠️ **Important:** Render's Docker support is limited on free tier.

**For Production (Starter plan):**
1. Go to Backend Service → "Settings"
2. Under "Docker" section, enable Docker socket access
3. This allows your Dockerode code execution to work

**Alternative for Free Tier:**
- Use external code execution service (e.g., Judge0 API)
- Or accept limited functionality on free tier

---

### Step 5: Deploy & Monitor

1. **Trigger Deployment:**
   - Render auto-deploys on git push
   - Or manually click "Deploy latest commit"

2. **Monitor Logs:**
   - Go to service → "Logs" tab
   - Watch for any errors during startup

3. **Check Health:**
   - Backend: `https://seek-backend.onrender.com/api/v1/health`
   - Frontend: `https://seek-frontend.onrender.com`

---

## 🔧 Post-Deployment Configuration

### 1. Update CORS Origin

After frontend deploys, update backend's `CORS_ORIGIN`:
```
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

### 2. Seed Database (Optional)

SSH into backend service and run:
```bash
npm run seed:all
```

Or create a manual job in Render dashboard.

### 3. Setup Custom Domain (Optional)

1. Go to Frontend Service → "Settings"
2. Add custom domain
3. Update DNS records as instructed
4. Update backend `CORS_ORIGIN` to your domain

---

## 📊 Monitoring & Maintenance

### Check Service Health

**Backend Health Check:**
```bash
curl https://seek-backend.onrender.com/api/v1/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "docker": true
}
```

### View Logs

- **Real-time logs:** Dashboard → Service → Logs
- **Download logs:** Use Render CLI

### Scaling

**Upgrade plan when needed:**
- **Starter** ($7/month): 512MB RAM, always on
- **Standard** ($25/month): 2GB RAM, auto-scaling
- **Pro** ($85/month): 4GB RAM, priority support

---

## 🐛 Troubleshooting

### Service Won't Start

1. Check logs for errors
2. Verify environment variables
3. Ensure Dockerfile builds locally:
   ```bash
   cd backend
   docker build -t seek-backend .
   docker run -p 5001:5001 seek-backend
   ```

### Database Connection Failed

1. Verify `MONGODB_URI` is set
2. Check database service is running
3. Ensure IP whitelist allows Render IPs

### Docker Execution Not Working

1. Upgrade to Starter plan (minimum)
2. Enable Docker socket access
3. Check Docker is running: `docker ps` in service shell

### CORS Errors

1. Update backend `CORS_ORIGIN` to match frontend URL
2. Clear browser cache
3. Check frontend API URL configuration

---

## 🔐 Security Checklist

- ✅ Use strong `JWT_SECRET` (64+ characters)
- ✅ Enable HTTPS only (Render does this automatically)
- ✅ Set proper CORS origins
- ✅ Use environment variables for secrets
- ✅ Enable rate limiting
- ✅ Keep dependencies updated

---

## 💡 Cost Optimization Tips

### Free Tier Strategy (Testing)
- Use Render free tier (with cold starts)
- MongoDB Atlas free tier instead
- Accept 15-minute inactivity spin-down

### Production Strategy ($14/month)
- Backend: Starter plan ($7)
- Frontend: Starter plan ($7)
- Database: Free tier (500MB)

### Scale Up Later
- Monitor usage in dashboard
- Upgrade individual services as needed
- Add caching (Redis) when traffic grows

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Docker on Render](https://render.com/docs/docker)
- [Environment Variables](https://render.com/docs/environment-variables)
- [Custom Domains](https://render.com/docs/custom-domains)

---

## 🆘 Support

If you encounter issues:
1. Check Render status: https://status.render.com
2. Review Render Community: https://community.render.com
3. Contact Render support (paid plans only)

---

## 🎉 Success!

Once deployed, your Seek platform will be live at:
- **Frontend:** `https://seek-frontend.onrender.com`
- **Backend API:** `https://seek-backend.onrender.com`
- **Database:** Internal MongoDB connection

Share your platform and start teaching coding! 🚀
