
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, UserCheck } from 'lucide-react';

interface User {
  initials: string;
  name: string;
  email: string;
  school: string;
  date: string;
  type: string;
  bgColor: string;
}

const Users = () => {
  const [activeTab, setActiveTab] = useState('students');
  
  const studentUsers: User[] = [
    { 
      initials: "EM", 
      name: "Elaina McAdams", 
      email: "Elainamhall@yahoo.com", 
      school: "California State University - Fresno", 
      date: "11/12/2024", 
      type: "student",
      bgColor: "bg-cauhec-red"
    },
    { 
      initials: "EM", 
      name: "Elaina McAdams", 
      email: "elainamhall@mail.fresnostate.edu", 
      school: "Loyola Marymount University - Baldwin Park", 
      date: "16/12/2024", 
      type: "student",
      bgColor: "bg-cauhec-red"
    },
    { 
      initials: "WT", 
      name: "William Turner", 
      email: "William.turner@mail.com", 
      school: "Alabama A & M University", 
      date: "03/01/2025", 
      type: "student",
      bgColor: "bg-purple-500"
    },
    { 
      initials: "fl", 
      name: "first last", 
      email: "heittasegra-44512s@yopmail.com", 
      school: "189455", 
      date: "06/01/2025", 
      type: "student",
      bgColor: "bg-pink-500"
    },
    { 
      initials: "OY", 
      name: "Olivia Young", 
      email: "Olivia.young@studentmail.com", 
      school: "Georgia State University", 
      date: "14/02/2025", 
      type: "student",
      bgColor: "bg-orange-500"
    },
  ];

  return (
    <Layout 
      title="Users" 
      subtitle="Manage students in the system"
    >
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-8 h-auto">
          <TabsTrigger 
            value="students" 
            className="flex items-center gap-2 py-4"
            onClick={() => setActiveTab('students')}
          >
            <GraduationCap className="h-5 w-5" />
            <span>Students</span>
          </TabsTrigger>
          <TabsTrigger 
            value="preceptors"
            className="flex items-center gap-2 py-4"
            onClick={() => setActiveTab('preceptors')}
          >
            <UserCheck className="h-5 w-5" />
            <span>Preceptors</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <div className="bg-white rounded-md shadow">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="p-4">NAME</th>
                  <th className="p-4">EMAIL</th>
                  <th className="p-4">SCHOOL</th>
                  <th className="p-4">JOIN DATE</th>
                </tr>
              </thead>
              <tbody>
                {studentUsers.map((user, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`user-initial ${user.bgColor}`}>{user.initials}</div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-gray-500 text-sm">{user.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">{user.email}</td>
                    <td className="p-4 text-gray-500">{user.school}</td>
                    <td className="p-4 text-gray-500">{user.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="preceptors">
          <div className="h-64 flex items-center justify-center text-gray-500">
            No preceptors data to display.
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Users;
