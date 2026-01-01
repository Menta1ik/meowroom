import React from 'react';
import { CatForm } from '../../components/admin/CatForm';

export const CreateCat: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-800 mb-8">Add New Cat</h1>
        <CatForm />
      </div>
    </div>
  );
};
