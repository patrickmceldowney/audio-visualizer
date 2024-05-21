<script lang="ts">
  import { GradientButton } from 'flowbite-svelte';
  import Login from '$lib/components/Login.svelte';
  import { ArrowRightOutline } from 'flowbite-svelte-icons';
  import Visualizer from '$lib/components/Visualizer.svelte';

  let player: Spotify.Player;

  function authenticate() {
    window.location.href = '/login';
  }
</script>

<div class="flex flex-col gap-4 items-center justify-center py-5 h-screen">
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
