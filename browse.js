let currentFilters = {
    publisher: 'all',
    genre: 'all',
    character: 'all',
    sort: 'title-asc'
};

function getUniqueValues(key) {
    return [...new Set(comics.map(c => c[key]))].sort();
}

function initFilters() {
    const publisherFilter = document.getElementById('publisher-filter');
    const genreFilter = document.getElementById('genre-filter');
    const characterFilter = document.getElementById('character-filter');
    
    getUniqueValues('publisher').forEach(publisher => {
        const option = document.createElement('option');
        option.value = publisher;
        option.textContent = publisher;
        publisherFilter.appendChild(option);
    });
    
    getUniqueValues('genre').forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
    
    getUniqueValues('character').forEach(character => {
        const option = document.createElement('option');
        option.value = character;
        option.textContent = character;
        characterFilter.appendChild(option);
    });
    
    publisherFilter.addEventListener('change', (e) => {
        currentFilters.publisher = e.target.value;
        applyFilters();
    });
    
    genreFilter.addEventListener('change', (e) => {
        currentFilters.genre = e.target.value;
        applyFilters();
    });
    
    characterFilter.addEventListener('change', (e) => {
        currentFilters.character = e.target.value;
        applyFilters();
    });
    
    document.getElementById('sort-select').addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        applyFilters();
    });
}

function filterAndSortComics() {
    let filtered = comics.filter(comic => {
        if (currentFilters.publisher !== 'all' && comic.publisher !== currentFilters.publisher) return false;
        if (currentFilters.genre !== 'all' && comic.genre !== currentFilters.genre) return false;
        if (currentFilters.character !== 'all' && comic.character !== currentFilters.character) return false;
        return true;
    });
    
    filtered.sort((a, b) => {
        switch (currentFilters.sort) {
            case 'title-asc':
                return a.title.localeCompare(b.title);
            case 'title-desc':
                return b.title.localeCompare(a.title);
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'date-newest':
                return new Date(b.releaseDate) - new Date(a.releaseDate);
            case 'date-oldest':
                return new Date(a.releaseDate) - new Date(b.releaseDate);
            default:
                return 0;
        }
    });
    
    return filtered;
}

function createComicCard(comic) {
    const badges = [];
    if (comic.featured) badges.push('<span class="badge badge-featured">Featured</span>');
    if (comic.popular) badges.push('<span class="badge badge-popular">Popular</span>');
    
    return `
        <div class="comic-card" onclick="window.location.href='comic-detail.html?id=${comic.id}'">
            <div class="comic-image">
                <img src="${comic.coverImage}" alt="${comic.title}">
                <div class="comic-badges">
                    ${badges.join('')}
                </div>
            </div>
            <div class="comic-content">
                <div class="comic-header">
                    <h3 class="comic-title">${comic.title}</h3>
                    <span class="comic-price">₹${comic.price.toFixed(2)}</span>
                </div>
                <div class="comic-meta">
                    <span class="badge badge-genre">${comic.publisher}</span>
                    <span class="badge badge-genre">${comic.genre}</span>
                </div>
                <p class="comic-description">${comic.description}</p>
                <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart('${comic.id}')">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 2L1 6v16l8 4 8-4 8 4V6l-8-4-8 4z"/>
                        <path d="M1 6l8 4m8-4l-8 4m0 0v16"/>
                    </svg>
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

function updateActiveFilters() {
    const activeFiltersContainer = document.getElementById('active-filters');
    const activeFilters = [];
    
    if (currentFilters.publisher !== 'all') {
        activeFilters.push(`
            <span class="text-gray-400 text-sm">Active filters:</span>
            <button class="filter-tag" onclick="clearFilter('publisher')">${currentFilters.publisher} ×</button>
        `);
    }
    
    if (currentFilters.genre !== 'all') {
        if (activeFilters.length === 0) {
            activeFilters.push('<span class="text-gray-400 text-sm">Active filters:</span>');
        }
        activeFilters.push(`
            <button class="filter-tag" onclick="clearFilter('genre')">${currentFilters.genre} ×</button>
        `);
    }
    
    if (currentFilters.character !== 'all') {
        if (activeFilters.length === 0) {
            activeFilters.push('<span class="text-gray-400 text-sm">Active filters:</span>');
        }
        activeFilters.push(`
            <button class="filter-tag" onclick="clearFilter('character')">${currentFilters.character} ×</button>
        `);
    }
    
    activeFiltersContainer.innerHTML = activeFilters.join('');
}

function applyFilters() {
    const filtered = filterAndSortComics();
    const grid = document.getElementById('browse-grid');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    const totalComics = document.getElementById('total-comics');
    
    totalComics.textContent = comics.length;
    resultsCount.textContent = filtered.length;
    
    if (filtered.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
    } else {
        grid.style.display = 'grid';
        noResults.style.display = 'none';
        grid.innerHTML = filtered.map(createComicCard).join('');
    }
    
    updateActiveFilters();
}

function clearFilter(filterName) {
    currentFilters[filterName] = 'all';
    document.getElementById(`${filterName}-filter`).value = 'all';
    applyFilters();
}

function clearFilters() {
    currentFilters = {
        publisher: 'all',
        genre: 'all',
        character: 'all',
        sort: 'title-asc'
    };
    
    document.getElementById('publisher-filter').value = 'all';
    document.getElementById('genre-filter').value = 'all';
    document.getElementById('character-filter').value = 'all';
    document.getElementById('sort-select').value = 'title-asc';
    
    applyFilters();
}

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    applyFilters();
});
