import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, UserCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  schoolName?: string;
  workLocation?: string;
  createdAt: string;
}

const Users = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'student' | 'preceptor'>('student');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found.');
        return;
      }

      const response = await fetch(`https://backend.cauhec.org/api/v1/admin/users-list/?role=${activeTab}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log(data);

      if (data.status === 'success') {
        // Filter out users without a valid firstName
        const validUsers = data.data.filter(
          (user: User) =>
            user.id &&
            user.email &&
            user.createdAt &&
            user.firstName &&
            user.firstName.trim() !== ''
        );
        setUsers(validUsers);
      } else {
        setUsers([]);
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setUsers([]);
      setError('Error fetching users');
      toast({
        title: 'Error loading users',
        description: 'There was a problem fetching the users list.',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  // Navigate to user detail page
  const handleUserClick = (userId: number) => {
    navigate(`/user/${userId}`);
  };

  return (
    <Layout title="Users" subtitle="Manage students and preceptors">
      <Tabs defaultValue="student" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-8 h-auto">
          <TabsTrigger value="student" className="flex items-center gap-2 py-4" onClick={() => setActiveTab('student')}>
            <GraduationCap className="h-5 w-5" />
            <span>Students</span>
          </TabsTrigger>
          <TabsTrigger value="preceptor" className="flex items-center gap-2 py-4" onClick={() => setActiveTab('preceptor')}>
            <UserCheck className="h-5 w-5" />
            <span>Preceptors</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <div className="bg-white rounded-md shadow overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="p-4">ICON</th>
                    <th className="p-4">NAME</th>
                    <th className="p-4">EMAIL</th>
                    <th className="p-4">{activeTab === 'preceptor' ? 'WORK LOCATION' : 'SCHOOL'}</th>
                    <th className="p-4">JOIN DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="user-initial bg-cauhec-red">
                            {`${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()}
                          </div>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => handleUserClick(user.id)}
                            className="font-medium text-left hover:text-cauhec-red hover:underline transition-colors"
                          >
                            {user.firstName} {user.lastName}
                          </button>
                        </td>
                        <td className="p-4 text-gray-500">{user.email}</td>
                        <td className="p-4 text-gray-500">
                          {activeTab === 'preceptor' ? user.workLocation ?? 'N/A' : user.schoolName ?? 'N/A'}
                        </td>
                        <td className="p-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Users;