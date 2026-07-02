// Generic in-SPA 404 fallback — rendered inside #app-main when the router doesn't match any
// route pattern, or when a page module (role.js, role-phase.js, etc.) resolves an unknown/invalid
// param (e.g. a comingSoon role, an out-of-range phase number). Distinct from the root 404.html,
// which only handles GitHub Pages' server-level unmatched-path redirect trick.
import { url } from '../base-url.js';

export async function render() {
  return `
    <div class="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p class="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-neutral-600 mb-3">404</p>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Page not found</h1>
      <p class="text-gray-500 dark:text-neutral-400 mb-6 max-w-sm">
        The page you're looking for doesn't exist or isn't available yet.
      </p>
      <a href="${url('')}" class="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
        Go to homepage
      </a>
    </div>
  `;
}

export async function afterMount() {
  // No interactive behavior needed.
}
