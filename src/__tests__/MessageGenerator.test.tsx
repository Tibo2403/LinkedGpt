import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../lib/api', () => ({
  generateContent: vi.fn(),
  sendLinkedInPost: vi.fn(),
  sendLinkedInMessage: vi.fn(),
}));

import { generateContent } from '../lib/api';
import MessageGenerator from '../components/messages/MessageGenerator';

const generateContentMock = generateContent as vi.MockedFunction<typeof generateContent>;

describe('MessageGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates a message on success', async () => {
    generateContentMock.mockResolvedValue('Hello there');
    render(<MessageGenerator />);

    fireEvent.change(screen.getAllByPlaceholderText(/enter recipient's name/i)[0], { target: { value: 'John' } });
    fireEvent.change(screen.getAllByPlaceholderText(/describe what you want/i)[0], { target: { value: 'Say hi' } });
    await act(async () => {
      fireEvent.click(
        screen.getAllByRole('button', { name: /generate message/i })[0]
      );
    });

    expect(generateContentMock).toHaveBeenCalled();
    expect(await screen.findByDisplayValue('Hello there')).toBeInTheDocument();
  });

  it('alerts when generation fails', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    generateContentMock.mockRejectedValue(new Error('bad'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<MessageGenerator />);

    fireEvent.change(screen.getAllByPlaceholderText(/enter recipient's name/i)[0], { target: { value: 'John' } });
    fireEvent.change(screen.getAllByPlaceholderText(/describe what you want/i)[0], { target: { value: 'Say hi' } });
    await act(async () => {
      fireEvent.click(
        screen.getAllByRole('button', { name: /generate message/i })[0]
      );
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Failed to generate message');
    });
    alertSpy.mockRestore();
  });
});
