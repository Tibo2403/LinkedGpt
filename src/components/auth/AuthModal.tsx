import React from 'react';

/**
 * Displays a modal containing Supabase authentication forms.
 */
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase';
import Card from '../common/Card';

/**
 * Wrapper component for Supabase Auth UI shown inside a card.
 */
const AuthModal: React.FC = () => {
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