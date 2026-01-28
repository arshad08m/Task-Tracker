import axios from 'axios';

// Base API URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service object with all endpoints
const apiService = {
  // User endpoints
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Task endpoints
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.assigned_to) params.append('assigned_to', filters.assigned_to);
    if (filters.status) params.append('status', filters.status);
    
    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  getTask: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
  },

  completeTask: async (taskId) => {
    const response = await api.post(`/tasks/${taskId}/complete`);
    return response.data;
  },

  reopenTask: async (taskId) => {
    const response = await api.post(`/tasks/${taskId}/reopen`);
    return response.data;
  },

  // Note endpoints
  addNote: async (taskId, content) => {
    const response = await api.post(`/tasks/${taskId}/notes`, { content });
    return response.data;
  },

  updateNote: async (noteId, content) => {
    const response = await api.put(`/notes/${noteId}`, { content });
    return response.data;
  },

  deleteNote: async (noteId) => {
    await api.delete(`/notes/${noteId}`);
  },

  // Attachment endpoints
  uploadAttachment: async (noteId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(
      `${API_BASE_URL}/notes/${noteId}/attachments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  deleteAttachment: async (attachmentId) => {
    await api.delete(`/attachments/${attachmentId}`);
  },

  downloadAttachment: async (attachmentId, filename) => {
    const response = await axios.get(
      `${API_BASE_URL}/attachments/${attachmentId}/download`,
      { responseType: 'blob' }
    );
    
    // Create a blob URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default apiService;
