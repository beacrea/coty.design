<script lang="ts">
  import { onMount } from 'svelte';
  import { theme } from '../../stores/theme';
  import { route } from '../../stores/router';
  import { fetchDoctrine, type DoctrineData } from '../../lib/doctrine';
  import DoctrineDashboard from './DoctrineDashboard.svelte';
  import ClaimDetail from './ClaimDetail.svelte';

  let data: DoctrineData | null = null;
  let error: string | null = null;
  let loading = true;

  $: isDark = $theme === 'dark';

  onMount(async () => {
    try {
      data = await fetchDoctrine();
    } catch (e) {
      error = 'Failed to load doctrine data.';
    } finally {
      loading = false;
    }
  });

  $: currentClaim = (() => {
    if (!data || $route.page !== 'claim-detail' || !$route.claimId) return null;
    return data.claims.find(c => c.id === $route.claimId) ?? null;
  })();
</script>

<div class="doctrine-page" class:dark={isDark}>
  {#if loading}
    <div class="loading">
      <p>Loading doctrine…</p>
    </div>
  {:else if error}
    <div class="error">
      <p>{error}</p>
    </div>
  {:else if data}
    {#if $route.page === 'claim-detail' && $route.claimId}
      {#if currentClaim}
        <ClaimDetail claim={currentClaim} />
      {:else}
        <div class="not-found">
          <nav class="back-nav">
            <a href="/doctrine" data-route>← Back to Doctrine</a>
          </nav>
          <p>Claim not found.</p>
        </div>
      {/if}
    {:else}
      <DoctrineDashboard {data} />
    {/if}
  {/if}
</div>

<style>
  .doctrine-page {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    padding: var(--page-padding-top) var(--page-padding-right) var(--page-padding-bottom) var(--page-padding-x);
  }

  .loading,
  .error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 40vh;
    font-size: var(--text-size-body);
    color: var(--semantic-caption);
  }

  .error {
    color: oklch(0.55 0.18 25);
  }

  .not-found {
    max-width: var(--content-max-width);
    margin: 0 auto;
  }

  .not-found .back-nav {
    margin-bottom: 24px;
  }

  .not-found .back-nav a {
    font-size: var(--text-size-caption);
    color: var(--semantic-link);
    text-decoration: none;
  }

  .not-found p {
    font-size: var(--text-size-body);
    color: var(--semantic-caption);
  }
</style>
