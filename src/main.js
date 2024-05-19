const scopes = 'user-read-playback-state user-modify-playback-state';
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

document.getElementById('login-button').addEventListener('click', () => {
  const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(
    scopes
  )}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  window.location.href = authUrl;
});

document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get(access_token);

  console.log('access token', accessToken);
  if (accessToken) {
    document.getElementById('login-button').style.display = 'none';
    document.getElementById('visualizer-container').style.display = 'block';
    setupVisualizer(accessToken);
  }
});

async function setupVisualizer(accessToken) {
  try {
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const anaylser = audioCtx.createAnalyser();
    anaylser.fftSize = 256;

    const bufferLength = anaylser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioCtx.createMediaElementSource(stream);
    source.connect(anaylser);

    async function getPlaybackState() {
      const res = await fetch('https://api.spotify.com/v1/me/player', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return res.json();
    }

    function visualize() {
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

      requestAnimationFrame(visualize);
    }

    visualize();

    setInterval(async () => {
      const playback = await getPlaybackState();
      if (playback && playback.is_playing) {
        const track = playback.item;
        console.log(
          `Now play: ${track.name} by ${track.artists
            .map((artist) => artist.name)
            .join(', ')}`
        );
      }
    }, 1000);
  } catch (e) {
    console.error('Error in the visualizer');
  }
}
