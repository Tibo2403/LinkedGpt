import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase';
import Card from '../common/Card';

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