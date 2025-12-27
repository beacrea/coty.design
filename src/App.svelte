<script lang="ts">
  import { theme } from './stores/theme';
  import ThemeToggle from './components/ThemeToggle.svelte';
  import Opener from './components/Opener.svelte';
  import Section from './components/Section.svelte';
  import ConnectSection from './components/ConnectSection.svelte';
  import Footer from './components/Footer.svelte';
  import { siteContent } from './lib/content';

  $: isDark = $theme === 'dark';
</script>

<div class:dark={isDark}>
  <main class="page">
    <ThemeToggle />
    
    <div class="content">
      <Opener 
        name={siteContent.opener.name}
        role={siteContent.opener.role}
        summary={siteContent.opener.summary}
      />
      
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
      
      <ConnectSection 
        heading={siteContent.connect.heading}
        items={siteContent.connect.items}
      />
      
      <Footer 
        legal={siteContent.metadata.legal}
        version={siteContent.metadata.version}
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
</style>
