const scopes = 'user-read-playback-state user-modify-playback-state';
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

document.getElementById('login-button').addEventListener('click', () => {
  const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(
    scopes
  )}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  window.location.href = authUrl;
});

window.addEventListener('load', () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');

  if (accessToken) {
    document.getElementById('login-button').style.display = 'none';
    document.getElementById('toggle-play').style.display = 'block';

    document.getElementById('visualizer-container').style.display = 'block';
    if (window.Spotify) {
      setupSpotifyPlayer(accessToken);
    }
  }
});

function setupSpotifyPlayer(accessToken) {
  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
      name: 'Spotify Audio Visualizer',
      getOAuthToken: (cb) => {
        cb(accessToken);
      },
      volume: 0.5,
    });

    player.addListener('initialization_error', ({ message }) => {
      console.error(message);
    });
    player.addListener('authentication_error', ({ message }) => {
      console.error(message);
    });
    player.addListener('account_error', ({ message }) => {
      console.error(message);
    });
    player.addListener('playback_error', ({ message }) => {
      console.error(message);
    });
    player.addListener('player_state_changed', (state) => {
      if (state) {
        visualize(state);
      }
    });

    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });

    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    document.getElementById('toggle-play').onclick = function () {
      player.togglePlay();
      console.log('here');
    };

    player.connect();
  };

  function visualize(state) {
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const anaylser = audioCtx.createAnalyser();
    anaylser.fftSize = 256;

    const bufferLength = anaylser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const track = state.track_window.current_track;
    console.log(
      `Now playing: ${track.name} by ${track.artists
        .map((artist) => artist.name)
        .join(', ')}`
    );
    const source = audioCtx.createMediaElementSource(new Audio(track.uri));
    source.connect(anaylser);
    anaylser.connect(audioCtx.destination);

    function draw() {
      requestAnimationFrame(draw);
      anaylser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // set bar dimensions
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight,
        x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        // colors
        const r = barHeight + 25 * (i / bufferLength);
        const g = 250 * (i / bufferLength);
        const b = 50;

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
      }
    }

    draw();
  }
}
