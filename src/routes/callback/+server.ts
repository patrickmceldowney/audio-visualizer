import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { error, redirect, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch }) => {
  const code = url.searchParams.get('code');
  console.log('code', code);

  if (!code) {
    error(404, 'Code not found');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: `${url.origin}/callback`,
      client_id: SPOTIFY_CLIENT_ID,
      client_secret: SPOTIFY_CLIENT_SECRET,
    }),
  });

  const data = await response.json();

  console.log('res', response.ok, data);

  if (response.ok) {
    return new Response(null, {
      status: 302,
      headers: {
        'Set-Cookie': `spotify_token=${data.access_token}; HttpOnly; Path=/`,
        Location: '/',
      },
    });
  } else {
    console.error('Error in response', data);
    redirect(response.status, '/');
  }
};
