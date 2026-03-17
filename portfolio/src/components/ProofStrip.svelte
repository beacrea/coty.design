<script lang="ts">
  import type { ProofRow } from '../lib/content';

  export let heading: string;
  export let rows: ProofRow[];
</script>

<section class="section animate-entrance">
  <h2 class="heading">{heading}</h2>
  <dl class="rows">
    {#each rows as row}
      <div class="row">
        <dt class="label">{row.label}</dt>
        <dd class="value">{row.value}</dd>
      </div>
    {/each}
  </dl>
</section>

<style>
  .section {
    margin-bottom: var(--section-spacing);
  }

  .heading {
    font-size: var(--text-size-header);
    font-weight: 460;
    color: var(--semantic-header);
    margin-bottom: var(--list-item-gap);
    transition: color var(--transition-theme);
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: var(--list-item-spacing);
  }

  .row {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .label {
    font-size: var(--text-size-body);
    font-weight: 600;
    color: var(--semantic-body);
    letter-spacing: 0.02em;
    transition: color var(--transition-theme);
    flex-shrink: 0;
  }

  .value {
    font-size: var(--text-size-body);
    font-weight: 400;
    color: var(--semantic-caption);
    line-height: 1.6;
    transition: color var(--transition-theme);
    text-wrap: pretty;
  }

  @media (min-width: 640px) {
    .row {
      flex-direction: row;
      gap: 0;
    }

    .label {
      width: 130px;
      min-width: 130px;
    }

    .value {
      flex: 1;
    }
  }

  @media (min-width: 1024px) {
    .label {
      width: 150px;
      min-width: 150px;
    }
  }
</style>
