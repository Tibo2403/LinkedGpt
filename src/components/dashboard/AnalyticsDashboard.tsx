import React from 'react';

/**
 * Visualizes basic engagement analytics using mock data.
 */
import { TrendingUp, Users, BarChart2, Activity } from 'lucide-react';
import Card from '../common/Card';

/**
 * Dashboard showing charts and statistics for user engagement.
 */
const AnalyticsDashboard: React.FC = () => {
  // Mock data for demonstration
  const engagementData = {
    posts: [65, 75, 82, 78, 88, 95, 92],
    messages: [45, 52, 48, 58, 63, 68, 72],
    connections: [12, 15, 18, 22, 25, 28, 32],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  };

  const topPerformingContent = [
    {
      id: 1,
      type: 'post',
      title: 'AI in Marketing: 2025 Trends',
      engagement: 892,
      growth: '+28%',
    },
    {
      id: 2,
      type: 'message',
      title: 'Personalized Outreach Campaign',
      engagement: 456,
      growth: '+15%',
    },
    {
      id: 3,
      type: 'post',
      title: 'LinkedIn Growth Strategies',
      engagement: 734,
      growth: '+22%',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-semibold text-gray-900">8.2%</p>
              <p className="text-sm text-green-600">+2.1% vs last week</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profile Views</p>
              <p className="text-2xl font-semibold text-gray-900">1,284</p>
              <p className="text-sm text-green-600">+15% vs last week</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Content Reach</p>
              <p className="text-2xl font-semibold text-gray-900">24.5K</p>
              <p className="text-sm text-green-600">+32% vs last week</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Rate</p>
              <p className="text-2xl font-semibold text-gray-900">42%</p>
              <p className="text-sm text-green-600">+5% vs last week</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart2 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Weekly Engagement">
          <div className="h-64 relative">
            <div className="absolute inset-0 flex items-end justify-between px-2">
              {engagementData.posts.map((value, index) => (
                <div key={index} className="flex flex-col items-center space-y-1">
                  <div className="flex space-x-1">
                    <div 
                      className="w-3 bg-blue-500 rounded-t"
                      style={{ height: `${value}px` }}
                    />
                    <div 
                      className="w-3 bg-green-500 rounded-t"
                      style={{ height: `${engagementData.messages[index]}px` }}
                    />
                    <div 
                      className="w-3 bg-purple-500 rounded-t"
                      style={{ height: `${engagementData.connections[index]}px` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{engagementData.labels[index]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-1" />
              <span className="text-xs text-gray-600">Posts</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-1" />
              <span className="text-xs text-gray-600">Messages</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded mr-1" />
              <span className="text-xs text-gray-600">Connections</span>
            </div>
          </div>
        </Card>

        <Card title="Top Performing Content">
          <div className="divide-y divide-gray-200">
            {topPerformingContent.map((content) => (
              <div key={content.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{content.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {content.type === 'post' ? 'LinkedIn Post' : 'Message Campaign'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{content.engagement}</p>
                    <p className="text-xs text-green-600 mt-1">{content.growth}</p>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${(content.engagement / 1000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;