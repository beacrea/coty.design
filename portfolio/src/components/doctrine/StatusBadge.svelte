<script lang="ts">
  import { theme } from '../../stores/theme';
  import { getStatusColor, getStatusColorDark } from '../../lib/doctrine';

  export let status: string;

  $: isDark = $theme === 'dark';
  $: colors = isDark ? getStatusColorDark(status) : getStatusColor(status);
</script>

<span
  class="badge"
  style="background-color: {colors.bg}; color: {colors.fg};"
>
  <span class="dot" style="background-color: {colors.dot};"></span>
  {status}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: var(--text-size-caption);
    font-weight: 600;
    letter-spacing: 0.02em;
    white-space: nowrap;
    line-height: 1.4;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
</style>
