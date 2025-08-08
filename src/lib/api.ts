import { supabase } from './supabase';

export class ApiException extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.code = code;
  }
}

/**
 * Generates text using the OpenAI Chat Completion API.
 *
 * @param prompt - Text prompt describing the desired content.
 * @param platform - Target platform for the content which influences tone and style.
 * @returns The generated text from the model.
 * @throws ApiException When the API key is missing or the request fails.
 */
export async function generateContent(prompt: string, platform: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new ApiException('OpenAI API key not configured');

  const platformPrompts: Record<string, string> = {
    LinkedIn: 'You are a professional assistant crafting LinkedIn posts in a business tone.',
    Twitter: 'You are a witty assistant crafting concise tweets (280 characters max).',
    Facebook: 'You are a friendly assistant creating engaging Facebook updates.',
  };

  const systemPrompt = platformPrompts[platform] || 'You are a helpful social media assistant.';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      }),
    });
    if (!response.ok) throw new ApiException('Failed to generate content', response.status);
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (err) {
    if (err instanceof ApiException) throw err;
    throw new ApiException('Network error while generating content');
  }
}

/**
 * Publishes a post to LinkedIn using the REST API.
 *
 * @param text - The body of the LinkedIn post.
 * @param accessToken - OAuth token granting publish permissions.
 * @throws ApiException When the request fails or a network error occurs.
 */
export async function sendLinkedInPost(text: string, accessToken: string) {
  try {
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        author: 'urn:li:person:me',
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: { visibility: 'PUBLIC' },
      }),
    });
    if (!response.ok) throw new ApiException('Failed to publish post', response.status);
  } catch (err) {
    if (err instanceof ApiException) throw err;
    throw new ApiException('Network error while publishing post');
  }
}

/**
 * Publishes a tweet using the Twitter API.
 *
 * @param text - Tweet content.
 * @param accessToken - OAuth token granting publish permissions.
 * @throws ApiException When the request fails or a network error occurs.
 */
export async function sendTwitterPost(text: string, accessToken: string) {
  try {
    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new ApiException('Failed to publish post', response.status);
  } catch (err) {
    if (err instanceof ApiException) throw err;
    throw new ApiException('Network error while publishing post');
  }
}

/**
 * Publishes a post to Facebook using the Graph API.
 *
 * @param text - The body of the Facebook post.
 * @param accessToken - OAuth token granting publish permissions.
 * @throws ApiException When the request fails or a network error occurs.
 */
export async function sendFacebookPost(text: string, accessToken: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/feed?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      },
    );
    if (!response.ok) throw new ApiException('Failed to publish post', response.status);
  } catch (err) {
    if (err instanceof ApiException) throw err;
    throw new ApiException('Network error while publishing post');
  }
}

/**
 * Routes post publication to the correct platform-specific function.
 *
 * @param text - Content to publish.
 * @param platform - Target platform.
 * @param accessToken - OAuth token granting publish permissions.
 */
export async function publishPost(
  text: string,
  platform: string,
  accessToken: string,
) {
  switch (platform) {
    case 'LinkedIn':
      return sendLinkedInPost(text, accessToken);
    case 'Twitter':
      return sendTwitterPost(text, accessToken);
    case 'Facebook':
      return sendFacebookPost(text, accessToken);
    default:
      throw new ApiException('Unsupported platform');
  }
}

export interface PostRecord {
  id?: string;
  user_id: string;
  content: string;
  platform: string;
  status: string;
  engagement?: Record<string, unknown>;
  created_at?: string;
}

export interface MessageRecord {
  id?: string;
  user_id: string;
  content: string;
  platform: string;
  status: string;
  engagement?: Record<string, unknown>;
  created_at?: string;
}

export type HistoryRecord =
  | (PostRecord & { type: 'post' })
  | (MessageRecord & { type: 'message' });

export async function savePost(post: PostRecord) {
  const { error } = await supabase.from('posts').insert(post);
  if (error) throw new ApiException('Failed to save post', error.status, error.code);
}

export async function saveMessage(message: MessageRecord) {
  const { error } = await supabase.from('messages').insert(message);
  if (error) throw new ApiException('Failed to save message', error.status, error.code);
}

export async function fetchHistory(userId: string): Promise<HistoryRecord[]> {
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId);
  if (postsError) throw new ApiException('Failed to fetch posts', postsError.status, postsError.code);

  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', userId);
  if (messagesError)
    throw new ApiException('Failed to fetch messages', messagesError.status, messagesError.code);

  const combined: HistoryRecord[] = [
    ...(posts ?? []).map((p) => ({ ...p, type: 'post' as const })),
    ...(messages ?? []).map((m) => ({ ...m, type: 'message' as const })),
  ];

  return combined.sort(
    (a, b) => new Date(b.created_at ?? '').getTime() - new Date(a.created_at ?? '').getTime(),
  );
}

/**
 * Sends a direct message to a LinkedIn user.
 *
 * @param text - Message body to deliver.
 * @param recipientUrn - LinkedIn URN of the recipient.
 * @param accessToken - OAuth token with messaging permissions.
 * @throws ApiException When the request fails or a network error occurs.
 */
export async function sendLinkedInMessage(
  text: string,
  recipientUrn: string,
  accessToken: string,
) {
  try {
    const response = await fetch('https://api.linkedin.com/v2/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        recipients: [recipientUrn],
        subject: 'Automated message',
        body: text,
      }),
    });
    if (!response.ok) throw new ApiException('Failed to send message', response.status);
  } catch (err) {
    if (err instanceof ApiException) throw err;
    throw new ApiException('Network error while sending message');
  }
}

/**
 * Retrieves events from the user's primary Google Calendar.
 *
 * @param token - OAuth access token for the Google Calendar API.
 * @returns A list of calendar event objects.
 * @throws ApiException When the request fails or a network error occurs.
 */
export async function fetchGoogleCalendarEvents(token: string) {
  try {
    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new ApiException('Failed to fetch Google Calendar events', res.status);
    return (await res.json()).items;
  } catch (err) {
    if (err instanceof ApiException) throw err;
    throw new ApiException('Network error while fetching Google Calendar events');
  }
}

/**
 * Fetches events from the authenticated user's Outlook calendar.
 *
 * @param token - OAuth token for the Microsoft Graph API.
 * @returns A list of Outlook event objects.
 * @throws ApiException When the request fails or a network error occurs.
 */
export async function fetchOutlookEvents(token: string) {
  try {
    const res = await fetch('https://graph.microsoft.com/v1.0/me/events', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new ApiException('Failed to fetch Outlook events', res.status);
    return (await res.json()).value;
  } catch (err) {
    if (err instanceof ApiException) throw err;
    throw new ApiException('Network error while fetching Outlook events');
  }
}

/**
 * Retrieves LinkedIn events accessible to the authenticated user.
 *
 * @param token - OAuth token for LinkedIn's API.
 * @returns An array of LinkedIn event objects.
 * @throws ApiException When the request fails or a network error occurs.
 */
export async function fetchLinkedInEvents(token: string) {
  try {
    const res = await fetch('https://api.linkedin.com/v2/events', {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });
    if (!res.ok) throw new ApiException('Failed to fetch LinkedIn events', res.status);
    return (await res.json()).elements;
  } catch (err) {
    if (err instanceof ApiException) throw err;
    throw new ApiException('Network error while fetching LinkedIn events');
  }
}
