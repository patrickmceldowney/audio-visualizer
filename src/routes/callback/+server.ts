import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { error, redirect, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch, cookies }) => {
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

  if (response.ok) {
    cookies.set('spotify_token', data.access_token, { path: '/' });
    redirect(302, '/');
  } else {
    console.error('Error in response', data);
    redirect(response.status, '/');
  }
};
