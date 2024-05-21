export const load = ({ cookies }) => {
	return {
		token: cookies.get('spotify_token'),
		refreshToken: cookies.get('refresh_token')
	};
};
