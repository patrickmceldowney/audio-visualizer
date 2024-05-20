<script lang="ts">
  import {
    PUBLIC_SPOTIFY_CLIENT_ID,
    PUBLIC_SPOTIFY_REDIRECT_URI,
  } from '$env/static/public';
  import { GradientButton } from 'flowbite-svelte';
  import Login from '$lib/components/Login.svelte';
  import { ArrowRightOutline } from 'flowbite-svelte-icons';
  import Visualizer from '$lib/components/Visualizer.svelte';

  let player: Spotify.Player;

  function authenticate() {
    const scope =
      'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state';
    const params = new URLSearchParams({
      response_type: 'token',
      client_id: PUBLIC_SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: PUBLIC_SPOTIFY_REDIRECT_URI,
    });
    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
    console.log(authUrl);
    window.location.href = authUrl;
  }
</script>

<div class="flex flex-col gap-4 items-center py-5">
  <h1 class="text-spotify-green text-4xl font-medium">
    Spotify Audio Visualizer
  </h1>
  {#if !player}
    <Login
      title="Connect to Spotify?"
      subtitle="Click here to link your Spotify account and play music directly from this app."
    >
      <GradientButton
        class=" w-fit"
        color="pink"
        slot="button"
        on:click={authenticate}
      >
        Connect <ArrowRightOutline class="w-6 h-6 ms-2 text-white" />
      </GradientButton>
    </Login>
  {:else}
    <Visualizer bind:player />
  {/if}
</div>
