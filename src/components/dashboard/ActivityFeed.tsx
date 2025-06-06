import React from 'react';
import { MessageSquare, ThumbsUp, Share2, Send } from 'lucide-react';
import Card from '../common/Card';

const ActivityFeed: React.FC = () => {
  const activities = [
    {
      id: '1',
      type: 'post_published',
      content: 'Your post about "Top 10 AI tools for marketers" was published',
      timestamp: '2 hours ago',
      icon: <Share2 className="h-4 w-4 text-[#0A66C2]" />,
    },
    {
      id: '2',
      type: 'post_engagement',
      content: 'Your post received 24 likes and 5 comments',
      timestamp: '6 hours ago',
      icon: <ThumbsUp className="h-4 w-4 text-[#0A66C2]" />,
    },
    {
      id: '3',
      type: 'message_sent',
      content: 'Connection message sent to Sarah Johnson',
      timestamp: '1 day ago',
      icon: <Send className="h-4 w-4 text-[#14B8A6]" />,
    },
    {
      id: '4',
      type: 'message_response',
      content: 'Michael Brown accepted your connection request',
      timestamp: '2 days ago',
      icon: <MessageSquare className="h-4 w-4 text-[#7E57C2]" />,
    },
  ];

  return (
    <Card title="Recent Activity">
      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <div key={activity.id} className="py-3 first:pt-0 last:pb-0 flex items-start space-x-3">
            <div className="flex-shrink-0 p-1 rounded-full bg-gray-100">
              {activity.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-800">{activity.content}</p>
              <p className="text-xs text-gray-500 mt-0.5">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <a href="#history" className="text-sm font-medium text-[#0A66C2] hover:text-[#004182]">
          View all activity
        </a>
      </div>
    </Card>
  );
};

export default ActivityFeed;