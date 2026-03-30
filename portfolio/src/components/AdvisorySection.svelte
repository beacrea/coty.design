<script lang="ts">
  import BulletList from './BulletList.svelte';

  export let heading: string;
  export let framing: string;
  export let items: string[];
</script>

<section class="section animate-entrance">
  <h2 class="heading">{heading}</h2>

  <p class="framing">{framing}</p>

  <BulletList {items} />
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

  .framing {
    font-size: var(--text-size-body);
    font-weight: 400;
    color: var(--semantic-caption);
    line-height: 1.6;
    margin-bottom: var(--list-item-gap);
    transition: color var(--transition-theme);
  }
</style>
