<script lang="ts">
  export let name: string;
  export let role: string;
  export let summary: string;
</script>

<div class="opener">
  <h1 class="name animate-entrance">{name}</h1>
  <p class="role animate-entrance stagger-1">{role}</p>
  <p class="summary animate-entrance stagger-2">{summary}</p>
</div>

<style>
  .opener {
  }

  .name {
    font-size: var(--text-size-title);
    font-weight: 680;
    color: var(--semantic-title);
    line-height: 1.1;
    margin-bottom: 0.5em;
    transition: color var(--transition-theme);
  }

  .role {
    font-size: var(--text-size-subtitle);
    font-weight: 460;
    color: var(--semantic-subtitle);
    margin-bottom: 1em;
    transition: color var(--transition-theme);
  }

  .summary {
    font-size: var(--text-size-body);
    font-weight: 400;
    color: var(--semantic-body);
    line-height: 1.6;
    transition: color var(--transition-theme);
  }
</style>
