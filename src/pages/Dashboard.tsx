import React from 'react';
import DashboardStats from '../components/dashboard/DashboardStats';
import AnalyticsDashboard from '../components/dashboard/AnalyticsDashboard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import PostGenerator from '../components/posts/PostGenerator';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Dashboard
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Welcome back! Here is an overview of your LinkedIn automation activity.
        </p>
      </div>
      
      <DashboardStats />
      <AnalyticsDashboard />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PostGenerator />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;