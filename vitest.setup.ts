import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

process.env.VITE_SUPABASE_URL = 'http://localhost';
process.env.VITE_SUPABASE_ANON_KEY = 'test';

// Stub alert for tests running in jsdom environment
globalThis.alert = vi.fn();
