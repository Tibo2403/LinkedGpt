import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PostGenerator from '../components/posts/PostGenerator';
import { generateContent, publishPost, savePost } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import type { User } from '@supabase/supabase-js';

vi.mock('../lib/api', async () => {
  const actual = await vi.importActual<typeof import('../lib/api')>('../lib/api');
  return {
    ...actual,
    generateContent: vi.fn(),
    publishPost: vi.fn(),
    savePost: vi.fn(),
    sendLinkedInMessage: vi.fn(),
  };
});

describe('PostGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (generateContent as unknown as vi.Mock).mockResolvedValue('Generated');
    const env = import.meta.env as Record<string, string>;
    env.VITE_LINKEDIN_API_KEY = 'token';
    useAuthStore.setState({ user: { id: 'user-1' } as unknown as User, loading: false });
  });

  afterEach(() => {
    useAuthStore.setState({ user: null, loading: false });
    cleanup();
  });

  it('calls generateContent when generate button is clicked', async () => {
    render(<PostGenerator />);
    fireEvent.change(
      screen.getByPlaceholderText(/Enter a topic or detailed instructions for GPT.../i),
      { target: { value: 'Topic' } },
    );
    fireEvent.click(screen.getByText(/generate content/i));
    await waitFor(() => expect(generateContent).toHaveBeenCalled());
  });

  it('publishes generated content when publish button is clicked', async () => {
    render(<PostGenerator />);
    fireEvent.change(
      screen.getByPlaceholderText(/Enter a topic or detailed instructions for GPT.../i),
      { target: { value: 'Topic' } },
    );
    fireEvent.click(screen.getByText(/generate content/i));
    await waitFor(() => expect(generateContent).toHaveBeenCalled());

    fireEvent.click(screen.getByText(/publish now/i));
    await waitFor(() => expect(publishPost).toHaveBeenCalledWith('Generated', 'LinkedIn', 'token'));
    await waitFor(() =>
      expect(savePost).toHaveBeenCalledWith({
        user_id: 'user-1',
        content: 'Generated',
        platform: 'LinkedIn',
        status: 'published',
      }),
    );
  });
});
