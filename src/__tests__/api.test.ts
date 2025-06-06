import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateContent,
  sendLinkedInPost,
  sendLinkedInMessage,
  fetchGoogleCalendarEvents,
  fetchOutlookEvents,
  fetchLinkedInEvents,
  ApiException,
} from '../lib/api';

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  // @ts-ignore
  global.fetch = fetchMock;
  vi.resetModules();
  process.env.VITE_OPENAI_API_KEY = 'key';
});

describe('generateContent', () => {
  it('posts prompt to OpenAI and returns content', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'hello' } }] }),
    });

    const text = await generateContent('prompt');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(text).toBe('hello');
  });

  it('throws ApiException when request fails', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 });
    await expect(generateContent('prompt')).rejects.toBeInstanceOf(ApiException);
  });
});

describe('sendLinkedInPost', () => {
  it('calls LinkedIn post endpoint', async () => {
    fetchMock.mockResolvedValue({ ok: true });
    await sendLinkedInPost('text', 'token');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.linkedin.com/v2/ugcPosts',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('throws ApiException on failure', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 400 });
    await expect(sendLinkedInPost('text', 'token')).rejects.toBeInstanceOf(ApiException);
  });
});

describe('sendLinkedInMessage', () => {
  it('calls LinkedIn message endpoint', async () => {
    fetchMock.mockResolvedValue({ ok: true });
    await sendLinkedInMessage('hi', 'urn', 'token');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.linkedin.com/v2/messages',
      expect.objectContaining({ method: 'POST' }),
    );
  });
});

describe('calendar fetch helpers', () => {
  it('fetches Google events', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ items: [1] }) });
    const data = await fetchGoogleCalendarEvents('t');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      expect.any(Object),
    );
    expect(data).toEqual([1]);
  });

  it('fetches Outlook events', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ value: [2] }) });
    const data = await fetchOutlookEvents('t');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://graph.microsoft.com/v1.0/me/events',
      expect.any(Object),
    );
    expect(data).toEqual([2]);
  });

  it('fetches LinkedIn events', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ elements: [3] }) });
    const data = await fetchLinkedInEvents('t');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.linkedin.com/v2/events',
      expect.any(Object),
    );
    expect(data).toEqual([3]);
  });
});
