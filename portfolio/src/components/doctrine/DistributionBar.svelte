<script lang="ts">
  import { theme } from '../../stores/theme';
  import type { Claim } from '../../lib/doctrine';
  import { getStatusColor, getStatusColorDark, confidenceLevel } from '../../lib/doctrine';

  export let claims: Claim[];
  export let statusDefinitions: Record<string, string> = {};

  interface StatusGroup {
    status: string;
    count: number;
    color: string;
    definition: string;
  }

  $: isDark = $theme === 'dark';

  $: groups = (() => {
    const counts: Record<string, number> = {};
    for (const c of claims) {
      counts[c.status] = (counts[c.status] || 0) + 1;
    }
    const result: StatusGroup[] = [];
    for (const [status, count] of Object.entries(counts)) {
      const colors = isDark ? getStatusColorDark(status) : getStatusColor(status);
      result.push({
        status,
        count,
        color: colors.dot,
        definition: statusDefinitions[status] ?? '',
      });
    }
    result.sort((a, b) => {
      const levelDiff = confidenceLevel(a.status) - confidenceLevel(b.status);
      if (levelDiff !== 0) return levelDiff;
      return a.status.localeCompare(b.status);
    });
    return result;
  })();

  $: total = claims.length;

  let openPopover: string | null = null;
  let hoveredPopover: string | null = null;
  let popoverStyle = '';
  // Guards against the synthetic click that fires after touchstart
  let touchJustFired = false;

  $: visiblePopover = openPopover ?? hoveredPopover;

  /**
   * Compute a clamped horizontal offset for the popover so it stays
   * within the viewport. Returns an inline style string.
   */
  function computePopoverStyle(wrapperEl: HTMLElement): string {
    const MARGIN = 8;
    const MAX_WIDTH = 260;
    const vw = window.innerWidth;
    const rect = wrapperEl.getBoundingClientRect();
    const iconCenterX = rect.left + rect.width / 2;
    const popoverWidth = Math.min(MAX_WIDTH, vw - MARGIN * 2);
    let left = iconCenterX - popoverWidth / 2;
    left = Math.max(MARGIN, Math.min(left, vw - popoverWidth - MARGIN));
    const offsetLeft = left - rect.left;
    return `left: ${offsetLeft}px; width: ${popoverWidth}px; transform: none;`;
  }

  function handleIconClick(status: string, event: MouseEvent) {
    // Suppress the synthetic click that browsers fire after touchstart
    if (touchJustFired) {
      touchJustFired = false;
      event.stopPropagation();
      return;
    }
    event.stopPropagation();
    const wrapper = (event.currentTarget as HTMLElement).closest('.info-wrapper') as HTMLElement;
    if (openPopover === status) {
      openPopover = null;
    } else {
      popoverStyle = computePopoverStyle(wrapper);
      openPopover = status;
    }
  }

  function handleIconTouchStart(status: string, event: TouchEvent) {
    event.preventDefault();
    event.stopPropagation();
    touchJustFired = true;
    // Clear the flag after the synthetic-click window (~350ms)
    setTimeout(() => { touchJustFired = false; }, 400);
    const wrapper = (event.currentTarget as HTMLElement).closest('.info-wrapper') as HTMLElement;
    if (openPopover === status) {
      openPopover = null;
    } else {
      popoverStyle = computePopoverStyle(wrapper);
      openPopover = status;
    }
  }

  function handleMouseEnter(status: string, event: MouseEvent) {
    const wrapper = (event.currentTarget as HTMLElement).closest('.info-wrapper') as HTMLElement;
    popoverStyle = computePopoverStyle(wrapper);
    hoveredPopover = status;
  }

  function handleFocus(status: string, event: FocusEvent) {
    const wrapper = (event.currentTarget as HTMLElement).closest('.info-wrapper') as HTMLElement;
    popoverStyle = computePopoverStyle(wrapper);
    hoveredPopover = status;
  }

  function handleOutsideInteraction() {
    openPopover = null;
  }
</script>

<svelte:window on:click={handleOutsideInteraction} on:touchstart={handleOutsideInteraction} />

<div class="distribution">
  <div class="bar">
    {#each groups as group}
      <div
        class="segment"
        style="flex: {group.count}; background-color: {group.color};"
        title="{group.status}: {group.count}"
      ></div>
    {/each}
  </div>
  <div class="legend">
    {#each groups as group}
      <div class="legend-item">
        <span class="legend-dot" style="background-color: {group.color};"></span>
        <span class="legend-label">{group.status} ({group.count})</span>
        {#if group.definition}
          <span class="info-wrapper">
            <button
              class="info-tap-target"
              aria-label="{group.status} definition"
              aria-expanded={visiblePopover === group.status}
              on:click={(e) => handleIconClick(group.status, e)}
              on:touchstart={(e) => handleIconTouchStart(group.status, e)}
              on:mouseenter={(e) => handleMouseEnter(group.status, e)}
              on:mouseleave={() => { hoveredPopover = null; }}
              on:focus={(e) => handleFocus(group.status, e)}
              on:blur={() => { hoveredPopover = null; }}
            >
              <span class="info-icon">?</span>
            </button>
            {#if visiblePopover === group.status}
              <span class="popover" role="tooltip" style={popoverStyle}>{group.definition}</span>
            {/if}
          </span>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .distribution {
    width: 100%;
  }

  .bar {
    display: flex;
    height: 10px;
    border-radius: 5px;
    overflow: hidden;
    gap: 2px;
  }

  .segment {
    min-width: 8px;
    transition: flex 300ms;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 10px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .legend-label {
    font-size: 11px;
    color: var(--semantic-caption);
  }

  .info-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }

  /* 44×44 invisible tap target that wraps the 13×13 visual icon */
  .info-tap-target {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    flex-shrink: 0;
    /* Collapse the excess spacing so the legend gap stays visually tight */
    margin: -15px -15px;
  }

  .info-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: var(--semantic-caption);
    color: var(--surface-card-bg);
    font-size: 9px;
    font-weight: 700;
    flex-shrink: 0;
    opacity: 0.65;
    line-height: 1;
    pointer-events: none;
  }

  .info-tap-target:hover .info-icon,
  .info-tap-target:focus-visible .info-icon,
  .info-tap-target[aria-expanded='true'] .info-icon {
    opacity: 1;
  }

  .popover {
    position: absolute;
    bottom: calc(100% + 8px);
    /* horizontal placement is applied via inline style (JS-computed) */
    background: var(--surface-card-bg, #fff);
    color: var(--semantic-body, #333);
    border: 1px solid var(--border-subtle, #ccc);
    border-radius: 6px;
    padding: 8px 10px;
    font-size: 11px;
    line-height: 1.4;
    white-space: normal;
    overflow-wrap: break-word;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
    pointer-events: none;
  }
</style>
