<script lang="ts">
  import type { ProofRow } from '../lib/content';
  import BulletList from './BulletList.svelte';

  export let heading: string;
  export let framing: string;
  export let rows: ProofRow[];
</script>

<section class="section animate-entrance">
  <h2 class="heading">{heading}</h2>

  <p class="framing">{framing}</p>

  {#each rows as row}
    <div class="subsection">
      <h3 class="label">{row.label}</h3>
      <BulletList items={row.items} />
    </div>
  {/each}
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

  .framing {
    font-size: var(--text-size-body);
    font-weight: 400;
    color: var(--semantic-caption);
    line-height: 1.6;
    margin-bottom: var(--list-item-gap);
    transition: color var(--transition-theme);
  }

  .subsection {
    margin-bottom: var(--list-item-gap);
  }

  .subsection:last-child {
    margin-bottom: 0;
  }

  .label {
    font-size: var(--text-size-body);
    font-weight: 600;
    color: var(--semantic-body);
    letter-spacing: 0.02em;
    margin-bottom: var(--list-item-spacing);
    transition: color var(--transition-theme);
  }
</style>
