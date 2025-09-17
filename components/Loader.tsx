import React from 'react';

const Loader: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 bg-white/80 rounded-lg backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-700 font-medium">{message}</p>
    </div>
  );
};

export default Loader;