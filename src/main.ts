import './app.css';
import App from './App.svelte';
import { injectEnhancedJsonLd } from './lib/agent-detection';

injectEnhancedJsonLd();

const app = new App({
  target: document.getElementById('app')!,
});

export default app;
