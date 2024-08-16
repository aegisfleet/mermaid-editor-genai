import React from 'react';

interface LoadingDialogProps {
  isOpen: boolean;
}

const LoadingDialog: React.FC<LoadingDialogProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-15 z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center justify-center">
        <svg
          className="w-10 h-10 animate-spin text-blue-500 dark:text-blue-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 2a1 1 0 011 1v4a1 1 0 01-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.415 0l2.83 2.83a1 1 0 01-1.415 1.415l-2.83-2.83a1 1 0 010-1.415zM22 11a1 1 0 010 2h-4a1 1 0 010-2h4zM17.64 17.64a1 1 0 011.415 0l2.83 2.83a1 1 0 01-1.415 1.415l-2.83-2.83a1 1 0 010-1.415zM12 18a1 1 0 011 1v4a1 1 0 01-2 0v-4a1 1 0 011-1zm-4.22 1.78a1 1 0 011.415 0l2.83 2.83a1 1 0 01-1.415 1.415l-2.83-2.83a1 1 0 010-1.415zM2 11a1 1 0 010 2H-2a1 1 0 010-2h4zM6.36 6.36a1 1 0 011.415 0l2.83 2.83a1 1 0 01-1.415 1.415L6.36 7.78a1 1 0 010-1.415z"
          />
        </svg>
        <p className="text-lg ml-4 text-gray-800 dark:text-gray-200">Processing...</p>
      </div>
    </div>
  );
};

export default LoadingDialog;
