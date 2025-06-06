import React from 'react';

/**
 * Displays high level statistics on the dashboard.
 */
import { BarChart, PieChart, Users, MessageSquare } from 'lucide-react';
import Card from '../common/Card';

/**
 * Render summary cards for posts, messages and engagement.
 */
const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-[#0A66C2] to-[#0077B5] text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-blue-100">Total Posts</p>
            <h3 className="text-2xl font-bold mt-1">24</h3>
            <p className="text-xs text-blue-100 mt-1">+12% from last month</p>
          </div>
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <BarChart className="h-6 w-6 text-white" />
          </div>
        </div>
      </Card>
      
      <Card className="bg-gradient-to-br from-[#14B8A6] to-[#0F9A8A] text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-teal-100">Messages Sent</p>
            <h3 className="text-2xl font-bold mt-1">86</h3>
            <p className="text-xs text-teal-100 mt-1">+24% from last month</p>
          </div>
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
        </div>
      </Card>
      
      <Card className="bg-gradient-to-br from-[#7E57C2] to-[#673AB7] text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-purple-100">New Connections</p>
            <h3 className="text-2xl font-bold mt-1">38</h3>
            <p className="text-xs text-purple-100 mt-1">+8% from last month</p>
          </div>
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
        </div>
      </Card>
      
      <Card className="bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-orange-100">Engagement Rate</p>
            <h3 className="text-2xl font-bold mt-1">18.2%</h3>
            <p className="text-xs text-orange-100 mt-1">+2.4% from last month</p>
          </div>
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <PieChart className="h-6 w-6 text-white" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardStats;