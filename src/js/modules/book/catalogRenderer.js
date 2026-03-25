import cardTemplate from '../../../pages/card.html?raw';
import heartIcon from '../../../icons/heart.svg?raw';
import { escapeHtml } from '../../utils/bookUtils.js';
import { getCoverById } from '../../api/bookApi.js';
import { isFavourite } from '../../store/store.js';
import { initCoverHandler } from './coverHandler.js';
import { attachFavouriteButtons } from './eventHandlers.js';

let allBooks = [];
let currentAuthorFilter = '';

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

function displayBooks(books) {
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

function applyFiltersAndRender() {
    let filtered = [...allBooks];
    if (currentAuthorFilter) {
        filtered = filtered.filter(book => {
            const authors = Array.isArray(book.author_name) ? book.author_name : [book.author_name];
            return authors.includes(currentAuthorFilter);
        });
    }
    displayBooks(filtered);
}

export function setBooks(books) {
    allBooks = books;
    applyFiltersAndRender();
}

export function appendBooks(books) {
    allBooks = [...allBooks, ...books];
    applyFiltersAndRender();
}

export function setAuthorFilter(author) {
    currentAuthorFilter = author;
    applyFiltersAndRender();
}

export function getAllBooks() {
    return [...allBooks];
}

export function getUniqueAuthors() {
    const authorsSet = new Set();
    allBooks.forEach(book => {
        const authors = Array.isArray(book.author_name) ? book.author_name : [book.author_name];
        authors.forEach(a => authorsSet.add(a));
    });
    return Array.from(authorsSet).sort();
}

export function renderCatalog(books, append = false) {
    if (append) {
        appendBooks(books);
    } else {
        setBooks(books);
    }
}