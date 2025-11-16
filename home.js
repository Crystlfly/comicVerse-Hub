let currentSlide = 0;
const featuredComics = comics.filter(c => c.featured);
let carouselInterval;

function initCarousel() {
    const carouselContainer = document.querySelector('.hero-carousel');
    const indicatorsContainer = document.querySelector('.carousel-indicators');

    const existingSlides = carouselContainer.querySelectorAll('.carousel-slide');
    existingSlides.forEach((slide, index) => {
        if (index > 0) slide.remove();
    });

    featuredComics.forEach((comic, index) => {
        if (index === 0) {
            const firstSlide = carouselContainer.querySelector('.carousel-slide');
            updateSlideContent(firstSlide, comic);
        } else {
            const slide = createSlide(comic);
            carouselContainer.insertBefore(slide, carouselContainer.querySelector('.carousel-prev'));
        }

        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(dot);
    });

    startCarousel();
}

function createSlide(comic) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    updateSlideContent(slide, comic);
    return slide;
}

function updateSlideContent(slide, comic) {
    slide.innerHTML = `
        <img src="${comic.coverImage}" alt="${comic.title}" class="carousel-bg">
        <div class="carousel-overlay"></div>
        <div class="carousel-content">
            <div class="carousel-badges">
                <span class="badge badge-featured">Featured</span>
                <span class="badge badge-publisher">${comic.publisher}</span>
            </div>
            <h1 class="carousel-title">${comic.title}</h1>
            <p class="carousel-description">${comic.description}</p>
            <div class="carousel-actions">
                <a href="comic-detail.html?id=${comic.id}" class="btn btn-primary">View Details</a>
                <a href="comic-detail.html?id=${comic.id}" class="btn btn-secondary">Learn More</a>
            </div>
        </div>
    `;
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    resetCarousel();
}

function nextSlide() {
    goToSlide((currentSlide + 1) % featuredComics.length);
}

function prevSlide() {
    goToSlide((currentSlide - 1 + featuredComics.length) % featuredComics.length);
}

function startCarousel() {
    carouselInterval = setInterval(nextSlide, 5000);
}

function resetCarousel() {
    clearInterval(carouselInterval);
    startCarousel();
}

function updatePublisherCounts() {
    const marvelCount = comics.filter(c => c.publisher === 'Marvel').length;
    const dcCount = comics.filter(c => c.publisher === 'DC').length;
    const imageCount = comics.filter(c => c.publisher === 'Image').length;
    
    document.getElementById('marvel-count').textContent = `${marvelCount} Comics Available`;
    document.getElementById('dc-count').textContent = `${dcCount} Comics Available`;
    document.getElementById('image-count').textContent = `${imageCount} Comics Available`;
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

function renderNewReleases() {
    const newReleases = [...comics]
        .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
        .slice(0, 4);
    
    const grid = document.getElementById('new-releases-grid');
    grid.innerHTML = newReleases.map(createComicCard).join('');
}

function renderPopularComics() {
    const popularComics = comics.filter(c => c.popular).slice(0, 4);
    
    const grid = document.getElementById('popular-grid');
    grid.innerHTML = popularComics.map(createComicCard).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    updatePublisherCounts();
    renderNewReleases();
    renderPopularComics();

    document.querySelector('.carousel-prev').addEventListener('click', prevSlide);
    document.querySelector('.carousel-next').addEventListener('click', nextSlide);
});
