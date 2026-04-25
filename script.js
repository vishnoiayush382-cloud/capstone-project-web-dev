document.addEventListener("DOMContentLoaded", () => {
    // 1. Fade-in on scroll
    const fadeElements = document.querySelectorAll(".fade-in, .fade-up");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => observer.observe(el));

    // 2. Active navbar highlight
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(link => {
        const linkPath = link.getAttribute("href").split("#")[0];
        if (linkPath === currentPath || (currentPath === "index.html" && linkPath === "")) {
            link.classList.add("active");
        }
    });

    // 3. Subtle image interaction (Parallax)
    const monkImage = document.getElementById("parallax-image");
    if (monkImage) {
        document.addEventListener("mousemove", (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const moveX = (clientX - centerX) / 60;
            const moveY = (clientY - centerY) / 60;
            monkImage.style.transform = `scale(1.02) translate3d(${moveX}px, ${moveY}px, 0) rotateX(${-moveY/2}deg) rotateY(${moveX/2}deg)`;
        });
    }

    // --- CART LOGIC START ---
    let cart = JSON.parse(localStorage.getItem('origine_cart')) || [];

    function injectCartDrawer() {
        if (document.getElementById('cart-drawer-container')) return;
        
        const drawerHTML = `
            <div id="cart-drawer-container">
                <div class="cart-overlay" id="cart-overlay"></div>
                <div class="cart-drawer" id="cart-drawer">
                    <div class="cart-header">
                        <h2>Your Cart</h2>
                        <div class="close-cart" id="close-cart">✕</div>
                    </div>
                    <div class="cart-items-container" id="cart-items">
                        <!-- Items injected here -->
                    </div>
                    <div class="cart-footer">
                        <div class="cart-subtotal">
                            <span>Subtotal</span>
                            <span id="cart-subtotal-val">₹0</span>
                        </div>
                        <button class="btn btn-gold btn-large" style="width: 100%;">Checkout</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', drawerHTML);

        // Event Listeners for the drawer
        document.getElementById('close-cart').addEventListener('click', toggleCart);
        document.getElementById('cart-overlay').addEventListener('click', toggleCart);
    }

    function toggleCart() {
        const drawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('cart-overlay');
        if (drawer) {
            drawer.classList.toggle('open');
            overlay.classList.toggle('open');
            if (drawer.classList.contains('open')) {
                renderCart();
            }
        }
    }

    function updateCartDisplay() {
        const cartCounts = document.querySelectorAll('.cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCounts.forEach(el => el.textContent = totalItems);
        localStorage.setItem('origine_cart', JSON.stringify(cart));
    }

    function renderCart() {
        const itemsContainer = document.getElementById('cart-items');
        const subtotalEl = document.getElementById('cart-subtotal-val');
        
        if (!itemsContainer) return;

        if (cart.length === 0) {
            itemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            subtotalEl.textContent = '₹0';
            return;
        }

        let subtotal = 0;
        itemsContainer.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;
            return `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">₹${item.price}</p>
                        <div class="cart-item-qty">
                            <button class="qty-btn-small minus">-</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn-small plus">+</button>
                            <span class="remove-item">Remove</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        subtotalEl.textContent = `₹${subtotal}`;

        // Add event listeners to buttons within cart
        itemsContainer.querySelectorAll('.minus').forEach(btn => {
            btn.addEventListener('click', () => updateQuantity(btn.closest('.cart-item').dataset.id, -1));
        });
        itemsContainer.querySelectorAll('.plus').forEach(btn => {
            btn.addEventListener('click', () => updateQuantity(btn.closest('.cart-item').dataset.id, 1));
        });
        itemsContainer.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(btn.closest('.cart-item').dataset.id));
        });
    }

    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.qty += product.qty;
            if (existingItem.qty > 5) existingItem.qty = 5;
        } else {
            cart.push(product);
        }
        updateCartDisplay();
        toggleCart();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartDisplay();
        renderCart();
    }

    function updateQuantity(id, delta) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty < 1) {
                removeFromCart(id);
            } else if (item.qty > 5) {
                item.qty = 5;
            }
            updateCartDisplay();
            renderCart();
        }
    }

    // Global Cart Listeners
    injectCartDrawer();
    document.querySelectorAll('.cart-icon-wrapper').forEach(w => {
        w.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
        });
    });
    updateCartDisplay();

    // --- CART LOGIC END ---

    // 5. Product Detail View Logic (on products.html)
    const productsGrid = document.querySelector('.products-grid');
    const productDetailView = document.getElementById('product-detail-view');
    const closeBtn = document.getElementById('close-product-view');
    const cards = document.querySelectorAll('.product-card');

    if (productsGrid && productDetailView) {
        let currentProduct = {};

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('h3').textContent;
                const imgSrc = card.querySelector('img').src;
                const price = card.dataset.price;
                const id = card.dataset.id;
                
                currentProduct = { id, name: title, price: parseInt(price), img: imgSrc };

                document.getElementById('detail-title').textContent = title;
                document.getElementById('detail-image').src = imgSrc;
                document.getElementById('detail-price').textContent = `₹${price}`;
                document.getElementById('qty-count').textContent = '1';
                document.getElementById('qty-warning').style.display = 'none';
                
                productsGrid.style.opacity = '0';
                setTimeout(() => {
                    productsGrid.classList.add('hidden');
                    productDetailView.classList.add('active');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    productDetailView.style.opacity = '1';
                }, 400);
            });
        });

        closeBtn.addEventListener('click', () => {
            productDetailView.style.opacity = '0';
            setTimeout(() => {
                productDetailView.classList.remove('active');
                productsGrid.classList.remove('hidden');
                productsGrid.style.opacity = '1';
            }, 400);
        });

        // Quantity Box
        const qtyMinus = document.getElementById('qty-minus');
        const qtyPlus = document.getElementById('qty-plus');
        const qtyCount = document.getElementById('qty-count');
        const qtyWarning = document.getElementById('qty-warning');

        qtyMinus.addEventListener('click', (e) => {
            e.stopPropagation();
            let val = parseInt(qtyCount.textContent);
            if (val > 1) {
                qtyCount.textContent = val - 1;
                qtyWarning.style.display = 'none';
            }
        });

        qtyPlus.addEventListener('click', (e) => {
            e.stopPropagation();
            let val = parseInt(qtyCount.textContent);
            if (val < 5) {
                qtyCount.textContent = val + 1;
                qtyWarning.style.display = 'none';
            } else {
                qtyWarning.style.display = 'block';
            }
        });

        // Add to Cart button in detail view
        const addBtn = document.getElementById('add-to-cart-btn');
        const cartMsg = document.getElementById('cart-msg');

        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const val = parseInt(qtyCount.textContent);
            addToCart({ ...currentProduct, qty: val });
            
            cartMsg.classList.add('show');
            setTimeout(() => cartMsg.classList.remove('show'), 2000);
        });
    }

    // 6. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Scroll Progress
    const scrollBar = document.querySelector('.scroll-progress');
    if (scrollBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollBar.style.width = scrolled + "%";
        });
    }
});
