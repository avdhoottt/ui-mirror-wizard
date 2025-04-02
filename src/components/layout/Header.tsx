import React from 'react';

interface HeaderProps {
  email: string;
  role: string;
  toggleSidebar: () => void;
}

const Header = ({ email, role, toggleSidebar }: HeaderProps) => {
  // Get first letter of email for avatar
  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="flex justify-between md:justify-end items-center p-4 border-b">
      {/* Mobile menu toggle - only visible on small screens */}
      <button 
        onClick={toggleSidebar} 
        className="md:hidden text-gray-600 hover:text-gray-900"
        aria-label="Toggle menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">{email}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
        <div className="bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center text-white">
          {initial}
        </div>
      </div>
    </div>
  );
};

export default Header;