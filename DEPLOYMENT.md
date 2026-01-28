# 🚀 Task Tracker - Deployment Guide

Complete guide for deploying the Task Tracker application to production.

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)
6. [Docker Deployment](#docker-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## ✅ Pre-Deployment Checklist

### Security
- [ ] Change default user credentials (if adding auth)
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure CORS for production domain only
- [ ] Enable rate limiting
- [ ] Set up environment variables
- [ ] Remove debug/development features
- [ ] Add input sanitization
- [ ] Implement proper error handling

### Performance
- [ ] Optimize database queries
- [ ] Enable response compression
- [ ] Minimize bundle size
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Enable production builds

### Infrastructure
- [ ] Choose hosting provider
- [ ] Set up domain name
- [ ] Configure DNS
- [ ] Set up SSL certificate
- [ ] Plan database backup strategy
- [ ] Set up monitoring
- [ ] Configure logging

---

## 🐍 Backend Deployment

### Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.11
sudo apt install python3.11 python3.11-venv python3-pip -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install nginx
sudo apt install nginx -y

# Install supervisor (process manager)
sudo apt install supervisor -y
```

#### 2. Application Setup
```bash
# Create app directory
sudo mkdir -p /var/www/task-tracker
cd /var/www/task-tracker

# Clone repository
git clone <your-repo-url> .

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
pip install gunicorn psycopg2-binary
```

#### 3. Configure Gunicorn
Create `/etc/supervisor/conf.d/task-tracker.conf`:
```ini
[program:task-tracker-api]
directory=/var/www/task-tracker/backend
command=/var/www/task-tracker/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 127.0.0.1:8000
user=www-data
autostart=true
autorestart=true
stderr_logfile=/var/log/task-tracker/api.err.log
stdout_logfile=/var/log/task-tracker/api.out.log
```

Start the service:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start task-tracker-api
```

#### 4. Configure Nginx
Create `/etc/nginx/sites-available/task-tracker`:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/task-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.yourdomain.com
```

---

### Option 2: Platform as a Service (Heroku)

#### 1. Create Procfile
```
web: cd backend && gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

#### 2. Create runtime.txt
```
python-3.11
```

#### 3. Update requirements.txt
```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
gunicorn==21.2.0
psycopg2-binary==2.9.9
```

#### 4. Deploy
```bash
heroku create task-tracker-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

---

### Option 3: Docker Container

See [Docker Deployment](#docker-deployment) section below.

---

## ⚛️ Frontend Deployment

### Option 1: Static Hosting (Netlify, Vercel, GitHub Pages)

#### Build for Production
```bash
cd frontend
npm run build
```

This creates a `dist` folder with optimized static files.

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod --dir=dist
```

Or use the web interface:
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

#### GitHub Pages
1. Build the project: `npm run build`
2. Push the `dist` folder to `gh-pages` branch
3. Enable GitHub Pages in repository settings

---

### Option 2: Traditional Server with Nginx

#### 1. Build Application
```bash
cd frontend
npm run build
```

#### 2. Copy to Server
```bash
scp -r dist/* user@server:/var/www/task-tracker/frontend/
```

#### 3. Configure Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/task-tracker/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🗄️ Database Setup

### Migrate from SQLite to PostgreSQL

#### 1. Update Backend Code
In `main.py`, change the database URL:
```python
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://user:password@localhost/tasktracker"
)

# Remove SQLite-specific parameter
engine = create_engine(DATABASE_URL)
```

#### 2. Install PostgreSQL Driver
```bash
pip install psycopg2-binary
```

#### 3. Create Database
```bash
sudo -u postgres psql
CREATE DATABASE tasktracker;
CREATE USER taskuser WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE tasktracker TO taskuser;
\q
```

#### 4. Run Migrations
The application will auto-create tables on first run.

### Database Backups

#### Automated Backup Script
Create `/usr/local/bin/backup-db.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/task-tracker"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U taskuser tasktracker > $BACKUP_DIR/backup_$TIMESTAMP.sql
gzip $BACKUP_DIR/backup_$TIMESTAMP.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

#### Cron Job
```bash
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-db.sh
```

---

## 🔐 Environment Variables

### Backend `.env`
```env
DATABASE_URL=postgresql://user:password@localhost/tasktracker
SECRET_KEY=your-secret-key-here
ENVIRONMENT=production
ALLOWED_ORIGINS=https://yourdomain.com
```

### Frontend `.env`
```env
VITE_API_URL=https://api.yourdomain.com
```

### Security Best Practices
- Never commit `.env` files to Git
- Use different keys for development and production
- Rotate secrets regularly
- Use environment-specific variables
- Consider using a secrets manager (AWS Secrets Manager, Vault)

---

## 🐳 Docker Deployment

### Backend Dockerfile
Create `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile
Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

### Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: tasktracker
      POSTGRES_USER: taskuser
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://taskuser:${DB_PASSWORD}@db/tasktracker
    depends_on:
      - db
    networks:
      - app-network
    ports:
      - "8000:8000"

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

### Deploy with Docker Compose
```bash
docker-compose up -d
```

---

## 📊 Monitoring & Maintenance

### Application Monitoring

#### 1. Add Health Check Endpoint
In `main.py`:
```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow()
    }
```

#### 2. Set Up Uptime Monitoring
Use services like:
- UptimeRobot
- Pingdom
- StatusCake

Configure alerts for downtime.

### Log Management

#### Backend Logging
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

#### Log Aggregation
Consider using:
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Graylog
- Papertrail
- Datadog

### Performance Monitoring

#### Application Performance Monitoring (APM)
- New Relic
- Datadog APM
- Sentry Performance

#### Database Monitoring
```sql
-- Enable query logging
ALTER SYSTEM SET log_statement = 'all';
SELECT pg_reload_conf();

-- Monitor slow queries
SELECT * FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

### Error Tracking

#### Add Sentry
```bash
pip install sentry-sdk
```

In `main.py`:
```python
import sentry_sdk

sentry_sdk.init(
    dsn="your-sentry-dsn",
    environment="production"
)
```

---

## 🔧 Maintenance Tasks

### Daily
- [ ] Check error logs
- [ ] Monitor API response times
- [ ] Check database size

### Weekly
- [ ] Review backup logs
- [ ] Check disk space
- [ ] Review security alerts
- [ ] Analyze usage patterns

### Monthly
- [ ] Update dependencies
- [ ] Review and optimize slow queries
- [ ] Check SSL certificate expiry
- [ ] Review access logs for anomalies

### Quarterly
- [ ] Rotate secrets
- [ ] Review and update documentation
- [ ] Perform security audit
- [ ] Review and optimize costs

---

## 🚨 Troubleshooting

### Backend Issues

**High CPU Usage**
```bash
# Check process
top -p $(pgrep -f gunicorn)

# Check slow queries
SELECT * FROM pg_stat_activity WHERE state = 'active';
```

**Memory Leaks**
```bash
# Monitor memory
watch -n 1 free -m

# Restart service
sudo supervisorctl restart task-tracker-api
```

### Frontend Issues

**Slow Load Times**
- Enable gzip compression
- Use CDN for static assets
- Optimize images
- Implement lazy loading

**CORS Errors**
Check backend CORS configuration matches frontend domain.

### Database Issues

**Connection Pool Exhausted**
```python
# Increase pool size in SQLAlchemy
engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=0
)
```

---

## 📚 Additional Resources

- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)

---

**Remember: Always test your deployment in a staging environment before going to production!**
