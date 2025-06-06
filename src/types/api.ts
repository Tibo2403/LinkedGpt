// Google Calendar API
export interface GoogleCalendarCredentials {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  scope?: string[];
}

export interface GoogleCalendarProfile {
  email: string;
  name: string;
  picture?: string;
  calendars: {
    id: string;
    name: string;
    primary: boolean;
    accessRole: string;
  }[];
}

// Outlook/Microsoft API
export interface OutlookCredentials {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  scope?: string[];
}

export interface OutlookProfile {
  id: string;
  displayName: string;
  email: string;
  businessPhones?: string[];
  jobTitle?: string;
  officeLocation?: string;
  calendars: {
    id: string;
    name: string;
    canEdit: boolean;
    owner: {
      name: string;
      address: string;
    };
  }[];
}

// LinkedIn API
export interface LinkedInCredentials {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  scope?: string[];
}

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: {
    displayImage: string;
  };
  email?: string;
  vanityName?: string;
  headline?: string;
  industry?: string;
  currentShare?: {
    id: string;
    text: string;
    timestamp: number;
  };
  numConnections?: number;
  summary?: string;
  positions?: {
    id: string;
    title: string;
    company: {
      id: string;
      name: string;
    };
    startDate: {
      month: number;
      year: number;
    };
    endDate?: {
      month: number;
      year: number;
    };
    current: boolean;
  }[];
}

// API Scopes
export const GOOGLE_CALENDAR_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
];

export const OUTLOOK_SCOPES = [
  'calendars.read',
  'calendars.readwrite',
  'user.read',
  'offline_access'
];

export const LINKEDIN_SCOPES = [
  'r_liteprofile',
  'r_emailaddress',
  'w_member_social',
  'r_network',
  'w_messages'
];

// API Endpoints
export const API_ENDPOINTS = {
  google: {
    auth: 'https://accounts.google.com/o/oauth2/v2/auth',
    token: 'https://oauth2.googleapis.com/token',
    calendar: 'https://www.googleapis.com/calendar/v3',
    userInfo: 'https://www.googleapis.com/oauth2/v2/userinfo'
  },
  outlook: {
    auth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    token: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    calendar: 'https://graph.microsoft.com/v1.0/me/calendar',
    userInfo: 'https://graph.microsoft.com/v1.0/me'
  },
  linkedin: {
    auth: 'https://www.linkedin.com/oauth/v2/authorization',
    token: 'https://www.linkedin.com/oauth/v2/accessToken',
    profile: 'https://api.linkedin.com/v2/me',
    email: 'https://api.linkedin.com/v2/emailAddress'
  }
};

// Error Types
export interface APIError {
  code: string;
  message: string;
  status: number;
  details?: unknown;
}

// Response Types
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  scope: string;
  tokenType: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: {
    email: string;
    name?: string;
    responseStatus?: 'accepted' | 'declined' | 'tentative' | 'needsAction';
  }[];
  location?: string;
  meetingLink?: string;
  source: 'google' | 'outlook' | 'linkedin';
  recurrence?: string[];
  status: 'confirmed' | 'tentative' | 'cancelled';
  creator: {
    email: string;
    name?: string;
  };
  organizer: {
    email: string;
    name?: string;
  };
  created: string;
  updated: string;
}