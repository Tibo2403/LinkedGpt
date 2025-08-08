import { describe, it, expect, vi } from 'vitest';

vi.mock('../lib/api', async () => {
  const actual = await vi.importActual<typeof import('../lib/api')>('../lib/api');
  return { ...actual, fetchTrendingHashtags: vi.fn().mockResolvedValue([]) };
});

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

describe('App routing', () => {
  it('renders dashboard by default', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
});
