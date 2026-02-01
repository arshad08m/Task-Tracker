import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

/**
 * FilterBar Component
 * Allows filtering tasks by status (user filtering now handled by tabs)
 */
const FilterBar = ({ filters, onFilterChange, users }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-3 sm:p-4 mb-6"
    >
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-gray-600 font-medium text-sm md:text-base">
          <Filter className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">Filter:</span>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 flex-1 sm:flex-none min-w-max">
          <label htmlFor="status-filter" className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
            Status:
          </label>
          <select
            id="status-filter"
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="input-field py-2 md:py-1 px-3 text-xs md:text-sm"
          >
            <option value="">All Tasks</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Clear Filters */}
        {filters.status && (
          <button
            onClick={() => onFilterChange('clear')}
            className="text-xs md:text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors whitespace-nowrap"
          >
            Clear Filter
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default FilterBar;
