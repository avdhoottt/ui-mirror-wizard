import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

// Define interfaces for the API response data structure
interface APIConnection {
  connection_status: string;
  connection_request_date: string;
  connection_date: string;
  student_name: string;
  student_id: number;
  student_email: string;
  preceptor_name: string;
  preceptor_id: number;
  preceptor_email: string;
}

interface FormattedConnection {
  studentId: number;
  studentInitials: string;
  studentName: string;
  studentEmail: string;
  studentBg: string;
  preceptorId: number;
  preceptorInitials: string;
  preceptorName: string;
  preceptorEmail: string;
  preceptorBg: string;
  requestDate: string;
  connectionDate: string;
}

const Connections = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState<FormattedConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Helper function to add debug information
  const addDebugInfo = (info: string) => {
    console.log("Debug:", info);
    setDebugInfo(prev => [...prev, info]);
  };

  // Helper to get initials from a name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  // Helper to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Helper to get a consistent background color based on user ID
  const getBackgroundColor = (id: number, role: string): string => {
    const colors = [
      'bg-cauhec-red', 'bg-blue-500', 'bg-green-500', 
      'bg-purple-500', 'bg-orange-500', 'bg-pink-500',
      'bg-teal-500', 'bg-indigo-500', 'bg-yellow-500'
    ];
    
    // Use different color sets for students and preceptors
    if (role === 'student') {
      return colors[id % 5]; // First 5 colors for students
    } else {
      return colors[5 + (id % 4)]; // Last 4 colors for preceptors
    }
  };

  // Format API connections to the display format
  const formatConnections = (apiConnections: APIConnection[]): FormattedConnection[] => {
    return apiConnections.map(conn => {
      return {
        studentId: conn.student_id,
        studentInitials: getInitials(conn.student_name),
        studentName: conn.student_name,
        studentEmail: conn.student_email || `${conn.student_name.replace(/\s/g, '').toLowerCase()}@studentmail.com`,
        studentBg: getBackgroundColor(conn.student_id, 'student'),
        preceptorId: conn.preceptor_id,
        preceptorInitials: getInitials(conn.preceptor_name),
        preceptorName: conn.preceptor_name,
        preceptorEmail: conn.preceptor_email || `${conn.preceptor_name.replace(/\s/g, '').toLowerCase()}@mail.com`,
        preceptorBg: getBackgroundColor(conn.preceptor_id, 'preceptor'),
        requestDate: formatDate(conn.connection_request_date),
        connectionDate: formatDate(conn.connection_date)
      };
    });
  };

  // Navigate to user detail page
  const handleUserClick = (userId: number) => {
    navigate(`/user/${userId}`);
  };

  // Fallback mock data
  const mockConnections: FormattedConnection[] = [
    {
      studentId: 1,
      studentInitials: "EM",
      studentName: "Elaina McAdams",
      studentEmail: "elainamhall@mail.fresnostate.edu",
      studentBg: "bg-cauhec-red",
      preceptorId: 2,
      preceptorInitials: "EM",
      preceptorName: "Elaina McAdams",
      preceptorEmail: "Elainamhall@gmail.com",
      preceptorBg: "bg-cauhec-red",
      requestDate: "18/12/2024",
      connectionDate: "18/12/2024"
    },
    {
      studentId: 3,
      studentInitials: "EM",
      studentName: "Elaina McAdams",
      studentEmail: "Elainamhall@yahoo.com",
      studentBg: "bg-cauhec-red",
      preceptorId: 4,
      preceptorInitials: "E",
      preceptorName: "Elaina",
      preceptorEmail: "elaina.mcadams@cauhec.org",
      preceptorBg: "bg-purple-500",
      requestDate: "11/01/2025",
      connectionDate: "11/01/2025"
    },
    {
      studentId: 5,
      studentInitials: "EM",
      studentName: "Elaina McAdams",
      studentEmail: "Elainamhall@yahoo.com",
      studentBg: "bg-cauhec-red",
      preceptorId: 6,
      preceptorInitials: "E",
      preceptorName: "Elaina McAdams",
      preceptorEmail: "Elaina.mcadams@cauhec.orf",
      preceptorBg: "bg-purple-500",
      requestDate: "10/02/2025",
      connectionDate: "10/02/2025"
    },
    {
      studentId: 7,
      studentInitials: "EM",
      studentName: "Elaina McAdams",
      studentEmail: "Elainamhall@yahoo.com",
      studentBg: "bg-cauhec-red",
      preceptorId: 8,
      preceptorInitials: "ML",
      preceptorName: "Marvin Lowrance",
      preceptorEmail: "marvin.lowrance@idea2impacttechsolutions.com",
      preceptorBg: "bg-green-500",
      requestDate: "10/02/2025",
      connectionDate: "10/02/2025"
    },
    {
      studentId: 9,
      studentInitials: "OY",
      studentName: "Olivia Young",
      studentEmail: "Olivia.young@studentmail.com",
      studentBg: "bg-orange-500",
      preceptorId: 10,
      preceptorInitials: "DS",
      preceptorName: "David Smith",
      preceptorEmail: "David.smith@mail.com",
      preceptorBg: "bg-blue-500",
      requestDate: "14/02/2025",
      connectionDate: "14/02/2025"
    },
  ];

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      addDebugInfo("Starting to fetch connections data");
      
      try {
        // Verify token exists
        const token = localStorage.getItem('token');
        if (!token) {
          addDebugInfo("No token found in localStorage");
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }
        
        addDebugInfo("Token found, attempting to fetch connections");
        
        // Method 1: Try direct fetch with CORS settings
        try {
          addDebugInfo("Attempting method 1: Direct fetch with CORS settings");
          const API_URL = 'https://backend.cauhec.org/api/v1';
          
          const response = await fetch(`${API_URL}/admin/all-connections`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'omit' // Important for CORS
          });
          
          addDebugInfo(`Connections API response status: ${response.status}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log(data); // Log full response
            addDebugInfo(`Connections data received: ${JSON.stringify(data).substring(0, 200)}...`);
            
            // Check for the correct data structure based on actual API response
            if (data.status === 'success' && data.data && Array.isArray(data.data)) {
              const formattedConnections = formatConnections(data.data);
              setConnections(formattedConnections);
              addDebugInfo(`Successfully formatted ${formattedConnections.length} connections`);
              setLoading(false);
              return;
            } else {
              addDebugInfo(`API returned unexpected data structure: ${JSON.stringify(data).substring(0, 100)}...`);
              throw new Error('Unexpected data structure in API response');
            }
          } else {
            addDebugInfo(`API returned error status: ${response.status}`);
            throw new Error(`API returned status: ${response.status}`);
          }
        } catch (method1Error) {
          addDebugInfo(`Method 1 failed: ${method1Error instanceof Error ? method1Error.message : String(method1Error)}`);
          
          // If all methods failed, use mock data
          addDebugInfo("API method failed, using mock data as fallback");
          setConnections(mockConnections);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Error fetching connections data:', err);
        addDebugInfo(`General error: ${errorMessage}`);
        setError(`Failed to load connections data: ${errorMessage}`);
        
        // Use mock data as fallback
        setConnections(mockConnections);
        
        toast({
          title: "Error loading connections",
          description: "There was a problem fetching the connections data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
        addDebugInfo("Finished loading process");
      }
    };

    fetchConnections();
  }, [toast]);

  return (
    <Layout 
      title="Connections" 
      subtitle="Manage student and preceptor connections"
    >
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}


      <div className="bg-white rounded-md shadow">
        {loading ? (
          // Loading skeleton
          <div className="p-4 space-y-4">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="border-b pb-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-gray-500 text-sm">
                <th className="p-4">STUDENT NAME</th>
                <th className="p-4">PRECEPTOR NAME</th>
                <th className="p-4">CONNECTION REQUESTED DATE</th>
                <th className="p-4">CONNECTION DATE</th>
              </tr>
            </thead>
            <tbody>
              {connections.map((connection, index) => (
                <tr key={index} className="border-b">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${connection.studentBg}`}>
                        {connection.studentInitials}
                      </div>
                      <div>
                        <button
                          onClick={() => handleUserClick(connection.studentId)}
                          className="font-medium hover:text-cauhec-red hover:underline transition-colors text-left block"
                        >
                          {connection.studentName}
                        </button>
                        <p className="text-gray-500 text-xs">{connection.studentEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${connection.preceptorBg}`}>
                        {connection.preceptorInitials}
                      </div>
                      <div>
                        <button
                          onClick={() => handleUserClick(connection.preceptorId)}
                          className="font-medium hover:text-cauhec-red hover:underline transition-colors text-left block"
                        >
                          {connection.preceptorName}
                        </button>
                        <p className="text-gray-500 text-xs">{connection.preceptorEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">{connection.requestDate}</td>
                  <td className="p-4 text-gray-500">{connection.connectionDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default Connections;