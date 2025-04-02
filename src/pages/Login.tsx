
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full">
        <div className="flex flex-col items-center mb-10">
          <img 
            src="/lovable-uploads/089d90e2-6727-428b-b688-a1d2bf181c3c.png" 
            alt="CAUHEC Connect Logo" 
            className="w-40 mb-4" 
          />
          <h2 className="text-xl font-medium text-gray-700">Sign in to your CAUHEC Connect account</h2>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  className="w-full pr-10"
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  aria-label="Show password"
                >
                  <Eye size={20} />
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-cauhec-red hover:bg-cauhec-red/90 flex gap-2 items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
