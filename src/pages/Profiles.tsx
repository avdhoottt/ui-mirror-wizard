
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface AdminProfile {
  initial: string;
  email: string;
  role: string;
}

const Profiles = () => {
  const profiles: AdminProfile[] = [
    {
      initial: "U",
      email: "yashshivhare@hotmail.com",
      role: "admin"
    },
    {
      initial: "U",
      email: "sarthak@gmail.com",
      role: "admin"
    },
    {
      initial: "U",
      email: "marvin@gmail.com",
      role: "admin"
    },
    {
      initial: "U",
      email: "karishma@gmail.com",
      role: "admin"
    },
    {
      initial: "U",
      email: "elainamhall@yahoo.com",
      role: "admin"
    },
    {
      initial: "U",
      email: "lakshya@hotmail.com",
      role: "admin"
    },
  ];

  return (
    <Layout 
      title="Profiles" 
      subtitle="Manage user profiles and credentials"
    >
      <div className="flex justify-end mb-6">
        <Button className="bg-cauhec-red hover:bg-cauhec-red/90 flex gap-2 items-center">
          <Plus size={16} />
          Create Admin
        </Button>
      </div>
      
      <div className="bg-white rounded-md shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="p-4">ICON</th>
              <th className="p-4">EMAIL</th>
              <th className="p-4">ROLE</th>
              <th className="p-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">
                  <div className="user-initial bg-cauhec-red">{profile.initial}</div>
                </td>
                <td className="p-4 text-gray-500">{profile.email}</td>
                <td className="p-4 text-gray-500">{profile.role}</td>
                <td className="p-4">
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Profiles;
