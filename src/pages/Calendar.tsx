import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Video, Users, X, Plus, ChevronLeft, ChevronRight, RefreshCw, MapPin, Linkedin, Edit, Trash2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, addDays } from 'date-fns';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { fetchGoogleCalendarEvents, fetchOutlookEvents, fetchLinkedInEvents } from '../lib/api';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'in-person';
  location?: {
    type: 'physical' | 'virtual';
    address?: string;
    meetingLink?: string;
    meetingId?: string;
    password?: string;
    platform?: 'google-meet' | 'microsoft-teams' | 'zoom' | 'other';
  };
  attendees: string[];
  description?: string;
  source?: 'local' | 'google' | 'outlook' | 'linkedin';
}

interface CalendarCredentials {
  google?: {
    clientId: string;
    clientSecret: string;
    token?: string;
  };
  outlook?: {
    clientId: string;
    clientSecret: string;
    token?: string;
  };
  linkedin?: {
    clientId: string;
    clientSecret: string;
    token?: string;
  };
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentials, setCredentials] = useState<CalendarCredentials>({});
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    type: 'video',
    duration: 30,
    location: {
      type: 'virtual'
    }
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isLinkedInConnected, setIsLinkedInConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    const today = new Date();
    const sampleMeetings: Meeting[] = [
      {
        id: '1',
        title: 'Product Strategy Meeting',
        date: format(today, 'yyyy-MM-dd'),
        time: '10:00',
        duration: 60,
        type: 'video',
        location: {
          type: 'virtual',
          platform: 'google-meet',
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          meetingId: '123456789'
        },
        attendees: ['product@company.com', 'design@company.com'],
        description: 'Quarterly product roadmap review and strategy alignment',
        source: 'google'
      },
      {
        id: '2',
        title: 'Client Presentation',
        date: format(addDays(today, 1), 'yyyy-MM-dd'),
        time: '14:30',
        duration: 45,
        type: 'video',
        location: {
          type: 'virtual',
          platform: 'microsoft-teams',
          meetingLink: 'https://teams.microsoft.com/meet/abc123'
        },
        attendees: ['client@clientcompany.com', 'sales@company.com'],
        description: 'New feature presentation and demo',
        source: 'outlook'
      },
      {
        id: '3',
        title: 'LinkedIn Networking Coffee',
        date: format(addDays(today, 2), 'yyyy-MM-dd'),
        time: '09:00',
        duration: 30,
        type: 'in-person',
        location: {
          type: 'physical',
          address: 'Starbucks, 123 Main St, San Francisco'
        },
        attendees: ['contact@linkedin.com'],
        description: 'Informal networking meeting to discuss AI in marketing',
        source: 'linkedin'
      },
      {
        id: '4',
        title: 'Team Weekly Sync',
        date: format(addDays(today, 3), 'yyyy-MM-dd'),
        time: '11:00',
        duration: 60,
        type: 'video',
        location: {
          type: 'virtual',
          platform: 'zoom',
          meetingLink: 'https://zoom.us/j/123456789',
          meetingId: '123456789',
          password: '123456'
        },
        attendees: ['team@company.com'],
        description: 'Weekly team sync and progress update',
        source: 'google'
      },
      {
        id: '5',
        title: 'Marketing Strategy Workshop',
        date: format(addDays(today, 4), 'yyyy-MM-dd'),
        time: '13:00',
        duration: 120,
        type: 'in-person',
        location: {
          type: 'physical',
          address: 'Company HQ, Conference Room A'
        },
        attendees: ['marketing@company.com', 'strategy@company.com'],
        description: 'Q2 marketing strategy planning session',
        source: 'outlook'
      }
    ];
    
    setMeetings(sampleMeetings);
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleCredentialsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCredentialsModal(false);
  };

  const handleGoogleAuth = async () => {
    if (!credentials.google?.clientId || !credentials.google?.clientSecret) {
      setShowCredentialsModal(true);
      return;
    }
    window.open('https://accounts.google.com/o/oauth2/v2/auth', '_blank');
    try {
      const events = await fetchGoogleCalendarEvents(credentials.google.token!);
      setIsGoogleConnected(true);
      setMeetings(prev => [...prev, ...events]);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch Google Calendar events');
    }
  };


  const handleLinkedInAuth = async () => {
    if (!credentials.linkedin?.clientId || !credentials.linkedin?.clientSecret) {
      setShowCredentialsModal(true);
      return;
    }
    window.open('https://www.linkedin.com/oauth/v2/authorization', '_blank');
    try {
      const events = await fetchLinkedInEvents(credentials.linkedin.token!);
      setIsLinkedInConnected(true);
      setMeetings(prev => [...prev, ...events]);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch LinkedIn events');
    }
  };

  const handleSyncCalendars = async () => {
    setIsSyncing(true);
    try {
      const events: Meeting[] = [];
      if (credentials.google?.token) {
        const g = await fetchGoogleCalendarEvents(credentials.google.token);
        events.push(...g);
      }
      if (credentials.outlook?.token) {
        const o = await fetchOutlookEvents(credentials.outlook.token);
        events.push(...o);
      }
      if (credentials.linkedin?.token) {
        const l = await fetchLinkedInEvents(credentials.linkedin.token);
        events.push(...l);
      }
      setMeetings(events);
    } catch (err) {
      console.error(err);
      alert('Failed to sync calendars');
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date: Date, meeting?: Meeting) => {
    setSelectedDate(date);
    
    if (meeting) {
      handleEditMeeting(meeting);
    } else {
      setNewMeeting({
        type: 'video',
        duration: 30,
        location: {
          type: 'virtual'
        },
        date: format(date, 'yyyy-MM-dd'),
        time: '09:00'
      });
      setShowNewMeeting(true);
    }
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setNewMeeting({
      ...meeting,
      attendees: meeting.attendees || []
    });
    setShowNewMeeting(true);
  };

  const handleDeleteMeeting = (meetingId: string) => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      setMeetings(meetings.filter(m => m.id !== meetingId));
    }
  };

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMeeting.title && newMeeting.date && newMeeting.time) {
      if (editingMeeting) {
        setMeetings(meetings.map(meeting => 
          meeting.id === editingMeeting.id 
            ? { ...meeting, ...newMeeting, id: editingMeeting.id } as Meeting
            : meeting
        ));
      } else {
        setMeetings([
          ...meetings,
          {
            id: Date.now().toString(),
            title: newMeeting.title,
            date: newMeeting.date,
            time: newMeeting.time,
            duration: newMeeting.duration || 30,
            type: newMeeting.type || 'video',
            location: newMeeting.location,
            attendees: newMeeting.attendees || [],
            description: newMeeting.description,
            source: 'local'
          } as Meeting
        ]);
      }
      setShowNewMeeting(false);
      setEditingMeeting(null);
      setNewMeeting({ 
        type: 'video', 
        duration: 30,
        location: {
          type: 'virtual'
        }
      });
    }
  };

  const getMeetingsForDate = (date: Date) => {
    return meetings.filter(meeting => meeting.date === format(date, 'yyyy-MM-dd'));
  };

  const handleMeetingTypeChange = (type: 'video' | 'in-person') => {
    setNewMeeting({
      ...newMeeting,
      type,
      location: {
        type: type === 'video' ? 'virtual' : 'physical'
      }
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, source, destination } = result;
    const meeting = meetings.find(m => m.id === draggableId);
    
    if (meeting) {
      if (destination.droppableId !== 'upcoming-meetings') {
        const newDate = format(new Date(destination.droppableId), 'yyyy-MM-dd');
        setMeetings(meetings.map(m => 
          m.id === draggableId 
            ? { ...m, date: newDate }
            : m
        ));
      } else {
        const reorderedMeetings = Array.from(meetings);
        const [removed] = reorderedMeetings.splice(source.index, 1);
        reorderedMeetings.splice(destination.index, 0, removed);
        setMeetings(reorderedMeetings);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-5">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Meeting Calendar
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Schedule and manage your LinkedIn networking meetings.
          </p>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex flex-wrap gap-4">
            <Button
              variant={isGoogleConnected ? 'outline' : 'primary'}
              onClick={handleGoogleAuth}
            >
              {isGoogleConnected
                ? 'Google Calendar Connected'
                : 'Connect Google Calendar'}
            </Button>
            <Button
              variant={isLinkedInConnected ? 'outline' : 'primary'}
              onClick={handleLinkedInAuth}
              icon={<Linkedin className="h-4 w-4" />}
            >
              {isLinkedInConnected ? 'LinkedIn Connected' : 'Connect LinkedIn'}
            </Button>
          </div>
          <div className="flex gap-4">
            {(isGoogleConnected || isLinkedInConnected) && (
              <Button
                variant="outline"
                onClick={handleSyncCalendars}
                isLoading={isSyncing}
                icon={<RefreshCw className="h-4 w-4" />}
              >
                Sync Calendars
              </Button>
            )}
            <Button
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setShowNewMeeting(true)}
            >
              Schedule Meeting
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-5">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousMonth}
                    icon={<ChevronLeft className="h-4 w-4" />}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextMonth}
                    icon={<ChevronRight className="h-4 w-4" />}
                  />
                </div>
              </div>

              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="bg-gray-50 py-2 text-center text-sm font-semibold text-gray-700"
                  >
                    {day}
                  </div>
                ))}
                {daysInMonth.map((date) => {
                  const dayMeetings = getMeetingsForDate(date);
                  return (
                    <Droppable key={date.toISOString()} droppableId={date.toISOString()}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`bg-white min-h-[100px] p-2 cursor-pointer hover:bg-gray-50 ${
                            !isSameMonth(date, currentDate) ? 'text-gray-400' : ''
                          } ${
                            isSameDay(date, selectedDate || new Date())
                              ? 'bg-blue-50'
                              : ''
                          }`}
                          onClick={() => handleDateClick(date)}
                          onDoubleClick={() => handleDateClick(date)}
                        >
                          <div className="font-medium text-sm">
                            {format(date, 'd')}
                          </div>
                          {dayMeetings.map((meeting) => (
                            <div
                              key={meeting.id}
                              className={`mt-1 text-xs p-1 rounded truncate cursor-pointer ${
                                meeting.source === 'google' 
                                  ? 'bg-red-100 text-red-800'
                                  : meeting.source === 'outlook'
                                  ? 'bg-blue-100 text-blue-800'
                                  : meeting.source === 'linkedin'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditMeeting(meeting);
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                handleEditMeeting(meeting);
                              }}
                            >
                              {meeting.time} - {meeting.title}
                            </div>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <h3 className="text-lg font-medium mb-4">Upcoming Meetings</h3>
              <Droppable droppableId="upcoming-meetings" type="meeting">
                {(provided) => (
                  <div 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-4"
                  >
                    {meetings
                      .sort((a, b) => {
                        const dateA = new Date(`${a.date} ${a.time}`);
                        const dateB = new Date(`${b.date} ${b.time}`);
                        return dateA.getTime() - dateB.getTime();
                      })
                      .map((meeting, index) => (
                        <Draggable key={meeting.id} draggableId={meeting.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="flex-shrink-0">
                                {meeting.type === 'video' ? (
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <Video className="h-6 w-6 text-blue-600" />
                                  </div>
                                ) : (
                                  <div className="p-2 bg-purple-100 rounded-lg">
                                    <Users className="h-6 w-6 text-purple-600" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-sm font-medium text-gray-900">
                                    {meeting.title}
                                  </h3>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleEditMeeting(meeting)}
                                      className="text-gray-400 hover:text-gray-600"
                                      title="Edit meeting"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteMeeting(meeting.id)}
                                      className="text-gray-400 hover:text-red-600"
                                      title="Delete meeting"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="mt-1 flex items-center text-xs text-gray-500">
                                  <CalendarIcon className="h-4 w-4 mr-1" />
                                  {new Date(meeting.date).toLocaleDateString()}
                                  <Clock className="h-4 w-4 ml-3 mr-1" />
                                  {meeting.time}
                                </div>

                                {meeting.location && (
                                  <div className="mt-1 flex items-center text-xs text-gray-500">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {meeting.location.type === 'physical' 
                                      ? meeting.location.address
                                      : meeting.location.meetingLink}
                                  </div>
                                )}
                                
                                {meeting.source && (
                                  <div className="mt-1">
                                    <span className={`text-xs px-2 py-1 rounded ${
                                      meeting.source === 'google'
                                        ? 'bg-red-100 text-red-800'
                                        : meeting.source === 'outlook'
                                        ? 'bg-blue-100 text-blue-800'
                                        : meeting.source === 'linkedin'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-purple-100 text-purple-800'
                                    }`}>
                                      {meeting.source.charAt(0).toUpperCase() + meeting.source.slice(1)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Card>
          </div>
        </div>

        {showNewMeeting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Schedule New Meeting</h3>
                <button
                  onClick={() => setShowNewMeeting(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMeeting}>
                <div className="space-y-4">
                  <Input
                    label="Meeting Title"
                    value={newMeeting.title || ''}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      label="Date"
                      value={newMeeting.date || ''}
                      onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                      required
                    />
                    <Input
                      type="time"
                      label="Time"
                      value={newMeeting.time || ''}
                      onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <select
                        className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] sm:text-sm"
                        value={newMeeting.duration || 30}
                        onChange={(e) => setNewMeeting({ ...newMeeting, duration: parseInt(e.target.value) })}
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>1 hour</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meeting Type
                      </label>
                      <select
                        className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] sm:text-sm"
                        value={newMeeting.type || 'video'}
                        onChange={(e) => handleMeetingTypeChange(e.target.value as 'video' | 'in-person')}
                      >
                        <option value="video">Video Call</option>
                        <option value="in-person">In Person</option>
                      </select>
                    </div>
                  </div>

                  {newMeeting.type === 'video' ? (
                    <div className="space-y-4">
                      <Input
                        label="Meeting Link"
                        placeholder="https://meet.google.com/..."
                        value={newMeeting.location?.meetingLink || ''}
                        onChange={(e) => setNewMeeting({
                          ...newMeeting,
                          location: {
                            ...newMeeting.location,
                            type: 'virtual',
                            meetingLink: e.target.value
                          }
                        })}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Meeting ID (optional)"
                          placeholder="123 456 789"
                          value={newMeeting.location?.meetingId || ''}
                          onChange={(e) => setNewMeeting({
                            ...newMeeting,
                            location: {
                              ...newMeeting.location,
                              meetingId: e.target.value
                            }
                          })}
                        />
                        <Input
                          label="Password (optional)"
                          type="password"
                          placeholder="Meeting password"
                          value={newMeeting.location?.password || ''}
                          onChange={(e) => setNewMeeting({
                            ...newMeeting,
                            location: {
                              ...newMeeting.location,
                              password: e.target.value
                            }
                          })}
                        />
                      </div>
                    </div>
                  ) : (
                    <Input
                      label="Meeting Location"
                      placeholder="Enter physical address"
                      value={newMeeting.location?.address || ''}
                      onChange={(e) => setNewMeeting({
                        ...newMeeting,
                        location: {
                          type: 'physical',
                          address: e.target.value
                        }
                      })}
                    />
                  )}

                  <Input
                    label="Attendees (comma-separated emails)"
                    placeholder="email1@example.com, email2@example.com"
                    value={newMeeting.attendees?.join(', ') || ''}
                    onChange={(e) => setNewMeeting({
                      ...newMeeting,
                      attendees: e.target.value.split(',').map(email => email.trim())
                    })}
                  />

                  <Input
                    label="Description (optional)"
                    value={newMeeting.description || ''}
                    onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                  />

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setShowNewMeeting(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingMeeting ? 'Update Meeting' : 'Schedule Meeting'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {showCredentialsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Calendar API Credentials</h3>
                <button
                  onClick={() => setShowCredentialsModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              
              </div>

              <form onSubmit={handleCredentialsUpdate}>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Google Calendar</h4>
                    <Input
                      label="Client ID"
                      value={credentials.google?.clientId || ''}
                      onChange={(e) => setCredentials({
                        ...credentials,
                        google: { ...credentials.google, clientId: e.target.value }
                      })}
                    />
                    <Input
                      label="Client Secret"
                      type="password"
                      value={credentials.google?.clientSecret || ''}
                      onChange={(e) => setCredentials({
                        ...credentials,
                        google: { ...credentials.google, clientSecret: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Outlook Calendar</h4>
                    <Input
                      label="Client ID"
                      value={credentials.outlook?.clientId || ''}
                      onChange={(e) => setCredentials({
                        ...credentials,
                        outlook: { ...credentials.outlook, clientId: e.target.value }
                      })}
                    />
                    <Input
                      label="Client Secret"
                      type="password"
                      value={credentials.outlook?.clientSecret || ''}
                      onChange={(e) => setCredentials({
                        ...credentials,
                        outlook: { ...credentials.outlook, clientSecret: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">LinkedIn</h4>
                    <Input
                      label="Client ID"
                      value={credentials.linkedin?.clientId || ''}
                      onChange={(e) => setCredentials({
                        ...credentials,
                        linkedin: { ...credentials.linkedin, clientId: e.target.value }
                      })}
                    />
                    
                    <Input
                      label="Client Secret"
                      type="password"
                      value={credentials.linkedin?.clientSecret || ''}
                      onChange={(e) => setCredentials({
                        ...credentials,
                        linkedin: { ...credentials.linkedin, clientSecret: e.target.value }
                      })}
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setShowCredentialsModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Save Credentials
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default Calendar;

