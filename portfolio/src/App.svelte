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
<div class="toggle-wrapper" class:observe-active={observeMode}>
  <ThemeToggle />
  <button 
    class="observe-toggle"
    on:click={toggleObserveMode}
    aria-label={observeMode ? 'Show content' : 'Observe organisms'}
    title={observeMode ? 'Show content' : 'Observe organisms'}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6.5 12c0-3.5 3.5-6 6.5-6s6.5 2.5 6.5 6-3.5 6-6.5 6-6.5-2.5-6.5-6z"></path>
      <path d="M6.5 12c-2 0-4.5-1-5.5-2 1-1 3.5-2 5.5-2"></path>
      <circle cx="15" cy="10.5" r="1" fill="currentColor"></circle>
      <path d="M20 9c1.5 1.5 3 3 3 3s-1.5 1.5-3 3"></path>
    </svg>
  </button>
</div>
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

  .observe-toggle {
    width: var(--toggle-size);
    height: var(--toggle-size);
    border-radius: 50%;
    border: var(--toggle-border-width) solid var(--toggle-border);
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color var(--transition-toggle), transform var(--transition-toggle);
    z-index: 100;
    flex-shrink: 0;
    color: var(--text-secondary);
  }

  .observe-toggle:hover {
    transform: scale(1.05);
  }

  .observe-toggle:active {
    transform: scale(0.95);
  }

  .observe-toggle svg {
    width: var(--icon-size);
    height: var(--icon-size);
  }

  .toggle-wrapper {
    position: fixed;
    top: var(--page-padding-top);
    right: var(--page-padding-x);
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    z-index: 100;
  }

  .observe-mode .page {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
</style>
