<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchLatestVersion, getFallbackVersion } from '../lib/github-version';

  export let legal: string;
  export let version: string;
  export let versionUrl: string;

  onMount(async () => {
    const latest = await fetchLatestVersion();
    version = latest.version;
    versionUrl = latest.versionUrl;
  });
</script>

<footer class="footer animate-entrance">
  <span class="legal">{legal}</span>
  <a href={versionUrl} target="_blank" rel="noopener noreferrer" class="version" aria-label="View changelog, {version}">{version}<span class="sr-only"> (opens in new tab)</span></a>
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
