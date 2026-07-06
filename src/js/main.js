import { inject } from '@vercel/analytics';
import { initRevealAnimations } from './modules/animations.js';
import { initProductFilters } from './modules/productFilters.js';
import { initCompatibilitySearch } from './modules/compatibilitySearch.js';
import { initNavigationHighlight } from './modules/navigation.js';
import { initModelSelector } from './modules/modelSelector.js';
import { initCartFeedback } from './modules/cartFeedback.js';
import { initCart } from './modules/cart.js';

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
}

document.addEventListener('DOMContentLoaded', initApp);
