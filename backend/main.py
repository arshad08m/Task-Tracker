"""
Task Tracker API - FastAPI Backend
A simple task management API for 2 users with notes support
"""
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, Session, relationship
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
import os
import shutil
from pathlib import Path

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tasks.db")

# Convert postgres:// to postgresql:// for SQLAlchemy 2.0 compatibility (Render compatibility)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Configure connection based on database type
is_sqlite = "sqlite" in DATABASE_URL
connect_args = {"check_same_thread": False} if is_sqlite else {}

try:
    engine = create_engine(
        DATABASE_URL,
        connect_args=connect_args,
        pool_pre_ping=True,  # Test connections before using them (important for cloud deployments)
        echo=False
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
except Exception as e:
    print(f"⚠️ Database connection warning: {e}")
    raise

# Create uploads directory
UPLOAD_DIR = "uploads"
Path(UPLOAD_DIR).mkdir(exist_ok=True)

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    display_name = Column(String)
    tasks = relationship("Task", back_populates="assigned_user")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    status = Column(String, default="Pending")  # Pending or Completed
    assigned_to = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    assigned_user = relationship("User", back_populates="tasks")
    notes = relationship("Note", back_populates="task", cascade="all, delete-orphan")

class Note(Base):
    __tablename__ = "notes"
    
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    content = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    task = relationship("Task", back_populates="notes")
    attachments = relationship("Attachment", back_populates="note", cascade="all, delete-orphan")

class Attachment(Base):
    __tablename__ = "attachments"
    
    id = Column(Integer, primary_key=True, index=True)
    note_id = Column(Integer, ForeignKey("notes.id"))
    filename = Column(String)
    file_path = Column(String)
    file_type = Column(String)  # pdf, image, etc.
    file_size = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    note = relationship("Note", back_populates="attachments")

# Pydantic Schemas
class NoteBase(BaseModel):
    content: str

class AttachmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    note_id: int
    filename: str
    file_type: str
    file_size: int
    created_at: datetime

class NoteResponse(NoteBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    task_id: int
    created_at: datetime
    attachments: List[AttachmentResponse] = []

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    username: str
    display_name: str

class TaskBase(BaseModel):
    title: str
    description: str
    assigned_to: int

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assigned_to: Optional[int] = None
    status: Optional[str] = None

class TaskResponse(TaskBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    status: str
    created_at: datetime
    completed_at: Optional[datetime]
    assigned_user: UserResponse
    notes: List[NoteResponse] = []

# Initialize FastAPI app
app = FastAPI(title="Task Tracker API", version="1.0.0")

# Initialize database on startup
try:
    Base.metadata.create_all(bind=engine)
    init_db()
    print("✅ Database initialized with tables and seed data")
except Exception as e:
    print(f"⚠️ Database initialization warning: {e}")

# Mount uploads directory for static file serving
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# CORS middleware - allows frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database and seed data
def init_db():
    """Create tables and seed initial data"""
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"⚠️ Warning creating tables: {e}")
        return
    
    db = SessionLocal()
    try:
        # Check if users already exist
        try:
            existing_users = db.query(User).count()
        except Exception as e:
            print(f"⚠️ Warning checking users: {e}")
            db.close()
            return
            
        if existing_users == 0:
            # Create default users
            user_a = User(username="user_a", display_name="Hehe")
            user_b = User(username="user_b", display_name="Haha")
            db.add(user_a)
            db.add(user_b)
            db.commit()
            
            # Create sample tasks
            sample_tasks = [
                Task(
                    title="Setup development environment",
                    description="Install all necessary tools and dependencies",
                    assigned_to=user_a.id,
                    status="Completed",
                    completed_at=datetime.utcnow()
                ),
                Task(
                    title="Design database schema",
                    description="Create ERD and define relationships",
                    assigned_to=user_b.id,
                    status="Completed",
                    completed_at=datetime.utcnow()
                ),
                Task(
                    title="Implement API endpoints",
                    description="Build REST API with FastAPI",
                    assigned_to=user_a.id,
                    status="Pending"
                ),
                Task(
                    title="Build React frontend",
                    description="Create responsive UI with React and TailwindCSS",
                    assigned_to=user_b.id,
                    status="Pending"
                ),
            ]
            
            for task in sample_tasks:
                db.add(task)
            
            db.commit()
            
            # Add sample notes
            task_1 = db.query(Task).first()
            if task_1:
                note_1 = Note(task_id=task_1.id, content="Started with Python 3.11 installation")
                note_2 = Note(task_id=task_1.id, content="Configured virtual environment successfully")
                db.add(note_1)
                db.add(note_2)
                db.commit()
            
            print("✅ Database initialized with sample data")
    finally:
        db.close()

# API Endpoints

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Task Tracker API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring services like Render - does NOT require DB"""
    return {
        "status": "healthy",
        "service": "task-tracker-api",
        "version": "1.0.0"
    }

@app.get("/users", response_model=List[UserResponse])
async def get_users(db: Session = Depends(get_db)):
    """Get all users"""
    users = db.query(User).all()
    return users

@app.get("/tasks", response_model=List[TaskResponse])
async def get_tasks(
    assigned_to: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all tasks with optional filtering
    - assigned_to: Filter by user ID
    - status: Filter by status (Pending/Completed)
    """
    query = db.query(Task)
    
    if assigned_to:
        query = query.filter(Task.assigned_to == assigned_to)
    
    if status:
        query = query.filter(Task.status == status)
    
    tasks = query.order_by(Task.created_at.desc()).all()
    return tasks

@app.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(task_id: int, db: Session = Depends(get_db)):
    """Get a specific task by ID"""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.post("/tasks", response_model=TaskResponse, status_code=201)
async def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    """Create a new task"""
    # Verify user exists
    user = db.query(User).filter(User.id == task.assigned_to).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_task = Task(
        title=task.title,
        description=task.description,
        assigned_to=task.assigned_to,
        status="Pending"
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    """Update an existing task"""
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update only provided fields
    update_data = task_update.dict(exclude_unset=True)
    
    if "assigned_to" in update_data:
        user = db.query(User).filter(User.id == update_data["assigned_to"]).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
    
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}", status_code=204)
async def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Delete a task"""
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return None

@app.post("/tasks/{task_id}/complete", response_model=TaskResponse)
async def complete_task(task_id: int, db: Session = Depends(get_db)):
    """Mark a task as completed"""
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_task.status = "Completed"
    db_task.completed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_task)
    return db_task

@app.post("/tasks/{task_id}/reopen", response_model=TaskResponse)
async def reopen_task(task_id: int, db: Session = Depends(get_db)):
    """Reopen a completed task"""
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_task.status = "Pending"
    db_task.completed_at = None
    
    db.commit()
    db.refresh(db_task)
    return db_task

@app.post("/tasks/{task_id}/notes", response_model=TaskResponse)
async def add_note(task_id: int, note: NoteBase, db: Session = Depends(get_db)):
    """Add a note to a task"""
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_note = Note(task_id=task_id, content=note.content)
    db.add(db_note)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.put("/notes/{note_id}", response_model=NoteResponse)
async def update_note(note_id: int, note_update: NoteBase, db: Session = Depends(get_db)):
    """Update an existing note"""
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db_note.content = note_update.content
    db.commit()
    db.refresh(db_note)
    return db_note

@app.delete("/notes/{note_id}", status_code=204)
async def delete_note(note_id: int, db: Session = Depends(get_db)):
    """Delete a note"""
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Delete associated files
    for attachment in db_note.attachments:
        try:
            if os.path.exists(attachment.file_path):
                os.remove(attachment.file_path)
        except Exception as e:
            print(f"Error deleting file: {e}")
    
    db.delete(db_note)
    db.commit()
    return None

@app.post("/notes/{note_id}/attachments")
async def upload_attachment(
    note_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload an attachment (PDF or image) to a note"""
    # Verify note exists
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Validate file type
    allowed_types = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail="Only PDF and image files (JPEG, PNG, GIF, WebP) are allowed"
        )
    
    # Validate file size (max 10MB)
    max_file_size = 10 * 1024 * 1024
    file_content = await file.read()
    if len(file_content) > max_file_size:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")
    
    try:
        # Create a unique filename
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        file_ext = file.filename.split('.')[-1] if '.' in file.filename else ''
        unique_filename = f"{note_id}_{timestamp}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        # Get file type
        file_type = 'pdf' if file.content_type == 'application/pdf' else 'image'
        
        # Create attachment record
        attachment = Attachment(
            note_id=note_id,
            filename=file.filename,
            file_path=file_path,
            file_type=file_type,
            file_size=len(file_content)
        )
        db.add(attachment)
        db.commit()
        db.refresh(attachment)
        
        return {
            "id": attachment.id,
            "note_id": attachment.note_id,
            "filename": attachment.filename,
            "file_type": attachment.file_type,
            "file_size": attachment.file_size,
            "created_at": attachment.created_at,
            "download_url": f"/attachments/{attachment.id}/download"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@app.get("/attachments/{attachment_id}/download")
async def download_attachment(attachment_id: int, db: Session = Depends(get_db)):
    """Download an attachment"""
    from fastapi.responses import FileResponse
    
    attachment = db.query(Attachment).filter(Attachment.id == attachment_id).first()
    if not attachment:
        raise HTTPException(status_code=404, detail="Attachment not found")
    
    if not os.path.exists(attachment.file_path):
        raise HTTPException(status_code=404, detail="File not found on server")
    
    return FileResponse(
        path=attachment.file_path,
        filename=attachment.filename,
        media_type='application/octet-stream'
    )

@app.delete("/attachments/{attachment_id}", status_code=204)
async def delete_attachment(attachment_id: int, db: Session = Depends(get_db)):
    """Delete an attachment"""
    attachment = db.query(Attachment).filter(Attachment.id == attachment_id).first()
    if not attachment:
        raise HTTPException(status_code=404, detail="Attachment not found")
    
    # Delete file from disk
    try:
        if os.path.exists(attachment.file_path):
            os.remove(attachment.file_path)
    except Exception as e:
        print(f"Error deleting file: {e}")
    
    # Delete database record
    db.delete(attachment)
    db.commit()
    return None

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
