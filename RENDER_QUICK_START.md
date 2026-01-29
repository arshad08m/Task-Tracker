# 🚀 Quick Start: Deploy Task Tracker to Render

Deploy your Task Tracker to Render in under 5 minutes!

## What You'll Get

- ✅ **Backend API** - FastAPI running on Python 3.11
- ✅ **Frontend** - React app with Vite
- ✅ **PostgreSQL Database** - Free 256 MB database
- ✅ **HTTPS** - Automatic SSL certificates
- ✅ **Auto-Deploy** - Push to git, auto-deploy
- ✅ **Zero Cost** - Everything on free tier

## Prerequisites

1. **GitHub Account** - To host your code
2. **Render Account** - Sign up at [render.com](https://render.com) (free)
3. **Your Code** - Push this project to GitHub/GitLab

## Step-by-Step Deployment

### 1️⃣ Test Locally (Optional but Recommended)

**Windows:**
```bash
test-render.bat
```

**macOS/Linux:**
```bash
chmod +x test-render.sh
./test-render.sh
```

This ensures everything works before deploying.

### 2️⃣ Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Render deployment"

# Create repository on GitHub and push
git remote add origin https://github.com/yourusername/task-tracker.git
git push -u origin main
```

### 3️⃣ Deploy to Render

#### Option A: One-Click Blueprint Deploy (Easiest!)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Click **"Connect Account"** to link GitHub
4. Select your `task-tracker` repository
5. Click **"Connect"**
6. Render detects `render.yaml` automatically
7. Review the 3 services:
   - ✅ PostgreSQL Database
   - ✅ Backend API
   - ✅ Frontend
8. Click **"Apply"** to create all services

That's it! Render will:
- Create your database
- Build and deploy backend (2-5 min)
- Build and deploy frontend (1-3 min)
- Connect everything automatically

#### Option B: Manual Setup (More Control)

<details>
<summary>Click to expand manual setup instructions</summary>

##### Create Database

1. Click **"New +"** → **"PostgreSQL"**
2. Configure:
   - Name: `task-tracker-db`
   - Database: `task_tracker`
   - User: `task_tracker_user`
   - Region: Choose closest
   - Plan: **Free**
3. Click **"Create Database"**
4. Wait 1-2 minutes for database creation
5. Copy **"Internal Database URL"**

##### Deploy Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your repository
3. Configure:
   - Name: `task-tracker-api`
   - Region: Same as database
   - Root Directory: *(leave empty)*
   - Runtime: **Python 3**
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Plan: **Free**
4. Environment Variables:
   - Click **"Add Environment Variable"**
   - Key: `DATABASE_URL`
   - Value: *(paste Internal Database URL)*
5. Health Check Path: `/health`
6. Click **"Create Web Service"**
7. Wait 2-5 minutes for deployment
8. Copy your backend URL (e.g., `https://task-tracker-api.onrender.com`)

##### Deploy Frontend

1. Click **"New +"** → **"Static Site"**
2. Connect your repository
3. Configure:
   - Name: `task-tracker-frontend`
   - Root Directory: *(leave empty)*
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
4. Environment Variables:
   - Click **"Add Environment Variable"**
   - Key: `VITE_API_URL`
   - Value: *(paste backend URL from previous step)*
5. Redirects/Rewrites:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: **Rewrite**
6. Click **"Create Static Site"**
7. Wait 1-3 minutes for deployment

</details>

### 4️⃣ Verify Deployment

Once deployed:

1. **Check Backend Health**:
   - Visit: `https://your-api-name.onrender.com/health`
   - Should show: `{"status": "healthy", "database": "connected"}`

2. **Check Users Initialized**:
   - Visit: `https://your-api-name.onrender.com/users`
   - Should show: `[{"id": 1, "username": "user_a", ...}, ...]`

3. **Open Your App**:
   - Visit: `https://your-frontend-name.onrender.com`
   - You should see the Task Tracker login screen!

### 5️⃣ Start Using!

1. Select a user (User A or User B)
2. Create your first task
3. Add notes, manage tasks
4. Share the URL with others!

## 📊 What's Running?

After deployment, you'll have:

```
┌─────────────────────────────────────┐
│  Frontend (Static Site)             │
│  https://xxx-frontend.onrender.com  │
│  - Always online                    │
│  - Global CDN                       │
│  - 100 GB bandwidth/month           │
└─────────────────────────────────────┘
                 │
                 │ API calls
                 ▼
┌─────────────────────────────────────┐
│  Backend API (Web Service)          │
│  https://xxx-api.onrender.com       │
│  - Python 3.11 + FastAPI            │
│  - Spins down after 15 min idle     │
│  - ~30s cold start                  │
└─────────────────────────────────────┘
                 │
                 │ Database queries
                 ▼
┌─────────────────────────────────────┐
│  PostgreSQL Database                │
│  - 256 MB storage                   │
│  - Private network                  │
│  - Automatic backups (paid)         │
└─────────────────────────────────────┘
```

## 🎯 Important Notes

### Free Tier Behavior

⚠️ **Backend Spin Down**: Free web services spin down after 15 minutes of inactivity.
- First request after spin down: ~30 seconds to wake up
- Subsequent requests: Fast!
- **Solution**: Use a service like [UptimeRobot](https://uptimerobot.com/) to ping every 10 minutes

### Keeping Your Backend Alive

**Option 1: Upgrade to Paid Plan**
- Starter plan: $7/month (no spin down)

**Option 2: Use a Monitoring Service** (Free)
1. Sign up at [UptimeRobot](https://uptimerobot.com/)
2. Create new monitor:
   - Type: HTTP(s)
   - URL: `https://your-api.onrender.com/health`
   - Monitoring Interval: 10 minutes
3. Your backend stays warm!

## 🔧 Configuration

### Environment Variables

Your app uses these environment variables (auto-configured by Blueprint):

**Backend:**
- `DATABASE_URL` - PostgreSQL connection (auto-set by Render)
- `PORT` - Server port (auto-set by Render)

**Frontend:**
- `VITE_API_URL` - Backend API URL (set during deployment)

### Updating Environment Variables

1. Go to your service in Render Dashboard
2. Click **"Environment"**
3. Edit or add variables
4. Click **"Save Changes"**
5. Service auto-redeploys

## 🔄 Updating Your App

### Automatic Deploys (Recommended)

With auto-deploy enabled (default):

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push

# Render automatically:
# 1. Detects the push
# 2. Builds your app
# 3. Deploys new version
# 4. Zero downtime!
```

### Manual Deploys

1. Go to service in Render Dashboard
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**

## 🐛 Troubleshooting

### Backend Issues

**"Service Unavailable" or Slow First Load**
- ✅ Normal! Free tier spins down after 15 min idle
- ⏱️ Wait 30 seconds for cold start
- 💡 Use UptimeRobot to keep it warm

**Database Connection Error**
- Check `DATABASE_URL` is set correctly
- Verify database is running in Render Dashboard
- Check backend logs for specific errors

**Build Failures**
- Check logs in **"Events"** tab
- Verify `requirements.txt` has all dependencies
- Ensure Python version is 3.9+

### Frontend Issues

**"Cannot connect to API"**
- Verify `VITE_API_URL` is set correctly (no trailing slash)
- Check backend is running
- Open browser console for error details

**404 on Page Refresh**
- Ensure rewrite rule is configured:
  - Source: `/*` → Destination: `/index.html`

**Build Failures**
- Check build logs in **"Events"** tab
- Verify all dependencies in `package.json`
- Check Node version compatibility

### Viewing Logs

1. Go to your service
2. Click **"Logs"** tab
3. View real-time logs
4. Filter by log level

## 📈 Monitoring

### Set Up Alerts

1. Go to service **"Settings"**
2. Click **"Notifications"**
3. Add email/Slack webhook for:
   - Deployment failures
   - Service health issues

### Check Service Status

Visit: [Render Status Page](https://status.render.com/)

## 💰 Upgrade Options

### Development (Free)
- ✅ All features work
- ⚠️ Backend spins down
- 💾 256 MB database
- 💵 **$0/month**

### Production (Minimal)
- ✅ Backend always on ($7/mo)
- ✅ No cold starts
- 💾 256 MB database (free)
- 💵 **$7/month**

### Production (Full)
- ✅ Backend standard ($25/mo)
- ✅ Better performance
- 💾 Database with backups ($7/mo)
- 💵 **$32/month**

## 🎉 Success!

Your Task Tracker is now live on Render!

- 🌍 Accessible from anywhere
- 🔒 HTTPS enabled
- 🚀 Auto-deploys on git push
- 📊 Monitoring & logs included

## 📚 Next Steps

- [ ] Add custom domain (Settings → Custom Domain)
- [ ] Set up UptimeRobot to prevent cold starts
- [ ] Configure email notifications
- [ ] Review logs and monitoring
- [ ] Share your app URL! 🎊

## 🆘 Need Help?

- 📖 [Full Documentation](./DEPLOYMENT_RENDER.md)
- 💬 [Render Community](https://community.render.com/)
- 🐛 [Render Support](https://render.com/docs/support)
- 📧 [FastAPI Docs](https://fastapi.tiangolo.com/)

---

**Happy Deploying! 🚀**
