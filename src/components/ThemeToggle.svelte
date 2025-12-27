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
    <svg class="icon moon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
        fill="var(--toggle-fill)"
        stroke="var(--toggle-stroke)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  {:else}
    <svg class="icon sun" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle 
        cx="12" 
        cy="12" 
        r="5" 
        fill="var(--toggle-fill)"
        stroke="var(--toggle-stroke)"
        stroke-width="2"
      />
      <g stroke="var(--toggle-rays)" stroke-width="2" stroke-linecap="round">
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  {/if}
</button>

<style>
  .toggle {
    position: fixed;
    top: var(--page-padding-top);
    right: var(--page-padding-x);
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
