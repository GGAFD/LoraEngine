
import React from 'react';
import Loader from './Loader';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, isLoading = false, disabled, ...props }) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className="relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 border border-transparent rounded-md shadow-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105"
    >
      {isLoading && <Loader />}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>{children}</span>
    </button>
  );
};

export default Button;
