// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      token: string;
      refreshToken: string;
    }
    // interface PageState {}
    // interface Platform {}
  }

  interface Window {
    Spotify: Spotify;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

export {};
