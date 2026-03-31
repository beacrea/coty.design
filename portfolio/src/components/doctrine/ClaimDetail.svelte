<script lang="ts">
  import { theme } from '../../stores/theme';
  import { navigateTo } from '../../stores/router';
  import type { Claim } from '../../lib/doctrine';
  import { sortEvidenceByRole, getTierColor, getTierColorDark, getRoleColor, getRoleColorDark } from '../../lib/doctrine';
  import StatusBadge from './StatusBadge.svelte';
  import ConfidenceBar from './ConfidenceBar.svelte';

  export let claim: Claim;
  export let statusDefinitions: Record<string, string> = {};

  $: isDark = $theme === 'dark';
  $: sortedEvidence = sortEvidenceByRole(claim.evidence);
  $: supportingCount = claim.evidence.filter(e => e.role === 'supporting').length;
  $: challengingCount = claim.evidence.filter(e => e.role === 'challenging').length;
  $: contextualCount = claim.evidence.filter(e => e.role === 'contextual').length;

  function goBack() {
    navigateTo('/doctrine');
  }

  function tierColors(tier: string) {
    return isDark ? getTierColorDark(tier) : getTierColor(tier);
  }

  function roleColor(role: string) {
    return isDark ? getRoleColorDark(role) : getRoleColor(role);
  }

  function roleLabel(role: string): string {
    const labels: Record<string, string> = {
      supporting: 'Supporting',
      challenging: 'Challenging',
      contextual: 'Contextual',
    };
    return labels[role] ?? role;
  }

  function formatCitation(ev: { sourceAuthor?: string; sourceDate?: string }): string {
    const parts: string[] = [];
    if (ev.sourceAuthor) parts.push(ev.sourceAuthor);
    if (ev.sourceDate) parts.push(ev.sourceDate);
    return parts.join(', ');
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
    <ConfidenceBar status={claim.status} {statusDefinitions} />
  </section>

  <div class="evidence-columns">
    <section class="evidence-col">
      <h2 class="section-label">Supporting Signals ({claim.supportingSignals.length})</h2>
      <ul class="signal-list supporting">
        {#each claim.supportingSignals as signal}
          <li>{signal}</li>
        {/each}
      </ul>
    </section>

    <section class="evidence-col">
      <h2 class="section-label">Challenges ({claim.challenges.length})</h2>
      <ul class="signal-list challenges">
        {#each claim.challenges as challenge}
          <li>{challenge}</li>
        {/each}
      </ul>
    </section>
  </div>

  {#if sortedEvidence.length > 0}
    <section class="evidence-section">
      <h2 class="section-label">
        Evidence ({sortedEvidence.length})
        <span class="evidence-breakdown">
          {#if supportingCount > 0}<span class="eb-supporting">{supportingCount} supporting</span>{/if}
          {#if challengingCount > 0}<span class="eb-challenging">{challengingCount} challenging</span>{/if}
          {#if contextualCount > 0}<span class="eb-contextual">{contextualCount} contextual</span>{/if}
        </span>
      </h2>
      <div class="evidence-items">
        {#each sortedEvidence as ev}
          <div class="evidence-card">
            <div class="ev-header">
              <div class="ev-badges">
                <span class="tier-badge" style="background-color: {tierColors(ev.tier).bg}; color: {tierColors(ev.tier).fg};">
                  Tier {ev.tier}
                </span>
                <span class="role-indicator" style="color: {roleColor(ev.role).fg};">
                  {roleLabel(ev.role)}
                </span>
              </div>
            </div>
            <h3 class="ev-title">
              {#if ev.sourceUrl}
                <a href={ev.sourceUrl} target="_blank" rel="noopener noreferrer">{ev.sourceTitle}</a>
              {:else}
                {ev.sourceTitle}
              {/if}
            </h3>
            {#if formatCitation(ev)}
              <p class="ev-citation">{formatCitation(ev)}</p>
            {/if}
            {#if ev.sourceUrl}
              <p class="ev-url"><a href={ev.sourceUrl} target="_blank" rel="noopener noreferrer">{ev.sourceUrl}</a></p>
            {/if}
            {#if ev.summary}
              <p class="ev-summary">{ev.summary}</p>
            {/if}
          </div>
        {/each}
      </div>
    </section>
  {/if}

  {#if claim.observations.length > 0}
    <section class="observations-section">
      <h2 class="section-label">Observations</h2>
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
    font-size: var(--text-size-caption);
    font-weight: 700;
    color: var(--semantic-caption);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .claim-title {
    font-size: var(--text-size-title);
    font-weight: 700;
    color: var(--semantic-title);
    line-height: 1.15;
  }

  .split-note {
    margin-top: 8px;
    font-size: var(--text-size-caption);
    color: var(--semantic-caption);
    font-style: italic;
  }

  .section-label {
    font-size: var(--text-size-caption);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--semantic-caption);
    margin-bottom: 14px;
  }

  .statement-card,
  .rationale-card {
    margin-bottom: 32px;
    padding: 24px;
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
    gap: 24px;
    margin-bottom: 32px;
  }

  @media (min-width: 640px) {
    .evidence-columns {
      grid-template-columns: 1fr 1fr;
    }
  }

  .evidence-col {
    padding: 24px;
    background: var(--surface-card-bg);
    border: 1px solid var(--surface-card-border);
    border-radius: 8px;
  }

  .signal-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .signal-list li {
    font-size: var(--text-size-body);
    color: var(--semantic-body);
    line-height: 1.5;
    padding-left: 16px;
    position: relative;
  }

  .signal-list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 7px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .signal-list.supporting li::before {
    background-color: oklch(0.55 0.18 145);
  }

  .signal-list.challenges li::before {
    background-color: oklch(0.55 0.18 25);
  }

  :global(.dark) .signal-list.supporting li::before {
    background-color: oklch(0.70 0.16 145);
  }

  :global(.dark) .signal-list.challenges li::before {
    background-color: oklch(0.70 0.16 25);
  }

  .evidence-section {
    margin-bottom: 32px;
  }

  .evidence-breakdown {
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
    margin-left: 8px;
  }

  .eb-supporting { color: oklch(0.55 0.18 145); }
  .eb-challenging { color: oklch(0.55 0.18 25); }
  .eb-contextual { color: oklch(0.55 0.10 200); }

  :global(.dark) .eb-supporting { color: oklch(0.70 0.16 145); }
  :global(.dark) .eb-challenging { color: oklch(0.70 0.16 25); }
  :global(.dark) .eb-contextual { color: oklch(0.70 0.10 200); }

  .evidence-breakdown span + span::before {
    content: ' · ';
    color: var(--semantic-caption);
  }

  .evidence-items {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .evidence-card {
    padding: 24px;
    background: var(--surface-card-bg);
    border: 1px solid var(--surface-card-border);
    border-radius: 8px;
  }

  .ev-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .ev-badges {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .tier-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 100px;
    font-size: var(--text-size-caption);
    font-weight: 600;
    letter-spacing: 0.02em;
    white-space: nowrap;
    line-height: 1.4;
  }

  .role-indicator {
    font-size: var(--text-size-caption);
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .ev-title {
    font-size: var(--text-size-body);
    font-weight: 600;
    color: var(--semantic-header);
    line-height: 1.4;
    margin-bottom: 6px;
  }

  .ev-title a {
    color: var(--semantic-link);
    text-decoration: none;
  }

  .ev-title a:hover {
    text-decoration: underline;
  }

  .ev-citation {
    font-size: var(--text-size-caption);
    color: var(--semantic-caption);
    margin-bottom: 4px;
  }

  .ev-url {
    font-size: var(--text-size-caption);
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ev-url a {
    color: var(--semantic-caption);
    text-decoration: none;
    opacity: 0.7;
  }

  .ev-url a:hover {
    text-decoration: underline;
    opacity: 1;
  }

  .ev-summary {
    font-size: var(--text-size-caption);
    color: var(--semantic-body);
    line-height: 1.55;
  }

  .observations-section {
    margin-bottom: 32px;
  }

  .observation-card {
    padding: 24px;
    background: var(--surface-card-bg);
    border: 1px solid var(--surface-card-border);
    border-radius: 8px;
    margin-bottom: 14px;
  }

  .observation-card:last-child {
    margin-bottom: 0;
  }

  .obs-period {
    font-size: var(--text-size-body);
    font-weight: 600;
    color: var(--semantic-header);
    margin-bottom: 12px;
  }

  .obs-notes {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .obs-notes li {
    font-size: var(--text-size-body);
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
    gap: 10px;
    padding: 24px;
    background: var(--surface-card-bg);
    border: 1px solid var(--surface-card-border);
    border-radius: 8px;
  }

  .criteria-list li {
    font-size: var(--text-size-body);
    color: var(--semantic-body);
    line-height: 1.5;
    padding-left: 16px;
    position: relative;
  }

  .criteria-list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 7px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--semantic-bullet);
  }
</style>
