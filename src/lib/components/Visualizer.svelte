<script lang="ts">
  import { onMount } from 'svelte';

  export let player: Spotify.Player;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const accessToken = getCookie('spotify_token');

      if (!accessToken) {
        console.error('No token found');
        return;
      }

      player = new window.Spotify.Player({
        name: 'Web playback SDK Quick Start Player',
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
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

      player.connect();
    };
  });

  function visualize(state: Spotify.PlaybackState) {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const audioElement = new Audio();
    audioElement.crossOrigin = 'anonymous';
    audioElement.src = `https://api.spotify.com/v1/tracks/${state.track_window.current_track.id}`;

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    audioElement.play();

    function draw() {
      requestAnimationFrame(draw);
      if (ctx) {
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];

          const r = barHeight + 25 * (i / bufferLength);
          const g = 250 * (i / bufferLength);
          const b = 50;

          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(
            x,
            canvas.height - barHeight / 2,
            barWidth,
            barHeight / 2
          );

          x += barWidth + 1;
        }
      }
    }

    draw();
  }

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return (parts.pop() || '').split(';').shift();
  }
</script>

<div class="mt-5 h-80 border border-spotify-black">
  <canvas bind:this={canvas}></canvas>
</div>
