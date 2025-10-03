// Создаем массив с информацией о всех товарах в магазине
const products = [
    {
        id: 1,
        name: "LADA Granta",
        price: 600000,
        image: "./img/IMG_6426.jpg"
    },
    {
        id: 2,
        name: "LADA Vesta",
        price: 1200000,
        image: "./img/vesta.jpg"
    },
    {
        id: 3,
        name: "LADA Iskra",
        price: 850000,
        image: "./img/IMG_6431.jpg"
    },
     {
        id: 4,
        name: "LADA Largus",
        price: 650000,
        image: "./img/IMG_6432.jpg"
    },
     {
        id: 5,
        name: "LADA Aura",
        price: 1050000,
        image: "./img/aura.jpg"
    },
     {
        id: 6,
        name: "LADA NIVA Legend",
        price: 505000,
        image: "./img/IMG_6433.jpg"
    },
     {
        id: 7,
        name: "LADA NIVA Travel",
        price: 735000,
        image: "./img/IMG_6434.jpg"
    },
];

// ===== КОРЗИНА =====
let cartItems = [];

// ===== ЭЛЕМЕНТЫ DOM =====
let cartIcon, cartPopup, closeCart, cartCount, cartItemsList, cartTotal;
let openOrderForm, orderModal, successModal, closeModal, cancelOrder, closeSuccess, orderForm;

function initDOMelements() {
    cartIcon = document.getElementById('cartIcon');
    cartPopup = document.getElementById('cartPopup');
    closeCart = document.getElementById('closeCart');
    cartCount = document.getElementById('cartCount');
    cartItemsList = document.getElementById('cartItems');
    cartTotal = document.getElementById('cartTotal');
    
    // Элементы для формы заказа
    openOrderForm = document.getElementById('openOrderForm');
    orderModal = document.getElementById('orderModal');
    successModal = document.getElementById('successModal');
    closeModal = document.getElementById('closeModal');
    cancelOrder = document.getElementById('cancelOrder');
    closeSuccess = document.getElementById('closeSuccess');
    orderForm = document.getElementById('orderForm');
    
    console.log('Элементы DOM инициализированы');
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function getProductById(productId) {
    return products.find(product => product.id === productId);
}

// Добавляем товар в корзину
function addToCart(productId) {
    console.log('addToCart вызван с productId:', productId);
    
    // Находим товар по ID
    const product = getProductById(productId);
    
    if (!product) {
        console.error('Товар не найден! ID:', productId);
        return;
    }
    
    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
        // Если товар уже есть - увеличиваем количество
        existingItem.quantity += 1;
        console.log('Увеличено количество:', existingItem.quantity);
    } else {
        // Если товара нет - добавляем новый
        cartItems.push({
            ...product,        // Копируем все свойства товара
            quantity: 1        // Добавляем количество
        });
        console.log('Добавлен новый товар');
    }
    
    // Обновляем отображение корзины
    updateCart();
    
    // Показываем всплывающее окно корзины
    if (cartPopup) {
        cartPopup.classList.add('active');
    }
    
    // Сохраняем корзину в localStorage
    saveCartToLocalStorage();
}

// Обновляем отображение корзины
function updateCart() {
    updateCartCount();
    renderCartItems();
    updateTotalPrice();
}

// Обновляем счетчик товаров
function updateCartCount() {
    // Считаем общее количество товаров в корзине
    const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCount) {
        // Обновляем цифру в иконке корзины
        cartCount.textContent = totalCount;
        
        // Скрываем бейдж, если корзина пуста
        if (totalCount === 0) {
            cartCount.style.display = 'none';
        } else {
            cartCount.style.display = 'flex';
        }
    }
}

// Обновляем список товаров в корзине
function renderCartItems() {
    if (!cartItemsList) return;
    
    // Очищаем список
    cartItemsList.innerHTML = '';
    
    // Если корзина пуста - показываем сообщение
    if (cartItems.length === 0) {
        cartItemsList.innerHTML = '<li class="cart-popup__empty">Корзина пуста</li>';
        return;
    }
    
    // Для каждого товара в корзине создаем HTML-элемент
    cartItems.forEach(item => {
        const cartItemElement = document.createElement('li');
        cartItemElement.className = 'cart-item';
        
        // Создаем кнопки с обработчиками событий
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
        
        // Находим кнопки внутри созданного элемента
        const decreaseBtn = cartItemElement.querySelector('.btn--quantity:nth-child(1)');
        const increaseBtn = cartItemElement.querySelector('.btn--quantity:nth-child(3)');
        const removeBtn = cartItemElement.querySelector('.btn--remove');
        
        // Добавляем обработчики событий с передачей event
        decreaseBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Останавливаем всплытие
            decreaseQuantity(item.id, e);
        });
        
        increaseBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Останавливаем всплытие
            increaseQuantity(item.id, e);
        });
        
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Останавливаем всплытие
            removeFromCart(item.id, e);
        });
        
        cartItemsList.appendChild(cartItemElement);
    });
}

