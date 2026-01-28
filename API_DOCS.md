# 🔌 Task Tracker API Documentation

Complete API reference for the Task Tracker backend.

## Base URL
```
http://localhost:8000
```

## Interactive Documentation
Visit these URLs when the backend is running:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 📚 Endpoints

### Health Check

#### GET `/`
Check if the API is running.

**Response:**
```json
{
  "message": "Task Tracker API is running",
  "version": "1.0.0"
}
```

---

## 👥 Users

### GET `/users`
Get all users in the system.

**Response:**
```json
[
  {
    "id": 1,
    "username": "user_a",
    "display_name": "User A"
  },
  {
    "id": 2,
    "username": "user_b",
    "display_name": "User B"
  }
]
```

---

## 📋 Tasks

### GET `/tasks`
Get all tasks with optional filtering.

**Query Parameters:**
- `assigned_to` (optional): User ID to filter by
- `status` (optional): "Pending" or "Completed"

**Examples:**
```
GET /tasks
GET /tasks?assigned_to=1
GET /tasks?status=Pending
GET /tasks?assigned_to=1&status=Completed
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Setup development environment",
    "description": "Install all necessary tools",
    "status": "Completed",
    "assigned_to": 1,
    "created_at": "2024-01-15T10:30:00",
    "completed_at": "2024-01-15T14:20:00",
    "assigned_user": {
      "id": 1,
      "username": "user_a",
      "display_name": "User A"
    },
    "notes": [
      {
        "id": 1,
        "task_id": 1,
        "content": "Started with Python installation",
        "created_at": "2024-01-15T11:00:00"
      }
    ]
  }
]
```

### GET `/tasks/{task_id}`
Get a specific task by ID.

**Parameters:**
- `task_id`: Task ID (integer)

**Response:**
```json
{
  "id": 1,
  "title": "Setup development environment",
  "description": "Install all necessary tools",
  "status": "Completed",
  "assigned_to": 1,
  "created_at": "2024-01-15T10:30:00",
  "completed_at": "2024-01-15T14:20:00",
  "assigned_user": {
    "id": 1,
    "username": "user_a",
    "display_name": "User A"
  },
  "notes": []
}
```

**Error Response (404):**
```json
{
  "detail": "Task not found"
}
```

### POST `/tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "New task title",
  "description": "Task description here",
  "assigned_to": 1
}
```

**Response (201):**
```json
{
  "id": 5,
  "title": "New task title",
  "description": "Task description here",
  "status": "Pending",
  "assigned_to": 1,
  "created_at": "2024-01-15T15:00:00",
  "completed_at": null,
  "assigned_user": {
    "id": 1,
    "username": "user_a",
    "display_name": "User A"
  },
  "notes": []
}
```

**Error Response (404):**
```json
{
  "detail": "User not found"
}
```

### PUT `/tasks/{task_id}`
Update an existing task.

**Parameters:**
- `task_id`: Task ID (integer)

**Request Body (all fields optional):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "assigned_to": 2,
  "status": "Completed"
}
```

**Response:**
```json
{
  "id": 5,
  "title": "Updated title",
  "description": "Updated description",
  "status": "Completed",
  "assigned_to": 2,
  "created_at": "2024-01-15T15:00:00",
  "completed_at": null,
  "assigned_user": {
    "id": 2,
    "username": "user_b",
    "display_name": "User B"
  },
  "notes": []
}
```

### DELETE `/tasks/{task_id}`
Delete a task.

**Parameters:**
- `task_id`: Task ID (integer)

**Response (204):**
No content

**Error Response (404):**
```json
{
  "detail": "Task not found"
}
```

### POST `/tasks/{task_id}/complete`
Mark a task as completed.

**Parameters:**
- `task_id`: Task ID (integer)

