import { searchBooks, getErrorState } from '../../api/bookApi.js';
import { setBooks, appendBooks, getAllBooks } from '../book/catalogRenderer.js';
import { populateAuthorFilter } from '../navbar/authorFilter.js';
import { loaderDiv, errorDiv, loadMoreButton } from '../book/domElements.js';

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

export async function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput?.value?.trim() || '';

    if (query.length <= 3) return;

    currentQuery = query;
    currentPage = 1;
    await loadBooks(query, 1, false);
}

export async function loadMore() {
    if (!currentQuery) return;
    await loadBooks(currentQuery, currentPage + 1, true);
}

export async function loadInitialBooks(query = 'frontend') {
    currentQuery = query;
    currentPage = 1;
    const result = await searchBooks(query, 1, 30);
    setBooks(result.books);
    totalBooks = result.total;
    if (getAllBooks().length < totalBooks) {
        loadMoreButton.style.display = 'block';
        loadMoreButton.disabled = false;
    }
    populateAuthorFilter();
}