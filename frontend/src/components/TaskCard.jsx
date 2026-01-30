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
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className={`text-base md:text-lg font-semibold text-gray-800 mb-1 break-words ${isCompleted ? 'line-through opacity-60' : ''}`}>
            {task.title}
          </h3>
          <span className={`badge text-xs md:text-sm ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>
        
        {/* Complete/Reopen button */}
        <button
          onClick={() => onToggleComplete(task)}
          className="icon-btn text-gray-400 hover:text-primary-600 transition-colors duration-200 flex-shrink-0"
          title={isCompleted ? 'Reopen task' : 'Mark as complete'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 md:w-6 md:h-6" />
          )}
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4 text-xs md:text-sm leading-relaxed">
        {task.description}
      </p>

      {/* Metadata */}
      <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500 mb-4 flex-wrap">
        <div className="flex items-center gap-1">
          <User className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{task.assigned_user.display_name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{formatDate(task.created_at)}</span>
        </div>
        {task.notes && task.notes.length > 0 && (
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span>{task.notes.length}</span>
          </div>
        )}
      </div>

      {/* Completion timestamp */}
      {isCompleted && task.completed_at && (
        <div className="text-xs text-green-600 mb-4 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
          Completed {formatDate(task.completed_at)}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-3 border-t border-gray-100 flex-wrap">
        <button
          onClick={() => onViewNotes(task)}
          className="flex-1 btn-secondary text-xs md:text-sm py-2 md:py-1 px-2 md:px-4 flex items-center justify-center gap-2 min-w-[80px]"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Notes</span>
          <span className="text-xs">({task.notes?.length || 0})</span>
        </button>
        <button
          onClick={() => onEdit(task)}
          className="icon-btn btn-secondary"
          title="Edit task"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="icon-btn btn-danger"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
