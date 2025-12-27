import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New version available - refresh to update');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