// Обновляем общую сумму
function updateTotalPrice() {
    if (!cartTotal) return;
    
    // Считаем общую стоимость всех товаров
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Обновляем элемент на странице
    cartTotal.textContent = total;
}

// Увеличиваем количество товара
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

// Уменьшаем количество товара
function decreaseQuantity(productId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            // Если количество стало 0 - удаляем товар
            removeFromCart(productId, event);
            return;
        }
        updateCart();
        saveCartToLocalStorage();
    }
}

// Удаляем товар из корзины
function removeFromCart(productId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    // Оставляем в массиве только товары с другим ID
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

// ===== ФУНКЦИИ ДЛЯ ФОРМЫ ЗАКАЗА =====
function openOrderModal() {
    if (cartItems.length === 0) {
        alert('Корзина пуста! Добавьте товары перед оформлением заказа.');
        return;
    }
    
    if (cartPopup) cartPopup.classList.remove('active');
    if (orderModal) orderModal.classList.add('active');
    if (orderForm) orderForm.reset();
}

function closeOrderModal() {
    if (orderModal) orderModal.classList.remove('active');
}

function openSuccessModal() {
    if (successModal) successModal.classList.add('active');
}

function closeSuccessModal() {
    if (successModal) successModal.classList.remove('active');
}

function handleOrderSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(orderForm);
    const orderData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        address: formData.get('address'),
        phone: formData.get('phone'),
        items: [...cartItems],
        total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        orderDate: new Date().toLocaleString()
    };
    
    console.log('Данные заказа:', orderData);
    
    closeOrderModal();
    cartItems = [];
    updateCart();
    saveCartToLocalStorage();
    openSuccessModal();
}

function setupPhoneMask() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            value = value.replace(/^(\d)/, '+$1');
        }
        if (value.length > 2) {
            value = value.replace(/^(\+\d)(\d)/, '$1 $2');
        }
        if (value.length > 3) {
            value = value.replace(/^(\+\d\s)(\d{3})/, '$1($2) ');
        }
        if (value.length > 8) {
            value = value.replace(/^(\+\d\s\(\d{3}\)\s)(\d{3})/, '$1$2');
        }
        if (value.length > 11) {
            value = value.replace(/^(\+\d\s\(\d{3}\)\s\d{3})(\d{2})/, '$1$2');
        }
        if (value.length > 14) {
            value = value.substring(0, 16);
        }
        
        e.target.value = value;
    });
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
function setupEventListeners() {
    // Корзина
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            cartPopup.classList.toggle('active');
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartPopup.classList.remove('active');
        });
    }
    
    // Форма заказа
    if (openOrderForm) {
        openOrderForm.addEventListener('click', openOrderModal);
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeOrderModal);
    }
    
    if (cancelOrder) {
        cancelOrder.addEventListener('click', closeOrderModal);
    }
    
    if (closeSuccess) {
        closeSuccess.addEventListener('click', closeSuccessModal);
    }
    
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }
    
    // Глобальные обработчики
    document.addEventListener('click', (e) => {
        if (cartPopup && !cartPopup.contains(e.target) && cartIcon && !cartIcon.contains(e.target)) {
            cartPopup.classList.remove('active');
        }
        
        if (orderModal && e.target === orderModal) {
            closeOrderModal();
        }
        
        if (successModal && e.target === successModal) {
            closeSuccessModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeOrderModal();
            closeSuccessModal();
            if (cartPopup) cartPopup.classList.remove('active');
        }
    });
}

// Обработчики для кнопок "Добавить в корзину"
function setupAddToCartButtons() {
    // Находим все кнопки "Добавить в корзину"
    const addToCartButtons = document.querySelectorAll('.btn--add');
    
    console.log('Найдено кнопок "Добавить в корзину":', addToCartButtons.length);
    
    // Для каждой кнопки добавляем обработчик
    addToCartButtons.forEach((button, index) => {
        console.log(`Кнопка ${index}:`, button);
        console.log(`Data-id:`, button.getAttribute('data-id'));
        
        button.addEventListener('click', (e) => {
            console.log('Клик по кнопке добавления!');
            
            // Получаем ID товара из data-атрибута
            const productId = parseInt(e.target.getAttribute('data-id'));
            console.log('Product ID:', productId);
            
            if (isNaN(productId)) {
                console.error('Ошибка: неверный productId', productId);
                return;
            }
            
            addToCart(productId);
        });
    });
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
function init() {
    console.log('Инициализация магазина...');
    
    // Инициализируем элементы DOM
    initDOMelements();
    
    // Настраиваем обработчики событий
    setupEventListeners();
    
    // Загружаем корзину из localStorage
    loadCartFromLocalStorage();
    
    // Настраиваем кнопки "Добавить в корзину"
    setupAddToCartButtons();
    
    // Настраиваем маску телефона
    setupPhoneMask();
    
    // Обновляем отображение корзины
    updateCart();
    
    console.log('Магазин инициализирован!');
}

// Запускаем инициализацию когда страница полностью загружена
document.addEventListener('DOMContentLoaded', init);
