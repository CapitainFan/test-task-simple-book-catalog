// src/js/main.js
import navbarHtml from '../pages/navbar.html?raw';
import footerHtml from '../pages/footer.html?raw';
import { searchBooks, getLoadingState, getErrorState } from './modules/api.js';
import { loadFavourites } from './store/store.js';
import { setBooks, appendBooks, setAuthorFilter, getAllBooks, getUniqueAuthors } from './modules/catalogRenderer.js';
import { renderFavourites } from './modules/favouritesRenderer.js';

document.getElementById('navbar').innerHTML = navbarHtml;
document.getElementById('footer').innerHTML = footerHtml;

const catalogContainer = document.getElementById('catalog');
const loaderDiv = document.createElement('div');
loaderDiv.id = 'loader';
loaderDiv.style.display = 'none';
loaderDiv.innerHTML = '<div class="spinner"></div> Loading...';
catalogContainer.parentNode.insertBefore(loaderDiv, catalogContainer.nextSibling);

const errorDiv = document.createElement('div');
errorDiv.id = 'error-message';
errorDiv.style.display = 'none';
errorDiv.style.color = 'red';
errorDiv.style.padding = '10px';
catalogContainer.parentNode.insertBefore(errorDiv, catalogContainer.nextSibling);

const loadMoreButton = document.createElement('button');
loadMoreButton.id = 'load-more';
loadMoreButton.textContent = 'Load more';
loadMoreButton.style.display = 'none';
loadMoreButton.style.margin = '20px auto';
loadMoreButton.style.padding = '10px 20px';
catalogContainer.parentNode.insertBefore(loadMoreButton, catalogContainer.nextSibling);

let currentQuery = '';
let currentPage = 1;
let totalBooks = 0;

async function loadBooks(query, page, append = false) {
    loaderDiv.style.display = 'block';
    errorDiv.style.display = 'none';
    loadMoreButton.disabled = true;

    const result = await searchBooks(query, page, 30);
    const { books, total } = result;

    loaderDiv.style.display = 'none';

    if (getErrorState().isError) {
        errorDiv.textContent = `Error: ${getErrorState().message}`;
        errorDiv.style.display = 'block';
        loadMoreButton.style.display = 'none';
        return;
    }

    if (books.length === 0 && !append) {
        setBooks([]);
        loadMoreButton.style.display = 'none';
        return;
    }

    if (!append) {
        setBooks(books);
        totalBooks = total;
        currentPage = page;
    } else {
        appendBooks(books);
        currentPage = page;
    }

    if (getAllBooks().length < totalBooks) {
        loadMoreButton.style.display = 'block';
        loadMoreButton.disabled = false;
    } else {
        loadMoreButton.style.display = 'none';
    }

    populateAuthorFilter();
}

function populateAuthorFilter() {
    const select = document.getElementById('author-filter');
    if (!select) return;
    const authors = getUniqueAuthors();
    const currentValue = select.value;
    select.innerHTML = '<option value="">All authors</option>';
    authors.forEach(author => {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = author;
        if (author === currentValue) option.selected = true;
        select.appendChild(option);
    });
}

function handleAuthorFilterChange(e) {
    setAuthorFilter(e.target.value);
}

async function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput?.value?.trim() || '';

    if (query.length <= 3) return;

    currentQuery = query;
    currentPage = 1;
    await loadBooks(query, 1, false);
}

async function loadMore() {
    if (!currentQuery) return;
    await loadBooks(currentQuery, currentPage + 1, true);
}

function waitForElement(selector) {
    return new Promise(resolve => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
}

async function init() {
    loadFavourites();
    const searchInput = await waitForElement('#search-input');
    searchInput.addEventListener('input', handleSearch);
    loadMoreButton.addEventListener('click', loadMore);
    const authorFilter = await waitForElement('#author-filter');
    authorFilter.addEventListener('change', handleAuthorFilterChange);

    const initialBooks = await searchBooks('frontend', 1, 30);
    setBooks(initialBooks.books);
    totalBooks = initialBooks.total;
    currentQuery = 'frontend';
    currentPage = 1;
    if (getAllBooks().length < totalBooks) {
        loadMoreButton.style.display = 'block';
        loadMoreButton.disabled = false;
    }
    populateAuthorFilter();
    renderFavourites();
}

init();