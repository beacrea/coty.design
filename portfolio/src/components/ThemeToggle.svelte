<script lang="ts">
  import { theme } from '../stores/theme';

  $: isDark = $theme === 'dark';
  
  function handleToggle() {
    theme.toggle();
  }
</script>

<button 
  class="toggle" 
  class:dark={isDark}
  on:click={handleToggle}
  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
  {#if isDark}
    <svg class="icon moon" viewBox="3 -1 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25.182 11.3833C25.0695 13.4667 24.356 15.4729 23.1276 17.1594C21.8993 18.8459 20.2088 20.1405 18.2604 20.8867C16.312 21.633 14.1891 21.7988 12.1485 21.3643C10.1078 20.9298 8.2367 19.9135 6.76131 18.4383C5.28592 16.963 4.26942 15.092 3.8347 13.0514C3.39997 11.0108 3.56563 8.8879 4.31165 6.9395C5.05767 4.991 6.3521 3.3003 8.03849 2.0718C9.72487 0.8433 11.731 0.1296 13.8144 0.0169C14.3004 -0.0095 14.5548 0.5689 14.2968 0.9805C13.4338 2.3612 13.0643 3.9935 13.248 5.6169C13.4317 7.2403 14.1587 8.7565 15.3208 9.9187C16.483 11.0808 17.9992 11.8078 19.6226 11.9915C21.246 12.1752 22.8783 11.8057 24.259 10.9427C24.6706 10.6847 25.2084 10.9391 25.182 11.3833Z" fill="#6366F1" style="fill:color(display-p3 0.3882 0.4000 0.9451);"/>
      <path d="M19.6483 5.8426C18.8672 5.0615 18.8672 3.7952 19.6483 3.0142C20.4293 2.2331 21.6957 2.2331 22.4767 3.0142C23.2578 3.7952 23.2578 5.0615 22.4767 5.8426C21.6957 6.6236 20.4293 6.6236 19.6483 5.8426Z" fill="#C5CAFF" style="fill:color(display-p3 0.7725 0.7922 1.0000);"/>
    </svg>
  {:else}
    <svg class="icon sun" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="4" fill="#FFF1E6" stroke="#F38034" style="fill:color(display-p3 1.0000 0.9451 0.9020);stroke:color(display-p3 0.9549 0.5007 0.2030);" stroke-width="1.5"/>
      <line x1="12" y1="2" x2="12" y2="5" stroke="#F9A825" style="stroke:color(display-p3 0.9765 0.6588 0.1451);" stroke-width="2" stroke-linecap="round"/>
      <line x1="12" y1="19" x2="12" y2="22" stroke="#F9A825" style="stroke:color(display-p3 0.9765 0.6588 0.1451);" stroke-width="2" stroke-linecap="round"/>
      <line x1="2" y1="12" x2="5" y2="12" stroke="#F9A825" style="stroke:color(display-p3 0.9765 0.6588 0.1451);" stroke-width="2" stroke-linecap="round"/>
      <line x1="19" y1="12" x2="22" y2="12" stroke="#F9A825" style="stroke:color(display-p3 0.9765 0.6588 0.1451);" stroke-width="2" stroke-linecap="round"/>
      <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" stroke="#F9A825" style="stroke:color(display-p3 0.9765 0.6588 0.1451);" stroke-width="2" stroke-linecap="round"/>
      <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" stroke="#F9A825" style="stroke:color(display-p3 0.9765 0.6588 0.1451);" stroke-width="2" stroke-linecap="round"/>
      <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" stroke="#F9A825" style="stroke:color(display-p3 0.9765 0.6588 0.1451);" stroke-width="2" stroke-linecap="round"/>
      <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" stroke="#F9A825" style="stroke:color(display-p3 0.9765 0.6588 0.1451);" stroke-width="2" stroke-linecap="round"/>
    </svg>
  {/if}
</button>

<style>
  .toggle {
    width: var(--toggle-size);
    height: var(--toggle-size);
    border-radius: 50%;
    border: var(--toggle-border-width) solid var(--toggle-border);
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color var(--transition-toggle), transform var(--transition-toggle);
    z-index: 100;
    flex-shrink: 0;
  }

  .toggle:hover {
    transform: scale(1.05);
  }

  .toggle:active {
    transform: scale(0.95);
  }

  .icon {
    width: var(--icon-size);
    height: var(--icon-size);
    transition: transform var(--transition-toggle);
  }

  .sun {
    animation: spin-in 0.3s ease-out;
  }

  .moon {
    animation: fade-in 0.3s ease-out;
  }

  @keyframes spin-in {
    from {
      transform: rotate(-90deg) scale(0.5);
      opacity: 0;
    }
    to {
      transform: rotate(0deg) scale(1);
      opacity: 1;
    }
  }

  @keyframes fade-in {
    from {
      transform: scale(0.5);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
