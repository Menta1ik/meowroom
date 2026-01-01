import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { LogOut } from 'lucide-react';
import { CatsList } from './CatsList';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Admin Dashboard</h1>
            <p className="text-neutral-500">Welcome, {user?.email}</p>
          </div>
          <Button variant="outline" onClick={signOut} className="flex items-center gap-2">
            <LogOut size={18} />
            Sign Out
          </Button>
        </header>

        <div className="space-y-8">
          <CatsList />
          
          {/* Placeholder for Adoption Requests */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h2 className="text-xl font-bold text-neutral-800 mb-4">Adoption Requests</h2>
            <p className="text-neutral-500">List of requests will appear here...</p>
          </div>
        </div>
      </div>
    </div>
  );
};
