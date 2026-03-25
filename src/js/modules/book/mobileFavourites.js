export function initMobileFavourites() {
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