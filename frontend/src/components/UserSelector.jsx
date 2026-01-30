import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';

/**
 * UserSelector Component
 * Simple authentication - allows switching between User A and User B
 */
const UserSelector = ({ users, currentUser, onUserChange, onLogout }) => {
  if (currentUser) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 sm:gap-3 bg-white rounded-xl shadow-md px-3 sm:px-4 py-2 text-xs sm:text-base"
      >
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
            {currentUser.display_name.charAt(0)}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800">{currentUser.display_name}</p>
            <p className="text-xs text-gray-500">@{currentUser.username}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="ml-1 sm:ml-2 text-gray-400 hover:text-red-500 transition-colors p-1"
          title="Switch user"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 w-full max-w-md"
    >
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
          <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
        <p className="text-xs sm:text-base text-gray-600">Select your account to continue</p>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {users.map((user) => (
          <motion.button
            key={user.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onUserChange(user)}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center font-bold text-sm">
              {user.display_name.charAt(0)}
            </div>
            <span>Continue as {user.display_name}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default UserSelector;
