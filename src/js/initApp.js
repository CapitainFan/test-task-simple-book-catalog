import navbarHtml from '../pages/navbar.html?raw';
import footerHtml from '../pages/footer.html?raw';
import catalogColumnHtml from '../pages/catalogColumn.html?raw';
import favouritesColumnHtml from '../pages/favouritesColumn.html?raw';

import { initTheme } from './modules/theme/handleTheme.js';
import { loadFavourites } from './store/store.js';
import { renderFavourites } from './modules/book/favouritesRenderer.js';
import { createLoader, createError, createLoadMoreButton } from './modules/book/domElements.js';
import { handleSearch, loadMore, loadInitialBooks } from './modules/navbar/search.js';
import { handleAuthorFilterChange } from './modules/navbar/authorFilter.js';
import { initMobileFavourites } from './modules/book/mobileFavourites.js';
import { waitForElement } from './utils/bookUtils.js';

export async function init() {
    // Insert static templates
    document.getElementById('navbar').innerHTML = navbarHtml;
    document.getElementById('footer').innerHTML = footerHtml;
    document.getElementById('catalogColumn').innerHTML = catalogColumnHtml;
    document.getElementById('favouritesColumn').innerHTML = favouritesColumnHtml;

    // Get container elements
    const catalogContainer = document.getElementById('catalog');
    const favouritesList = document.getElementById('favourites-list');

    // Create helper UI elements
    createLoader(catalogContainer);
    createError(catalogContainer);
    const loadMoreButton = createLoadMoreButton(catalogContainer);

    // Initialize theme (light/dark mode)
    initTheme();

    // Load favourites from localStorage
    loadFavourites();

    // Mobile version of favourites panel
    initMobileFavourites();

    // Wait for search input and author filter to appear
    const searchInput = await waitForElement('#search-input');
    searchInput.addEventListener('input', handleSearch);

    const authorFilter = await waitForElement('#author-filter');
    authorFilter.addEventListener('change', handleAuthorFilterChange);

    loadMoreButton.addEventListener('click', loadMore);

    // Load initial set of books
    await loadInitialBooks('frontend');

    // Render favourites panel
    renderFavourites();
}