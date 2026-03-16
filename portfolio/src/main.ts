import './app.css';
import { mount } from 'svelte';
import App from './App.svelte';

const target = document.getElementById('app')!;
const placeholder = document.getElementById('app-placeholder');

const app = mount(App, { target });

if (placeholder && placeholder.parentNode) {
  requestAnimationFrame(() => {
    placeholder.style.visibility = 'hidden';
    placeholder.style.pointerEvents = 'none';
    requestAnimationFrame(() => {
      placeholder.remove();
    });
  });
}

export default app;
