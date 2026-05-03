document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://capstone-web-dev-backend-cd1e.onrender.com/api";

    // Scroll Progress logic
    const scrollBar = document.querySelector('.scroll-progress');
    if (scrollBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollBar.style.width = scrolled + "%";
        });
    }

    // Reveal on scroll
    function checkReveal() {
        const elements = document.querySelectorAll(".fade-in, .fade-up");
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 100) {
                element.classList.add("visible");
            }
        }
    }
    checkReveal();
    window.addEventListener("scroll", checkReveal);

    // Active link highlighting
    const allNavLinks = document.querySelectorAll(".nav-links a");
    const currentPage = window.location.pathname;
    allNavLinks.forEach(link => {
        if (currentPage.includes(link.getAttribute("href"))) {
            link.classList.add("active");
        }
    });

    // --- DYNAMIC PRODUCT LOGIC ---
    const productsHero = document.querySelector('.products-hero');
    const productsSection = document.getElementById('products');
    const productsGrid = document.querySelector('.products-grid');
    const productDetailSection = document.getElementById('product-detail-view');
    const backButton = document.getElementById('close-product-view');

    if (productsGrid) {
        fetchProducts();
    }
    updateCartCount(); 

    async function fetchProducts() {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error("Error fetching products:", error);
            if (productsGrid) {
                productsGrid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: rgba(192, 57, 43, 0.05); border: 1px solid rgba(192, 57, 43, 0.2);">
                        <p style="color: #c0392b; font-weight: 600; margin-bottom: 1rem;">Failed to load products.</p>
                        <p style="font-size: 0.9rem; color: #666;">Error: ${error.message}</p>
                        <p style="font-size: 0.8rem; margin-top: 1rem;">Make sure the backend is running at ${API_URL}</p>
                    </div>
                `;
            }
        }
    }

    function renderProducts(products) {
        if (!productsGrid) return;
        productsGrid.innerHTML = "";
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card fade-up';
            card.innerHTML = `
                <div class="product-img-wrapper">
                    <img src="${product.image}" alt="${product.name}">
                    <button class="delete-product-btn" data-id="${product.id}" title="Delete from inventory">&times;</button>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">₹${product.price}</p>
                    <p>${product.description}</p>
                    <a href="#" class="btn btn-gold">Shop Now</a>
                </div>
            `;

            // Click listener for the card (product detail)
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-product-btn')) return;
                e.preventDefault();
                showProductDetail(product);
            });

            // Click listener for the delete button
            const deleteBtn = card.querySelector('.delete-product-btn');
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to remove "${product.name}" from the collection?`)) {
                    try {
                        const response = await fetch(`${API_URL}/products/${product.id}`, { method: 'DELETE' });
                        if (response.ok) {
                            fetchProducts();
                        }
                    } catch (error) {
                        console.error("Error deleting product:", error);
                    }
                }
            });

            productsGrid.appendChild(card);
        });
        setTimeout(checkReveal, 100);
    }

    function showProductDetail(product) {
        document.getElementById('detail-title').innerText = product.name;
        document.getElementById('detail-image').src = product.image;
        document.getElementById('detail-price').innerText = "₹" + product.price;
        document.getElementById('detail-description').innerText = product.description;
        
        // Store current product ID for "Add to Cart"
        productDetailSection.setAttribute('data-current-id', product.id);

        if (productsGrid) productsGrid.style.display = 'none';
        if (productsSection) productsSection.style.display = 'none';
        
        productDetailSection.style.display = 'block';
        productDetailSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    if (backButton) {
        backButton.addEventListener('click', () => {
            productDetailSection.style.display = 'none';
            if (productsSection) productsSection.style.display = 'block';
            if (productsGrid) productsGrid.style.display = 'grid';
        });
    }

    // --- CART LOGIC ---
    const cartLink = document.getElementById('cart-link');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.querySelector('.close-cart');
    const addToCartBtn = document.querySelector('.btn-add-cart');

    if (cartLink) {
        cartLink.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
    }

    async function openCart() {
        cartModal.classList.add('active');
        fetchCart();
    }

    async function fetchCart() {
        try {
            const response = await fetch(`${API_URL}/cart`);
            const data = await response.json();
            renderCart(data);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    }

    function renderCart(data) {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalAmount = document.getElementById('cart-total-amount');
        
        cartItemsContainer.innerHTML = "";
        
        if (data.items.length === 0) {
            cartItemsContainer.innerHTML = "<p style='text-align: center; color: #888; margin-top: 2rem;'>Your cart is empty.</p>";
        } else {
            data.items.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.quantity} x ₹${item.price}</p>
                    </div>
                    <button class="remove-item" data-id="${item.id}">&times;</button>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }
        
        cartTotalAmount.innerText = "₹" + data.total;
        updateCartCountUI(data.count);

        // Add remove listeners
        const removeBtns = cartItemsContainer.querySelectorAll('.remove-item');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                await fetch(`${API_URL}/cart/${id}`, { method: 'DELETE' });
                fetchCart();
            });
        });
    }

    // Clear Cart logic
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', async () => {
            if (confirm("Are you sure you want to clear your cart?")) {
                await fetch(`${API_URL}/cart`, { method: 'DELETE' });
                fetchCart();
            }
        });
    }

    async function updateCartCount() {
        try {
            const response = await fetch(`${API_URL}/cart`);
            const data = await response.json();
            updateCartCountUI(data.count);
        } catch (error) {}
    }

    function updateCartCountUI(count) {
        const cartLinks = document.querySelectorAll('#cart-link');
        cartLinks.forEach(link => {
            link.innerText = `Cart (${count})`;
        });
    }

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', async () => {
            const product_id = productDetailSection.getAttribute('data-current-id');
            const quantity = parseInt(document.querySelector('.qty-input').value);
            
            try {
                const response = await fetch(`${API_URL}/cart`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: product_id, quantity: quantity })
                });
                
                if (response.ok) {
                    openCart();
                }
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
        });
    }

    // --- ADD PRODUCT FORM LOGIC ---
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const feedback = document.getElementById('form-feedback');
            const submitBtn = addProductForm.querySelector('button[type="submit"]');
            
            const formData = {
                name: document.getElementById('name').value,
                price: parseFloat(document.getElementById('price').value),
                image: document.getElementById('image').value,
                description: document.getElementById('description').value
            };

            try {
                submitBtn.disabled = true;
                submitBtn.innerText = "Creating...";
                feedback.style.display = "none";
                
                const response = await fetch(`${API_URL}/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    feedback.innerText = "Product created successfully!";
                    feedback.className = "form-feedback success";
                    feedback.style.display = "block";
                    addProductForm.reset();
                } else {
                    const err = await response.json();
                    throw new Error(err.error || "Failed to create product");
                }
            } catch (error) {
                feedback.innerText = "Error: " + error.message;
                feedback.className = "form-feedback error";
                feedback.style.display = "block";
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = "Create Product";
            }
        });
    }

    // Quantity Selector Logic
    if (productDetailSection) {
        productDetailSection.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-minus') || e.target.classList.contains('btn-plus')) {
                const input = productDetailSection.querySelector('.qty-input');
                const currentValue = parseInt(input.value);
                
                if (e.target.classList.contains('btn-plus')) {
                    input.value = currentValue + 1;
                } else if (e.target.classList.contains('btn-minus') && currentValue > 1) {
                    input.value = currentValue - 1;
                }
            }
        });
    }

    // Mobile Nav logic
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        const menuLinks = navLinks.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
});
