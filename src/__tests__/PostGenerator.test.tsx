import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PostGenerator from '../components/posts/PostGenerator';
import { generateContent } from '../lib/api';

vi.mock('../lib/api', async () => {
  const actual = await vi.importActual<typeof import('../lib/api')>('../lib/api');
  return {
    ...actual,
    generateContent: vi.fn(),
    sendLinkedInPost: vi.fn(),
    sendLinkedInMessage: vi.fn(),
  };
});

describe('PostGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (generateContent as unknown as vi.Mock).mockResolvedValue('Generated');
    const env = import.meta.env as Record<string, string>;
    env.VITE_LINKEDIN_API_KEY = 'token';
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
});
