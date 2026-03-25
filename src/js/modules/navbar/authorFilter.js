import { getUniqueAuthors, setAuthorFilter } from '../book/catalogRenderer.js';

export function populateAuthorFilter() {
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

export function handleAuthorFilterChange(e) {
    setAuthorFilter(e.target.value);
}