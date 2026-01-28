# ⚡ Quick Start Guide

Get the Task Tracker running in under 2 minutes!

## 🎯 One-Command Setup

### macOS / Linux
```bash
cd task-tracker
chmod +x setup.sh
./setup.sh
```

### Windows
```bash
cd task-tracker
setup.bat
```

That's it! The application will:
1. ✅ Install all dependencies
2. ✅ Create and initialize the database
3. ✅ Start both servers automatically
4. ✅ Open in your browser

## 📋 Manual Start (If You've Already Set Up)

### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

## 🎮 First Steps

1. **Choose Your User**
   - Click on "User A" or "User B" to login
   
2. **Create Your First Task**
   - Click the blue "Create Task" button
   - Fill in the title and description
   - Assign it to yourself or the other user
   - Click "Create Task"

3. **Try These Features**
   - ✅ Mark a task as complete by clicking the circle
   - 📝 Click "Notes" to add notes to any task
   - ✏️ Click the edit icon to modify a task
   - 🗑️ Click the trash icon to delete a task
   - 🔍 Use filters to find specific tasks

4. **Switch Users**
   - Click the logout icon in the header
   - Login as the other user to see collaboration in action

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (Interactive Swagger UI)

## 🆘 Need Help?

**Backend won't start?**
- Make sure Python 3.8+ is installed: `python3 --version`
- Check if port 8000 is available

**Frontend won't start?**
- Make sure Node.js 16+ is installed: `node --version`
- Try deleting `node_modules` and running `npm install` again

**Can't see tasks?**
- Make sure the backend is running first
- Check the browser console for errors
- Verify the API URL in `frontend/.env`

For detailed troubleshooting, see the full README.md file.

---

**Happy Task Tracking! 🚀**
