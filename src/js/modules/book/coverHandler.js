import { escapeHtml } from '../../utils/bookUtils'

export function initCoverHandler() {
    const cards = document.querySelectorAll('.book-card, .favourite-card');
    cards.forEach(card => {
        const img = card.querySelector('.book-cover img, .favourite-cover img');
        if (!img) return;

        const title = img.getAttribute('data-title') || '';
        const author = img.getAttribute('data-author') || '';

        function replaceWithPlaceholder() {
            if (!img || !img.parentNode) return;
            const coverDiv = img.parentNode;
            const placeholder = document.createElement('div');
            placeholder.className = 'book-placeholder';
            placeholder.innerHTML = `
                <div class="title">${escapeHtml(title)}</div>
                <div class="author">${escapeHtml(author)}</div>
            `;
            coverDiv.replaceChild(placeholder, img);
        }

        if (!img.src) {
            replaceWithPlaceholder();
            return;
        }

        img.onerror = replaceWithPlaceholder;

        if (img.complete && img.naturalWidth === 0) {
            replaceWithPlaceholder();
        }
    });
}