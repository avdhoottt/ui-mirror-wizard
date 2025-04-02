
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const Layout = ({ children, title, subtitle }: LayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Header email="elaina.mcadams@cauhec.org" role="superadmin" />
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-gray-500">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
