import favouritesCardTemplate from '../../pages/favouritesCard.html?raw';
import heartIcon from '../../assets/icons/heart.svg?raw';
import { escapeHtml } from './utils.js';
import { getCoverById } from './api.js';
import { getFavourites } from '../store/store.js';
import { initCoverHandler } from './coverHandler.js';
import { attachFavouriteButtons } from './eventHandlers.js';

export function renderFavourites() {
    const container = document.getElementById('favourites-list');
    const favourites = getFavourites();
    container.innerHTML = '';

    if (!favourites.length) {
        container.innerHTML = 'No favourites';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        return;
    }

    favourites.forEach(book => {
        const coverUrl = getCoverById(book.cover_i, 'M');
        const authors = Array.isArray(book.author_name) ? book.author_name.join(', ') : book.author_name;
        const year = book.first_publish_year ? `${book.first_publish_year}` : '';

        let cardHtml = favouritesCardTemplate
            .replace(/\{\{\s*title\s*\}\}/g, escapeHtml(book.title))
            .replace(/\{\{\s*author\s*\}\}/g, escapeHtml(authors))
            .replace(/\{\{\s*year\s*\}\}/g, escapeHtml(year))
            .replace(/\{\{\s*coverUrl\s*\}\}/g, coverUrl || '')
            .replace(/\{\{\s*bookId\s*\}\}/g, book.id)
            .replace(/\{\{\s*heartIcon\s*\}\}/g, heartIcon);

        container.insertAdjacentHTML('beforeend', cardHtml);
    });

    initCoverHandler();
    attachFavouriteButtons();
}