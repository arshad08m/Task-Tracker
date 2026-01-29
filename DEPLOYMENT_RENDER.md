# Deploying Task Tracker to Render

This guide will help you deploy the Task Tracker application to Render with a PostgreSQL database, backend API, and frontend.

## Prerequisites

- A [Render account](https://render.com) (free tier available)
- Your code pushed to a GitHub/GitLab repository

## Deployment Options

### Option 1: One-Click Deploy (Recommended)

Render will automatically detect the `render.yaml` file and set up all services.

1. **Connect Your Repository**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your GitHub/GitLab repository
   - Select the repository containing your Task Tracker code

2. **Configure Blueprint**
   - Render will automatically detect `render.yaml`
   - Review the services that will be created:
     - PostgreSQL Database (task-tracker-db)
     - Backend API (task-tracker-api)
     - Frontend Static Site (task-tracker-frontend)
   - Click "Apply" to create all services

3. **Wait for Deployment**
   - Database will be created first
   - Backend will build and deploy (takes 2-5 minutes)
   - Frontend will build and deploy (takes 1-3 minutes)

4. **Access Your Application**
   - Once deployed, click on the frontend service
   - Your application URL will be: `https://task-tracker-frontend.onrender.com`
   - The backend API will be automatically connected

### Option 2: Manual Setup

If you prefer to set up services individually:

#### Step 1: Create PostgreSQL Database

1. Click "New +" → "PostgreSQL"
2. Configure:
   - **Name**: `task-tracker-db`
   - **Database**: `task_tracker`
   - **User**: `task_tracker_user`
   - **Region**: Choose closest to you
   - **Plan**: Free
3. Click "Create Database"
4. Wait for the database to be ready (1-2 minutes)
5. Copy the "Internal Database URL" for later use

#### Step 2: Deploy Backend API

1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name**: `task-tracker-api`
   - **Region**: Same as database
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: (leave empty)
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

4. Add Environment Variable:
   - Click "Advanced" → "Add Environment Variable"
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the Internal Database URL from Step 1
   - Note: Render will automatically convert `postgres://` to `postgresql://`

5. Add Health Check (optional but recommended):
   - **Health Check Path**: `/health`

6. Click "Create Web Service"
7. Wait for the build and deployment (2-5 minutes)
8. Copy your backend URL (e.g., `https://task-tracker-api.onrender.com`)

#### Step 3: Deploy Frontend

1. Click "New +" → "Static Site"
2. Connect your repository
3. Configure:
   - **Name**: `task-tracker-frontend`
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

4. Add Environment Variable:
   - Click "Advanced" → "Add Environment Variable"
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL from Step 2 (without trailing slash)
   - Example: `https://task-tracker-api.onrender.com`

5. Configure Rewrites (for React Router):
   - Under "Redirects/Rewrites"
   - Add rewrite rule:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Action**: Rewrite

6. Click "Create Static Site"
7. Wait for the build (1-3 minutes)

## Post-Deployment

### Verify Deployment

1. **Check Backend**:
   - Visit `https://your-api.onrender.com/health`
   - Should return: `{"status": "healthy"}`
   
2. **Check Database**:
   - Visit `https://your-api.onrender.com/users`
   - Should return initial users: User1 and User2

3. **Check Frontend**:
   - Visit your frontend URL
   - The application should load and connect to the API
   - Try creating a task to verify full functionality

### Initial Database Setup

The database will be automatically initialized on first request with:
- Two default users: User1 and User2
- Empty task list

### Custom Domain (Optional)

1. Go to your frontend service settings
2. Click "Custom Domain"
3. Add your domain and follow DNS configuration instructions

## Environment Variables Reference

### Backend (API) Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | Auto-provided by Render |
| `PORT` | Port for the API server | No | Auto-provided by Render |

### Frontend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | Yes | - |

## Service Specifications

### Free Tier Limits

- **Database**: 
  - 256 MB RAM
  - 1 GB storage
  - Automatic backups not included
  - Database will spin down after 90 days of inactivity

- **Backend (Web Service)**:
  - 512 MB RAM
  - Spins down after 15 minutes of inactivity
  - 750 hours/month free
  - Cold start: ~30 seconds

- **Frontend (Static Site)**:
  - 100 GB bandwidth/month
  - Always online (no spin down)
  - Global CDN included

### Performance Tips

1. **Keep Services Active**: 
   - Free web services spin down after 15 minutes
   - First request after spin down takes ~30 seconds
   - Consider using UptimeRobot or similar to ping your API every 10 minutes

2. **Database Connection Pooling**:
   - The app uses `pool_pre_ping=True` for reliable connections
   - Handles connection drops automatically

3. **Upgrade for Production**:
   - For production use, consider upgrading to paid plans:
     - Starter plan: $7/month for web service (no spin down)
     - Standard database: $7/month for 256 MB

## Troubleshooting

### Backend Issues

**Issue**: Backend not starting
- Check logs in Render dashboard
- Verify `DATABASE_URL` environment variable is set
- Ensure `requirements.txt` includes all dependencies

**Issue**: Database connection errors
- Verify database is running and healthy
- Check if `DATABASE_URL` is correctly set
- Check backend logs for specific error messages

**Issue**: 503 Service Unavailable
- Free tier spins down after 15 minutes inactivity
- Wait 30 seconds for cold start
- Consider keeping service active with pings

### Frontend Issues

**Issue**: Cannot connect to API
- Verify `VITE_API_URL` is set correctly
- Check backend is running and healthy
- Check browser console for CORS errors

**Issue**: 404 on page refresh
- Ensure rewrite rules are configured:
  - Source: `/*` → Destination: `/index.html`

**Issue**: Build failures
- Check Node.js version compatibility
- Verify all dependencies in `package.json`
- Check build logs for specific errors

### Database Issues

**Issue**: Database connection timeouts
- Use Internal Database URL for backend (faster, private network)
- Verify database is in same region as backend
- Check database status in Render dashboard

**Issue**: Database full
- Free tier has 1 GB limit
- Monitor database size in dashboard
- Consider upgrading or implementing data cleanup

## Monitoring & Logs

### View Logs

1. **Backend Logs**:
   - Go to your API service
   - Click "Logs" tab
   - Shows real-time application logs

2. **Build Logs**:
   - Click "Events" tab
   - View historical builds and deployments

3. **Database Logs**:
   - Go to database service
   - Click "Logs" tab
   - View connection and query logs

### Set Up Alerts

1. Go to service settings
2. Click "Notifications"
3. Add email or Slack webhooks for:
   - Deployment failures
   - Service health issues
   - Database problems

## Updating Your Application

### Automatic Deploys

With auto-deploy enabled (default in `render.yaml`):
1. Push changes to your repository
2. Render automatically detects changes
3. Builds and deploys new version
4. Zero downtime deployment

### Manual Deploys

1. Go to your service dashboard
2. Click "Manual Deploy"
3. Select "Deploy latest commit"
4. Click "Deploy"

## Security Best Practices

1. **Environment Variables**: Never commit sensitive data
2. **CORS**: Backend already configured for security
3. **HTTPS**: Automatically enabled by Render
4. **Database**: Use internal URL for backend connections
5. **Custom Domain**: Configure HTTPS for custom domains

## Cost Optimization

### Free Tier Strategy

- Keep all services on free tier for development/testing
- Total cost: $0/month
- Limitations: Spin down, limited resources

### Minimal Production Setup

- Backend: Starter plan ($7/month) - no spin down
- Database: Free tier (if sufficient)
- Frontend: Free tier (always on)
- Total: ~$7/month

### Full Production Setup

- Backend: Standard ($25/month) - better performance
- Database: Standard ($7/month) - 256 MB + backups
- Frontend: Free tier
- Total: ~$32/month

## Getting Help

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)

## Next Steps

- ✅ Application deployed
- 🔄 Set up custom domain (optional)
- 📊 Configure monitoring/alerts
- 🔒 Review security settings
- 💾 Plan database backups (paid feature)
- 📈 Monitor usage and performance

Your Task Tracker is now live on Render! 🚀
