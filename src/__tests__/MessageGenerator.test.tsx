import { describe, it, expect, vi, Mock, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MessageGenerator from '../components/messages/MessageGenerator';
import { generateContent } from '../lib/api';

vi.mock('../lib/api', () => ({
  generateContent: vi.fn(),
  sendLinkedInMessage: vi.fn(),
  ApiException: class ApiException extends Error {},
}));

const generateContentMock = generateContent as Mock<
  Parameters<typeof generateContent>,
  ReturnType<typeof generateContent>
>;

afterEach(() => {
  vi.resetAllMocks();
});

describe('MessageGenerator', () => {
  it('calls generateContent when generating a message', async () => {
    generateContentMock.mockResolvedValueOnce('hello');
    render(<MessageGenerator />);

    const nameInput = screen.getByPlaceholderText(/enter recipient's name/i);
    fireEvent.change(nameInput, { target: { value: 'John' } });

    const textarea = screen.getByPlaceholderText(/describe what you want to say/i);
    fireEvent.change(textarea, { target: { value: 'Hi' } });

    const button = screen.getByRole('button', { name: /generate message/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(generateContentMock).toHaveBeenCalledWith('Hi');
    });
  });
});
