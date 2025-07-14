import React from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, User } from 'lucide-react';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({ 
  isOpen, 
  onClose, 
  feature = "this feature" 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-berlin-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3 className="text-lg leading-6 font-medium text-berlin-gray-900">
                  Login Required
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-berlin-gray-500">
                    You need to be logged in to use {feature}. Please sign in to your account or create a new one to get started.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-berlin-gray-400 hover:text-berlin-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="bg-berlin-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Link
              to="/login"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-berlin-red-600 text-base font-medium text-white hover:bg-berlin-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-berlin-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Link>
            <Link
              to="/signup"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-berlin-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-berlin-gray-700 hover:bg-berlin-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-berlin-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Create Account
            </Link>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-berlin-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-berlin-gray-700 hover:bg-berlin-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-berlin-red-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
