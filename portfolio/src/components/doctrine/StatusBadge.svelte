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
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    white-space: nowrap;
    line-height: 1.4;
  }

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  @media (min-width: 640px) {
    .badge {
      font-size: 14px;
    }
    .dot {
      width: 6px;
      height: 6px;
    }
  }
</style>
