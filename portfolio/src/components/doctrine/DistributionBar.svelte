<script lang="ts">
  import { theme } from '../../stores/theme';
  import type { Claim } from '../../lib/doctrine';
  import { getStatusColor, getStatusColorDark } from '../../lib/doctrine';

  export let claims: Claim[];

  interface StatusGroup {
    status: string;
    count: number;
    color: string;
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
      result.push({ status, count, color: colors.dot });
    }
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
</style>
