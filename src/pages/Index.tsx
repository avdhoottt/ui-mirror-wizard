
import React from 'react';
import Layout from '@/components/layout/Layout';
import StatCard from '@/components/dashboard/StatCard';
import Chart from '@/components/dashboard/Chart';
import { Users, Activity, UserCheck, Graduation } from 'lucide-react';

const Dashboard = () => {
  return (
    <Layout 
      title="Dashboard Overview" 
      subtitle="Welcome back! Here's what's happening."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Active Connections" 
          value={9} 
          change="+100.0%" 
          icon={<Users className="text-white" size={24} />} 
          iconBg="bg-cauhec-red/20"
        />
        
        <StatCard 
          title="Active Clinical Rotation" 
          value={4} 
          change="+100.0%" 
          icon={<Activity className="text-white" size={24} />} 
          iconBg="bg-cauhec-red/20"
        />
        
        <StatCard 
          title="Total Preceptor" 
          value={12} 
          change="+500.0%" 
          icon={<UserCheck className="text-white" size={24} />} 
          iconBg="bg-cauhec-red/20"
        />
        
        <StatCard 
          title="Total Students" 
          value={9} 
          change="+200.0%" 
          icon={<Graduation className="text-white" size={24} />} 
          iconBg="bg-cauhec-red/20"
        />
      </div>

      <Chart />
    </Layout>
  );
};

export default Dashboard;
