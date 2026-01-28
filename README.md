# 📋 Task Tracker - 2-User Collaboration App

A modern, full-stack task management application built with **React** and **FastAPI** that allows two users to collaborate on tasks with notes, file attachments, filtering, and real-time updates.

![Task Tracker](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-blue)
![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)

## ✨ Features

### Core Functionality
- ✅ **Simple Authentication** - Switch between User A and User B
- ✅ **Task Management** - Create, edit, delete, and complete tasks
- ✅ **Rich Notes System** - Add, edit, and delete multiple notes per task
- ✅ **File Attachments** - Attach PDFs and images to notes (up to 10MB)
- ✅ **Smart Filtering** - Filter by assigned user and task status
- ✅ **Status Tracking** - Pending and Completed states with timestamps
- ✅ **User Assignment** - Assign tasks to either user

### UI/UX Features
- 🎨 **Modern Design** - Clean, professional interface with TailwindCSS
- ✨ **Smooth Animations** - Framer Motion for fluid transitions
- 🔔 **Toast Notifications** - Real-time feedback for all actions
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- 🎯 **Intuitive Navigation** - Easy-to-use interface with clear actions
- 🌈 **Beautiful Gradients** - Eye-catching color schemes

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful notification system
- **Lucide React** - Clean, consistent icons

### Backend
- **FastAPI** - Modern, fast Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database (auto-initializes)
- **Pydantic** - Data validation using Python type hints
- **Uvicorn** - Lightning-fast ASGI server

## 📁 Project Structure

```
task-tracker/
├── backend/
│   ├── main.py              # FastAPI application with all endpoints
│   ├── requirements.txt     # Python dependencies
│   └── tasks.db            # SQLite database (auto-created)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskCard.jsx       # Individual task display
│   │   │   ├── TaskForm.jsx       # Create/edit task modal
│   │   │   ├── NotesModal.jsx     # Notes management modal
│   │   │   ├── FilterBar.jsx      # Task filtering controls
│   │   │   └── UserSelector.jsx   # User authentication
│   │   ├── services/
│   │   │   └── api.js             # API service layer
│   │   ├── utils/
│   │   │   └── helpers.js         # Utility functions
│   │   ├── App.jsx                # Main application component
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Option 1: Automated Setup (Recommended)

#### On macOS/Linux:
```bash
# Clone or navigate to the project directory
cd task-tracker

# Make the setup script executable
chmod +x setup.sh

# Run the setup script
./setup.sh
```

#### On Windows:
```bash
# Navigate to the project directory
cd task-tracker

# Run the setup script
setup.bat
```

The application will automatically:
- Install all dependencies
- Initialize the database with sample data
- Start both backend and frontend servers
- Open your browser to http://localhost:3000

### Option 2: Manual Setup

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

The backend will be running at `http://localhost:8000`

#### 2. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running at `http://localhost:3000`

## 📖 Usage Guide

### 1. Login
- Choose between **User A** or **User B** on the login screen
- Your selection is saved in localStorage

### 2. View Dashboard
- See statistics: Total, Pending, and Completed tasks
- View all tasks in a responsive grid layout

### 3. Create Tasks
- Click the **"Create Task"** button
- Fill in:
  - Task title (required)
  - Description (required)
  - Assign to user (required)
- Click **"Create Task"** to save

### 4. Manage Tasks
- **Complete/Reopen**: Click the circle icon on the task card
- **Edit**: Click the edit icon to modify task details
- **Delete**: Click the trash icon to remove a task
- **View Notes**: Click the "Notes" button to manage notes

### 5. Work with Notes
- Open the notes modal for any task
- **Add Note**: Click "Add Note" and write your content
- **Edit Note**: Click the edit icon on any note
- **Delete Note**: Click the trash icon on any note
- All notes show timestamps

### 6. Filter Tasks
- **By User**: Select a user from the "Assigned to" dropdown
- **By Status**: Choose "Pending" or "Completed"
- **Clear Filters**: Click "Clear Filters" to reset

### 7. Switch Users
- Click the logout icon in the header
- Select a different user to login as

## 🗄 Database Schema

### Users Table
```sql
- id: Integer (Primary Key)
- username: String (Unique)
- display_name: String
```

### Tasks Table
```sql
- id: Integer (Primary Key)
- title: String
- description: String
- status: String (Pending/Completed)
- assigned_to: Integer (Foreign Key → users.id)
- created_at: DateTime
- completed_at: DateTime (nullable)
```

### Notes Table
```sql
- id: Integer (Primary Key)
- task_id: Integer (Foreign Key → tasks.id)
- content: String
- created_at: DateTime
```

