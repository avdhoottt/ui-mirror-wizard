import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Profile {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  role: string;
  city: string | null;
  zipCode: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

const Profiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  // Fetch profiles from API
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError('');
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found.');
          setLoading(false);
          return;
        }
        
        const response = await fetch('https://backend.cauhec.org/api/v1/admin/profiles', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors',
          credentials: 'omit'
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Profiles data:', data);
          
          if (data.status === 'success' && data.data) {
            // Use data.data instead of data.profiles based on the actual response
            setProfiles(data.data);
          } else {
            setError('Failed to fetch profiles data');
          }
        } else {
          console.error('Failed to fetch profiles:', response.status);
          setError(`Failed to fetch profiles (Status: ${response.status})`);
        }
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to fetch profiles');
        
        toast({
          title: 'Error loading profiles',
          description: 'There was a problem fetching the profiles list.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [toast]);

  // Get initials from profile email
  const getInitials = (email: string): string => {
    return 'U'; // Default initial for admin profiles as shown in the image
  };

  // Handle create admin form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({ ...prev, [name]: value }));
  };

  // Handle create admin submission
  const handleCreateAdmin = async () => {
    if (!newAdmin.email || !newAdmin.password) {
      toast({
        title: 'Validation Error',
        description: 'Email and password are required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: 'Authentication Error',
          description: 'You must be logged in to create an admin.',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch('https://backend.cauhec.org/api/v1/admin/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newAdmin.email,
          password: newAdmin.password,
          fullName: newAdmin.fullName,
          role: 'admin'
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast({
          title: 'Success',
          description: 'Admin created successfully!',
        });
        
        // Add the new admin to the profiles list
        if (data.user) {
          setProfiles(prev => [data.user, ...prev]);
        } else {
          // Refresh profiles
          const token = localStorage.getItem('token');
          const refreshResponse = await fetch('https://backend.cauhec.org/api/v1/admin/profiles', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const refreshData = await refreshResponse.json();
          if (refreshData.status === 'success') {
            setProfiles(refreshData.data || []);
          }
        }
        
        // Close dialog and reset form
        setIsCreateDialogOpen(false);
        setNewAdmin({
          email: '',
          password: '',
          fullName: ''
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to create admin.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      toast({
        title: 'Error',
        description: 'Failed to create admin. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle delete profile
  const handleDeleteProfile = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: 'Authentication Error',
          description: 'You must be logged in to delete a profile.',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch(`https://backend.cauhec.org/api/v1/admin/profile/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast({
          title: 'Success',
          description: 'Profile deleted successfully!',
        });
        
        // Remove the deleted profile from the list
        setProfiles(prev => prev.filter(profile => profile.id !== id));
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to delete profile.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout 
      title="Profiles" 
      subtitle="Manage user profiles and credentials"
    >
      <div className="flex justify-end mb-6">
        <Button 
          className="bg-cauhec-red hover:bg-cauhec-red/90 flex gap-2 items-center"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus size={16} />
          Create Admin
        </Button>
      </div>
      
      {error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cauhec-red"></div>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-gray-500 uppercase text-sm">
                <th className="p-4">Icon</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.filter(profile => profile.role === 'admin').map((profile) => (
                <tr key={profile.id} className="border-b">
                  <td className="p-4">
                    <div className="h-10 w-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-medium">
                      {getInitials(profile.email)}
                    </div>
                  </td>
                  <td className="p-4 text-gray-800">{profile.email}</td>
                  <td className="p-4 text-gray-800">{profile.role}</td>
                  <td className="p-4">
                    <button 
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      onClick={() => handleDeleteProfile(profile.id)}
                      disabled
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Admin Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create New Admin</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name</label>
              <Input
                name="fullName"
                value={newAdmin.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                name="email"
                value={newAdmin.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                type="email"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <Input
                name="password"
                value={newAdmin.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                type="password"
                className="w-full"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateAdmin}
              className="bg-cauhec-red hover:bg-cauhec-red/90"
            >
              Create Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Profiles;