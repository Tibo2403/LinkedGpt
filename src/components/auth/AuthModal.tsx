import React from 'react';

/**
 * Displays a modal containing Supabase authentication forms.
 */
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { isDemoMode, supabase } from '../../lib/supabase';
import Card from '../common/Card';

/**
 * Wrapper component for Supabase Auth UI shown inside a card.
 */
const AuthModal: React.FC = () => {
  if (isDemoMode) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Demo mode enabled</h2>
          <p className="text-sm text-gray-600">
            LinkedGPT is running with a built-in demo user and mock integrations.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-10">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="dark"
        providers={['google', 'facebook']}
        redirectTo={`${window.location.origin}/auth/callback`}
      />
    </Card>
  );
};

export default AuthModal;
