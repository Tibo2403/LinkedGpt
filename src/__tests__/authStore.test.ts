import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { User } from '@supabase/supabase-js';

const authMock = {
  signOut: vi.fn().mockResolvedValue(undefined),
  getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
  onAuthStateChange: vi.fn(),
};

let useAuthStore: any;

beforeEach(async () => {
  vi.resetModules();
  vi.doMock('../lib/supabase', () => ({ supabase: { auth: authMock } }));
  const mod = await import('../stores/authStore');
  useAuthStore = mod.useAuthStore;
  authMock.signOut.mockClear();
  useAuthStore.setState({ user: { id: '1' } as unknown as User, loading: false });
});

describe('authStore signOut', () => {
  it('clears the user state', async () => {
    await useAuthStore.getState().signOut();
    expect(authMock.signOut).toHaveBeenCalled();
    expect(useAuthStore.getState().user).toBeNull();
  });
});
