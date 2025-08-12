import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PostGenerator from '../components/posts/PostGenerator';
import { generateContent, publishPost } from '../lib/api';

vi.mock('../lib/api', async () => {
  const actual = await vi.importActual<typeof import('../lib/api')>('../lib/api');
  return {
    ...actual,
    generateContent: vi.fn(),
    publishPost: vi.fn(),
    sendLinkedInMessage: vi.fn(),
    translateContent: vi.fn(),
    rewriteContent: vi.fn(),
  };
});

describe('PostGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (generateContent as unknown as vi.Mock).mockResolvedValue('Generated');
    const env = import.meta.env as Record<string, string>;
    env.VITE_LINKEDIN_API_KEY = 'token';
  });

  afterEach(() => {
    cleanup();
  });

  it('calls generateContent when generate button is clicked', async () => {
    render(<PostGenerator />);
    fireEvent.change(screen.getByLabelText(/Platform/i), {
      target: { value: 'LinkedIn' },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Enter a topic or detailed instructions for GPT.../i),
      { target: { value: 'Topic' } },
    );
    fireEvent.click(screen.getByText(/generate content/i));
    await waitFor(() => expect(generateContent).toHaveBeenCalled());
  });

  it('publishes generated content when publish button is clicked', async () => {
    render(<PostGenerator />);
    fireEvent.change(screen.getByLabelText(/Platform/i), {
      target: { value: 'LinkedIn' },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Enter a topic or detailed instructions for GPT.../i),
      { target: { value: 'Topic' } },
    );
    fireEvent.click(screen.getByText(/generate content/i));
    await waitFor(() => expect(generateContent).toHaveBeenCalled());

    fireEvent.click(screen.getByText(/publish now/i));
    await waitFor(() =>
      expect(publishPost).toHaveBeenCalledWith('Generated', 'LinkedIn', 'token'),
    );
  });

  it('limits generateContent calls when quota is exceeded', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<PostGenerator />);
    fireEvent.change(screen.getByLabelText(/Platform/i), {
      target: { value: 'LinkedIn' },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Enter a topic or detailed instructions for GPT.../i),
      { target: { value: 'Topic' } },
    );
    const button = screen.getByText(/generate content/i) as HTMLButtonElement;
    for (let i = 0; i < 5; i++) {
      fireEvent.click(button);
      await waitFor(() => expect(generateContent).toHaveBeenCalledTimes(i + 1));
      await waitFor(() => expect(button.disabled).toBe(false));
    }

    fireEvent.click(button);
    expect(alertMock).toHaveBeenCalledWith('Rate limit exceeded. Please wait.');
    expect(generateContent).toHaveBeenCalledTimes(5);
    alertMock.mockRestore();
  });
});
