import React from 'react';
import { motion } from 'framer-motion';

const TaskTabs = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    { id: 'assigned_to_me', label: 'Assigned to Me', count: counts.assigned_to_me || 0 },
    { id: 'assigned_by_me', label: 'Assigned by Me', count: counts.assigned_by_me || 0 },
    { id: 'all_tasks', label: 'All Tasks', count: counts.all_tasks || 0 },
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-6 py-3 font-medium text-sm transition-colors
              ${activeTab === tab.id
                ? 'text-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
          >
            <span className="flex items-center gap-2">
              {tab.label}
              <span
                className={`
                  inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full
                  ${activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}
              >
                {tab.count}
              </span>
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskTabs;
