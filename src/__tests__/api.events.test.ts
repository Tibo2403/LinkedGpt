import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  fetchGoogleCalendarEvents,
  fetchOutlookEvents,
  fetchLinkedInEvents,
  ApiException,
} from '../lib/api';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

function mockFetchSuccess(key: 'items' | 'value' | 'elements') {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ [key]: [] }),
  }) as unknown as typeof fetch;
}

function mockFetchFailure() {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 404,
  }) as unknown as typeof fetch;
}

describe('fetchGoogleCalendarEvents', () => {
  it('returns an array on success', async () => {
    mockFetchSuccess('items');
    const events = await fetchGoogleCalendarEvents('token');
    expect(Array.isArray(events)).toBe(true);
  });

  it('throws ApiException with status code on failure', async () => {
    mockFetchFailure();
    try {
      await fetchGoogleCalendarEvents('token');
      throw new Error('should throw');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiException);
      expect((err as ApiException).status).toBe(404);
    }
  });
});

describe('fetchOutlookEvents', () => {
  it('returns an array on success', async () => {
    mockFetchSuccess('value');
    const events = await fetchOutlookEvents('token');
    expect(Array.isArray(events)).toBe(true);
  });

  it('throws ApiException with status code on failure', async () => {
    mockFetchFailure();
    try {
      await fetchOutlookEvents('token');
      throw new Error('should throw');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiException);
      expect((err as ApiException).status).toBe(404);
    }
  });
});

describe('fetchLinkedInEvents', () => {
  it('returns an array on success', async () => {
    mockFetchSuccess('elements');
    const events = await fetchLinkedInEvents('token');
    expect(Array.isArray(events)).toBe(true);
  });

  it('throws ApiException with status code on failure', async () => {
    mockFetchFailure();
    try {
      await fetchLinkedInEvents('token');
      throw new Error('should throw');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiException);
      expect((err as ApiException).status).toBe(404);
    }
  });
});
