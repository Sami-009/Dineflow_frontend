// CustomerLayout.jsx
import React from 'react';
import Navbar from '../common/Navbar';

export const CustomerLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      {/* Shared Navbar */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Basic Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 mt-12 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} DineFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
