import type { PostMetrics } from '../types';

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
export async function sendLinkedInPost(text: string, accessToken: string): Promise<string> {
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
    const data = await response.json();
    return data.id as string;
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
export async function sendTwitterPost(text: string, accessToken: string): Promise<string> {
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
    const data = await response.json();
    return data.data?.id as string;
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
export async function sendFacebookPost(text: string, accessToken: string): Promise<string> {
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
    const data = await response.json();
    return data.id as string;
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
  let postId: string;
  switch (platform) {
    case 'LinkedIn':
      postId = await sendLinkedInPost(text, accessToken);
      break;
    case 'Twitter':
      postId = await sendTwitterPost(text, accessToken);
      break;
    case 'Facebook':
      postId = await sendFacebookPost(text, accessToken);
      break;
    default:
      throw new ApiException('Unsupported platform');
  }
  await savePostReference(postId, platform);
  return postId;
}

async function savePostReference(postId: string, platform: string) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return;
  try {
    await fetch(`${supabaseUrl}/rest/v1/post_metrics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        post_id: postId,
        platform,
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      }),
    });
  } catch {
    // Ignore errors saving references
  }
}

/**
 * Stores a scheduled post in Supabase for later publication.
 *
 * @param userId - ID of the user creating the post.
 * @param content - Post content to be published.
 * @param platforms - Array of target platforms.
 * @param scheduledAt - ISO timestamp when the post should be published.
 * @throws ApiException When the request fails or a network error occurs.
 */
export async function schedulePost(
  userId: string,
  content: string,
  platforms: string[],
  scheduledAt: string,
) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new ApiException('Supabase not configured');
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/scheduled_posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        user_id: userId,
        content,
        platforms,
        scheduled_at: scheduledAt,
        status: 'pending',
      }),
    });
    if (!response.ok) throw new ApiException('Failed to schedule post', response.status);
    const data = await response.json();
    for (const platform of platforms) {
      await savePostReference(data.id, platform);
    }
    return data;
  } catch (err) {
    if (err instanceof ApiException) throw err;
    throw new ApiException('Network error while scheduling post');
  }
}

export async function fetchPostMetrics(postIds: string[]): Promise<PostMetrics[]> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new ApiException('Supabase not configured');
  }

  try {
    const filter = postIds.map((id) => `"${id}"`).join(',');
    const response = await fetch(
      `${supabaseUrl}/rest/v1/post_metrics?post_id=in.(${filter})`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      },
    );
    if (!response.ok) {
      throw new ApiException('Failed to fetch post metrics', response.status);
    }
    return response.json();
  } catch (err) {
    if (err instanceof ApiException) throw err;
    throw new ApiException('Network error while fetching post metrics');
  }
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
