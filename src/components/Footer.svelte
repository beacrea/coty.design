<script lang="ts">
  export let legal: string;
  export let version: string;
</script>

<footer class="footer">
  <span class="legal">{legal}</span>
  <span class="version">{version}</span>
</footer>

<style>
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--section-spacing);
  }

  .legal,
  .version {
    font-size: var(--text-size-caption);
    font-weight: 400;
    color: var(--semantic-caption);
    transition: color var(--transition-theme);
  }
</style>
