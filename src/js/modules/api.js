let isLoading = false;
let isError = false;
let errorMessage = '';

export function getLoadingState() {
    return isLoading;
}

export function getErrorState() {
    return { isError, message: errorMessage };
}

export async function searchBooks(searchLine, page = 1, limit = 20) {
    isLoading = true;
    isError = false;
    errorMessage = '';

    try {
        const encodedQuery = encodeURIComponent(searchLine);
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodedQuery}&page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('Ошибка сети: ' + response.status);
        const data = await response.json();
        const books = data.docs.map(doc => ({
            id: doc.key,
            title: doc.title || 'Без названия',
            author_name: doc.author_name || ['Автор не указан'],
            first_publish_year: doc.first_publish_year || null,
            cover_i: doc.cover_i || null
        }));
        return {
            books,
            total: data.numFound || 0,
            page,
            limit
        };
    } catch (err) {
        isError = true;
        errorMessage = err.message;
        return { books: [], total: 0, page, limit };
    } finally {
        isLoading = false;
    }
}

export function getCoverById(coverId, size = 'M') {
    if (!coverId) return '';
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}