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
 * @param n - Number of variations to generate. Defaults to 1.
 * @returns An array of generated texts from the model.
 * @throws ApiException When the API key is missing or the request fails.
 */
export async function generateContent(prompt: string, n = 1): Promise<string[]> {
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
        n,
      }),
    });
    if (!response.ok) throw new ApiException('Failed to generate content', response.status);
    const data = await response.json();
    return data.choices.map((choice: any) => choice.message.content.trim());
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
