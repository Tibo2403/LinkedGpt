import React, { useState } from 'react';
import { MessageSquare, Search, Calendar, Filter, X } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

interface Message {
  id: string;
  senderName: string;
  senderTitle: string;
  content: string;
  date: string;
  read: boolean;
  type: 'connection' | 'inmail' | 'reply';
}

const ReceivedMessages: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    type: 'all',
    read: 'all'
  });

  const messages: Message[] = [
    {
      id: '1',
      senderName: 'Sarah Johnson',
      senderTitle: 'Marketing Director at TechCorp',
      content: 'Thanks for reaching out! I\'d love to connect and discuss AI marketing strategies. Your experience in implementing AI solutions for content optimization sounds fascinating.',
      date: '2025-02-15',
      read: true,
      type: 'reply'
    },
    {
      id: '2',
      senderName: 'Michael Chen',
      senderTitle: 'Product Manager at InnovateLabs',
      content: 'I noticed we share several connections in the AI space. Would love to connect and exchange insights about emerging AI technologies.',
      date: '2025-02-14',
      read: false,
      type: 'connection'
    },
    {
      id: '3',
      senderName: 'Emily Rodriguez',
      senderTitle: 'Head of Digital Marketing',
      content: 'I read your article about AI-driven marketing automation. We\'re facing similar challenges at our company. Would you be open to a quick call to discuss your approach?',
      date: '2025-02-13',
      read: false,
      type: 'inmail'
    }
  ];

  const filteredMessages = messages.filter(message => {
    if (filters.search && !message.content.toLowerCase().includes(filters.search.toLowerCase()) &&
        !message.senderName.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.dateFrom && new Date(message.date) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(message.date) > new Date(filters.dateTo)) return false;
    if (filters.type !== 'all' && message.type !== filters.type) return false;
    if (filters.read !== 'all' && message.read !== (filters.read === 'read')) return false;
    return true;
  });

  const handleResetFilters = () => {
    setFilters({
      search: '',
      dateFrom: '',
      dateTo: '',
      type: 'all',
      read: 'all'
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Received Messages
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          View and manage your LinkedIn inbox messages.
        </p>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[200px] max-w-md">
            <Input
              placeholder="Search messages..."
              icon={<Search className="h-4 w-4 text-gray-400" />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={<Filter className="h-4 w-4" />}
            onClick={() => setShowFilters(true)}
          >
            More Filters
          </Button>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`py-4 cursor-pointer hover:bg-gray-50 ${!message.read ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white">
                    {message.senderName.charAt(0)}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{message.senderName}</p>
                    <p className="text-xs text-gray-500">{new Date(message.date).toLocaleDateString()}</p>
                  </div>
                  <p className="text-xs text-gray-500">{message.senderTitle}</p>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Message View Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium">{selectedMessage.senderName}</h3>
                <p className="text-sm text-gray-500">{selectedMessage.senderTitle}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                Close
              </Button>
              <Button>
                Reply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Filter Messages</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="From Date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  icon={<Calendar className="h-4 w-4 text-gray-400" />}
                />
                <Input
                  type="date"
                  label="To Date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  icon={<Calendar className="h-4 w-4 text-gray-400" />}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message Type
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] sm:text-sm"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="all">All Types</option>
                  <option value="connection">Connection Requests</option>
                  <option value="inmail">InMail</option>
                  <option value="reply">Replies</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Read Status
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] sm:text-sm"
                  value={filters.read}
                  onChange={(e) => setFilters({ ...filters, read: e.target.value })}
                >
                  <option value="all">All Messages</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                >
                  Reset
                </Button>
                <Button
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivedMessages;