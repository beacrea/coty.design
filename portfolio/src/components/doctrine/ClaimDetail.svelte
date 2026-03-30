<script lang="ts">
  import { theme } from '../../stores/theme';
  import { navigateTo } from '../../stores/router';
  import type { Claim } from '../../lib/doctrine';
  import StatusBadge from './StatusBadge.svelte';
  import ConfidenceBar from './ConfidenceBar.svelte';

  export let claim: Claim;

  $: isDark = $theme === 'dark';

  function goBack() {
    navigateTo('/doctrine');
  }
</script>

<div class="claim-detail" class:dark={isDark}>
  <nav class="back-nav">
    <a href="/doctrine" data-route on:click|preventDefault={goBack} aria-label="Back to doctrine">← Back to Doctrine</a>
  </nav>

  <header class="claim-header">
    <div class="header-top">
      <span class="claim-number">Claim #{claim.claimNumber}</span>
      <StatusBadge status={claim.status} />
    </div>
    <h1 class="claim-title">{claim.title}</h1>
    <p class="claim-attribution">Predicted by Coty Beasley</p>
    {#if claim.splitFrom}
      <p class="split-note">
        Split from <strong>{claim.splitFrom}</strong> in {claim.splitVersion}
      </p>
    {/if}
  </header>

  <section class="statement-card">
    <h2 class="section-label">Statement</h2>
    <p class="statement-text">{claim.statement}</p>
  </section>

  <section class="rationale-card">
    <h2 class="section-label">Rationale</h2>
    <p class="rationale-text">{claim.rationale}</p>
  </section>

  <section class="confidence-section">
    <h2 class="section-label">Confidence Level</h2>
    <ConfidenceBar status={claim.status} />
  </section>

  <div class="evidence-columns">
    <section class="evidence-col">
      <h2 class="section-label">Supporting Signals ({claim.supportingSignals.length})</h2>
      <ul class="evidence-list supporting">
        {#each claim.supportingSignals as signal}
          <li>{signal}</li>
        {/each}
      </ul>
    </section>

    <section class="evidence-col">
      <h2 class="section-label">Challenges ({claim.challenges.length})</h2>
      <ul class="evidence-list challenges">
        {#each claim.challenges as challenge}
          <li>{challenge}</li>
        {/each}
      </ul>
    </section>
  </div>

  {#if claim.observations.length > 0}
    <section class="observations-section">
      <h2 class="section-label">Quarterly Observations</h2>
      {#each claim.observations as obs}
        <div class="observation-card">
          <h3 class="obs-period">{obs.period}</h3>
          <ul class="obs-notes">
            {#each obs.notes as note}
              <li>{note}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </section>
  {/if}

  {#if claim.evaluationCriteria.length > 0}
    <section class="criteria-section">
      <h2 class="section-label">Evaluation Criteria</h2>
      <ul class="criteria-list">
        {#each claim.evaluationCriteria as criterion}
          <li>{criterion}</li>
        {/each}
      </ul>
    </section>
  {/if}
</div>

<style>
  .claim-detail {
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

  .claim-header {
    margin-bottom: var(--section-spacing);
  }

  .header-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .claim-number {
    font-size: 13px;
    font-weight: 700;
    color: var(--semantic-caption);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .claim-title {
    font-size: var(--text-size-title);
    font-weight: 680;
    color: var(--semantic-title);
    line-height: 1.15;
  }

  .claim-attribution {
    margin-top: 6px;
    font-size: 13px;
    color: var(--semantic-caption);
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .split-note {
    margin-top: 8px;
    font-size: 12px;
    color: var(--semantic-caption);
    font-style: italic;
  }

  .section-label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--semantic-caption);
    margin-bottom: 10px;
  }

  .statement-card,
  .rationale-card {
    margin-bottom: 28px;
    padding: 18px 20px;
    background: var(--surface-card-bg);
    border: 1px solid var(--surface-card-border);
    border-radius: 8px;
  }

  .statement-text,
  .rationale-text {
    font-size: var(--text-size-body);
    color: var(--semantic-body);
    line-height: 1.6;
  }

  .confidence-section {
    margin-bottom: 32px;
  }

  .evidence-columns {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 32px;
  }

  @media (min-width: 640px) {
    .evidence-columns {
      grid-template-columns: 1fr 1fr;
    }
  }

  .evidence-col {
    padding: 16px;
    background: var(--surface-card-bg);
    border: 1px solid var(--surface-card-border);
    border-radius: 8px;
  }

  .evidence-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .evidence-list li {
    font-size: 13px;
    color: var(--semantic-body);
    line-height: 1.5;
    padding-left: 16px;
    position: relative;
  }

  .evidence-list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 7px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .evidence-list.supporting li::before {
    background-color: oklch(0.55 0.18 145);
  }

  .evidence-list.challenges li::before {
    background-color: oklch(0.55 0.18 25);
  }

  :global(.dark) .evidence-list.supporting li::before {
    background-color: oklch(0.70 0.16 145);
  }

  :global(.dark) .evidence-list.challenges li::before {
    background-color: oklch(0.70 0.16 25);
  }

  .observations-section {
    margin-bottom: 32px;
  }

  .observation-card {
    padding: 16px;
    background: var(--surface-card-bg);
    border: 1px solid var(--surface-card-border);
    border-radius: 8px;
    margin-bottom: 12px;
  }

  .obs-period {
    font-size: 14px;
    font-weight: 600;
    color: var(--semantic-header);
    margin-bottom: 10px;
  }

  .obs-notes {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .obs-notes li {
    font-size: 13px;
    color: var(--semantic-body);
    line-height: 1.6;
    padding-left: 16px;
    position: relative;
  }

  .obs-notes li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 7px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--semantic-bullet);
  }

  .criteria-section {
    margin-bottom: 32px;
  }

  .criteria-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    background: var(--surface-card-bg);
    border: 1px solid var(--surface-card-border);
    border-radius: 8px;
  }

  .criteria-list li {
    font-size: 13px;
    color: var(--semantic-body);
    line-height: 1.5;
    padding-left: 16px;
    position: relative;
  }

  .criteria-list li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--semantic-caption);
  }
</style>
