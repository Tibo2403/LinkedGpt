import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async () => {
  const now = new Date().toISOString();
  const { data: posts, error } = await supabase
    .from('scheduled_posts')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_at', now);

  if (error) return new Response(error.message, { status: 500 });

  for (const post of posts ?? []) {
    for (const platform of post.platforms ?? []) {
      const token = Deno.env.get(`${platform.toUpperCase()}_API_KEY`);
      if (!token) continue;
      try {
        await publishPost(post.content, platform, token);
      } catch (err) {
        console.error(`Failed to publish to ${platform}`, err);
      }
    }
    await supabase
      .from('scheduled_posts')
      .update({ status: 'published' })
      .eq('id', post.id);
  }

  return new Response(JSON.stringify({ processed: posts?.length ?? 0 }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

async function publishPost(text: string, platform: string, token: string) {
  switch (platform) {
    case 'LinkedIn':
      return sendLinkedInPost(text, token);
    case 'Twitter':
      return sendTwitterPost(text, token);
    case 'Facebook':
      return sendFacebookPost(text, token);
    default:
      return;
  }
}

async function sendLinkedInPost(text: string, accessToken: string) {
  await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      author: 'urn:li:person:me',
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: { visibility: 'PUBLIC' },
    }),
  });
}

async function sendTwitterPost(text: string, accessToken: string) {
  await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
}

async function sendFacebookPost(text: string, accessToken: string) {
  await fetch(`https://graph.facebook.com/v18.0/me/feed?access_token=${accessToken}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: text }),
  });
}
