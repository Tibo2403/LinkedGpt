import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../lib/api', () => ({
  generateContent: vi.fn(),
  sendLinkedInPost: vi.fn(),
  sendLinkedInMessage: vi.fn(),
}));

import { generateContent } from '../lib/api';
import type { Mock } from 'vitest';
import PostGenerator from '../components/posts/PostGenerator';

const generateContentMock = generateContent as Mock<
  ReturnType<typeof generateContent>,
  Parameters<typeof generateContent>
>;

describe('PostGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates post content on success', async () => {
    generateContentMock.mockResolvedValue('Generated text');
    render(<PostGenerator />);

    fireEvent.change(
      screen.getAllByPlaceholderText(/enter a topic/i)[0],
      { target: { value: 'topic' } }
    );
    await act(async () => {
      fireEvent.click(
        screen.getAllByRole('button', { name: /generate content/i })[0]
      );
    });

    expect(generateContentMock).toHaveBeenCalledWith('topic');
    expect(await screen.findByDisplayValue('Generated text')).toBeInTheDocument();
  });

  it('shows an alert when generation fails', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    generateContentMock.mockRejectedValue(new Error('fail'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<PostGenerator />);

    fireEvent.change(
      screen.getAllByPlaceholderText(/enter a topic/i)[0],
      { target: { value: 'topic' } }
    );
    await act(async () => {
      fireEvent.click(
        screen.getAllByRole('button', { name: /generate content/i })[0]
      );
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Failed to generate content');
    });
    alertSpy.mockRestore();
  });
});
