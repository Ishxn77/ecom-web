// Product data
const products = {
    mens: [
        {
            id: 'm1',
            name: 'Classic White T-Shirt',
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            sizes: ['S', 'M', 'L', 'XL'],
            category: 'mens'
        },
        {
            id: 'm2',
            name: 'Slim Fit Jeans',
            price: 59.99,
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            sizes: ['30', '32', '34', '36'],
            category: 'mens'
        },
        {
            id: 'm3',
            name: 'Casual Blazer',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            sizes: ['S', 'M', 'L', 'XL'],
            category: 'mens'
        }
    ],
    ladies: [
        {
            id: 'l1',
            name: 'Floral Summer Dress',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            sizes: ['XS', 'S', 'M', 'L'],
            category: 'ladies'
        },
        {
            id: 'l2',
            name: 'High-Waisted Pants',
            price: 45.99,
            image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5e757?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            sizes: ['XS', 'S', 'M', 'L'],
            category: 'ladies'
        },
        {
            id: 'l3',
            name: 'Silk Blouse',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            sizes: ['XS', 'S', 'M', 'L'],
            category: 'ladies'
        }
    ]
};

// Cart state
let cart = [];

// Load cart from localStorage
function loadCart() {
    console.log('Loading cart from localStorage...');
    const savedCart = localStorage.getItem('cart');
    console.log('Raw saved cart data:', savedCart);
    
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            console.log('Cart loaded from localStorage:', cart);
        } catch (e) {
            console.error('Error parsing cart from localStorage:', e);
            cart = [];
        }
    } else {
        console.log('No cart found in localStorage');
    }
    updateCartCount();
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => {
            // Handle different cart item formats
            const quantity = item.quantity || item.qty || 0;
            return sum + quantity;
        }, 0);
        cartCount.textContent = totalItems;
    }
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden';
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover">
        <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
            <p class="text-gray-600 mb-4">₹${(product.price * 83).toFixed(2)}</p>
            <div class="flex items-center space-x-2 mb-4">
                <label class="text-sm text-gray-600">Size:</label>
                <select class="size-select border rounded px-2 py-1">
                    ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                </select>
            </div>
            <button 
                class="add-to-cart w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
                data-id="${product.id}"
                data-category="${product.category}">
                Add to Cart
            </button>
        </div>
    `;

    // Add to cart click handler
    const addToCartBtn = card.querySelector('.add-to-cart');
    const sizeSelect = card.querySelector('.size-select');

    addToCartBtn.addEventListener('click', () => {
        const selectedSize = sizeSelect.value;
        addToCart(product, selectedSize);
    });

    return card;
}

// Add to cart
function addToCart(product, selectedSize) {
    console.log('Adding to cart:', product, 'with size:', selectedSize);
    console.log('Current cart before adding:', cart);
    
    const existingItem = cart.find(item => item.id === product.id && item.size === selectedSize);

    if (existingItem) {
        existingItem.quantity += 1;
        console.log('Updated existing item quantity:', existingItem);
    } else {
        const newItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            quantity: 1,
            category: product.category
        };
        cart.push(newItem);
        console.log('Added new item to cart:', newItem);
    }

    console.log('Cart after adding item:', cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Saved cart to localStorage:', localStorage.getItem('cart'));
    
    updateCartCount();
    
    // Show fancy confirmation message
    showFancyNotification(product);
}

// Show fancy notification
function showFancyNotification(product) {
    // Create notification container
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 transform transition-all duration-500 ease-in-out translate-x-full';
    notification.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl overflow-hidden flex items-center max-w-md">
            <div class="bg-green-500 p-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <div class="p-4 flex items-center">
                <img src="${product.image}" alt="${product.name}" class="h-16 w-16 object-cover rounded mr-4">
                <div>
                    <h3 class="font-semibold text-gray-800">Added to Cart!</h3>
                    <p class="text-gray-600 text-sm">${product.name}</p>
                    <p class="text-gray-500 text-xs">₹${(product.price * 83).toFixed(2)}</p>
                </div>
            </div>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
}

// Update cart item quantity
function updateQuantity(index, newQuantity) {
    if (newQuantity > 0) {
        // Handle different cart item formats
        if (cart[index].quantity !== undefined) {
            cart[index].quantity = newQuantity;
        } else if (cart[index].qty !== undefined) {
            cart[index].qty = newQuantity;
        } else {
            cart[index].quantity = newQuantity;
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        if (window.location.pathname.includes('cart.html') || window.location.href.includes('cart.html')) {
            renderCart();
        }
    }
}

// Render cart items
function renderCart() {
    console.log('renderCart function called');
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');

    if (!cartItemsContainer) {
        console.error('Cart items container not found!');
        return;
    }

    console.log('Rendering cart with items:', cart);

    if (cart.length === 0) {
        console.log('Cart is empty, showing empty cart message');
        cartItemsContainer.parentElement.classList.add('hidden');
        emptyCartMessage.classList.remove('hidden');
        return;
    }

    console.log('Cart has items, rendering them');
    cartItemsContainer.parentElement.classList.remove('hidden');
    emptyCartMessage.classList.add('hidden');

    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        // Validate item data
        if (!item || typeof item !== 'object') {
            console.error('Invalid cart item:', item);
            return; // Skip this item
        }

        // Handle different cart item formats
        const itemPrice = item.price || 0;
        const itemQuantity = item.quantity || item.qty || 0;
        const itemSize = item.size || 'N/A';
        const itemName = item.name || 'Unknown Item';
        const itemImage = item.image || 'https://via.placeholder.com/150';
        
        subtotal += itemPrice * itemQuantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'flex items-center bg-white p-4 rounded-lg shadow-md';
        cartItem.innerHTML = `
            <img src="${itemImage}" alt="${itemName}" class="w-24 h-24 object-cover rounded">
            <div class="ml-4 flex-grow">
                <h3 class="font-semibold">${itemName}</h3>
                <p class="text-gray-600">Size: ${itemSize}</p>
                <p class="text-gray-600">₹${(itemPrice * 83).toFixed(2)}</p>
                <div class="flex items-center mt-2">
                    <button class="quantity-btn bg-gray-200 px-2 py-1 rounded" data-action="decrease" data-index="${index}">-</button>
                    <span class="mx-2">${itemQuantity}</span>
                    <button class="quantity-btn bg-gray-200 px-2 py-1 rounded" data-action="increase" data-index="${index}">+</button>
                </div>
            </div>
            <button class="remove-item ml-4 text-red-500 hover:text-red-700" data-index="${index}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    // Add event listeners for quantity buttons and remove buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            const action = e.target.dataset.action;
            const currentQuantity = cart[index].quantity || cart[index].qty || 0;
            
            if (action === 'increase') {
                updateQuantity(index, currentQuantity + 1);
            } else if (action === 'decrease') {
                updateQuantity(index, currentQuantity - 1);
            }
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('.remove-item').dataset.index);
            removeFromCart(index);
        });
    });

    // Update totals
    const shipping = subtotal >= 50 ? 0 : 5;
    const total = subtotal + shipping;

    subtotalElement.textContent = `₹${(subtotal * 83).toFixed(2)}`;
    shippingElement.textContent = shipping === 0 ? 'FREE' : `₹${(shipping * 83).toFixed(2)}`;
    totalElement.textContent = `₹${(total * 83).toFixed(2)}`;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    console.log('Current URL:', window.location.href);
    
    // Load cart from localStorage first
    loadCart();
    
    // Check if we're on the cart page - more reliable detection
    const isCartPage = window.location.href.includes('cart.html') || 
                       window.location.pathname.includes('cart.html') ||
                       document.getElementById('cart-items') !== null;
    
    console.log('Is cart page?', isCartPage);
    
    if (isCartPage) {
        console.log('On cart page, rendering cart');
        // Small delay to ensure DOM is fully loaded
        setTimeout(() => {
            renderCart();
        }, 100);
    } else {
        console.log('Not on cart page, skipping cart rendering');
    }

    // Render products on category pages
    const mensProductsContainer = document.getElementById('mens-products');
    const ladiesProductsContainer = document.getElementById('ladies-products');

    if (mensProductsContainer) {
        products.mens.forEach(product => {
            mensProductsContainer.appendChild(createProductCard(product));
        });
    }

    if (ladiesProductsContainer) {
        products.ladies.forEach(product => {
            ladiesProductsContainer.appendChild(createProductCard(product));
        });
    }
    
    // Add user icon click handler
    const userIcon = document.querySelector('a[href="#"]');
    if (userIcon) {
        userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            showUserAuthPopup();
        });
    }
});

