
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  change: string;
  icon: React.ReactNode;
  iconBg: string;
}

const StatCard = ({ title, value, change, icon, iconBg }: StatCardProps) => {
  const isPositive = change.startsWith('+');

  return (
    <div className="stat-card">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <h3 className="text-3xl font-semibold">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{change}</span>
        <span className="text-gray-500 text-sm"> vs last month</span>
      </div>
    </div>
  );
};

export default StatCard;
