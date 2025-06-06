import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PostGenerator from '../components/posts/PostGenerator';
import type { Mock } from 'vitest';
import * as api from '../lib/api';

vi.mock('../lib/api', () => ({
  generateContent: vi.fn(),
  sendLinkedInPost: vi.fn(),
  sendLinkedInMessage: vi.fn(),
  ApiException: class ApiException extends Error {},
}));

const generateContent = api.generateContent as unknown as Mock;

describe('PostGenerator', () => {
  it('calls generateContent and displays returned text', async () => {
    (generateContent as any).mockResolvedValue('mock post');
    render(<PostGenerator />);
    const input = screen.getByPlaceholderText(/Enter a topic/i);
    fireEvent.change(input, { target: { value: 'test prompt' } });
    const button = screen.getByRole('button', { name: /Generate Content/i });
    fireEvent.click(button);
    expect(generateContent).toHaveBeenCalledWith('test prompt');
    expect(await screen.findByDisplayValue('mock post')).toBeInTheDocument();
  });
});