// Show user authentication popup
function showUserAuthPopup() {
    // Create popup container
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    popup.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 scale-95 opacity-0">
            <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-800">User Authentication</h2>
                    <button class="close-popup text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="mb-6">
                    <p class="text-gray-600 mb-4">We're working on an exciting new user authentication system!</p>
                    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-yellow-700">
                                    <span class="font-bold">Coming Soon!</span> Stay tuned for exclusive offers and personalized shopping experiences.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center space-x-4 mt-6">
                        <button class="bg-black text-white py-2 px-6 rounded hover:bg-gray-800 transition-colors">
                            Sign Up
                        </button>
                        <button class="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300 transition-colors">
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(popup);
    
    // Get the popup content
    const popupContent = popup.querySelector('.bg-white');
    
    // Trigger animation
    setTimeout(() => {
        popupContent.classList.remove('scale-95', 'opacity-0');
        popupContent.classList.add('scale-100', 'opacity-100');
    }, 10);
    
    // Add close button handler
    const closeButton = popup.querySelector('.close-popup');
    closeButton.addEventListener('click', () => {
        popupContent.classList.remove('scale-100', 'opacity-100');
        popupContent.classList.add('scale-95', 'opacity-0');
        
        setTimeout(() => {
            popup.remove();
        }, 300);
    });
    
    // Close when clicking outside
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popupContent.classList.remove('scale-100', 'opacity-100');
            popupContent.classList.add('scale-95', 'opacity-0');
            
            setTimeout(() => {
                popup.remove();
            }, 300);
        }
    });
}

