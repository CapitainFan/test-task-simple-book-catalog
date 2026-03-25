import { isFavourite, addToFavourites, removeFromFavourites } from '../store/store.js';
import { renderFavourites } from './favouritesRenderer.js';
import { getCurrentBooks } from './catalogRenderer.js';

export function attachFavouriteButtons() {
    document.querySelectorAll('.favourite-btn').forEach(btn => {
        btn.removeEventListener('click', handleFavouriteClick);
        btn.addEventListener('click', handleFavouriteClick);
    });
}

function handleFavouriteClick(e) {
    const btn = e.currentTarget;
    const card = btn.closest('[data-id]');
    if (!card) return;
    const bookId = card.getAttribute('data-id');
    if (!bookId) return;

    if (isFavourite(bookId)) {
        removeFromFavourites(bookId);
        btn.classList.remove('favourite-active');
        document.querySelectorAll(`.book-card[data-id="${bookId}"] .favourite-btn`).forEach(b => b.classList.remove('favourite-active'));
        renderFavourites();
    } else {
        let book = getCurrentBooks().find(b => b.id === bookId);
        if (!book) return;
        addToFavourites(book);
        btn.classList.add('favourite-active');
        document.querySelectorAll(`.book-card[data-id="${bookId}"] .favourite-btn`).forEach(b => b.classList.add('favourite-active'));
        renderFavourites();
    }
}