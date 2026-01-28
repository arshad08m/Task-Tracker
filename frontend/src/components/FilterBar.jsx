import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

/**
 * FilterBar Component
 * Allows filtering tasks by user and status
 */
const FilterBar = ({ filters, onFilterChange, users }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-4 mb-6"
    >
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-gray-600 font-medium">
          <Filter className="w-5 h-5" />
          <span>Filters:</span>
        </div>

        {/* User Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="user-filter" className="text-sm text-gray-600">
            Assigned to:
          </label>
          <select
            id="user-filter"
            value={filters.assigned_to || ''}
            onChange={(e) => onFilterChange('assigned_to', e.target.value)}
            className="input-field py-1 px-3 text-sm"
          >
            <option value="">All Users</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.display_name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-sm text-gray-600">
            Status:
          </label>
          <select
            id="status-filter"
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="input-field py-1 px-3 text-sm"
          >
            <option value="">All Tasks</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(filters.assigned_to || filters.status) && (
          <button
            onClick={() => onFilterChange('clear')}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default FilterBar;
