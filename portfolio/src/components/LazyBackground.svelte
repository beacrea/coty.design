<script lang="ts">
  import { onMount } from 'svelte';

  export let enhancedContrast = false;
  export let observationMode = false;

  let ready = false;

  onMount(() => {
    const start = () => { ready = true; };
    if ('requestIdleCallback' in window) {
      setTimeout(() => {
        (window as any).requestIdleCallback(start);
      }, 800);
    } else {
      setTimeout(start, 1200);
    }
  });
</script>

{#if ready}
  {#await import('./GenerativeBackground.svelte') then mod}
    <svelte:component this={mod.default} {enhancedContrast} {observationMode} />
  {/await}
{/if}
