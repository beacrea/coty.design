<script lang="ts">
  import BulletList from './BulletList.svelte';

  export let heading: string;
  export let items: string[];
  export let variant: 'bullet' | 'paragraph' = 'bullet';
</script>

<section class="section animate-entrance">
  <h2 class="heading">{heading}</h2>
  
  {#if variant === 'bullet'}
    <BulletList {items} />
  {:else}
    <div class="paragraphs">
      {#each items as item}
        <p class="paragraph">
          <span class="inline-bullet"></span>
          {item}
        </p>
      {/each}
    </div>
  {/if}
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

  .paragraphs {
    display: flex;
    flex-direction: column;
    gap: var(--list-item-spacing);
  }

  .paragraph {
    font-size: var(--text-size-body);
    font-weight: 400;
    color: var(--semantic-body);
    line-height: 1.6;
    display: flex;
    align-items: flex-start;
    gap: 0.75em;
    transition: color var(--transition-theme);
  }

  .inline-bullet {
    flex-shrink: 0;
    width: var(--bullet-size);
    height: var(--bullet-size);
    border-radius: 50%;
    background-color: var(--semantic-bullet);
    margin-top: var(--bullet-y-offset);
    transition: background-color var(--transition-theme);
  }
</style>
