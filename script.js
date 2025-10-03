// Создаем массив с информацией о всех товарах в магазине
const products = [
    {
        id: 1,
        name: "LADA Granta",
        price: 600000,
        image: "img/product1.jpg"
    },
    {
        id: 2,
        name: "LADA Vesta",
        price: 1200000,
        image: "img/product2.jpg"
    },
    {
        id: 3,
        name: "LADA Iskra",
        price: 850000,
        image: "img/product3.jpg"
    },
     {
        id: 4,
        name: "LADA Iskra",
        price: 850000,
        image: "img/product3.jpg"
    },
     {
        id: 5,
        name: "LADA Iskra",
        price: 850000,
        image: "img/product3.jpg"
    },
     {
        id: 6,
        name: "LADA Iskra",
        price: 850000,
        image: "img/product3.jpg"
    },
     {
        id: 7,
        name: "LADA Iskra",
        price: 850000,
        image: "img/product3.jpg"
    },
];

// ===== КОРЗИНА =====
let cartItems = [];

// ===== ЭЛЕМЕНТЫ DOM =====
const cartIcon = document.getElementById('cartIcon');
const cartPopup = document.getElementById('cartPopup');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItemsList = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function getProductById(productId) {
    return products.find(product => product.id === productId);
}

function addToCart(productId) {
    const product = getProductById(productId);
    
    if (!product) {
        console.error('Товар не найден!');
        return;
    }
    
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    cartPopup.classList.add('active');
    saveCartToLocalStorage();
}

function updateCart() {
    updateCartCount();
    renderCartItems();
    updateTotalPrice();
}

function updateCartCount() {
    const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalCount;
    
    if (totalCount === 0) {
        cartCount.style.display = 'none';
    } else {
        cartCount.style.display = 'flex';
    }
}

function renderCartItems() {
    cartItemsList.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsList.innerHTML = '<li class="cart-popup__empty">Корзина пуста</li>';
        return;
    }
    
    cartItems.forEach(item => {
        const cartItemElement = document.createElement('li');
        cartItemElement.className = 'cart-item';
        
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item__image">
            <div class="cart-item__info">
                <div class="cart-item__name">${item.name}</div>
                <div class="cart-item__price">${item.price} руб.</div>
            </div>
            <div class="cart-item__controls">
                <button class="btn btn--quantity">-</button>
                <span class="cart-item__quantity">${item.quantity}</span>
                <button class="btn btn--quantity">+</button>
                <button class="btn btn--remove">×</button>
            </div>
        `;
        
        const decreaseBtn = cartItemElement.querySelector('.btn--quantity:nth-child(1)');
        const increaseBtn = cartItemElement.querySelector('.btn--quantity:nth-child(3)');
        const removeBtn = cartItemElement.querySelector('.btn--remove');
        
        decreaseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            decreaseQuantity(item.id, e);
        });
        
        increaseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            increaseQuantity(item.id, e);
        });
        
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromCart(item.id, e);
        });
        
        cartItemsList.appendChild(cartItemElement);
    });
}

function updateTotalPrice() {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total;
}

function increaseQuantity(productId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        item.quantity += 1;
        updateCart();
        saveCartToLocalStorage();
    }
}

function decreaseQuantity(productId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(productId, event);
            return;
        }
        updateCart();
        saveCartToLocalStorage();
    }
}

function removeFromCart(productId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    cartItems = cartItems.filter(item => item.id !== productId);
    updateCart();
    saveCartToLocalStorage();
}

// ===== LOCALSTORAGE =====
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCart();
    }
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
cartIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    cartPopup.classList.toggle('active');
});

closeCart.addEventListener('click', () => {
    cartPopup.classList.remove('active');
});

document.addEventListener('click', (e) => {
    if (!cartPopup.contains(e.target) && !cartIcon.contains(e.target)) {
        cartPopup.classList.remove('active');
    }
});

function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.btn--add');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
function init() {
    loadCartFromLocalStorage();
    setupAddToCartButtons();
    updateCart();
    console.log('Магазин инициализирован!');
}

document.addEventListener('DOMContentLoaded', init);