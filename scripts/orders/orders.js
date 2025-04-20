import { getOrders } from '../../data/orders.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { cart, updateCartQuantity, addToCart } from '../../data/cart.js';

let allOrders = []; // Store full orders list for filtering

// Main function to render orders
function renderOrders() {
    allOrders = getOrders();
    const ordersContainer = document.querySelector('.orders-grid');
    
    updateCartQuantity();

    if (!allOrders.length) {
        showEmptyOrdersMessage(ordersContainer);
        return;
    }

    renderOrdersList(allOrders, ordersContainer);
    setupEventListeners();
}

// Show message when no orders exist
function showEmptyOrdersMessage(container) {
    container.innerHTML = `
        <div class="empty-orders-message">
            You have not placed any orders yet.
            <a href="amazon.html" class="shop-link">Start shopping</a>
        </div>
    `;
}

// Render the list of orders
function renderOrdersList(orders, container) {
    container.innerHTML = orders.map(order => `
        <div class="order-container">
            ${renderOrderHeader(order)}
            ${renderOrderItems(order)}
        </div>
    `).join('');
}

// Render the order header section
function renderOrderHeader(order) {
    const orderDate = new Date(order.orderDate);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return `
        <div class="order-header">
            <div class="order-header-left-section">
                <div class="order-date">
                    <div class="order-header-label">Order Placed:</div>
                    <div>${formattedDate}</div>
                </div>
                <div class="order-total">
                    <div class="order-header-label">Total:</div>
                    <div>$${(order.total.totalCents / 100).toFixed(2)}</div>
                </div>
            </div>
            <div class="order-header-right-section">
                <div class="order-header-label">Order ID:</div>
                <div>${order.id}</div>
            </div>
        </div>
    `;
}

// Render all items in an order
function renderOrderItems(order) {
    return order.items.map(item => {
        const product = getProduct(item.productId);
        const deliveryOption = getDeliveryOption(item.deliveryOptionId);
        const deliveryDate = calculateDeliveryDate(deliveryOption.deliveryDays);
        
        return `
            <div class="order-details-grid">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-details">
                    <div class="product-name">${product.name}</div>
                    <div class="product-delivery-date">
                        Arriving on: ${deliveryDate}
                    </div>
                    <div class="product-quantity">
                        Quantity: ${item.quantity}
                    </div>
                    <button class="buy-again-button button-primary" 
                            data-product-id="${product.id}" >
                        <img class="buy-again-icon" src="images/icons/buy-again.png" alt="Buy again">
                        <span class="buy-again-message">Buy it again</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Calculate and format delivery date
function calculateDeliveryDate(deliveryDays) {
    const date = new Date();
    date.setDate(date.getDate() + deliveryDays);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
    });
}

// Set up all event listeners
function setupEventListeners() {
    setupBuyAgainButtons();
    setupTrackPackageButtons();
    setupSearchInput(); // ← Add this
}

// Set up buy again button handlers
function setupBuyAgainButtons() {
    document.querySelectorAll('.buy-again-button').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            addToCart(productId);
            updateCartQuantity();
            showAddedToCartNotification();
        });
    });
}


// Handle package tracking
function trackPackage(orderId, productId) {
    sessionStorage.setItem('trackingOrderId', orderId);
    sessionStorage.setItem('trackingProductId', productId);
    window.location.href = 'tracking.html';
}

// Filter orders based on search input
function filterOrders(searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();

    const filtered = allOrders.filter(order =>
        order.items.some(item => {
            const product = getProduct(item.productId);
            return product.name.toLowerCase().includes(lowerSearch);
        })
    );

    const ordersContainer = document.querySelector('.orders-grid');

    if (!filtered.length) {
        showEmptyOrdersMessage(ordersContainer);
    } else {
        renderOrdersList(filtered, ordersContainer);
    }
}

// Hook up search input listener
function setupSearchInput() {
    const input = document.getElementById('order-search-input');
    input.addEventListener('input', (e) => {
        filterOrders(e.target.value);
    });
}

// Initialize the page
renderOrders();
