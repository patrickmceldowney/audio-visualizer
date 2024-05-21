<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Visualizer from './Visualizer.svelte';
	import { Button, ButtonGroup, Card } from 'flowbite-svelte';
	import { CaretLeftSolid, CaretRightSolid, PauseSolid, PlaySolid } from 'flowbite-svelte-icons';

	let track: Spotify.Track;
	let player: Spotify.Player;
	let visualizer: Visualizer;
	let paused = false;

	onMount(() => {
		window.onSpotifyWebPlaybackSDKReady = () => {
			const accessToken = $page.data.token;

			if (!accessToken) {
				console.error('No token found');
				return;
			}

			player = new window.Spotify.Player({
				name: 'Web playback SDK Quick Start Player',
				getOAuthToken: (cb) => {
					cb(accessToken);
				}
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
					track = state.track_window.current_track;

					paused = state.paused;

					visualizer.animate(state);
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
</script>

<div class="flex flex-col gap-10">
	<div class="space-y-4">
		<Card img={track && track.album.images[0].url} href="/" horizontal size="md">
			<div class="flex flex-col gap-4">
				<div>
					{#if track}
						<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
							{track.name}
						</h5>
						<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
							{track.artists[0].name}
						</p>
					{:else}
						<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
							Player is unavailable right now
						</h5>
					{/if}
				</div>

				<div class="self-center">
					<ButtonGroup>
						<Button on:click={() => player.previousTrack()}>
							<CaretLeftSolid />
						</Button>
						<Button on:click={() => player.togglePlay()}>
							{#if paused}
								<PlaySolid />
							{:else}
								<PauseSolid />
							{/if}
						</Button>
						<Button on:click={() => player.nextTrack()}>
							<CaretRightSolid />
						</Button>
					</ButtonGroup>
				</div>
			</div>
		</Card>
	</div>

	<Visualizer bind:this={visualizer} />
</div>
