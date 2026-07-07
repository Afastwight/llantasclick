import { inject } from '@vercel/analytics';
import { initRevealAnimations } from './modules/animations.js';
import { initProductFilters } from './modules/productFilters.js';
import { initCompatibilitySearch } from './modules/compatibilitySearch.js';
import { initNavigationHighlight } from './modules/navigation.js';
import { initModelSelector } from './modules/modelSelector.js';
import { initCartFeedback } from './modules/cartFeedback.js';
import { initCart } from './modules/cart.js';
import { initProductSearch } from './modules/search.js';
import { initAuthState } from './modules/authState.js';

// Initialize Vercel Web Analytics
inject();

function initApp() {
  initRevealAnimations();
  initProductFilters();
  initCompatibilitySearch();
  initNavigationHighlight();
  initModelSelector();
  initCartFeedback();
  initCart();
  initProductSearch();
  initAuthState();
}

document.addEventListener('DOMContentLoaded', initApp);
