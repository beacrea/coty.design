<script lang="ts">
  import { theme } from '../../stores/theme';
  import { confidenceLevel, getStatusColor, getStatusColorDark } from '../../lib/doctrine';

  export let status: string;
  export let maxDots: number = 5;

  $: level = confidenceLevel(status);
  $: isDark = $theme === 'dark';
  $: colors = isDark ? getStatusColorDark(status) : getStatusColor(status);
</script>

<div class="meter" aria-label="Confidence: {level} of {maxDots}">
  {#each Array(maxDots) as _, i}
    <span
      class="dot"
      class:filled={i < level}
      style={i < level ? `background-color: ${colors.dot};` : ''}
    ></span>
  {/each}
</div>

<style>
  .meter {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: oklch(0.85 0 0);
    transition: background-color 200ms;
  }

  :global(.dark) .dot:not(.filled) {
    background-color: oklch(0.30 0 0);
  }
</style>
