import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { error, redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ fetch, cookies }) => {
	const token = cookies.get('refresh_token');
	console.log('token', token);

	if (!token) {
		error(404, 'Refresh token not found');
	}

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: token,
			client_id: SPOTIFY_CLIENT_ID,
			client_secret: SPOTIFY_CLIENT_SECRET
		})
	});

	const data = await response.json();

	if (response.ok) {
		cookies.set('spotify_token', data.access_token, { path: '/' });
		cookies.set('refresh_token', data.refresh_token, { path: '/' });
		redirect(302, '/');
	} else {
		console.error('Error in response', data);
		redirect(response.status, '/');
	}
};
