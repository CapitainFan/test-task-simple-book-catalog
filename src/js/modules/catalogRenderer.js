import cardTemplate from '../../pages/card.html?raw';
import heartIcon from '../../assets/icons/heart.svg?raw';
import { escapeHtml } from './utils.js';
import { getCoverById } from './api.js';
import { isFavourite } from '../store/store.js';
import { initCoverHandler } from './coverHandler.js';
import { attachFavouriteButtons } from './eventHandlers.js';

let currentBooks = [];

function createCardHtml(book) {
    const coverUrl = getCoverById(book.cover_i, 'M');
    const authors = Array.isArray(book.author_name) ? book.author_name.join(', ') : book.author_name;
    const year = book.first_publish_year ? `${book.first_publish_year}` : '';

    return cardTemplate
        .replace(/\{\{\s*title\s*\}\}/g, escapeHtml(book.title))
        .replace(/\{\{\s*author\s*\}\}/g, escapeHtml(authors))
        .replace(/\{\{\s*year\s*\}\}/g, escapeHtml(year))
        .replace(/\{\{\s*coverUrl\s*\}\}/g, coverUrl || '')
        .replace(/\{\{\s*bookId\s*\}\}/g, book.id)
        .replace(/\{\{\s*favouriteClass\s*\}\}/g, isFavourite(book.id) ? 'favourite-active' : '')
        .replace(/\{\{\s*heartIcon\s*\}\}/g, heartIcon);
}

export function renderCatalog(books, append = false) {
    if (append) {
        books.forEach(book => {
            const cardHtml = createCardHtml(book);
            document.getElementById('catalog').insertAdjacentHTML('beforeend', cardHtml);
            currentBooks.push(book);
        });
        initCoverHandler();
        attachFavouriteButtons();
    } else {
        currentBooks = books;
        const container = document.getElementById('catalog');
        container.innerHTML = '';

        if (!books.length) {
            container.innerHTML = '<p>Nothing found</p>';
            return;
        }

        books.forEach(book => {
            container.insertAdjacentHTML('beforeend', createCardHtml(book));
        });
        initCoverHandler();
        attachFavouriteButtons();
    }
}

export function getCurrentBooks() {
    return [...currentBooks];
}