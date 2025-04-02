import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Plus, MapPin, Globe, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

// Institution interface based on API response and UI
interface Institution {
  id: number;
  value: string;  // Institution name
  locationType?: string;
  phone?: string;
  state?: string;
  address?: string;
  adminName?: string;
}

// Institution form interface
interface InstitutionForm {
  value: string;  // Institution name
  locationType: string;
  phone: string;
  collegeName: string;
  adminName: string;
  adminPhone: string;
  adminEmail: string;
  fax: string;
  dapipId: string;
  opeId: string;
  ipedsUnitIds: string;
  parentName: string;
  parentDapipId: string;
}

const Institutions = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();
  
  // Filters
  const [selectedLocationType, setSelectedLocationType] = useState<string>("school-locations");
  const [selectedState, setSelectedState] = useState<string>("all-states");
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add institution dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInstitution, setNewInstitution] = useState<InstitutionForm>({
    value: '',
    locationType: '',
    phone: '',
    collegeName: '',
    adminName: '',
    adminPhone: '',
    adminEmail: '',
    fax: '',
    dapipId: '',
    opeId: '',
    ipedsUnitIds: '',
    parentName: '',
    parentDapipId: ''
  });
  
  // States with their codes
  const states = [
    { value: "al", label: "Alabama (AL)" },
    { value: "ak", label: "Alaska (AK)" },
    { value: "az", label: "Arizona (AZ)" },
    { value: "ar", label: "Arkansas (AR)" },
    { value: "ca", label: "California (CA)" },
    { value: "co", label: "Colorado (CO)" },
    { value: "ct", label: "Connecticut (CT)" },
    { value: "de", label: "Delaware (DE)" },
    { value: "fl", label: "Florida (FL)" },
    { value: "ga", label: "Georgia (GA)" },
    { value: "hi", label: "Hawaii (HI)" },
    { value: "id", label: "Idaho (ID)" },
    { value: "il", label: "Illinois (IL)" },
    { value: "in", label: "Indiana (IN)" },
    { value: "ia", label: "Iowa (IA)" },
    { value: "ks", label: "Kansas (KS)" },
    { value: "ky", label: "Kentucky (KY)" },
    { value: "la", label: "Louisiana (LA)" },
    { value: "me", label: "Maine (ME)" },
    { value: "md", label: "Maryland (MD)" },
    { value: "ma", label: "Massachusetts (MA)" },
    { value: "mi", label: "Michigan (MI)" },
    { value: "mn", label: "Minnesota (MN)" },
    { value: "ms", label: "Mississippi (MS)" },
    { value: "mo", label: "Missouri (MO)" },
    { value: "mt", label: "Montana (MT)" },
    { value: "ne", label: "Nebraska (NE)" },
    { value: "nv", label: "Nevada (NV)" },
    { value: "nh", label: "New Hampshire (NH)" },
    { value: "nj", label: "New Jersey (NJ)" },
    { value: "nm", label: "New Mexico (NM)" },
    { value: "ny", label: "New York (NY)" },
    { value: "nc", label: "North Carolina (NC)" },
    { value: "nd", label: "North Dakota (ND)" },
    { value: "oh", label: "Ohio (OH)" },
    { value: "ok", label: "Oklahoma (OK)" },
    { value: "or", label: "Oregon (OR)" },
    { value: "pa", label: "Pennsylvania (PA)" },
    { value: "ri", label: "Rhode Island (RI)" },
    { value: "sc", label: "South Carolina (SC)" },
    { value: "sd", label: "South Dakota (SD)" },
    { value: "tn", label: "Tennessee (TN)" },
    { value: "tx", label: "Texas (TX)" },
    { value: "ut", label: "Utah (UT)" },
    { value: "vt", label: "Vermont (VT)" },
    { value: "va", label: "Virginia (VA)" },
    { value: "wa", label: "Washington (WA)" },
    { value: "wv", label: "West Virginia (WV)" },
    { value: "wi", label: "Wisconsin (WI)" },
    { value: "wy", label: "Wyoming (WY)" }
  ];
  
  // Location types
  const locationTypes = [
    { value: "institution", label: "Institution" },
    { value: "additional-location", label: "Additional Location" },
    { value: "university", label: "University" },
    { value: "college", label: "College" },
    { value: "hospital", label: "Hospital" },
    { value: "medical-center", label: "Medical Center" },
    { value: "health-system", label: "Health System" }
  ];

  // Fetch institutions from API
  useEffect(() => {
    const fetchInstitutions = async () => {
      setLoading(true);
      setError('');
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found.');
          setLoading(false);
          return;
        }

        // Build query parameters for filters
        const queryParams = new URLSearchParams();
        
        // Only add state filter if it's not "all-states"
        if (selectedState && selectedState !== "all-states") {
          queryParams.append('state', selectedState.toUpperCase());
        }
        
        // Only add type filter if it's not "school-locations"
        if (selectedLocationType && selectedLocationType !== "school-locations") {
          // Convert kebab-case to Title Case
          const formattedType = selectedLocationType
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          queryParams.append('type', formattedType);
        }
        
        if (searchQuery) {
          queryParams.append('search', searchQuery);
        }

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        
        console.log(`Fetching institutions with params: ${queryString}`);
        
        const response = await fetch(`https://backend.cauhec.org/api/v1/admin/institutions${queryString}`, {
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
          console.log('Institutions data:', data);
          
          if (data.status === 'success' && data.data.institutions) {
            setInstitutions(data.data.institutions);
          } else {
            setError('Failed to fetch institutions data');
          }
        } else {
          console.error('Failed to fetch institutions:', response.status);
          setError(`Failed to fetch institutions (Status: ${response.status})`);
        }
      } catch (err) {
        console.error('Error fetching institutions:', err);
        setError('Failed to fetch institutions');
        
        toast({
          title: 'Error loading institutions',
          description: 'There was a problem fetching the institutions list.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, [selectedState, selectedLocationType, searchQuery, toast]);

  // Handle adding a new institution
  const handleAddInstitution = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: 'Authentication Error',
          description: 'You must be logged in to add an institution.',
          variant: 'destructive',
        });
        return;
      }

      // Validate required fields
      if (!newInstitution.value) {
        toast({
          title: 'Validation Error',
          description: 'Institution name is required.',
          variant: 'destructive',
        });
        return;
      }

      console.log('Submitting new institution:', newInstitution);

      try {
        const response = await fetch('https://backend.cauhec.org/api/v1/admin/add-institution', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newInstitution),
        });

        const data = await response.json();
        console.log('Add institution response:', data);

        if (data.status === 'success') {
          toast({
            title: 'Success',
            description: 'Institution added successfully!',
          });
          
          // Close dialog and reset form
          setIsDialogOpen(false);
          setNewInstitution({
            value: '',
            locationType: '',
            phone: '',
            collegeName: '',
            adminName: '',
            adminPhone: '',
            adminEmail: '',
            fax: '',
            dapipId: '',
            opeId: '',
            ipedsUnitIds: '',
            parentName: '',
            parentDapipId: ''
          });
          
          // Refresh institutions list
          if (data.schoolLocation) {
            setInstitutions(prev => [data.schoolLocation, ...prev]);
          } else {
            // Refresh the data by triggering the useEffect
            setSelectedState(selectedState);
          }
        } else {
          toast({
            title: 'Error',
            description: data.message || 'Failed to add institution.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error adding institution:', error);
        
        toast({
          title: 'Error',
          description: 'Failed to add institution. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Error in add institution handler:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  // Handle input change in the add institution form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewInstitution(prev => ({ ...prev, [name]: value }));
  };

  // Handle select change in the add institution form
  const handleSelectChange = (name: string, value: string) => {
    setNewInstitution(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Layout
      title="Institutions"
      subtitle="Manage partner institutions and facilities"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
  <div className="flex items-center">
    <Filter className="mr-2 h-5 w-5 text-gray-500" />
    <span className="font-medium mr-2">Filters</span>
  </div>
  
  <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
    <Select value={selectedLocationType} onValueChange={setSelectedLocationType}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="School Locations" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="school-locations">School Locations</SelectItem>
        {locationTypes.map(type => (
          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
    
    <Select value={selectedState} onValueChange={setSelectedState}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="All States" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all-states">All States</SelectItem>
        {states.map(state => (
          <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
  
  <div className="relative w-full sm:w-64 mt-4 lg:mt-0">
    <Input
      className="pl-8 w-full"
      placeholder="Search schools..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <svg
      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
</div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cauhec-red"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      ) : institutions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No institutions found</p>
          <p className="text-gray-400 mt-2">Please select a state to view locations</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {institutions.map((institution) => (
            <div key={institution.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-cauhec-red/10 rounded-full w-12 h-12 flex items-center justify-center">
                      <svg 
                        className="w-6 h-6 text-cauhec-red" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{institution.collegeName}</h3>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                        {institution.locationType || "Institution"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Globe className="w-4 h-4 mr-2" />
                    <span>{institution.value}</span>
                  </div>
                  
                  {institution.address && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{institution.address}</span>
                    </div>
                  )}
                  
                  {institution.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{institution.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Administrator:</span>
                    <span className="font-medium text-sm">{institution.adminName || "Not specified"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Institution Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New Institution</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-1">
              <label className="text-sm font-medium mb-2 block">Institution Name</label>
              <Input
                name="value"
                value={newInstitution.value}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            
            <div className="col-span-1">
              <label className="text-sm font-medium mb-2 block">Location Type</label>
              <Select
                value={newInstitution.locationType}
                onValueChange={(value) => handleSelectChange('locationType', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {locationTypes.map(type => (
                    <SelectItem key={type.value} value={type.label}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-1">
              <label className="text-sm font-medium mb-2 block">Phone</label>
              <Input
                name="phone"
                value={newInstitution.phone}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            
            <div className="col-span-1">
              <label className="text-sm font-medium mb-2 block">College Name</label>
              <Input
                name="collegeName"
                value={newInstitution.collegeName}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            
            <div className="col-span-1">
              <label className="text-sm font-medium mb-2 block">Admin Name</label>
              <Input
                name="adminName"
                value={newInstitution.adminName}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            
            <div className="col-span-1">
              <label className="text-sm font-medium mb-2 block">Admin Phone</label>
              <Input
                name="adminPhone"
                value={newInstitution.adminPhone}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            
            <div className="col-span-1">
              <label className="text-sm font-medium mb-2 block">Admin Email</label>
              <Input
                name="adminEmail"
                value={newInstitution.adminEmail}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            
            <div className="col-span-1">
              <label className="text-sm font-medium mb-2 block">Fax</label>
              <Input
                name="fax"
                value={newInstitution.fax}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            
            <div className="col-span-1">
              <label className="text-sm font-medium mb-2 block">DAPIP ID</label>
              <Input
                name="dapipId"
                value={newInstitution.dapipId}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            
            <div className="col-span-1">
              <label className="text-sm font-medium mb-2 block">OPE ID</label>
              <Input
                name="opeId"
                value={newInstitution.opeId}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            
            <div className="col-span-1">
              <label className="text-sm font-medium mb-2 block">IPEDS Unit IDs</label>
              <Input
                name="ipedsUnitIds"
                value={newInstitution.ipedsUnitIds}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            
            <div className="col-span-1">
              <label className="text-sm font-medium mb-2 block">Parent Institution Name</label>
              <Input
                name="parentName"
                value={newInstitution.parentName}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            
            <div className="col-span-1">
              <label className="text-sm font-medium mb-2 block">Parent DAPIP ID</label>
              <Input
                name="parentDapipId"
                value={newInstitution.parentDapipId}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddInstitution}
              className="bg-cauhec-red hover:bg-cauhec-red/90"
            >
              Add Institution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Institutions;