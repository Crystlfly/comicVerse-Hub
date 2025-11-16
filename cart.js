function getCart() {
    const cart = localStorage.getItem('comicverse-cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('comicverse-cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(comicId) {
    const comic = comics.find(c => c.id === comicId);
    if (!comic) return;

    const cart = getCart();
    const existingItem = cart.find(item => item.id === comicId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...comic, quantity: 1 });
    }

    saveCart(cart);
    showNotification(`${comic.title} added to cart!`);
}

function removeFromCart(comicId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== comicId);
    saveCart(cart);
}

function updateQuantity(comicId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === comicId);
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(comicId);
        } else {
            item.quantity = quantity;
            saveCart(cart);
        }
    }
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCartCount() {
    const cartCounts = document.querySelectorAll('.cart-count');
    const count = getCartItemCount();
    cartCounts.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #dc2626;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', updateCartCount);

document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
});
