<script lang="ts">
  import { theme } from '../../stores/theme';
  import { navigateTo } from '../../stores/router';
  import type { DoctrineData } from '../../lib/doctrine';
  import StatusBadge from './StatusBadge.svelte';
  import DistributionBar from './DistributionBar.svelte';

  export let data: DoctrineData;

  $: isDark = $theme === 'dark';

  function goToClaim(claimId: string) {
    navigateTo(`/doctrine/${claimId}`);
  }
</script>

<div class="doctrine-dashboard" class:dark={isDark}>
  <nav class="back-nav">
    <a href="/" data-route aria-label="Back to portfolio">← Back</a>
  </nav>

  <header class="doctrine-header">
    <h1 class="doctrine-title">Doctrine</h1>
    <p class="doctrine-subtitle">{data.name.replace('Doctrine: ', '')}</p>
    <p class="doctrine-attribution">Coty Beasley's predicted evolutions in AI-assisted development: positions he has taken and is actively tracking against real-world evidence.</p>
    <div class="doctrine-meta">
      <span>v{data.version.replace('v', '')}</span>
      <span>·</span>
      <span>Updated {data.dateModified}</span>
      <span>·</span>
      <span>{data.reviewCadence} review</span>
    </div>
  </header>

  <section class="thesis-banner">
    <h2 class="section-label">Core Thesis</h2>
    <blockquote class="thesis-text">{data.thesis}</blockquote>
  </section>

  <section class="distribution-section">
    <h2 class="section-label">Evidence Confidence Distribution</h2>
    <DistributionBar claims={data.claims} statusDefinitions={data.statusDefinitions} />
  </section>

  <section class="claims-section">
    <h2 class="section-label">Claims ({data.claims.length})</h2>
    <div class="claims-grid">
      {#each data.claims as claim}
        <button
          class="claim-card"
          on:click={() => goToClaim(claim.id)}
          aria-label="View claim {claim.claimNumber}: {claim.title}"
        >
          <div class="card-header">
            <span class="claim-number">#{claim.claimNumber}</span>
            <StatusBadge status={claim.status} />
          </div>
          <h3 class="claim-title">{claim.title}</h3>
          <p class="claim-preview">{claim.statement}</p>
          <div class="card-footer">
            <div class="evidence-summary">
              <span class="evidence-label">{claim.supportingSignals.length} supporting</span>
              {#if claim.challenges.length > 0}
                <span class="evidence-sep">·</span>
                <span class="evidence-label">{claim.challenges.length} {claim.challenges.length === 1 ? 'challenge' : 'challenges'}</span>
              {/if}
            </div>
            <span class="view-details">View details →</span>
          </div>
        </button>
      {/each}
    </div>
  </section>

  <section class="definitions-section">
    <h2 class="section-label">Working Definitions</h2>
    <dl class="definitions-list">
      {#each data.definitions as def}
        <div class="definition-item">
          <dt class="def-term">{def.term}</dt>
          <dd class="def-desc">{def.description}</dd>
        </div>
      {/each}
    </dl>
  </section>

  <footer class="doctrine-footer">
    <div class="footer-content">
      <p class="footer-author">
        {data.author.name} · {data.author.affiliation.name}
      </p>
      <p class="footer-cadence">
        Review cadence: {data.reviewCadence} · Status: {data.status}
      </p>
    </div>
  </footer>
</div>

<style>
  .doctrine-dashboard {
    max-width: var(--content-max-width);
    margin: 0 auto;
  }

  .back-nav {
    margin-bottom: 24px;
  }

  .back-nav a {
    font-size: var(--text-size-caption);
    color: var(--semantic-link);
    text-decoration: none;
  }

  .back-nav a:hover {
    text-decoration: underline;
  }

  .doctrine-header {
    margin-bottom: var(--section-spacing);
  }

  .doctrine-title {
    font-size: var(--text-size-title);
    font-weight: 680;
    color: var(--semantic-title);
    line-height: 1.1;
    margin-bottom: 8px;
  }

  .doctrine-subtitle {
    font-size: var(--text-size-body);
    color: var(--semantic-body);
    line-height: 1.5;
    margin-bottom: 8px;
  }

  .doctrine-attribution {
    font-size: var(--text-size-caption);
    color: var(--semantic-caption);
    line-height: 1.5;
    margin-bottom: 12px;
    font-style: italic;
  }

  .doctrine-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-size: var(--text-size-caption);
    color: var(--semantic-caption);
  }

  .section-label {
    font-size: var(--text-size-caption);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--semantic-caption);
    margin-bottom: 12px;
  }

  .thesis-banner {
    margin-bottom: var(--section-spacing);
    padding: 20px 24px;
    border-left: 3px solid var(--semantic-link);
    background: var(--surface-card-bg);
    border-radius: 0 8px 8px 0;
  }

  .thesis-text {
    font-size: var(--text-size-body);
    color: var(--semantic-body);
    line-height: 1.6;
    font-style: italic;
    margin: 0;
  }

  .distribution-section {
    margin-bottom: var(--section-spacing);
  }

  .claims-section {
    margin-bottom: var(--section-spacing);
  }

  .claims-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .claim-card {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 24px;
    background: var(--surface-card-bg);
    border: 1px solid var(--surface-card-border);
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    transition: transform 200ms, border-color 200ms;
    width: 100%;
  }

  .claim-card:hover {
    transform: translateY(-1px);
    border-color: var(--semantic-link);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .claim-number {
    font-size: var(--text-size-caption);
    font-weight: 700;
    color: var(--semantic-caption);
  }

  .claim-title {
    font-size: var(--text-size-body);
    font-weight: 600;
    color: var(--semantic-body);
    line-height: 1.4;
    text-wrap: pretty;
  }

  .claim-preview {
    font-size: var(--text-size-caption);
    color: var(--semantic-caption);
    line-height: 1.6;
    flex: 1;
    text-wrap: pretty;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 4px;
    padding-top: 14px;
    border-top: 1px solid var(--surface-card-border);
  }

  .evidence-summary {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: var(--semantic-caption);
  }

  .evidence-sep {
    color: var(--semantic-caption);
  }

  .view-details {
    font-size: 14px;
    font-weight: 600;
    color: var(--semantic-link);
  }

  .definitions-section {
    margin-bottom: var(--section-spacing);
  }

  .definitions-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .definition-item {
    padding: 14px 16px;
    background: var(--surface-card-bg);
    border-radius: 8px;
    border: 1px solid var(--surface-card-border);
  }

  .def-term {
    font-size: var(--text-size-body);
    font-weight: 600;
    color: var(--semantic-header);
    margin-bottom: 4px;
  }

  .def-desc {
    font-size: var(--text-size-caption);
    color: var(--semantic-body);
    line-height: 1.5;
  }

  .doctrine-footer {
    padding-top: 24px;
    border-top: 1px solid var(--surface-card-border);
  }

  .footer-content {
    text-align: center;
  }

  .footer-author {
    font-size: var(--text-size-caption);
    color: var(--semantic-body);
    margin-bottom: 4px;
  }

  .footer-cadence {
    font-size: var(--text-size-caption);
    color: var(--semantic-caption);
  }
</style>
