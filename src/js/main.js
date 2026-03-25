import navbarHtml from '../pages/navbar.html?raw';
import footerHtml from '../pages/footer.html?raw';
import { searchBooks, getLoadingState, getErrorState } from './modules/api.js';
import { loadFavourites } from './store/store.js';
import { renderCatalog, getCurrentBooks } from './modules/catalogRenderer.js';
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
let allBooks = [];

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
        renderCatalog([], false);
        loadMoreButton.style.display = 'none';
        return;
    }

    if (!append) {
        renderCatalog(books, false);
        totalBooks = total;
        allBooks = books;
        currentPage = page;
    } else {
        renderCatalog(books, true);
        allBooks = [...allBooks, ...books];
        currentPage = page;
    }

    if (allBooks.length < totalBooks) {
        loadMoreButton.style.display = 'block';
        loadMoreButton.disabled = false;
    } else {
        loadMoreButton.style.display = 'none';
    }
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
    const initialBooks = await searchBooks('frontend', 1, 30);
    renderCatalog(initialBooks.books, false);
    totalBooks = initialBooks.total;
    allBooks = initialBooks.books;
    currentPage = 1;
    currentQuery = 'frontend';
    if (allBooks.length < totalBooks) {
        loadMoreButton.style.display = 'block';
        loadMoreButton.disabled = false;
    }
    renderFavourites();
}

init();