import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CVGenerator from '../pages/CVGenerator';

describe('CVGenerator', () => {
  it('allows generated CV content to be edited', async () => {
    render(<CVGenerator />);

    fireEvent.change(
      screen.getByPlaceholderText(/paste the job description here/i),
      { target: { value: 'AI marketing manager role' } },
    );
    fireEvent.click(screen.getByText(/analyze & generate cv/i));

    const titleInput = await screen.findByDisplayValue('Senior Marketing Manager', {}, {
      timeout: 3000,
    });
    fireEvent.change(titleInput, { target: { value: 'AI Marketing Lead' } });

    await waitFor(() => {
      expect(screen.getByDisplayValue('AI Marketing Lead')).toBeInTheDocument();
    });

    const skillsInput = screen.getByDisplayValue(
      'Digital Marketing, AI Strategy, Content Optimization, Marketing Automation',
    );
    fireEvent.change(skillsInput, { target: { value: 'AI, Automation, SEO' } });

    expect(screen.getByText('Automation')).toBeInTheDocument();
  }, 6000);
});
