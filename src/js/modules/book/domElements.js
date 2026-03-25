export let loaderDiv = null;
export let errorDiv = null;
export let loadMoreButton = null;

export function createLoader(catalogContainer) {
    loaderDiv = document.createElement('div');
    loaderDiv.id = 'loader';
    loaderDiv.style.display = 'none';
    loaderDiv.innerHTML = '<div class="spinner"></div> Loading...';
    catalogContainer.parentNode.insertBefore(loaderDiv, catalogContainer.nextSibling);
    return loaderDiv;
}

export function createError(catalogContainer) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.style.display = 'none';
    errorDiv.style.color = 'red';
    errorDiv.style.padding = '10px';
    catalogContainer.parentNode.insertBefore(errorDiv, catalogContainer.nextSibling);
    return errorDiv;
}

export function createLoadMoreButton(catalogContainer) {
    loadMoreButton = document.createElement('button');
    loadMoreButton.id = 'load-more';
    loadMoreButton.textContent = 'Load more';
    loadMoreButton.style.display = 'none';
    loadMoreButton.style.margin = '20px auto';
    loadMoreButton.style.padding = '10px 20px';
    catalogContainer.parentNode.insertBefore(loadMoreButton, catalogContainer.nextSibling);
    return loadMoreButton;
}