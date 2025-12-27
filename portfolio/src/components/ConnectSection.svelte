<script lang="ts">
  import type { ConnectItem } from '../lib/content';

  export let heading: string;
  export let items: ConnectItem[];
</script>

<section class="connect-section">
  <h2 class="heading">{heading}</h2>
  
  <ul class="connect-list">
    {#each items as item}
      <li class="connect-item">
        <span class="bullet"></span>
        <span class="content">
          {#if item.url}<a href={item.url} target="_blank" rel="noopener noreferrer" class="link">{item.text}</a>{:else}<span class="text">{item.text}</span>{/if} <span class="description">{item.description}</span>
        </span>
      </li>
    {/each}
  </ul>
</section>

<style>
  .connect-section {
    margin-bottom: var(--section-spacing);
  }

  .heading {
    font-size: var(--text-size-header);
    font-weight: 460;
    color: var(--semantic-header);
    margin-bottom: var(--list-item-gap);
    transition: color var(--transition-theme);
  }

  .connect-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--list-item-spacing);
  }

  .connect-item {
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

  .content {
    font-size: var(--text-size-body);
    font-weight: 400;
    line-height: 1.6;
  }

  .link {
    color: oklch(1 0 0);
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color var(--transition-theme);
  }

  .link:hover {
    color: oklch(0.85 0 0);
    text-decoration: underline;
  }

  .text {
    color: var(--semantic-body);
    transition: color var(--transition-theme);
  }

  .description {
    color: var(--semantic-caption);
    transition: color var(--transition-theme);
  }
</style>
