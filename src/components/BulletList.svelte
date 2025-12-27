<script lang="ts">
  export let items: string[];
</script>

<ul class="bullet-list">
  {#each items as item}
    <li class="item">
      <span class="bullet"></span>
      <span class="text">{item}</span>
    </li>
  {/each}
</ul>

<style>
  .bullet-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--list-item-spacing);
  }

  .item {
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

  .text {
    font-size: var(--text-size-body);
    font-weight: 400;
    color: var(--semantic-body);
    line-height: 1.6;
    transition: color var(--transition-theme);
  }
</style>
