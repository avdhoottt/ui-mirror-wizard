import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Link2, Building2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Users, label: 'Users', href: '/users' },
    { icon: Link2, label: 'Connections', href: '/connections' },
    { icon: Building2, label: 'Institutions', href: '/institutions' },
    { icon: User, label: 'Profiles', href: '/profiles' },
  ];

  return (
    <div className="w-64 h-screen bg-cauhec-red md:fixed top-0 left-0 flex flex-col">
      <div className="p-4 mt-2">
        <h1 className="text-white text-2xl font-bold">CAUHEC Connect</h1>
        <p className="text-white/80 text-sm">Admin Dashboard</p>
      </div>

      <nav className="flex flex-col gap-1 mt-8 px-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "nav-link",
              location.pathname === item.href && "active"
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto p-4">
        <Link to="/login" className="nav-link">
          <span className="rotate-180 inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
          </span>
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;