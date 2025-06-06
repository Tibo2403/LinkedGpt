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

export async function generateContent(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new ApiException('OpenAI API key not configured');
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
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
