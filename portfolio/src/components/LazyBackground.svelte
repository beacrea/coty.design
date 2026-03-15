<script lang="ts">
  import { onMount } from 'svelte';

  export let enhancedContrast = false;
  export let observationMode = false;

  let mounted = false;

  onMount(() => {
    mounted = true;
  });
</script>

{#if mounted}
  {#await import('./GenerativeBackground.svelte') then mod}
    <svelte:component this={mod.default} {enhancedContrast} {observationMode} />
  {/await}
{/if}
