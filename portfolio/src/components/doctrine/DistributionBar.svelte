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
</script>

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
          <span class="info-icon" aria-label="{group.status} definition" title={group.definition}>?</span>
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
    cursor: help;
    opacity: 0.65;
    line-height: 1;
  }

  .info-icon:hover {
    opacity: 1;
  }
</style>
