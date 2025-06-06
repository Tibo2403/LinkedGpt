import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MessageGenerator from '../components/messages/MessageGenerator';
import type { Mock } from 'vitest';
import * as api from '../lib/api';

vi.mock('../lib/api', () => ({
  generateContent: vi.fn(),
  sendLinkedInPost: vi.fn(),
  sendLinkedInMessage: vi.fn(),
  ApiException: class ApiException extends Error {},
}));

const generateContent = api.generateContent as unknown as Mock;

describe('MessageGenerator', () => {
  it('applies template and generates message', async () => {
    (generateContent as any).mockResolvedValue('hello message');
    render(<MessageGenerator />);

    fireEvent.change(screen.getByPlaceholderText(/Enter recipient's name/i), {
      target: { value: 'John Doe' },
    });

    const template = screen.getByText(/Mutual Interest/i);
    fireEvent.click(template);

    const expectedTemplate =
      'I noticed we both share an interest in [topic]. Would love to connect and possibly exchange ideas about [industry/topic].';
    const prompt = screen.getByPlaceholderText(/Describe what you want to say/i);
    expect(prompt).toHaveValue(expectedTemplate);

    fireEvent.click(screen.getByRole('button', { name: /Generate Message/i }));

    expect(generateContent).toHaveBeenCalledWith(expectedTemplate);
    expect(await screen.findByDisplayValue('hello message')).toBeInTheDocument();
  });
});
