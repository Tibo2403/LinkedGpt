import React from 'react';
import ApiSettings from '../components/settings/ApiSettings';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Settings
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Manage your account settings and API connections.
        </p>
      </div>
      
      <ApiSettings />
    </div>
  );
};

export default Settings;