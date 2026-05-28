import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { isDemoMode, supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
}

const demoUser = {
  id: 'demo-user',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'demo@linkedgpt.local',
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: {
    provider: 'demo',
    providers: ['demo'],
  },
  user_metadata: {
    full_name: 'LinkedGPT Demo User',
    avatar_url: '',
  },
  identities: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_anonymous: false,
} satisfies User;

export const useAuthStore = create<AuthState>((set) => ({
  user: isDemoMode ? demoUser : null,
  loading: !isDemoMode,
  setUser: (user) => set({ user, loading: false }),
  signOut: async () => {
    if (isDemoMode) {
      set({ user: demoUser, loading: false });
      return;
    }

    await supabase.auth.signOut();
    set({ user: null });
  },
}));

// Initialize auth state
if (!isDemoMode) {
  supabase.auth.getSession().then(({ data: { session } }) => {
    useAuthStore.getState().setUser(session?.user ?? null);
  });

  // Listen for auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.getState().setUser(session?.user ?? null);
  });
}
