<script lang="ts">
  import { theme } from './stores/theme';
  import ThemeToggle from './components/ThemeToggle.svelte';
  import Opener from './components/Opener.svelte';
  import Section from './components/Section.svelte';
  import FamilyExplainer from './components/FamilyExplainer.svelte';
  import ConnectSection from './components/ConnectSection.svelte';
  import Footer from './components/Footer.svelte';
  import GenerativeBackground from './components/GenerativeBackground.svelte';
  import { siteContent } from './lib/content';

  $: isDark = $theme === 'dark';
  
  let observeMode = false;
  
  function toggleObserveMode() {
    observeMode = !observeMode;
  }
</script>

<GenerativeBackground enhancedContrast={observeMode} />
<div class:dark={isDark} class:observe-mode={observeMode}>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <main class="page" id="main-content" tabindex="-1">
    <div class="content">
      <header class="header">
        <div class="opener-wrapper">
          <Opener 
            name={siteContent.opener.name}
            role={siteContent.opener.role}
            summary={siteContent.opener.summary}
          />
        </div>
        <div class="toggle-wrapper">
          <button 
            class="observe-toggle"
            on:click={toggleObserveMode}
            aria-label={observeMode ? 'Show content' : 'Observe organisms'}
            title={observeMode ? 'Show content' : 'Observe organisms'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              {#if observeMode}
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              {:else}
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              {/if}
            </svg>
          </button>
          <ThemeToggle />
        </div>
      </header>
      
      <Section 
        heading={siteContent.recentFocus.heading}
        items={siteContent.recentFocus.items}
        variant="bullet"
      />
      
      <Section 
        heading={siteContent.currentStatus.heading}
        items={siteContent.currentStatus.items}
        variant="paragraph"
      />
      
      <Section 
        heading={siteContent.foundations.heading}
        items={siteContent.foundations.items}
        variant="paragraph"
      />
      
      <Section 
        heading={siteContent.domainExpertise.heading}
        items={siteContent.domainExpertise.items}
        variant="bullet"
      />

      <FamilyExplainer 
        heading={siteContent.familyExplainer.heading}
        description={siteContent.familyExplainer.description}
        buttonText={siteContent.familyExplainer.buttonText}
        buttonUrl={siteContent.familyExplainer.buttonUrl}
      />
      
      <ConnectSection 
        heading={siteContent.connect.heading}
        items={siteContent.connect.items}
      />
      
      <Footer 
        legal={siteContent.metadata.legal}
        version={siteContent.metadata.version}
        versionUrl={siteContent.metadata.versionUrl}
      />
    </div>
  </main>
</div>

<style>
  .dark {
    background-color: var(--background);
  }

  .page {
    min-height: 100vh;
    padding: var(--page-padding-top) var(--page-padding-x) var(--page-padding-bottom);
    background-color: var(--background);
    transition: background-color var(--transition-theme);
  }

  .content {
    max-width: var(--content-max-width);
    margin: 0 auto;
  }

  .header {
    position: relative;
    margin-bottom: var(--section-spacing);
  }

  .opener-wrapper {
    width: 100%;
  }

  .toggle-wrapper {
    position: absolute;
    top: 0;
    right: 0;
  }

  @media (min-width: 640px) {
    .toggle-wrapper {
      position: fixed;
      top: var(--page-padding-top);
      right: var(--page-padding-x);
    }
  }

  .observe-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 1px solid var(--text-tertiary);
    border-radius: 50%;
    background: var(--background);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-theme);
  }

  .observe-toggle:hover {
    border-color: var(--text-secondary);
    color: var(--text-primary);
  }

  .toggle-wrapper {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  :global(.observe-mode) .page {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  :global(.observe-mode) .toggle-wrapper {
    position: fixed;
    top: var(--page-padding-top);
    right: var(--page-padding-x);
    z-index: 100;
  }
</style>
