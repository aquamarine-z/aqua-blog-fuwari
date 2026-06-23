<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { musicStore } from '../stores/musicStore';
  import Icon from '@iconify/svelte';
  import { url } from '../utils/url-utils';
  import { fade, fly } from 'svelte/transition';
  import I18nKey from '../i18n/i18nKey';
  import { i18n } from '../i18n/translation';

  let audioRef: HTMLAudioElement;
  let containerRef: HTMLDivElement;
  
  export let lang = 'zh_CN';
  let showCard = false;
  let closeTimeout: ReturnType<typeof setTimeout>;
  let isDragging = false;
  let dragValue = 0;
  let lastVolume = 0.15;

  // Touch and Long-press detection variables
  let isTouchDevice = false;
  let isTouchActive = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchTimeout: ReturnType<typeof setTimeout>;
  let showTimeout: ReturnType<typeof setTimeout>;
  let longPressed = false;


  // Subscribe to Zustand store changes using Svelte store contract for robust reactivity
  const store = {
    subscribe(run: (value: any) => void) {
      run(musicStore.getState());
      return musicStore.subscribe(run);
    }
  };

  onDestroy(() => {
    if (closeTimeout) clearTimeout(closeTimeout);
    if (touchTimeout) clearTimeout(touchTimeout);
    if (showTimeout) clearTimeout(showTimeout);
    if (typeof window !== 'undefined') {
      window.removeEventListener('click', handleClickOutside);
    }
  });

  onMount(() => {
    if (audioRef) {
      audioRef.volume = $store.volume;
      const currentTrack = $store.playlist[$store.currentTrackIndex];
      if (currentTrack) {
        audioRef.src = url(currentTrack.src);
      }
      
      // Attempt play on mount if active (subject to browser policies)
      if ($store.isPlaying) {
        audioRef.play().catch(() => {
          musicStore.getState().setPlaying(false);
        });
      }
    }
    
    window.addEventListener('click', handleClickOutside);
  });

  // Keep audio ref properties in sync with store playing/volume states
  $: if (audioRef) {
    if ($store.isPlaying && audioRef.paused) {
      audioRef.play().catch(() => {
        musicStore.getState().setPlaying(false);
      });
    } else if (!$store.isPlaying && !audioRef.paused) {
      audioRef.pause();
    }

    if (audioRef.volume !== $store.volume) {
      audioRef.volume = $store.volume;
    }
  }

  // Handle Track Changes
  let currentSrc = '';
  $: {
    const currentTrack = $store.playlist[$store.currentTrackIndex];
    const nextSrc = currentTrack ? url(currentTrack.src) : '';
    if (audioRef && nextSrc && currentSrc !== nextSrc) {
      currentSrc = nextSrc;
      audioRef.src = nextSrc;
      audioRef.load();
      if ($store.isPlaying) {
        audioRef.play().catch(() => {
          musicStore.getState().setPlaying(false);
        });
      }
    }
  }

  // Audio Event Handlers
  function handleTimeUpdate() {
    if (!audioRef || isDragging) return;
    musicStore.getState().setCurrentTime(audioRef.currentTime);
  }

  function handleDurationChange() {
    if (!audioRef) return;
    musicStore.getState().setDuration(audioRef.duration);
  }

  function handleEnded() {
    if ($store.playlist.length > 1) {
      musicStore.getState().nextTrack();
    } else {
      // Loop single track
      if (audioRef) {
        audioRef.currentTime = 0;
        audioRef.play().catch(() => {});
      }
    }
  }

  // UI Interactive Handlers - PC Hover
  function showCardDelayed(e: MouseEvent) {
    if (isTouchDevice) return; // Ignore hover events on touch devices
    if (closeTimeout) clearTimeout(closeTimeout);
    if (showTimeout) clearTimeout(showTimeout);

    showTimeout = setTimeout(() => {
      showCard = true;
    }, 1000); // Show only after 1 second (1000ms) of hover
  }

  function hideCardDelayed() {
    if (isTouchDevice) return;
    if (showTimeout) clearTimeout(showTimeout);
    if (closeTimeout) clearTimeout(closeTimeout);
    
    closeTimeout = setTimeout(() => {
      showCard = false;
    }, 100); // 100ms delay to prevent accidental closing
  }

  function cancelHideCard() {
    if (closeTimeout) clearTimeout(closeTimeout);
  }

  // UI Interactive Handlers - Touch / Mobile
  function handleTouchStart(e: TouchEvent) {
    isTouchDevice = true;
    isTouchActive = true;
    longPressed = false;
    
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

    if (touchTimeout) clearTimeout(touchTimeout);
    touchTimeout = setTimeout(() => {
      if (isTouchActive) {
        showCard = !showCard; // Toggle card on long press
        longPressed = true;
        
        // Mobile vibration feedback on successful long press
        if (navigator.vibrate) {
          try {
            navigator.vibrate(50);
          } catch (err) {}
        }
      }
    }, 1000); // 1000ms long press threshold
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isTouchActive) return;
    const touch = e.touches[0];
    const diffX = Math.abs(touch.clientX - touchStartX);
    const diffY = Math.abs(touch.clientY - touchStartY);
    
    // Cancel long press if finger moved significantly (scroll/swipe)
    if (diffX > 10 || diffY > 10) {
      isTouchActive = false;
      if (touchTimeout) clearTimeout(touchTimeout);
    }
  }

  function handleTouchEnd(e: TouchEvent) {
    if (touchTimeout) clearTimeout(touchTimeout);
    
    if (isTouchActive) {
      isTouchActive = false;
      e.preventDefault(); // Prevent synthetic click
      
      if (!longPressed) {
        togglePlay(); // Short tap toggles playback
      }
    }
  }

  // UI Interactive Handlers - Mouse Click
  function handleMouseClick(e: MouseEvent) {
    // Only execute play/pause if not handled by touch events
    if (e.button === 0) { // Left click
      togglePlay();
    }
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;
    if (
      showCard && 
      containerRef && 
      !containerRef.contains(target) &&
      document.body.contains(target)
    ) {
      showCard = false;
    }
  }

  function handleSeekInput(e: Event) {
    isDragging = true;
    const target = e.target as HTMLInputElement;
    dragValue = parseFloat(target.value);
    musicStore.getState().setCurrentTime(dragValue);
  }

  function handleSeekChange(e: Event) {
    isDragging = false;
    const target = e.target as HTMLInputElement;
    const val = parseFloat(target.value);
    if (audioRef) {
      audioRef.currentTime = val;
      musicStore.getState().setCurrentTime(val);
    }
  }

  function handleVolumeSlider(e: Event) {
    const target = e.target as HTMLInputElement;
    const val = parseFloat(target.value);
    musicStore.getState().setVolume(val);
  }

  function toggleMute() {
    if ($store.volume > 0) {
      lastVolume = $store.volume;
      musicStore.getState().setVolume(0);
    } else {
      musicStore.getState().setVolume(lastVolume || 0.15);
    }
  }

  function togglePlay() {
    musicStore.getState().togglePlay();
  }

  function formatTime(secs: number) {
    if (isNaN(secs)) return '00:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
</script>



<!-- Audio Element -->
<audio 
  bind:this={audioRef}
  on:timeupdate={handleTimeUpdate}
  on:durationchange={handleDurationChange}
  on:ended={handleEnded}
  loop={$store.playlist.length <= 1}
/>

<!-- Wrapper with hover interaction -->
<div 
  bind:this={containerRef}
  class="relative flex items-center"
  on:mouseenter={showCardDelayed}
  on:mouseleave={hideCardDelayed}
  role="none"
>
  <!-- Collapsed state (Navbar Button) -->
  <button 
    aria-label="Toggle Music Player" 
    title={$store.isPlaying ? i18n(I18nKey.pauseMusic, lang) : i18n(I18nKey.playMusic, lang)}
    class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 flex items-center justify-center relative" 
    on:click={handleMouseClick}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
  >
    {#if $store.isPlaying}
      <div class="relative w-5 h-5 flex items-center justify-center">
        <!-- Slow rotating music note when playing -->
        <Icon icon="material-symbols:music-note-rounded" class="text-[1.25rem] text-[var(--primary)] animate-spin-slow" />
        <span class="absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-20 animate-ping"></span>
      </div>
    {:else}
      <Icon icon="material-symbols:music-off-rounded" class="text-[1.25rem]" />
    {/if}
  </button>

  <!-- Expanded State (Glassmorphic Player Card) -->
  {#if showCard}

    <!-- Safe Triangle SVG Overlay (Static) -->
    <svg 
      class="absolute pointer-events-none overflow-visible z-40" 
      style="top: 0; left: -244px; width: 288px; height: 48px;"
    >
      <polygon 
        points="244,0 288,0 288,48 0,48" 
        class="pointer-events-auto" 
        pointer-events="all"
        fill="transparent" 
      />
    </svg>

    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div 
      transition:fly={{ y: 10, duration: 200 }}
      class="absolute right-0 top-12 w-72 p-4 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-md z-50 flex flex-col gap-3 transition-colors"
      on:click|stopPropagation
      on:mouseenter={cancelHideCard}
    >
      <!-- Track Title & Music Visualization -->
      <div class="text-center min-w-0 py-1 flex flex-col items-center gap-2">
        <h4 class="text-sm font-semibold truncate text-neutral-800 dark:text-neutral-200 w-full px-2">
          {$store.playlist[$store.currentTrackIndex]?.title || 'Unknown Track'}
        </h4>
        
        <!-- Music Visualization Spectrum (12 Bars) -->
        <div class="h-8 flex items-end justify-center gap-[3px] w-full px-4" aria-hidden="true">
          {#if $store.isPlaying}
            <div class="w-[3px] bg-gradient-to-t from-[var(--primary)] to-[var(--primary)]/50 rounded-full eq-bar" style="animation-delay: 0.1s; animation-duration: 0.85s;"></div>
            <div class="w-[3px] bg-gradient-to-t from-[var(--primary)] to-[var(--primary)]/50 rounded-full eq-bar" style="animation-delay: 0.35s; animation-duration: 1.15s;"></div>
            <div class="w-[3px] bg-gradient-to-t from-[var(--primary)] to-[var(--primary)]/50 rounded-full eq-bar" style="animation-delay: 0.0s; animation-duration: 0.95s;"></div>
            <div class="w-[3px] bg-gradient-to-t from-[var(--primary)] to-[var(--primary)]/50 rounded-full eq-bar" style="animation-delay: 0.55s; animation-duration: 0.75s;"></div>
            <div class="w-[3px] bg-gradient-to-t from-[var(--primary)] to-[var(--primary)]/50 rounded-full eq-bar" style="animation-delay: 0.2s; animation-duration: 1.05s;"></div>
            <div class="w-[3px] bg-gradient-to-t from-[var(--primary)] to-[var(--primary)]/50 rounded-full eq-bar" style="animation-delay: 0.45s; animation-duration: 0.8s;"></div>
            <div class="w-[3px] bg-gradient-to-t from-[var(--primary)] to-[var(--primary)]/50 rounded-full eq-bar" style="animation-delay: 0.15s; animation-duration: 1.3s;"></div>
            <div class="w-[3px] bg-gradient-to-t from-[var(--primary)] to-[var(--primary)]/50 rounded-full eq-bar" style="animation-delay: 0.6s; animation-duration: 0.7s;"></div>
            <div class="w-[3px] bg-gradient-to-t from-[var(--primary)] to-[var(--primary)]/50 rounded-full eq-bar" style="animation-delay: 0.3s; animation-duration: 1.1s;"></div>
            <div class="w-[3px] bg-gradient-to-t from-[var(--primary)] to-[var(--primary)]/50 rounded-full eq-bar" style="animation-delay: 0.05s; animation-duration: 0.9s;"></div>
            <div class="w-[3px] bg-gradient-to-t from-[var(--primary)] to-[var(--primary)]/50 rounded-full eq-bar" style="animation-delay: 0.5s; animation-duration: 1.25s;"></div>
            <div class="w-[3px] bg-gradient-to-t from-[var(--primary)] to-[var(--primary)]/50 rounded-full eq-bar" style="animation-delay: 0.25s; animation-duration: 0.85s;"></div>
          {:else}
            {#each Array(12) as _}
              <div class="w-[3px] h-[3px] bg-neutral-200 dark:bg-neutral-800 rounded-full"></div>
            {/each}
          {/if}
        </div>
      </div>

      <!-- Timeline (Progress Slider) -->
      <div class="flex flex-col gap-1">
        <div class="flex justify-between text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
          <span>{formatTime($store.currentTime)}</span>
          <span>{formatTime($store.duration)}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max={$store.duration || 100} 
          value={$store.currentTime} 
          on:input={handleSeekInput}
          on:change={handleSeekChange}
          class="seek-bar"
        />
      </div>

      <!-- Controls & Volume Row -->
      <div class="grid grid-cols-3 items-center gap-2 pt-1 w-full">
        <!-- Quick indicator -->
        <span class="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 justify-self-start">
          {$store.currentTrackIndex + 1} / {$store.playlist.length}
        </span>

        <!-- Playback Controls -->
        <div class="flex items-center gap-3 justify-self-center">
          {#if $store.playlist.length > 1}
            <button 
              on:click={() => musicStore.getState().prevTrack()} 
              class="btn-icon text-neutral-600 dark:text-neutral-400 hover:text-[var(--primary)] active:scale-90 transition-all"
              aria-label="Previous Track"
            >
              <Icon icon="material-symbols:skip-previous-rounded" class="text-xl" />
            </button>
          {/if}

          <button 
            on:click={togglePlay} 
            class="p-2 rounded-full bg-[var(--primary)] hover:opacity-90 hover:scale-105 active:scale-95 text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center"
            aria-label={$store.isPlaying ? "Pause" : "Play"}
          >
            {#if $store.isPlaying}
              <Icon icon="material-symbols:pause-rounded" class="text-xl" />
            {:else}
              <Icon icon="material-symbols:play-arrow-rounded" class="text-xl" />
            {/if}
          </button>

          {#if $store.playlist.length > 1}
            <button 
              on:click={() => musicStore.getState().nextTrack()} 
              class="btn-icon text-neutral-600 dark:text-neutral-400 hover:text-[var(--primary)] active:scale-90 transition-all"
              aria-label="Next Track"
            >
              <Icon icon="material-symbols:skip-next-rounded" class="text-xl" />
            </button>
          {/if}
        </div>

        <!-- Volume Control (Always visible with fixed width to prevent layout shifts) -->
        <div class="flex items-center gap-1.5 volume-container justify-self-end">
          <button 
            on:click={toggleMute} 
            class="btn-icon text-neutral-600 dark:text-neutral-400 hover:text-[var(--primary)] active:scale-90 transition-all"
            aria-label="Toggle Mute"
          >
            {#if $store.volume === 0}
              <Icon icon="material-symbols:volume-off-rounded" class="text-base" />
            {:else if $store.volume < 0.4}
              <Icon icon="material-symbols:volume-down-rounded" class="text-base" />
            {:else}
              <Icon icon="material-symbols:volume-up-rounded" class="text-base" />
            {/if}
          </button>

          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={$store.volume} 
            on:input={handleVolumeSlider}
            class="volume-bar"
          />
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin-slow {
    animation: spin-slow 12s linear infinite;
  }

  @keyframes eq-bounce {
    0%, 100% { height: 4px; }
    50% { height: 28px; }
  }

  .eq-bar {
    animation-name: eq-bounce;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    height: 4px;
    width: 3px;
  }

  /* Custom Range Inputs (Seek & Volume) */
  input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    background: transparent;
  }

  input[type="range"]:focus {
    outline: none;
  }

  /* Seek bar specific track */
  .seek-bar::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 9999px;
  }
  :global(.dark) .seek-bar::-webkit-slider-runnable-track {
    background: rgba(255, 255, 255, 0.15);
  }
  .seek-bar::-webkit-slider-thumb {
    height: 12px;
    width: 12px;
    border-radius: 9999px;
    background: var(--primary);
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -4px;
    transition: transform 0.1s ease;
  }
  .seek-bar:hover::-webkit-slider-thumb {
    transform: scale(1.25);
  }

  .seek-bar::-moz-range-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 9999px;
  }
  :global(.dark) .seek-bar::-moz-range-track {
    background: rgba(255, 255, 255, 0.15);
  }
  .seek-bar::-moz-range-thumb {
    height: 12px;
    width: 12px;
    border: none;
    border-radius: 9999px;
    background: var(--primary);
    cursor: pointer;
    transition: transform 0.1s ease;
  }
  .seek-bar:hover::-moz-range-thumb {
    transform: scale(1.25);
  }

  /* Volume bar styles (fixed width to prevent layout shifts) */
  .volume-container {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .volume-bar {
    width: 3.5rem !important;
    opacity: 1;
    pointer-events: auto;
  }

  .volume-bar::-webkit-slider-runnable-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 9999px;
  }
  :global(.dark) .volume-bar::-webkit-slider-runnable-track {
    background: rgba(255, 255, 255, 0.15);
  }
  .volume-bar::-webkit-slider-thumb {
    height: 10px;
    width: 10px;
    border-radius: 9999px;
    background: var(--primary);
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -3.5px;
    transition: transform 0.1s ease;
  }
  .volume-bar:hover::-webkit-slider-thumb {
    transform: scale(1.2);
  }

  .volume-bar::-moz-range-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 9999px;
  }
  :global(.dark) .volume-bar::-moz-range-track {
    background: rgba(255, 255, 255, 0.15);
  }
  .volume-bar::-moz-range-thumb {
    height: 10px;
    width: 10px;
    border: none;
    border-radius: 9999px;
    background: var(--primary);
    cursor: pointer;
    transition: transform 0.1s ease;
  }
  .volume-bar:hover::-moz-range-thumb {
    transform: scale(1.2);
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .animate-spin-slow, .eq-bar {
      animation: none !important;
    }
    .seek-bar::-webkit-slider-thumb, .volume-bar::-webkit-slider-thumb,
    .seek-bar::-moz-range-thumb, .volume-bar::-moz-range-thumb {
      transition: none !important;
    }
  }
</style>
