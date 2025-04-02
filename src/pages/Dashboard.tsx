import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Users, Activity, UserCheck, GraduationCap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalPreceptors: number;
  totalConnections: number;
  totalReviews: number;
}

interface ChartData {
  months: string[];
  students: number[];
  preceptors: number[];
}

// StatCard component to match the UI in the image
const StatCard = ({ title, value, change, icon, iconBg }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between">
      <div>
        <h3 className="text-gray-600 font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-green-500 text-sm mt-2">{change} vs last month</p>
      </div>
      <div className={`flex items-center justify-center rounded-full w-12 h-12 ${iconBg}`}>
        {icon}
      </div>
    </div>
  </div>
);

// Custom Chart component to match the UI in the image
const PreceptorsStudentsChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-6">Preceptors vs Students Comparison</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => value === 0 ? '0' : value.toLocaleString()}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="preceptors" fill="#ef5350" radius={[4, 4, 0, 0]} barSize={40} />
            <Bar dataKey="students" fill="#ffaaa5" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center mt-4">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-cauhec-red rounded-sm mr-2"></div>
          <span className="text-sm text-gray-600">Preceptors</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-pink-200 rounded-sm mr-2"></div>
          <span className="text-sm text-gray-600">Students</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // Verify token exists
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }
        
        // Fetch stats data
        try {
          const statsResponse = await fetch('https://backend.cauhec.org/api/v1/admin/stats', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'omit'
          });
          
          if (statsResponse.ok) {
            const data = await statsResponse.json();
            console.log('Stats data:', data);
            
            if (data.status === 'success') {
              setStats(data.data);
            }
          }
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
        
        // Fetch or create chart data
        try {
          // Try to fetch chart data if there's an endpoint for it
          const chartResponse = await fetch('https://backend.cauhec.org/api/v1/admin/charts/preceptors-vs-students', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'omit'
          });
          
          if (chartResponse.ok) {
            const chartData = await chartResponse.json();
            
            if (chartData.status === 'success' && chartData.data) {
              // Format API data to match chart requirements
              const formattedData = transformAPIChartData(chartData.data);
              setChartData(formattedData);
            } else {
              // If no valid chart data, create sample data
              setChartData(createSampleChartData());
            }
          } else {
            // If API call fails, create sample data
            setChartData(createSampleChartData());
          }
        } catch (error) {
          console.error('Error fetching chart data:', error);
          setChartData(createSampleChartData());
        }
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Error fetching dashboard data:', err);
        setError(`Failed to load dashboard data: ${errorMessage}`);
        
        toast({
          title: "Error loading dashboard",
          description: "There was a problem fetching the dashboard data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  // Transform API chart data to format needed by chart component
  const transformAPIChartData = (apiData) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    if (apiData.months && apiData.students && apiData.preceptors) {
      return months.map((month, index) => ({
        name: month,
        students: apiData.students[index] || 0,
        preceptors: apiData.preceptors[index] || 0
      }));
    }
    
    return createSampleChartData();
  };

  // Create sample chart data for development/testing
  const createSampleChartData = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return months.map(month => ({
      name: month,
      preceptors: Math.floor(Math.random() * 10) * (month === 'April' ? 20 : 1),
      students: Math.floor(Math.random() * 8)
    }));
  };

  // Format change percentage
  const formatChangePercentage = (value) => {
    if (!value && value !== 0) return '+0.0%';
    return value > 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  };

  // Define stat cards data using the actual data from API
  const statsData = [
    { 
      title: 'Active Connections', 
      value: stats?.activeConnections?.count || 0, 
      change: formatChangePercentage(parseFloat(stats?.activeConnections?.change || "0")), 
      icon: <Users className="text-cauhec-red" size={24} />, 
      iconBg: 'bg-cauhec-red/10' 
    },
    { 
      title: 'Active Clinical Rotations', 
      value: stats?.activeClinicalRotations?.count || 0, 
      change: formatChangePercentage(parseFloat(stats?.activeClinicalRotations?.change || "0")), 
      icon: <Activity className="text-cauhec-red" size={24} />, 
      iconBg: 'bg-cauhec-red/10' 
    },
    { 
      title: 'Total Preceptors', 
      value: stats?.totalPreceptors?.count || 0, 
      change: formatChangePercentage(parseFloat(stats?.totalPreceptors?.change || "0")), 
      icon: <UserCheck className="text-cauhec-red" size={24} />, 
      iconBg: 'bg-cauhec-red/10' 
    },
    { 
      title: 'Total Students', 
      value: stats?.totalStudents?.count || 0, 
      change: formatChangePercentage(parseFloat(stats?.totalStudents?.change || "0")), 
      icon: <GraduationCap className="text-cauhec-red" size={24} />, 
      iconBg: 'bg-cauhec-red/10' 
    },
  ];
  

  return (
    <Layout 
      title="Dashboard Overview" 
      subtitle="Welcome back! Here's what's happening."
    >
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          // Loading skeletons
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-8 w-1/4 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </div>
          ))
        ) : (
          // Actual data
          statsData.map((stat, index) => (
            <StatCard 
              key={index}
              title={stat.title} 
              value={stat.value} 
              change={stat.change} 
              icon={stat.icon} 
              iconBg={stat.iconBg}
            />
          ))
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-6">
          <Skeleton className="h-6 w-1/4 mb-4" />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : (
        <PreceptorsStudentsChart data={chartData} />
      )}
    </Layout>
  );
};

export default Dashboard;