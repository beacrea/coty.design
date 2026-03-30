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
        <span class="bullet" aria-hidden="true"></span>
        <div class="row-content">
          <dt class="label">{row.label}</dt>
          <dd class="value">
            <ul class="items">
              {#each row.items as item}
                <li class="item">{item}</li>
              {/each}
            </ul>
          </dd>
        </div>
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
    font-weight: 500;
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
    align-items: flex-start;
    gap: 0.75em;
  }

  .bullet {
    flex-shrink: 0;
    width: var(--bullet-size);
    height: var(--bullet-size);
    border-radius: 50%;
    background-color: var(--semantic-bullet);
    margin-top: var(--bullet-y-offset);
    transition: background-color var(--transition-theme);
  }

  .row-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
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
  }

  .items {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0;
  }

  .item {
    text-wrap: pretty;
  }

  .item:not(:last-child)::after {
    content: ",\00a0";
  }

  @media (min-width: 640px) {
    .label {
      width: 130px;
      min-width: 130px;
    }
  }

  @media (min-width: 1024px) {
    .label {
      width: 150px;
      min-width: 150px;
    }
  }
</style>
