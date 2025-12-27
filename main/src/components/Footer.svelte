<script lang="ts">
  export let legal: string;
  export let version: string;
  export let changelogUrl: string = "https://github.com/beacrea/coty-design/blob/main/CHANGELOG.md";
</script>

<footer class="footer">
  <span class="legal">{legal}</span>
  <a href={changelogUrl} target="_blank" rel="noopener noreferrer" class="version">{version}</a>
</footer>

<style>
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--section-spacing);
  }

  .legal {
    font-size: var(--text-size-caption);
    font-weight: 400;
    color: var(--semantic-caption);
    transition: color var(--transition-theme);
  }

  .version {
    font-size: var(--text-size-caption);
    font-weight: 400;
    color: var(--semantic-caption);
    text-decoration: none;
    transition: color var(--transition-theme);
  }

  .version:hover {
    color: var(--semantic-link);
  }
</style>