## 🔌 API Endpoints

### Users
- `GET /users` - Get all users

### Tasks
- `GET /tasks` - Get all tasks (with optional filters)
  - Query params: `assigned_to`, `status`
- `GET /tasks/{id}` - Get specific task
- `POST /tasks` - Create new task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task
- `POST /tasks/{id}/complete` - Mark task as completed
- `POST /tasks/{id}/reopen` - Reopen completed task

### Notes
- `POST /tasks/{id}/notes` - Add note to task
- `PUT /notes/{id}` - Update note
- `DELETE /notes/{id}` - Delete note

## 🎨 Design Features

### Color Scheme
- **Primary**: Blue gradient (#0ea5e9 → #0369a1)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)

### Animations
- Fade-in effects on page load
- Smooth hover transitions on cards
- Scale animations on buttons
- Slide-up animations for modals
- Loading spinner with rotation

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Configuration

### Backend Configuration
Edit environment variables or modify `main.py`:
```python
DATABASE_URL = "sqlite:///./tasks.db"  # Change database location
HOST = "0.0.0.0"
PORT = 8000
```

### Frontend Configuration
Create `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:8000
```

## 📝 Sample Data

The application automatically creates:
- **2 Users**: User A and User B
- **4 Sample Tasks**: 2 completed, 2 pending
- **2 Sample Notes**: On the first task

You can delete or modify this data through the UI once the app is running.

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Find and kill the process
# On macOS/Linux:
lsof -ti:8000 | xargs kill -9
# On Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Database errors:**
```bash
# Delete and reinitialize database
rm backend/tasks.db
python backend/main.py
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Vite will automatically suggest port 3001
# Or kill the process on port 3000
```

**Module not found errors:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**API connection failed:**
- Ensure backend is running on port 8000
- Check CORS settings in `main.py`
- Verify `VITE_API_URL` in frontend `.env`

## 🚀 Vercel Deployment

Deploy your Task Tracker to Vercel for free with automatic CI/CD!

### Quick Deploy

**Option 1: Using Deploy Script**
```bash
# Windows
.\deploy.bat

# macOS/Linux
chmod +x deploy.sh
./deploy.sh
```

**Option 2: Manual Deployment**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit: Task Tracker"
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" and select your GitHub repository
   - Configure:
     - Framework: **Vite**
     - Root Directory: **./frontend**
     - Build Command: **npm run build**
     - Output Directory: **dist**
   - Add Environment Variables:
     - `VITE_API_URL`: `https://your-project.vercel.app/api`
     - `DATABASE_URL`: `sqlite:///./tasks.db` (or your DB URL)
   - Click **Deploy**

3. **Your app is live!** 🎉
   - Frontend: `https://your-project.vercel.app`
   - API: `https://your-project.vercel.app/api`

### Environment Variables for Production

Set these in Vercel project settings:
```
VITE_API_URL=https://your-project.vercel.app/api
DATABASE_URL=your_production_database_url
```

For detailed deployment instructions, see [DEPLOYMENT_VERCEL.md](./DEPLOYMENT_VERCEL.md)

## 🚀 Production Deployment

### Backend
```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Serve with any static file server
# The built files will be in the 'dist' folder
```

### Environment Variables for Production
- Update `VITE_API_URL` to your production backend URL
- Configure CORS in FastAPI to allow your production domain
- Use PostgreSQL instead of SQLite for production

## 📚 Additional Features to Consider

- [ ] Real-time updates with WebSockets
- [ ] Task priorities (Low, Medium, High)
- [ ] Due dates with reminders
- [ ] Task categories/tags
- [ ] File attachments
- [ ] Search functionality
- [ ] Activity log
- [ ] Email notifications
- [ ] Dark mode
- [ ] Export tasks to CSV/PDF

## 🤝 Contributing

This is a demonstration project. Feel free to fork and extend it with additional features!

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Developer Notes

### Code Organization
- **Components**: Reusable UI components with clear props
- **Services**: API calls abstracted into service layer
- **Utils**: Helper functions for formatting and storage
- **State Management**: React hooks with centralized App state

### Best Practices Implemented
- ✅ Async/await for all API calls
- ✅ Error handling with user-friendly messages
- ✅ Loading states for better UX
- ✅ Responsive design with mobile-first approach
- ✅ Accessibility features (semantic HTML, ARIA labels)
- ✅ Clean code with comments
- ✅ Consistent naming conventions
- ✅ Modular component structure

---

**Built with ❤️ using React, FastAPI, and modern web technologies**
