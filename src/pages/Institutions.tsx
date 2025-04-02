
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Plus, Search } from 'lucide-react';

const Institutions = () => {
  return (
    <Layout 
      title="Institutions" 
      subtitle="Manage partner institutions and facilities"
    >
      <div className="flex justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md border">
            <Filter size={16} />
            <span className="text-sm">Filters</span>
          </div>
          
          <Select defaultValue="schoolLocations">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="schoolLocations">School Locations</SelectItem>
              <SelectItem value="clinicalSites">Clinical Sites</SelectItem>
              <SelectItem value="partners">Partner Organizations</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="allStates">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allStates">All States</SelectItem>
              <SelectItem value="ca">California</SelectItem>
              <SelectItem value="ny">New York</SelectItem>
              <SelectItem value="tx">Texas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search schools..." 
              className="pl-10 w-72"
            />
          </div>
          <Button className="bg-cauhec-red hover:bg-cauhec-red/90 flex gap-2 items-center">
            <Plus size={16} />
            Add Institution
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-10 h-64 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please select a state to view locations</p>
        </div>
      </div>
    </Layout>
  );
};

export default Institutions;
