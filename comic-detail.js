let currentComic = null;
let quantity = 1;

function getComicIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function loadComicDetails() {
    const comicId = getComicIdFromUrl();
    currentComic = comics.find(c => c.id === comicId);
    
    if (!currentComic) {
        document.querySelector('.detail-page').innerHTML = `
            <div class="container" style="text-align: center; padding: 4rem 1rem;">
                <h2 style="color: #fff; font-size: 1.875rem; margin-bottom: 1rem;">Comic not found</h2>
                <a href="browse.html" class="btn btn-primary">Browse Comics</a>
            </div>
        `;
        return;
    }

    document.title = `${currentComic.title} - ComicVerse Hub`;

    document.getElementById('comic-image').src = currentComic.coverImage;
    document.getElementById('comic-image').alt = currentComic.title;

    const badges = [];
    badges.push(`<span class="badge badge-featured">${currentComic.publisher}</span>`);
    badges.push(`<span class="badge badge-genre">${currentComic.genre}</span>`);
    if (currentComic.featured) badges.push('<span class="badge badge-popular">Featured</span>');
    document.getElementById('comic-badges').innerHTML = badges.join('');
    
    document.getElementById('comic-title').textContent = currentComic.title;
    document.getElementById('comic-price').textContent = `₹${currentComic.price.toFixed(2)}`;

    document.getElementById('comic-description').textContent = currentComic.description;

    document.getElementById('comic-writer').textContent = currentComic.creators.writer;
    document.getElementById('comic-artist').textContent = currentComic.creators.artist;
    document.getElementById('comic-colorist').textContent = currentComic.creators.colorist;

    document.getElementById('comic-pages').textContent = currentComic.pages;
    document.getElementById('comic-date').textContent = new Date(currentComic.releaseDate).toLocaleDateString();

    loadRelatedComics();
}

function loadRelatedComics() {
    const related = comics
        .filter(c => 
            c.id !== currentComic.id && 
            (c.publisher === currentComic.publisher || c.genre === currentComic.genre)
        )
        .slice(0, 4);
    
    if (related.length === 0) {
        document.getElementById('related-section').style.display = 'none';
        return;
    }
    
    const grid = document.getElementById('related-grid');
    grid.innerHTML = related.map(comic => `
        <div class="comic-card" onclick="window.location.href='comic-detail.html?id=${comic.id}'">
            <div class="comic-image">
                <img src="${comic.coverImage}" alt="${comic.title}">
            </div>
            <div class="comic-content">
                <h3 class="comic-title">${comic.title}</h3>
                <span class="comic-price">₹${comic.price.toFixed(2)}</span>
            </div>
        </div>
    `).join('');
}

function initZoom() {
    const wrapper = document.getElementById('comic-image-wrapper');
    wrapper.addEventListener('click', () => {
        wrapper.classList.toggle('zoomed');
    });
}

function incrementQty() {
    quantity++;
    updateQuantityDisplay();
}

function decrementQty() {
    if (quantity > 1) {
        quantity--;
        updateQuantityDisplay();
    }
}

function updateQuantityDisplay() {
    document.getElementById('quantity').textContent = quantity;
    const total = (currentComic.price * quantity).toFixed(2);
    document.getElementById('add-cart-text').textContent = `Add to Cart - ₹${total}`;
}

function addToCartFromDetail() {
    if (!currentComic) return;
    
    for (let i = 0; i < quantity; i++) {
        addToCart(currentComic.id);
    }
    
    quantity = 1;
    updateQuantityDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
    loadComicDetails();
    initZoom();
    updateQuantityDisplay();
});
