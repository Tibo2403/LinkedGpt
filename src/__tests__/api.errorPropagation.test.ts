import { describe, it, expect, vi, afterEach } from 'vitest';
import { ApiException, generateContent, sendLinkedInPost, sendLinkedInMessage } from '../lib/api';

describe('API error propagation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('generateContent rejects ApiException with status 500', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }));
    const env = import.meta.env as Record<string, string>;
    env.VITE_OPENAI_API_KEY = 'token';

    const promise = generateContent('prompt');
    await expect(promise).rejects.toBeInstanceOf(ApiException);
    await expect(promise).rejects.toHaveProperty('status', 500);
  });

  it('sendLinkedInPost rejects ApiException with status 500', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }));

    const promise = sendLinkedInPost('text', 'token');
    await expect(promise).rejects.toBeInstanceOf(ApiException);
    await expect(promise).rejects.toHaveProperty('status', 500);
  });

  it('sendLinkedInMessage rejects ApiException with status 500', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }));

    const promise = sendLinkedInMessage('text', 'urn:li:person:test', 'token');
    await expect(promise).rejects.toBeInstanceOf(ApiException);
    await expect(promise).rejects.toHaveProperty('status', 500);
  });
});
