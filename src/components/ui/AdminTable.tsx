import React from 'react';

// Wrapper for the table, handles overflow
export const AdminTable: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="w-full">
      {children}
    </table>
  </div>
);

export const AdminTableHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="text-left text-sm font-semibold text-neutral-600">
    <tr>{children}</tr>
  </thead>
);

export const AdminTableHeader: React.FC<{ children: React.ReactNode; className?: string; align?: 'left' | 'center' | 'right' }> = ({ 
  children, 
  className = "",
  align = 'left'
}) => (
  <th className={`p-4 text-${align} ${className}`}>
    {children}
  </th>
);

export const AdminTableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className="divide-y divide-neutral-100">
    {children}
  </tbody>
);

export const AdminTableRow: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ 
  children, 
  className = "",
  onClick
}) => (
  <tr 
    onClick={onClick}
    className={`hover:bg-yellow-50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </tr>
);

export const AdminTableCell: React.FC<{ children: React.ReactNode; className?: string; align?: 'left' | 'center' | 'right' }> = ({ 
  children, 
  className = "",
  align = 'left'
}) => (
  <td className={`p-4 text-${align} ${className}`}>
    {children}
  </td>
);
