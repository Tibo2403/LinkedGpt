import React from 'react';
import MessageGenerator from '../components/messages/MessageGenerator';

const Messages: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          LinkedIn Messages
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Generate personalized connection requests and outreach messages.
        </p>
      </div>
      
      <MessageGenerator />
    </div>
  );
};

export default Messages;