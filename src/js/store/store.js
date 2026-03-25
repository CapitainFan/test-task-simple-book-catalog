let favourites = [];

export function loadFavourites() {
    const stored = localStorage.getItem('favourites');
    if (stored) favourites = JSON.parse(stored);
}

function saveFavourites() {
    localStorage.setItem('favourites', JSON.stringify(favourites));
}

export function addToFavourites(book) {
    if (!book?.id) return false;
    if (!favourites.some(fav => fav.id === book.id)) {
        favourites.unshift(book);
        saveFavourites();
        return true;
    }
    return false;
}

export function removeFromFavourites(bookId) {
    if (!bookId) return false;
    const len = favourites.length;
    favourites = favourites.filter(book => book.id !== bookId);
    if (favourites.length !== len) {
        saveFavourites();
        return true;
    }
    return false;
}

export function getFavourites() {
    return [...favourites];
}

export function isFavourite(bookId) {
    if (!bookId) return false;
    return favourites.some(book => book.id === bookId);
}