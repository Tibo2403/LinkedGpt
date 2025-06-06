import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateContent, ApiException } from '../lib/api';

let originalApiKey: string | undefined;
let originalFetch: typeof fetch;

describe('generateContent', () => {
  beforeEach(() => {
    const env = import.meta.env as Record<string, any>;
    originalApiKey = env.VITE_OPENAI_API_KEY;
    delete env.VITE_OPENAI_API_KEY;
    originalFetch = global.fetch;
    global.fetch = vi.fn();
  });

  afterEach(() => {
    const env = import.meta.env as Record<string, any>;
    if (originalApiKey !== undefined) {
      env.VITE_OPENAI_API_KEY = originalApiKey;
    } else {
      delete env.VITE_OPENAI_API_KEY;
    }
    global.fetch = originalFetch;
    vi.resetAllMocks();
  });

  it('rejects when API key is not configured', async () => {
    try {
      await generateContent('prompt');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiException);
      expect((err as Error).message).toBe('OpenAI API key not configured');
      return;
    }
    throw new Error('generateContent did not throw');
  });
});
