<script lang="ts">
  import { onMount } from 'svelte';
  import { musicStore } from '../stores/musicStore';
  import Icon from '@iconify/svelte';
  import { url } from '../utils/url-utils';

  let isPlaying = musicStore.getState().isPlaying;
  let audioRef: HTMLAudioElement;

  onMount(() => {
    // Subscribe to zustand store changes
    const unsubscribe = musicStore.subscribe((state) => {
      isPlaying = state.isPlaying;
      if (audioRef) {
        if (state.isPlaying) {
          audioRef.play().catch(() => {
            // Autoplay might be blocked by browser policy
            musicStore.getState().setPlaying(false);
          });
        } else {
          audioRef.pause();
        }
      }
    });

    // Initialize audio
    if (audioRef) {
      audioRef.volume = 0.15; // Set a relatively low volume
      if (isPlaying) {
        audioRef.play().catch(() => {
          // If browser prevents autoplay without interaction, update state to pause
          musicStore.getState().setPlaying(false);
        });
      }
    }

    // Since Swup navigations replace content but NOT the Navbar,
    // this component will persist across Swup navigations.
    // That means the music will seamlessly keep playing!
    return () => {
      unsubscribe();
    };
  });

  function toggle() {
    musicStore.getState().togglePlay();
  }
</script>

<audio 
  bind:this={audioRef} 
  src={url("/music/최정인 - Already Free (Exultation).flac")} 
  loop 
/>

<button 
  aria-label="Toggle Music" 
  title={isPlaying ? "Pause Music" : "Play Music"}
  class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 flex items-center justify-center" 
  on:click={toggle}
>
  {#if isPlaying}
    <Icon icon="material-symbols:music-note-rounded" class="text-[1.25rem] text-[var(--primary)] animate-pulse" />
  {:else}
    <Icon icon="material-symbols:music-off-rounded" class="text-[1.25rem]" />
  {/if}
</button>
