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
