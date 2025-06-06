import React from 'react';
import HistoryTable from '../components/history/HistoryTable';

const History: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Activity History
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          View and manage your past LinkedIn posts and messages.
        </p>
      </div>
      
      <HistoryTable />
    </div>
  );
};

export default History;