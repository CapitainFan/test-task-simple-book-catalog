import navbarHtml from '../pages/navbar.html?raw';
import footerHtml from '../pages/footer.html?raw';
import catalogColumnHtml from '../pages/catalogColumn.html?raw';
import favouritesColumnHtml from '../pages/favouritesColumn.html?raw';
import { searchBooks, getLoadingState, getErrorState } from './modules/api.js';
import { loadFavourites } from './store/store.js';
import { setBooks, appendBooks, setAuthorFilter, getAllBooks, getUniqueAuthors } from './modules/catalogRenderer.js';
import { renderFavourites } from './modules/favouritesRenderer.js';
import { initTheme } from './modules/handleTheme.js';

document.getElementById('navbar').innerHTML = navbarHtml;
document.getElementById('footer').innerHTML = footerHtml;
document.getElementById('catalogColumn').innerHTML = catalogColumnHtml;
document.getElementById('favouritesColumn').innerHTML = favouritesColumnHtml;

const catalogContainer = document.getElementById('catalog');
const favouritesList = document.getElementById('favourites-list');

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

function addMobileFavouritesTrigger() {
    const favouritesCol = document.querySelector('.favourites-column');
    if (!favouritesCol) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;

    if (favouritesCol.querySelector('.favourites-trigger')) return;

    const trigger = document.createElement('div');
    trigger.className = 'favourites-trigger';
    trigger.innerHTML = `
        <div class="heart-square">
            <svg class="heart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
        </div>
    `;
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        favouritesCol.classList.add('open');
    });
    favouritesCol.appendChild(trigger);

    document.addEventListener('click', (e) => {
        if (favouritesCol.classList.contains('open') && !favouritesCol.contains(e.target)) {
            favouritesCol.classList.remove('open');
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            favouritesCol.classList.remove('open');
        }
    });
}

function initMobileFavourites() {
    const favouritesCol = document.querySelector('.favourites-column');
    if (!favouritesCol) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;

    if (!favouritesCol.querySelector('.favourites-trigger')) {
        const trigger = document.createElement('div');
        trigger.className = 'favourites-trigger';
        trigger.innerHTML = `
            <div class="heart-square">
                <svg class="heart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </div>
        `;
        favouritesCol.appendChild(trigger);
    }

    const trigger = favouritesCol.querySelector('.favourites-trigger');
    if (!trigger) return;

    function closeFavourites() {
        favouritesCol.classList.remove('open');
    }

    function openFavourites(e) {
        e.stopPropagation();
        favouritesCol.classList.add('open');
    }

    trigger.addEventListener('click', openFavourites);

    document.addEventListener('click', (e) => {
        if (favouritesCol.classList.contains('open')) {
            if (e.target.closest('.favourite-btn')) {
                return;
            }
            if (!favouritesCol.contains(e.target)) {
                closeFavourites();
            }
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            favouritesCol.classList.remove('open');
        }
    });
}

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
    initTheme();
    loadFavourites();
    initMobileFavourites();
    addMobileFavouritesTrigger();
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