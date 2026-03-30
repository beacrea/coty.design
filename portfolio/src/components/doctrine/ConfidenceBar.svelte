<script lang="ts">
  import { theme } from '../../stores/theme';
  import { confidenceLevel } from '../../lib/doctrine';

  export let status: string;

  const segments = [
    { label: 'Proposed', level: 1 },
    { label: 'Active', level: 2 },
    { label: 'Emerging', level: 3 },
    { label: 'Supported', level: 4 },
    { label: 'Strongly Supported', level: 5 },
  ];

  $: currentLevel = confidenceLevel(status);
  $: isDark = $theme === 'dark';
</script>

<div class="bar-container">
  <div class="segments">
    {#each segments as seg}
      <div
        class="segment"
        class:active={seg.level <= currentLevel}
        class:dark={isDark}
      >
        <div class="segment-fill"></div>
        <span class="segment-label">{seg.label}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .bar-container {
    width: 100%;
  }

  .segments {
    display: flex;
    gap: 3px;
    width: 100%;
  }

  .segment {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
  }

  .segment-fill {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background-color: oklch(0.90 0 0);
    transition: background-color 300ms;
  }

  .segment.dark .segment-fill {
    background-color: oklch(0.25 0 0);
  }

  .segment.active .segment-fill {
    background-color: var(--semantic-link);
  }

  .segment-label {
    font-size: 10px;
    color: var(--semantic-caption);
    text-align: center;
    line-height: 1.2;
  }

  @media (max-width: 639px) {
    .segment-label {
      font-size: 8px;
    }
  }
</style>