**Response:**
```json
{
  "id": 1,
  "title": "Task title",
  "description": "Task description",
  "status": "Completed",
  "assigned_to": 1,
  "created_at": "2024-01-15T10:00:00",
  "completed_at": "2024-01-15T16:30:00",
  "assigned_user": {
    "id": 1,
    "username": "user_a",
    "display_name": "User A"
  },
  "notes": []
}
```

### POST `/tasks/{task_id}/reopen`
Reopen a completed task.

**Parameters:**
- `task_id`: Task ID (integer)

**Response:**
```json
{
  "id": 1,
  "title": "Task title",
  "description": "Task description",
  "status": "Pending",
  "assigned_to": 1,
  "created_at": "2024-01-15T10:00:00",
  "completed_at": null,
  "assigned_user": {
    "id": 1,
    "username": "user_a",
    "display_name": "User A"
  },
  "notes": []
}
```

---

## 📝 Notes

### POST `/tasks/{task_id}/notes`
Add a note to a task.

**Parameters:**
- `task_id`: Task ID (integer)

**Request Body:**
```json
{
  "content": "This is a note about the task"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Task title",
  "description": "Task description",
  "status": "Pending",
  "assigned_to": 1,
  "created_at": "2024-01-15T10:00:00",
  "completed_at": null,
  "assigned_user": {
    "id": 1,
    "username": "user_a",
    "display_name": "User A"
  },
  "notes": [
    {
      "id": 1,
      "task_id": 1,
      "content": "This is a note about the task",
      "created_at": "2024-01-15T16:45:00"
    }
  ]
}
```

### PUT `/notes/{note_id}`
Update an existing note.

**Parameters:**
- `note_id`: Note ID (integer)

**Request Body:**
```json
{
  "content": "Updated note content"
}
```

**Response:**
```json
{
  "id": 1,
  "task_id": 1,
  "content": "Updated note content",
  "created_at": "2024-01-15T16:45:00"
}
```

**Error Response (404):**
```json
{
  "detail": "Note not found"
}
```

### DELETE `/notes/{note_id}`
Delete a note.

**Parameters:**
- `note_id`: Note ID (integer)

**Response (204):**
No content

**Error Response (404):**
```json
{
  "detail": "Note not found"
}
```

---

## 🔧 Error Responses

All endpoints may return these error codes:

### 400 Bad Request
```json
{
  "detail": "Invalid request data"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Unprocessable Entity
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## 📊 Data Models

### User
```typescript
{
  id: number;
  username: string;
  display_name: string;
}
```

### Task
```typescript
{
  id: number;
  title: string;
  description: string;
  status: "Pending" | "Completed";
  assigned_to: number;
  created_at: string;  // ISO 8601 datetime
  completed_at: string | null;  // ISO 8601 datetime
  assigned_user: User;
  notes: Note[];
}
```

### Note
```typescript
{
  id: number;
  task_id: number;
  content: string;
  created_at: string;  // ISO 8601 datetime
}
```

---

## 🧪 Testing with curl

### Create a task
```bash
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test task",
    "description": "This is a test",
    "assigned_to": 1
  }'
```

### Get all tasks
```bash
curl http://localhost:8000/tasks
```

### Complete a task
```bash
curl -X POST http://localhost:8000/tasks/1/complete
```

### Add a note
```bash
curl -X POST http://localhost:8000/tasks/1/notes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Important note"
  }'
```

---

## 🔒 CORS Configuration

The API is configured to accept requests from any origin during development:

```python
allow_origins=["*"]
```

**For production**, update this to your specific frontend domain:

```python
allow_origins=["https://your-frontend-domain.com"]
```

---

## 📦 Database Initialization

The database automatically initializes with:
- 2 users (User A and User B)
- 4 sample tasks
- 2 sample notes

This happens on the first run when `tasks.db` doesn't exist.

To reset the database:
```bash
rm tasks.db
python main.py
```

---

For more information, visit the interactive API documentation at http://localhost:8000/docs when the server is running.
