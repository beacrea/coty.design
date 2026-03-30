import { writable, derived } from 'svelte/store';

const pathname = writable(window.location.pathname);

function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  pathname.set(path);
  window.scrollTo(0, 0);
}

window.addEventListener('popstate', () => {
  pathname.set(window.location.pathname);
  window.scrollTo(0, 0);
});

document.addEventListener('click', (e) => {
  const anchor = (e.target as Element).closest('a[data-route]');
  if (anchor) {
    e.preventDefault();
    const href = anchor.getAttribute('href');
    if (href) navigateTo(href);
  }
});

export const currentPath = { subscribe: pathname.subscribe };

export const route = derived(pathname, ($p) => {
  if ($p.startsWith('/doctrine/')) {
    const claimId = $p.replace('/doctrine/', '').replace(/\/$/, '');
    if (claimId) {
      return { page: 'claim-detail' as const, claimId };
    }
    return { page: 'doctrine' as const, claimId: null };
  }
  if ($p === '/doctrine' || $p === '/doctrine/') {
    return { page: 'doctrine' as const, claimId: null };
  }
  return { page: 'home' as const, claimId: null };
});

export { navigateTo };
