import { SPOTIFY_CLIENT_ID } from '$env/static/private';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing';

	const auth_query_parameters = new URLSearchParams({
		response_type: 'code',
		client_id: SPOTIFY_CLIENT_ID,
		scope: scope,
		redirect_uri: `${url.origin}/callback`,
		state: generateRandomString(16)
	});

	const authUrl = `https://accounts.spotify.com/authorize/?${auth_query_parameters.toString()}`;

	redirect(302, authUrl);
};

const generateRandomString = (length: number) => {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};
