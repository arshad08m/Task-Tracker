# 🚀 Vercel Deployment Quick Reference

## One-Minute Setup

### 1️⃣ Push to GitHub
```bash
git add .
git commit -m "Task Tracker ready for Vercel"
git push -u origin main
```

### 2️⃣ Deploy on Vercel
1. Visit [vercel.com](https://vercel.com)
2. Click "New Project" → Select repository
3. Set Root Directory: `./frontend`
4. Add Env Var: `VITE_API_URL=https://your-project.vercel.app/api`
5. Click "Deploy" ✅

### 3️⃣ Done!
- App: `https://your-project.vercel.app`
- API: `https://your-project.vercel.app/api`

---

## Environment Variables

| Variable | Value | Required |
|----------|-------|----------|
| `VITE_API_URL` | `https://your-project.vercel.app/api` | ✅ |
| `DATABASE_URL` | `sqlite:///./tasks.db` | Optional |

---

## Directory Structure

```
task-tracker/
├── api/                    # 🔥 Vercel serverless functions
│   └── index.py           # FastAPI app entry point
├── frontend/               # ⚡ React + Vite app
│   ├── src/
│   ├── .env.production    # Production env vars
│   └── package.json
├── vercel.json            # ✨ Vercel config
├── requirements.txt       # Python dependencies
└── DEPLOYMENT_VERCEL.md   # 📖 Full guide
```

---

## Important Files

| File | Purpose |
|------|---------|
| `/api/index.py` | Backend FastAPI + Mangum adapter |
| `/vercel.json` | Vercel build configuration |
| `/frontend/.env.production` | Frontend API URL |
| `/requirements.txt` | Python deps (includes Mangum) |

---

## Endpoints After Deployment

```
GET    https://your-project.vercel.app/api/
GET    https://your-project.vercel.app/api/users
GET    https://your-project.vercel.app/api/tasks
POST   https://your-project.vercel.app/api/tasks
PUT    https://your-project.vercel.app/api/tasks/{id}
DELETE https://your-project.vercel.app/api/tasks/{id}
```

---

## Test Deployment

```bash
# After deployment, test the API
curl https://your-project.vercel.app/api/users
curl https://your-project.vercel.app/api/tasks
```

---

## Features Ready ✨

- ✅ Tasks CRUD operations
- ✅ User management
- ✅ Notes with timestamps
- ✅ File attachments (PDF + images)
- ✅ Task filtering
- ✅ Status tracking
- ✅ Modern React UI
- ✅ Responsive design

---

## Production Checklist

- [ ] Push code to GitHub
- [ ] Create Vercel project
- [ ] Configure environment variables
- [ ] Deploy
- [ ] Test API endpoints
- [ ] Set custom domain (optional)
- [ ] Monitor in Vercel Dashboard
- [ ] Consider PostgreSQL for production
- [ ] Set up file storage (S3, Cloudinary)
- [ ] Configure CORS for production domain

---

## Support Links

- 📖 [Full Guide](./DEPLOYMENT_VERCEL.md)
- 🔗 [Vercel Docs](https://vercel.com/docs)
- ⚡ [FastAPI Deploy](https://fastapi.tiangolo.com/deployment/)

---

**🎉 You're ready to deploy!**
