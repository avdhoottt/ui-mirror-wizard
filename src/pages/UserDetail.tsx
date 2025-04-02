import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Mail, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

interface UserDetail {
  id: number;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  image?: string;
  subscribeStatus?: string;
  experience?: string;
  clinicalRole?: string;
  majorClinicalProgramType?: string;
  numberOfClinicalHoursNeeded?: string;
  bio?: string;
  state?: string;
  role: string;
  schoolName?: string;
  workLocation?: string;
  createdAt: string;
  updatedAt: string;
}

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Helper function to add debug information
  const addDebugInfo = (info: string) => {
    console.log("Debug:", info);
    setDebugInfo(prev => [...prev, info]);
  };

  // Get user initials
  const getUserInitials = (name: string | undefined) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  // Get background color based on user role
  const getBackgroundColor = (role: string | undefined) => {
    if (!role) return 'bg-gray-300';
    
    switch (role.toLowerCase()) {
      case 'student':
        return 'bg-cauhec-red';
      case 'preceptor':
        return 'bg-purple-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  // Format date
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  useEffect(() => {
    const fetchUserDetail = async () => {
      setLoading(true);
      addDebugInfo(`Starting to fetch user detail for ID: ${id}`);
      
      try {
        // Verify token exists
        const token = localStorage.getItem('token');
        if (!token) {
          addDebugInfo("No token found in localStorage");
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }
        
        addDebugInfo("Token found, attempting to fetch user details");
        
        try {
          const API_URL = 'https://backend.cauhec.org/api/v1';
          
          // Use the correct API endpoint with query parameter
          const response = await fetch(`${API_URL}/admin/view-user?id=${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'omit'
          });
          
          addDebugInfo(`User API response status: ${response.status}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log(data); // Log full response
            addDebugInfo(`User data received: ${JSON.stringify(data).substring(0, 200)}...`);
            
            if (data.status === 'success' && data.user) {
              setUser(data.user);
              addDebugInfo("User data successfully set");
            } else {
              addDebugInfo(`API returned unexpected data structure: ${JSON.stringify(data).substring(0, 100)}...`);
              
              // For demo, fall back to mock data if API doesn't return expected structure
              setUser(getMockUserDetail(parseInt(id || '1')));
              addDebugInfo("Using mock user data as fallback");
            }
          } else {
            addDebugInfo(`API returned error status: ${response.status}`);
            
            // For demo, fall back to mock data
            setUser(getMockUserDetail(parseInt(id || '1')));
            addDebugInfo("Using mock user data due to API error");
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          addDebugInfo(`Error fetching user: ${errorMessage}`);
          
          // For demo, fall back to mock data
          setUser(getMockUserDetail(parseInt(id || '1')));
          addDebugInfo("Using mock user data due to error");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Error fetching user data:', err);
        addDebugInfo(`General error: ${errorMessage}`);
        setError(`Failed to load user data: ${errorMessage}`);
        
        // For demo, fall back to mock data
        setUser(getMockUserDetail(parseInt(id || '1')));
        
        toast({
          title: "Error loading user",
          description: "There was a problem fetching the user data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
        addDebugInfo("Finished loading process");
      }
    };

    fetchUserDetail();
  }, [id, toast]);

  const handleDelete = () => {
    toast({
      title: "User Deletion Requested",
      description: `You've requested to delete user: ${user?.fullName}`,
      variant: "default"
    });
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Mock data for demonstration
  const getMockUserDetail = (userId: number): UserDetail => {
    return {
      id: userId,
      fullName: "Elaina McAdams",
      firstName: "Elaina",
      lastName: "McAdams",
      email: "elainamhall@mail.fresnostate.edu",
      subscribeStatus: "",
      role: "Student",
      majorClinicalProgramType: "Registered Nurse",
      clinicalRole: "Not specified",
      schoolName: "Loyola Marymount University - Baldwin Park",
      state: "California",
      createdAt: "2024-01-16T10:42:13.000Z",
      updatedAt: "2024-01-16T10:42:13.000Z"
    };
  };

  return (
    <Layout
      title=""
      subtitle=""
    >
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      
<div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6">
  <Button
    variant="ghost"
    onClick={handleBack}
    className="text-gray-600 hover:text-gray-900 flex items-center justify-center sm:justify-start"
  >
    <ArrowLeft className="mr-2 h-4 w-4" />
    Back to Users
  </Button>
  
  <Button
    variant="destructive"
    onClick={handleDelete}
    className="bg-cauhec-red hover:bg-cauhec-red/90 flex items-center justify-center"
    disabled
  >
    <Trash2 className="mr-2 h-4 w-4" />
    Delete User
  </Button>
</div>

      {loading ? (
        // Loading skeleton
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div>
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-40 mt-2" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-5 w-48" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-5 w-48" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-5 w-48" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-5 w-64" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* User Header */}
          <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-medium ${getBackgroundColor(user?.role)}`}>
    {getUserInitials(user?.fullName)}
  </div>
  <div>
    <h2 className="text-2xl font-bold">{user?.fullName}</h2>
    <p className="text-gray-500 mb-2">{user?.role}</p>
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-gray-700">
      <div className="flex items-center">
        <Mail className="h-4 w-4 mr-2" />
        {user?.email}
      </div>
      <div className="flex items-center">
        <Calendar className="h-4 w-4 mr-2" />
        Joined {formatDate(user?.createdAt)}
      </div>
    </div>
  </div>
</div>

          {/* Professional Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500 text-sm">Major</p>
                  <p className="font-semibold">{user?.majorClinicalProgramType || 'Registered Nurse'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Communication Style/Personality Assessment</p>
                  <p className="font-semibold">Not specified</p>
                </div>
              </div>
            </div>
          </div>

          {/* School Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">School Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500 text-sm">School Name</p>
                  <p className="font-semibold">{user?.schoolName || 'Loyola Marymount University - Baldwin Park'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">School Location</p>
                  <p className="font-semibold">3883 Baldwin Park Blvd, Baldwin Park, CA 91706</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stipend Information - only show for students */}
          {user?.role?.toLowerCase() === 'student' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Stipend Information</h3>
                <div>
                  <p className="text-gray-500 text-sm">Stipend Amount</p>
                  <p className="font-semibold">Not specified</p>
                </div>
              </div>
            </div>
          )}

          {/* Status Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Status Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500 text-sm">Subscription Status</p>
                  <p className="font-semibold">{user?.subscribeStatus || ''}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Verification ID</p>
                  <p className="font-semibold">•</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-sm">Personality Assessment</p>
                  <p className="font-semibold"></p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">LinkedIn Profile</p>
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-semibold">
                    View Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserDetail;