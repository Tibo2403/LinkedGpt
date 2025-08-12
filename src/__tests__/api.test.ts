import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ApiException,
  generateContent,
  translateContent,
  rewriteContent,
  publishPost,
} from '../lib/api';

const env = import.meta.env as Record<string, string>;

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('fetch', mockFetch);
  env.VITE_OPENAI_API_KEY = 'test-key';
  env.VITE_SUPABASE_URL = 'http://localhost';
  env.VITE_SUPABASE_ANON_KEY = 'anon';
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('generateContent', () => {
  it('returns text when fetch succeeds', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: 'Hello ' } }] }),
    });
    await expect(generateContent('prompt', 'LinkedIn')).resolves.toBe('Hello');
  });

  it('throws ApiException with status when fetch fails', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });
    const p = generateContent('prompt', 'LinkedIn');
    await expect(p).rejects.toBeInstanceOf(ApiException);
    await expect(p).rejects.toMatchObject({ message: 'Failed to generate content', status: 500 });
  });

  it('throws ApiException on network error', async () => {
    mockFetch.mockRejectedValue(new Error('network'));
    const p = generateContent('prompt', 'LinkedIn');
    await expect(p).rejects.toBeInstanceOf(ApiException);
    await expect(p).rejects.toMatchObject({ message: 'Network error while generating content' });
  });
});

describe('translateContent', () => {
  it('returns translated text on success', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: 'Bonjour' } }] }),
    });
    await expect(translateContent('Hello', 'French')).resolves.toBe('Bonjour');
  });

  it('throws ApiException with status on failure', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 400 });
    const p = translateContent('Hello', 'French');
    await expect(p).rejects.toBeInstanceOf(ApiException);
    await expect(p).rejects.toMatchObject({ message: 'Failed to translate content', status: 400 });
  });

  it('throws ApiException on network error', async () => {
    mockFetch.mockRejectedValue(new Error('network'));
    const p = translateContent('Hello', 'French');
    await expect(p).rejects.toBeInstanceOf(ApiException);
    await expect(p).rejects.toMatchObject({ message: 'Network error while translating content' });
  });
});

describe('rewriteContent', () => {
  it('returns rewritten text on success', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: 'Rewritten' } }] }),
    });
    await expect(rewriteContent('Text', 'friendly')).resolves.toBe('Rewritten');
  });

  it('throws ApiException with status on failure', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 403 });
    const p = rewriteContent('Text', 'friendly');
    await expect(p).rejects.toBeInstanceOf(ApiException);
    await expect(p).rejects.toMatchObject({ message: 'Failed to rewrite content', status: 403 });
  });

  it('throws ApiException on network error', async () => {
    mockFetch.mockRejectedValue(new Error('network'));
    const p = rewriteContent('Text', 'friendly');
    await expect(p).rejects.toBeInstanceOf(ApiException);
    await expect(p).rejects.toMatchObject({ message: 'Network error while rewriting content' });
  });
});

describe('publishPost', () => {
  it('publishes a LinkedIn post successfully', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: '123' }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });
    await expect(publishPost('Post', 'LinkedIn', 'token')).resolves.toBe('123');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('throws ApiException with status when publish fails', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 401 });
    const p = publishPost('Post', 'LinkedIn', 'token');
    await expect(p).rejects.toBeInstanceOf(ApiException);
    await expect(p).rejects.toMatchObject({ message: 'Failed to publish post', status: 401 });
  });

  it('throws ApiException on network error', async () => {
    mockFetch.mockRejectedValue(new Error('network'));
    const p = publishPost('Post', 'LinkedIn', 'token');
    await expect(p).rejects.toBeInstanceOf(ApiException);
    await expect(p).rejects.toMatchObject({ message: 'Network error while publishing post' });
  });
});

