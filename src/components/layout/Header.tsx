
import React from 'react';

interface HeaderProps {
  email: string;
  role: string;
}

const Header = ({ email, role }: HeaderProps) => {
  // Get first letter of email for avatar
  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="flex justify-end items-center p-4 border-b">
      <div className="flex items-center gap-3">
        <div className="text-right">
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
