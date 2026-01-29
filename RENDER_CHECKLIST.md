# 🚀 Render Deployment Checklist

Use this checklist to ensure a smooth deployment to Render.

## ✅ Pre-Deployment Checklist

### Code Preparation
- [ ] All code committed to git
- [ ] `.gitignore` excludes sensitive files (`.env`, `*.db`, `node_modules/`)
- [ ] `backend/requirements.txt` lists all Python dependencies
- [ ] `frontend/package.json` lists all Node dependencies
- [ ] Environment variables documented

### Testing
- [ ] Backend runs locally: `cd backend && python main.py`
- [ ] Frontend runs locally: `cd frontend && npm run dev`
- [ ] Frontend builds successfully: `cd frontend && npm run build`
- [ ] Backend health endpoint works: `http://localhost:8000/health`
- [ ] API endpoints respond correctly
- [ ] Database initializes with sample data

### Configuration Files
- [ ] `render.yaml` exists in project root
- [ ] `backend/main.py` has health check endpoint
- [ ] Database URL handling includes Render compatibility
- [ ] CORS configured correctly in backend
- [ ] Frontend API URL uses environment variable

## 📋 Deployment Steps

### 1. Repository Setup
- [ ] Code pushed to GitHub/GitLab
- [ ] Repository is public or Render has access
- [ ] Default branch is `main` or `master`

### 2. Render Account
- [ ] Signed up at [render.com](https://render.com)
- [ ] GitHub/GitLab account connected
- [ ] Payment method added (optional for free tier)

### 3. Deploy via Blueprint
- [ ] Clicked "New +" → "Blueprint" in Render Dashboard
- [ ] Selected correct repository
- [ ] Render detected `render.yaml`
- [ ] Reviewed all 3 services:
  - [ ] PostgreSQL Database
  - [ ] Backend API
  - [ ] Frontend Static Site
- [ ] Clicked "Apply"

### 4. Monitor Deployment
- [ ] Database created successfully
- [ ] Backend build completed (check logs)
- [ ] Backend deployment successful
- [ ] Frontend build completed (check logs)
- [ ] Frontend deployment successful

### 5. Verify Deployment
- [ ] Backend health check responds: `https://your-api.onrender.com/health`
- [ ] Backend users endpoint works: `https://your-api.onrender.com/users`
- [ ] Frontend loads: `https://your-frontend.onrender.com`
- [ ] Can login as User A or User B
- [ ] Can create a task
- [ ] Can add notes to a task
- [ ] Can complete/uncomplete tasks
- [ ] Can filter tasks
- [ ] Can delete tasks

## 🔧 Post-Deployment Configuration

### Optional Optimizations
- [ ] Set up custom domain
- [ ] Configure UptimeRobot to prevent cold starts
- [ ] Set up email notifications for deployments
- [ ] Enable auto-deploy on git push (enabled by default)
- [ ] Review and adjust CORS settings
- [ ] Set up database backups (paid feature)

### Monitoring
- [ ] Check logs for errors
- [ ] Test all functionality
- [ ] Monitor database usage
- [ ] Set up alerts for service failures
- [ ] Bookmark service dashboard URLs

## 🐛 Troubleshooting

### If Backend Fails to Start
- [ ] Check build logs in Render Dashboard
- [ ] Verify `DATABASE_URL` environment variable is set
- [ ] Check for Python version compatibility
- [ ] Review error messages in logs
- [ ] Ensure all dependencies in `requirements.txt`

### If Frontend Fails to Build
- [ ] Check build logs
- [ ] Verify Node version compatibility (18+)
- [ ] Ensure all dependencies in `package.json`
- [ ] Check `VITE_API_URL` is set correctly

### If Frontend Cannot Connect to Backend
- [ ] Verify `VITE_API_URL` is set (no trailing slash)
- [ ] Check backend is running and healthy
- [ ] Review CORS settings in backend
- [ ] Check browser console for errors

### If Database Connection Fails
- [ ] Verify database is running
- [ ] Check `DATABASE_URL` format
- [ ] Ensure backend and database in same region
- [ ] Review backend logs for connection errors

## 📊 Service URLs

Record your deployment URLs here:

```
Frontend:  https://_____________________.onrender.com
Backend:   https://_____________________.onrender.com
Database:  (Internal only - see Render Dashboard)
```

## ⚡ Quick Commands

### View Logs
```bash
# Go to service → Click "Logs" tab
```

### Manual Deploy
```bash
# Go to service → Click "Manual Deploy" → "Deploy latest commit"
```

### Update Environment Variable
```bash
# Go to service → "Environment" → Edit → Save Changes
```

### Check Database
```bash
# Connect via psql (see database dashboard for connection string)
psql <DATABASE_URL>
```

## 💡 Tips

- ✅ Free tier spins down after 15 min - first request takes ~30s
- ✅ Use UptimeRobot to keep service warm (free)
- ✅ Upgrade to Starter ($7/mo) for no spin down
- ✅ Monitor logs regularly for issues
- ✅ Test locally before deploying
- ✅ Use health check endpoints
- ✅ Keep dependencies updated

## 📚 Resources

- [Render Documentation](https://render.com/docs)
- [RENDER_QUICK_START.md](./RENDER_QUICK_START.md)
- [DEPLOYMENT_RENDER.md](./DEPLOYMENT_RENDER.md)
- [Render Community](https://community.render.com/)

## ✅ Deployment Complete!

Once all items are checked:

🎉 **Your Task Tracker is live on Render!**

Share your URL: `https://your-frontend.onrender.com`

---

**Last Updated:** Ready for deployment
**Status:** ✅ All systems configured for Render
