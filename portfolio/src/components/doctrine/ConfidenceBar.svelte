<script lang="ts">
  import { theme } from '../../stores/theme';
  import { confidenceLevel } from '../../lib/doctrine';

  export let status: string;
  export let statusDefinitions: Record<string, string> = {};

  const segments = [
    { label: 'Proposed', level: 1 },
    { label: 'Active', level: 2 },
    { label: 'Emerging', level: 3 },
    { label: 'Supported', level: 4 },
    { label: 'Strongly Supported', level: 5 },
  ];

  const definitionKeys: Record<string, string> = {
    'Proposed': 'Proposed',
    'Active': 'Active',
    'Emerging': 'Emerging',
    'Supported': 'Supported',
    'Strongly Supported': 'Strongly supported',
  };

  $: currentLevel = confidenceLevel(status);
  $: isDark = $theme === 'dark';

  let activeTooltip: string | null = null;

  function toggleTooltip(label: string) {
    activeTooltip = activeTooltip === label ? null : label;
  }

  function handleKeydown(e: KeyboardEvent, label: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTooltip(label);
    }
    if (e.key === 'Escape') {
      activeTooltip = null;
    }
  }

  function getDefinition(label: string): string {
    const key = definitionKeys[label] ?? label;
    return statusDefinitions[key] ?? '';
  }

  function handleOutsideClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('.segment')) {
      activeTooltip = null;
    }
  }
</script>

<svelte:window on:click={handleOutsideClick} />

<div class="bar-container">
  <div class="segments">
    {#each segments as seg}
      <div
        class="segment"
        class:active={seg.level <= currentLevel}
        class:dark={isDark}
      >
        <div class="segment-fill"></div>
        {#if getDefinition(seg.label)}
          <button
            class="segment-label has-tooltip"
            class:tooltip-open={activeTooltip === seg.label}
            on:click|stopPropagation={() => toggleTooltip(seg.label)}
            on:keydown={(e) => handleKeydown(e, seg.label)}
            aria-expanded={activeTooltip === seg.label}
            aria-describedby="tooltip-{seg.level}"
          >
            {seg.label}
            <span
              class="tooltip"
              class:visible={activeTooltip === seg.label}
              id="tooltip-{seg.level}"
              role="tooltip"
            >
              {getDefinition(seg.label)}
            </span>
          </button>
        {:else}
          <span class="segment-label">{seg.label}</span>
        {/if}
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
    position: relative;
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

  button.segment-label {
    background: none;
    border: none;
    padding: 2px 4px;
    margin: -2px -4px;
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
    text-decoration-line: underline;
    text-decoration-style: dotted;
    text-decoration-color: var(--semantic-caption);
    text-underline-offset: 2px;
    text-decoration-thickness: 1px;
    transition: background-color 150ms;
  }

  @media (hover: hover) {
    button.segment-label:hover {
      background-color: oklch(0 0 0 / 0.05);
    }

    button.segment-label:hover .tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }

    :global(.dark) button.segment-label:hover {
      background-color: oklch(1 0 0 / 0.08);
    }
  }

  button.segment-label:focus-visible {
    outline: 2px solid var(--semantic-link);
    outline-offset: 1px;
  }

  .tooltip {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    width: max-content;
    max-width: 220px;
    padding: 8px 12px;
    background: var(--foreground);
    color: var(--background);
    font-size: 12px;
    font-weight: 400;
    line-height: 1.5;
    border-radius: 6px;
    text-align: left;
    text-transform: none;
    letter-spacing: 0;
    text-decoration: none;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transition: opacity 150ms, visibility 150ms, transform 150ms;
    z-index: 10;
    white-space: normal;
  }

  .tooltip::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-bottom-color: var(--foreground);
  }

  .tooltip.visible {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
    pointer-events: auto;
  }

  @media (max-width: 639px) {
    .segment-label {
      font-size: 8px;
    }

    .tooltip {
      position: fixed;
      top: auto;
      bottom: 24px;
      left: 16px;
      right: 16px;
      transform: none;
      max-width: none;
      width: auto;
      font-size: 13px;
      padding: 12px 16px;
      box-shadow: 0 -2px 12px oklch(0 0 0 / 0.15);
    }

    .tooltip::before {
      display: none;
    }

    .tooltip.visible {
      transform: none;
    }
  }
</style>
