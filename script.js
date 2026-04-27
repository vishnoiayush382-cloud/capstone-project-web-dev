document.addEventListener("DOMContentLoaded", () => {
    const scrollBar = document.querySelector('.scroll-progress');
    if (scrollBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollBar.style.width = scrolled + "%";
        });
    }

    const revealElements = document.querySelectorAll(".fade-in, .fade-up");
    function checkReveal() {
        for (let i = 0; i < revealElements.length; i++) {
            const element = revealElements[i];
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 100) {
                element.classList.add("visible");
            }
        }
    }
    checkReveal();
    window.addEventListener("scroll", checkReveal);

    const allNavLinks = document.querySelectorAll(".nav-links a");
    const currentPage = window.location.pathname;
    allNavLinks.forEach(link => {
        if (currentPage.includes(link.getAttribute("href"))) {
            link.classList.add("active");
        }
    });

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                event.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const parallaxImg = document.getElementById("parallax-image");
    if (parallaxImg) {
        document.addEventListener("mousemove", (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 50;
            const y = (window.innerHeight / 2 - e.clientY) / 50;
            parallaxImg.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    const productsGrid = document.querySelector('.products-grid');
    const productDetailSection = document.getElementById('product-detail-view');
    const productCards = document.querySelectorAll('.product-card');
    const backButton = document.getElementById('close-product-view');

    if (productsGrid && productDetailSection) {
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                const name = card.querySelector('h3').innerText;
                const imageSrc = card.querySelector('img').src;
                const price = card.getAttribute('data-price');

                document.getElementById('detail-title').innerText = name;
                document.getElementById('detail-image').src = imageSrc;
                document.getElementById('detail-price').innerText = "₹" + price;

                productsGrid.style.display = 'none';
                productDetailSection.style.display = 'block';
                productDetailSection.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'auto' });
            });
        });

        if (backButton) {
            backButton.addEventListener('click', () => {
                productDetailSection.style.display = 'none';
                productsGrid.style.display = 'grid';
            });
        }
    }
});
