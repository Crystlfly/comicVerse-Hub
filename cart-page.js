function renderCartPage() {
    const cart = getCart();
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.getElementById('cart-content');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
    } else {
        emptyCart.style.display = 'none';
        cartContent.style.display = 'block';
        renderCartItems(cart);
        updateCartSummary(cart);
    }
}

function renderCartItems(cart) {
    const container = document.getElementById('cart-items-list');
    const itemCountEl = document.getElementById('cart-item-count');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    itemCountEl.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image" onclick="window.location.href='comic-detail.html?id=${item.id}'">
                <img src="${item.coverImage}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-title" onclick="window.location.href='comic-detail.html?id=${item.id}'">${item.title}</h3>
                <div class="cart-item-meta">
                    <span class="badge badge-genre">${item.publisher}</span>
                    <span class="badge badge-genre">${item.genre}</span>
                </div>
                <p class="cart-item-description">${item.description}</p>
                <div class="cart-item-footer">
                    <div class="cart-item-qty">
                        <span>Qty:</span>
                        <div class="cart-qty-controls">
                            <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <span class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="cart-delete-btn" onclick="removeCartItem('${item.id}')">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCartSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
}

function updateCartQuantity(comicId, newQuantity) {
    updateQuantity(comicId, newQuantity);
    renderCartPage();
}

function removeCartItem(comicId) {
    removeFromCart(comicId);
    renderCartPage();
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) return;
    
    document.getElementById('cart-content').style.display = 'none';
    document.getElementById('empty-cart').style.display = 'none';
    document.getElementById('checkout-success').style.display = 'block';
    
    setTimeout(() => {
        localStorage.removeItem('comicverse-cart');
        window.location.href = 'index.html';
    }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
});
