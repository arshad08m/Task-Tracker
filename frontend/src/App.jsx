import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, CheckCircle, Clock, ListTodo } from 'lucide-react';

// Components
import UserSelector from './components/UserSelector';
import FilterBar from './components/FilterBar';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import NotesModal from './components/NotesModal';
import TaskTabs from './components/TaskTabs';

// Services and utilities
import apiService from './services/api';
import { storage } from './utils/helpers';

/**
 * Main App Component
 * Manages the entire task tracker application state and logic
 */
function App() {
  // State management
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState('assigned_to_me');
  const [tasksByView, setTasksByView] = useState({
    assigned_to_me: [],
    assigned_by_me: [],
    all_tasks: [],
  });
  const [loading, setLoading] = useState(true);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Load current user from localStorage on mount
  useEffect(() => {
    const savedUser = storage.getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    fetchUsers();
  }, []);

  // Fetch tasks when user changes or filters change
  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser, filters]);

  // Update displayed tasks when tab changes
  useEffect(() => {
    const currentTabTasks = tasksByView[activeTab] || [];
    setTasks(currentTabTasks);
    setFilteredTasks(currentTabTasks);
  }, [activeTab, tasksByView]);

  /**
   * Fetch all users from API
   */
  const fetchUsers = async () => {
    try {
      const data = await apiService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  /**
   * Fetch tasks with current filters
   */
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMyTasksView(currentUser.id, filters);
      
      // Store tasks by view
      setTasksByView({
        assigned_to_me: Array.isArray(data.assigned_to_me) ? data.assigned_to_me : [],
        assigned_by_me: Array.isArray(data.assigned_by_me) ? data.assigned_by_me : [],
        all_tasks: Array.isArray(data.all_tasks) ? data.all_tasks : [],
      });
      
      // Set tasks based on active tab
      const currentTabTasks = data[activeTab] || [];
      setTasks(currentTabTasks);
      setFilteredTasks(currentTabTasks);
    } catch (error) {
      toast.error('Failed to load tasks');
      console.error('Error fetching tasks:', error);
      setTasksByView({
        assigned_to_me: [],
        assigned_by_me: [],
        all_tasks: [],
      });
      setTasks([]);
      setFilteredTasks([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle user login/switch
   */
  const handleUserChange = (user) => {
    setCurrentUser(user);
    storage.setCurrentUser(user);
    toast.success(`Welcome, ${user.display_name}!`);
  };

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    setCurrentUser(null);
    storage.clearCurrentUser();
    setTasks([]);
    setFilters({});
    toast.success('Logged out successfully');
  };

  /**
   * Handle tab changes
   */
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  /**
   * Handle filter changes
   */
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'clear') {
      setFilters({});
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: value || undefined,
      }));
    }
  };

  /**
   * Open task form for creating new task
   */
  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  /**
   * Open task form for editing existing task
   */
  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  /**
   * Submit task form (create or update)
   */
  const handleTaskSubmit = async (taskData) => {
    try {
      if (editingTask) {
        // Update existing task
        await apiService.updateTask(editingTask.id, taskData);
        toast.success('Task updated successfully!');
      } else {
        // Create new task
        await apiService.createTask(taskData);
        toast.success('Task created successfully!');
      }
      setIsTaskFormOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
      console.error('Error submitting task:', error);
    }
  };

  /**
   * Delete a task
   */
  const handleDeleteTask = async (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        await apiService.deleteTask(task.id);
        toast.success('Task deleted successfully!');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
        console.error('Error deleting task:', error);
      }
    }
  };

  /**
   * Toggle task completion status
   */
  const handleToggleComplete = async (task) => {
    try {
      if (task.status === 'Completed') {
        await apiService.reopenTask(task.id);
        toast.success('Task reopened!');
      } else {
        await apiService.completeTask(task.id);
        toast.success('Task completed!', {
          icon: '🎉',
        });
      }
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task status');
      console.error('Error toggling task:', error);
    }
  };

  /**
   * Open notes modal for a task
   */
  const handleViewNotes = async (task) => {
    try {
      // Fetch fresh task data to get latest notes
      const freshTask = await apiService.getTask(task.id);
      setSelectedTask(freshTask);
      setIsNotesModalOpen(true);
    } catch (error) {
      toast.error('Failed to load task notes');
      console.error('Error loading notes:', error);
    }
  };

  /**
   * Add a note to a task
   */
  const handleAddNote = async (taskId, content) => {
    try {
      const updatedTask = await apiService.addNote(taskId, content);
      setSelectedTask(updatedTask);
      toast.success('Note added!');
      fetchTasks(); // Refresh to update note count
    } catch (error) {
      toast.error('Failed to add note');
      console.error('Error adding note:', error);
    }
  };

  /**
   * Update a note
   */
  const handleUpdateNote = async (noteId, content) => {
    try {
      await apiService.updateNote(noteId, content);
      // Refresh task notes
      const freshTask = await apiService.getTask(selectedTask.id);
      setSelectedTask(freshTask);
      toast.success('Note updated!');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update note');
      console.error('Error updating note:', error);
    }
  };

  /**
   * Delete a note
   */
  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await apiService.deleteNote(noteId);
        // Refresh task notes
        const freshTask = await apiService.getTask(selectedTask.id);
        setSelectedTask(freshTask);
        toast.success('Note deleted!');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete note');
        console.error('Error deleting note:', error);
      }
    }
  };

  /**
   * Refresh selected task (for attachment uploads)
   */
  const handleRefreshTask = async () => {
    try {
      const freshTask = await apiService.getTask(selectedTask.id);
      setSelectedTask(freshTask);
      fetchTasks();
    } catch (error) {
      console.error('Error refreshing task:', error);
    }
  };

  // Calculate stats for current tab
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
  };

  // Calculate counts for each tab
  const tabCounts = {
    assigned_to_me: tasksByView.assigned_to_me.length,
    assigned_by_me: tasksByView.assigned_by_me.length,
    all_tasks: tasksByView.all_tasks.length,
  };

  // Show login screen if no user is logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <UserSelector
          users={users}
          currentUser={currentUser}
          onUserChange={handleUserChange}
          onLogout={handleLogout}
        />
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Task Tracker
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">Collaborate and complete tasks together</p>
          </div>
          
          <UserSelector
            users={users}
            currentUser={currentUser}
            onUserChange={handleUserChange}
            onLogout={handleLogout}
          />
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm mb-1">Total Tasks</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <ListTodo className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm mb-1">Pending</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm mb-1">Completed</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Navigation */}
        <TaskTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          counts={tabCounts}
        />

        {/* Filters and Create Button */}
        <div className="flex flex-col gap-4 mb-6">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            users={users}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateTask}
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm md:text-base py-3 md:py-2"
          >
            <Plus className="w-5 h-5" />
            Create New Task
          </motion.button>
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full"
            />
          </div>
        ) : filteredTasks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                  onViewNotes={handleViewNotes}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <ListTodo className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-6">
              {Object.keys(filters).length > 0
                ? 'Try adjusting your filters'
                : 'Create your first task to get started'}
            </p>
            {Object.keys(filters).length === 0 && (
              <button onClick={handleCreateTask} className="btn-primary">
                <Plus className="w-5 h-5 inline mr-2" />
                Create Task
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}
        task={editingTask}
        users={users}
        currentUser={currentUser}
      />

      <NotesModal
        isOpen={isNotesModalOpen}
        onClose={() => {
          setIsNotesModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onAddNote={handleAddNote}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
        onRefresh={handleRefreshTask}
      />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
