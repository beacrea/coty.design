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
</script>

<GenerativeBackground />
<div class:dark={isDark}>
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
</style>
