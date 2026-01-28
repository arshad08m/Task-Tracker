# 🚀 Vercel Deployment Guide

## Prerequisites
- [Vercel Account](https://vercel.com) (free tier available)
- [GitHub Account](https://github.com)
- Git installed locally

## Deployment Steps

### Step 1: Push to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Task Tracker with file attachments"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/task-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select your GitHub repository `task-tracker`
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - Key: `VITE_API_URL`
   - Value: `https://your-project.vercel.app/api`
6. Click **"Deploy"**

### Step 3: Deploy Backend API to Vercel

The backend is configured as serverless functions in the `/api` directory.

1. In your Vercel project settings:
   - Go to **Settings** → **Environment Variables**
   - Add the following variables:
     ```
     DATABASE_URL=sqlite:///./tasks.db
     ```

2. The API will be automatically deployed when you push to the `api/` directory
3. Your backend endpoints will be available at:
   - `https://your-project.vercel.app/api`

### Step 4: Update Frontend API URL

After deployment, update your frontend to use the deployed backend:

1. In `frontend/.env.production`:
   ```
   VITE_API_URL=https://your-project.vercel.app/api
   ```

2. Rebuild and redeploy:
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

## Important Notes

### Database
- The application uses SQLite by default
- For production with multiple users, consider using PostgreSQL or MySQL
- Update `DATABASE_URL` in Vercel environment variables if using a different database

### File Uploads
- Files are stored in `/tmp` directory (ephemeral in serverless)
- For persistent storage in production, consider:
  - AWS S3
  - Google Cloud Storage
  - Supabase
  - Cloudinary

### CORS
- Currently allows all origins (`allow_origins=["*"]`)
- Update this in `api/index.py` for production:
  ```python
  allow_origins=["https://your-project.vercel.app"]
  ```

## Verification

After deployment:

1. Check frontend: `https://your-project.vercel.app`
2. Check API: `https://your-project.vercel.app/api`
3. Test API endpoints:
   ```bash
   curl https://your-project.vercel.app/api/users
   ```

## Troubleshooting

### "Cannot find module" errors
- Ensure all dependencies are in `requirements.txt`
- Run: `pip freeze > requirements.txt` to generate full dependency list

### CORS errors
- Update CORS settings in `api/index.py`
- Ensure `VITE_API_URL` matches your deployed API URL

### Database connection errors
- Verify `DATABASE_URL` environment variable is set
- Check database permissions

### File upload issues
- Maximum file size is 10MB
- Use cloud storage for persistent file storage

## Next Steps for Production

1. **Add a real database** (PostgreSQL recommended)
2. **Implement file storage** (AWS S3, Cloudinary, etc.)
3. **Add authentication** (JWT tokens, OAuth)
4. **Set up monitoring** (Sentry, LogRocket)
5. **Configure custom domain** (in Vercel settings)
6. **Set up CI/CD** (automatic deployments on push)

## Useful Vercel Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from terminal
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel status
```

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Mangum Documentation](https://mangum.io/)
- [Vite Deployment](https://vitejs.dev/guide/build.html)
