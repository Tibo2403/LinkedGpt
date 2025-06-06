import { describe, it, expect, vi, Mock, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PostGenerator from '../components/posts/PostGenerator';
import { generateContent } from '../lib/api';

vi.mock('../lib/api', () => ({
  generateContent: vi.fn(),
  sendLinkedInPost: vi.fn(),
  ApiException: class ApiException extends Error {},
}));

const generateContentMock = generateContent as Mock<
  Parameters<typeof generateContent>,
  ReturnType<typeof generateContent>
>;

afterEach(() => {
  vi.resetAllMocks();
});

describe('PostGenerator', () => {
  it('calls generateContent when generating a post', async () => {
    generateContentMock.mockResolvedValueOnce('post');
    render(<PostGenerator />);

    const textarea = screen.getByPlaceholderText(/enter a topic/i);
    fireEvent.change(textarea, { target: { value: 'Topic' } });

    const button = screen.getByRole('button', { name: /generate content/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(generateContentMock).toHaveBeenCalledWith('Topic');
    });
  });
});
