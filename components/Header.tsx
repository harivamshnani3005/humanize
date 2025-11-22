import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
            H
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">HumanizeAI</h1>
        </div>
        <nav className="flex gap-4">
           <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Documentation</a>
           <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">About</a>
        </nav>
      </div>
    </header>
  );
};