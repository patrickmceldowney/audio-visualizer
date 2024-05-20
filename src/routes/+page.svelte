<script lang="ts">
  import { page } from '$app/stores';
  import {
    PUBLIC_SPOTIFY_CLIENT_ID,
    PUBLIC_SPOTIFY_REDIRECT_URI,
  } from '$env/static/public';
  import { onMount } from 'svelte';

  let player: Spotify.Player;

  onMount(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    const accessToken = $page.url.searchParams.get('accessToken');
    if (accessToken) {
      window.onSpotifyWebPlaybackSDKReady = () => {
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
    }
  });

  function visualize(state: Spotify.PlaybackState) {
    const canvas = document.getElementById('visualizer') as HTMLCanvasElement;
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

  function authenticate() {
    const scopes =
      'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state';
    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${PUBLIC_SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(PUBLIC_SPOTIFY_REDIRECT_URI)}`;
    console.log(authUrl);
    window.location.href = authUrl;
  }
</script>

<div class="container">
  <h1 class="title">Spotify Audio Visualizer</h1>
  {#if !player}
    <button on:click={authenticate}> Login to Spotify </button>
  {:else}
    <button id="toggle-play"> Play music </button>
    <div id="visualizer-container">
      <canvas id="visualizer"></canvas>
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .title {
    color: #1db954;
  }

  h1 {
    font-size: 3.2em;
    line-height: 1.1;
  }

  #visualizer {
    height: 300px;
    margin-top: 20px;
  }

  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #a21db9;
    cursor: pointer;
    transition: border-color 0.25s;
    color: white;
  }
  button:hover {
    border-color: #a21db9;
  }
  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
</style>
