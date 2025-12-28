<script lang="ts">
  export let heading: string;
  export let description: string;
  export let buttonText: string;
  export let buttonUrl: string;
</script>

<section class="family-section">
  <h2 class="heading">{heading}</h2>
  <p class="description">{description}</p>
  <a href={buttonUrl} target="_blank" rel="noopener noreferrer" class="cta-button">
    {buttonText}
  </a>
</section>

<style>
  .family-section {
    margin-bottom: var(--section-spacing);
  }

  .heading {
    font-size: var(--text-size-header);
    font-weight: 460;
    color: var(--semantic-header);
    margin-bottom: var(--list-item-gap);
    transition: color var(--transition-theme);
  }

  .description {
    font-size: var(--text-size-body);
    font-weight: 400;
    color: var(--semantic-body);
    line-height: 1.6;
    margin-bottom: 1.25rem;
    transition: color var(--transition-theme);
  }

  .cta-button {
    display: inline-block;
    padding: 0.75rem 1.25rem;
    font-size: var(--text-size-body);
    font-weight: 500;
    color: oklch(1 0 0);
    background-color: oklch(0.45 0.15 260);
    border-radius: 0.5rem;
    text-decoration: none;
    transition: background-color 0.2s ease, transform 0.15s ease;
  }

  .cta-button:hover {
    background-color: oklch(0.5 0.15 260);
    transform: translateY(-1px);
  }

  .cta-button:active {
    transform: translateY(0);
  }
</style>
