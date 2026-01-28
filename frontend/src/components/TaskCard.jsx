import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Trash2, Edit, MessageSquare, Clock, User } from 'lucide-react';
import { formatDate, getStatusColor } from '../utils/helpers';

/**
 * TaskCard Component
 * Displays a single task with all its details and actions
 */
const TaskCard = ({ task, onEdit, onDelete, onToggleComplete, onViewNotes }) => {
  const isCompleted = task.status === 'Completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="card p-5"
    >
      {/* Header with title and status badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold text-gray-800 mb-1 ${isCompleted ? 'line-through opacity-60' : ''}`}>
            {task.title}
          </h3>
          <span className={`badge ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>
        
        {/* Complete/Reopen button */}
        <button
          onClick={() => onToggleComplete(task)}
          className="ml-3 text-gray-400 hover:text-primary-600 transition-colors duration-200"
          title={isCompleted ? 'Reopen task' : 'Mark as complete'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
        {task.description}
      </p>

      {/* Metadata */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>{task.assigned_user.display_name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{formatDate(task.created_at)}</span>
        </div>
        {task.notes && task.notes.length > 0 && (
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{task.notes.length} note{task.notes.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Completion timestamp */}
      {isCompleted && task.completed_at && (
        <div className="text-xs text-green-600 mb-4 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Completed {formatDate(task.completed_at)}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onViewNotes(task)}
          className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Notes ({task.notes?.length || 0})
        </button>
        <button
          onClick={() => onEdit(task)}
          className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
          title="Edit task"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="btn-danger text-sm py-2 px-4 flex items-center gap-2"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
