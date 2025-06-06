import React, { useState } from 'react';
import { ExternalLink, Filter, ArrowUp, ArrowDown, X, Calendar, Search } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

interface HistoryItem {
  id: string;
  type: 'post' | 'message';
  title: string;
  date: string;
  status: 'published' | 'sent' | 'draft' | 'scheduled';
  content?: string;
  engagement?: {
    views: number;
    likes: number;
    comments: number;
  };
}

interface Filters {
  dateFrom: string;
  dateTo: string;
  status: string;
  search: string;
  engagement: {
    min: string;
    max: string;
  };
}

const HistoryTable: React.FC = () => {
  const [sortField, setSortField] = useState<keyof HistoryItem>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'post' | 'message'>('all');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    dateFrom: '',
    dateTo: '',
    status: '',
    search: '',
    engagement: {
      min: '',
      max: ''
    }
  });

  const historyData: HistoryItem[] = [
    {
      id: '1',
      type: 'post',
      title: 'LinkedIn algorithm changes for 2025',
      date: '2025-01-15',
      status: 'published',
      content: 'LinkedIn has announced major changes to their algorithm, focusing on authentic engagement and professional content. Here are the key updates that will affect how your content performs...',
      engagement: {
        views: 1243,
        likes: 56,
        comments: 12,
      },
    },
    {
      id: '2',
      type: 'message',
      title: 'Connection request to Sarah Johnson',
      date: '2025-01-12',
      status: 'sent',
      content: 'Hi Sarah, I noticed we share an interest in AI-driven marketing strategies. Would love to connect and exchange ideas about how AI is transforming the marketing landscape.',
    },
    {
      id: '3',
      type: 'post',
      title: 'Top 5 AI tools for content creators',
      date: '2025-01-10',
      status: 'published',
      content: 'As content creation evolves, AI tools are becoming indispensable. Here are the top 5 AI tools that every content creator should consider...',
      engagement: {
        views: 3621,
        likes: 142,
        comments: 28,
      },
    },
    {
      id: '4',
      type: 'message',
      title: 'Follow-up with Michael Brown',
      date: '2025-01-08',
      status: 'sent',
      content: 'Hi Michael, I wanted to follow up on our conversation about AI implementation in marketing workflows. Have you had a chance to review the resources I shared?',
    },
    {
      id: '5',
      type: 'post',
      title: 'Why AI integration is essential for modern marketing',
      date: '2025-01-05',
      status: 'draft',
      content: 'Draft: In today\'s rapidly evolving digital landscape, AI integration has become more than just a buzzword...',
    },
    {
      id: '6',
      type: 'post',
      title: 'Case study: How we increased engagement by 200%',
      date: '2025-01-03',
      status: 'scheduled',
      content: 'Scheduled: A detailed analysis of how our team leveraged AI tools to dramatically improve our social media engagement...',
    },
  ];

  const handleSort = (field: keyof HistoryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleView = (item: HistoryItem) => {
    setSelectedItem(item);
  };

  const applyFilters = (data: HistoryItem[]) => {
    return data.filter(item => {
      // Type filter
      if (filterType !== 'all' && item.type !== filterType) return false;

      // Date range filter
      if (filters.dateFrom && new Date(item.date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(item.date) > new Date(filters.dateTo)) return false;

      // Status filter
      if (filters.status && item.status !== filters.status) return false;

      // Search filter
      if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) return false;

      // Engagement filter (only for posts)
      if (item.type === 'post' && item.engagement) {
        const totalEngagement = item.engagement.views + item.engagement.likes + item.engagement.comments;
        if (filters.engagement.min && totalEngagement < parseInt(filters.engagement.min)) return false;
        if (filters.engagement.max && totalEngagement > parseInt(filters.engagement.max)) return false;
      }

      return true;
    });
  };

  const filteredData = applyFilters(historyData);

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const renderSortIcon = (field: keyof HistoryItem) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 inline ml-1" />
    );
  };

  const handleResetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      status: '',
      search: '',
      engagement: {
        min: '',
        max: ''
      }
    });
    setFilterType('all');
  };

  return (
    <Card title="Activity History">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterType === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilterType('all')}
          >
            All Activities
          </Button>
          <Button
            variant={filterType === 'post' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilterType('post')}
          >
            Posts Only
          </Button>
          <Button
            variant={filterType === 'message' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilterType('message')}
          >
            Messages Only
          </Button>
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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('type')}
              >
                Type {renderSortIcon('type')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('title')}
              >
                Title {renderSortIcon('title')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                Date {renderSortIcon('date')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status {renderSortIcon('status')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.type === 'post' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {item.type === 'post' ? 'Post' : 'Message'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'published' ? 'bg-green-100 text-green-800' : 
                    item.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    item.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    className="text-[#0A66C2] hover:text-[#004182] mr-4"
                    onClick={() => handleView(item)}
                  >
                    View
                  </button>
                  {item.type === 'post' && item.status === 'published' && (
                    <a href="#" className="text-[#0A66C2] hover:text-[#004182] inline-flex items-center">
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
        <div>
          Showing {sortedData.length} of {historyData.length} items
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>

      {/* View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedItem.type === 'post' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {selectedItem.type === 'post' ? 'Post' : 'Message'}
                </span>
                <h3 className="text-lg font-medium mt-2">{selectedItem.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(selectedItem.date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-4">
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedItem.content}</p>
              </div>
              
              {selectedItem.type === 'post' && selectedItem.engagement && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Engagement Statistics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-semibold text-gray-900">{selectedItem.engagement.views}</div>
                      <div className="text-sm text-gray-500">Views</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-semibold text-gray-900">{selectedItem.engagement.likes}</div>
                      <div className="text-sm text-gray-500">Likes</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-semibold text-gray-900">{selectedItem.engagement.comments}</div>
                      <div className="text-sm text-gray-500">Comments</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* More Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Advanced Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Search"
                placeholder="Search by title..."
                icon={<Search className="h-4 w-4 text-gray-400" />}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />

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
                  Status
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] sm:text-sm"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="sent">Sent</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Min Engagement"
                  placeholder="0"
                  value={filters.engagement.min}
                  onChange={(e) => setFilters({
                    ...filters,
                    engagement: { ...filters.engagement, min: e.target.value }
                  })}
                />
                <Input
                  type="number"
                  label="Max Engagement"
                  placeholder="999999"
                  value={filters.engagement.max}
                  onChange={(e) => setFilters({
                    ...filters,
                    engagement: { ...filters.engagement, max: e.target.value }
                  })}
                />
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
    </Card>
  );
};

export default HistoryTable;