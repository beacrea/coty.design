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
    padding: 1rem;
    border-radius: 0.75rem;
    border: 1px solid var(--surface-card-border);
    background-color: var(--surface-card-bg);
    transition: background-color var(--transition-theme), border-color var(--transition-theme);
  }

  @media (min-width: 640px) {
    .family-section {
      padding: 1.25rem 1.5rem 1.5rem;
    }
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
    text-wrap: wrap;
  }

  .cta-button {
    display: block;
    width: 100%;
    padding: 0.75rem 1.25rem;
    font-size: var(--text-size-body);
    font-weight: 500;
    text-align: center;
    color: oklch(1 0 0);
    background-color: var(--semantic-header);
    border-radius: 0.5rem;
    text-decoration: none;
    transition: background-color 0.2s ease, transform 0.15s ease;
  }

  .cta-button:hover {
    background-color: var(--semantic-link-hover);
    transform: translateY(-1px);
  }

  .cta-button:active {
    transform: translateY(0);
  }

  @media (min-width: 640px) {
    .cta-button {
      display: inline-block;
      width: auto;
    }
  }
</style>
