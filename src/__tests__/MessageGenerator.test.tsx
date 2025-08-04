import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MessageGenerator from '../components/messages/MessageGenerator';
import { generateContent, sendLinkedInMessage } from '../lib/api';

vi.mock('../lib/api', async () => {
  const actual = await vi.importActual<typeof import('../lib/api')>('../lib/api');
  return {
    ...actual,
    generateContent: vi.fn(),
    sendLinkedInPost: vi.fn(),
    sendLinkedInMessage: vi.fn(),
  };
});

describe('MessageGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (generateContent as unknown as vi.Mock).mockResolvedValue(['Generated']);
    const env = import.meta.env as Record<string, string>;
    env.VITE_LINKEDIN_API_KEY = 'token';
  });

  afterEach(() => {
    cleanup();
  });

  it('calls generateContent when generate button is clicked', async () => {
    render(<MessageGenerator />);
    fireEvent.change(screen.getByPlaceholderText("Enter recipient's name"), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(
      screen.getByPlaceholderText(
        /Describe what you want to say to this person or choose a template from the right.../i,
      ),
      { target: { value: 'Hello' } },
    );
    fireEvent.click(screen.getByText(/generate message/i));
    await waitFor(() => expect(generateContent).toHaveBeenCalled());
  });

  it('sends generated message when send button is clicked', async () => {
    render(<MessageGenerator />);
    fireEvent.change(screen.getByPlaceholderText("Enter recipient's name"), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(
      screen.getByPlaceholderText(
        /Describe what you want to say to this person or choose a template from the right.../i,
      ),
      { target: { value: 'Hello' } },
    );
    fireEvent.click(screen.getByText(/generate message/i));
    await waitFor(() => expect(generateContent).toHaveBeenCalled());

    fireEvent.click(screen.getByText(/send message/i));
    await waitFor(() => expect(sendLinkedInMessage).toHaveBeenCalledWith('Generated', 'urn:li:person:john123', 'token'));
  });
});