// Initialize Razorpay
function initializeRazorpay() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            resolve();
        };
        script.onerror = () => {
            console.error('Razorpay SDK failed to load');
        };
        document.body.appendChild(script);
    });
}

// Handle checkout process
async function handleCheckout() {
    try {
        // Get cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cartItems.length === 0) {
            alert('Your cart is empty');
            return;
        }
        
        // Validate shipping information
        const state = document.getElementById('state').value;
        if (state !== 'Delhi') {
            alert('Sorry, we currently only deliver to Delhi. Please select Delhi as your state.');
            return;
        }
        
        // Calculate total amount
        let totalAmount = 0;
        cartItems.forEach(item => {
            totalAmount += item.price * item.quantity;
        });
        
        // Add shipping and tax
        const shipping = 5.00;
        const tax = totalAmount * 0.1;
        totalAmount = totalAmount + shipping + tax;
        
        // Convert to INR (assuming 1 USD = 75 INR)
        const amountInINR = Math.round(totalAmount * 75 * 100); // Convert to paise
        
        // Get shipping information
        const shippingInfo = {
            name: document.getElementById('first-name').value + ' ' + document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value
        };
        
        // Check if Razorpay is selected
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        if (paymentMethod === 'razorpay') {
            // Initialize Razorpay
            await initializeRazorpay();
            
            const options = {
                key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay key
                amount: amountInINR,
                currency: 'INR',
                name: 'My Shop',
                description: 'Purchase of items',
                handler: function(response) {
                    handlePaymentSuccess(response, shippingInfo);
                },
                prefill: {
                    name: shippingInfo.name,
                    email: shippingInfo.email,
                    contact: shippingInfo.phone
                },
                notes: {
                    address: shippingInfo.address,
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    zip: shippingInfo.zip
                },
                theme: {
                    color: '#000000'
                }
            };
            
            const rzp = new Razorpay(options);
            rzp.open();
        } else {
            // Handle Cash on Delivery
            handleCashOnDelivery(shippingInfo);
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('An error occurred during checkout. Please try again.');
    }
}

// Handle successful payment
function handlePaymentSuccess(response, shippingInfo) {
    // Clear cart
    localStorage.removeItem('cart');
    updateCartCount();
    
    // Redirect to success page with order details
    const orderDetails = {
        orderId: response.razorpay_payment_id,
        paymentId: response.razorpay_payment_id,
        amount: response.razorpay_amount / 100,
        currency: 'INR',
        status: 'Paid',
        shippingInfo: shippingInfo
    };
    
    // Store order details in localStorage
    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
    
    // Redirect to success page
    window.location.href = 'success.html';
}

// Handle Cash on Delivery
function handleCashOnDelivery(shippingInfo) {
    // Clear cart
    localStorage.removeItem('cart');
    updateCartCount();
    
    // Create order details
    const orderDetails = {
        orderId: 'COD-' + Date.now(),
        paymentId: null,
        amount: document.getElementById('total').textContent.replace('$', ''),
        currency: 'USD',
        status: 'Pending',
        shippingInfo: shippingInfo
    };
    
    // Store order details in localStorage
    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
    
    // Redirect to success page
    window.location.href = 'success.html';
}

// Add event listener for place order button
document.addEventListener('DOMContentLoaded', function() {
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', handleCheckout);
    }
    
    // Add event listener for proceed to checkout button
    const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout');
    if (proceedToCheckoutBtn) {
        proceedToCheckoutBtn.addEventListener('click', function() {
            // Check if cart is empty
            const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            if (cartItems.length === 0) {
                alert('Your cart is empty. Please add items before proceeding to checkout.');
                return;
            }
            
            // Redirect to checkout page
            window.location.href = 'checkout.html';
        });
    }
}); 