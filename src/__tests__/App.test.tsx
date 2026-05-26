import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import '../i18n';

describe('App routing', () => {
  it('renders dashboard by default', async () => {
    render(
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <App />
      </BrowserRouter>,
    );
    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
  });
});
