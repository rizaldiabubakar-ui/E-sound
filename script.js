document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // --- INITIALIZATION ---
    initPreloader();
    initThemeSwitcher();
    initAnimations();
    initModalLogic();
    initClientSearch();
    initBackToTopButton();

    // --- PRELOADER ---
    function initPreloader() {
        const preloader = document.querySelector('.preloader');
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // --- DARK MODE LOGIC ---
    function initThemeSwitcher() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
        darkModeToggle.addEventListener('change', () => {
            body.classList.toggle('dark-mode');
            localStorage.setItem('theme', body.classList.contains('dark-mode')? 'dark' : 'light');
        });
    }

    // --- ANIMATIONS ---
    function initAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Parallax Animation
        gsap.to(".hero-background", {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            },
        });
        gsap.to(".hero-content", {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            },
        });

        // Card Stagger Animation on Scroll
        gsap.from(".book-card", {
            duration: 0.8,
            opacity: 0,
            y: 60,
            scale: 0.95,
            rotationZ: -5,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: ".card-grid",
                start: "top 85%",
                toggleActions: "play none none none",
            },
        });
        
        // 3D Tilt Effect for Cards
        const cards = document.querySelectorAll('.book-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const { width, height } = rect;
                const rotateX = (y / height - 0.5) * -20; // Max rotation 10 degrees
                const rotateY = (x / width - 0.5) * 20;   // Max rotation 10 degrees
                
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateX(0) rotateY(0) scale(1)';
            });
        });
    }

    // --- MODAL LOGIC ---
    function initModalLogic() {
        const modal = document.querySelector('.book-modal');
        const modalCloseBtn = document.querySelector('.modal-close-btn');
        const bookCards = document.querySelectorAll('.book-card');

        bookCards.forEach(card => {
            const listenBtn = card.querySelector('.listen-btn');
            if (listenBtn) {
                listenBtn.addEventListener('click', () => {
                    const data = card.dataset;
                    modal.querySelector('.modal-cover img').src = card.querySelector('img').src;
                    modal.querySelector('.modal-title').textContent = data.title;
                    modal.querySelector('.modal-author').textContent = "oleh " + data.author;
                    modal.querySelector('.modal-description').textContent = data.desc;
                    modal.querySelector('.modal-audio').src = data.audio;
                    modal.classList.add('visible');
                    modal.querySelector('.modal-audio').play();
                });
            }
        });

        const closeModal = () => {
            modal.classList.remove('visible');
            modal.querySelector('.modal-audio').pause();
        };

        modalCloseBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modal.classList.contains('visible')) closeModal();
        });
    }

    // --- CLIENT-SIDE SEARCH LOGIC ---
    function initClientSearch() {
        const searchInput = document.getElementById('search-input');
        const bookCards = Array.from(document.querySelectorAll('.book-card'));
        if (!searchInput |

| bookCards.length === 0) return;

        const booksData = bookCards.map(card => ({
            id: card.dataset.id,
            title: card.dataset.title,
            author: card.dataset.author
        }));

        const search = new JsSearch.Search('id');
        search.addIndex('title');
        search.addIndex('author');
        search.addDocuments(booksData);

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            const results = query? search.search(query) : booksData;
            const resultIds = new Set(results.map(book => book.id));

            bookCards.forEach(card => {
                if (resultIds.has(card.dataset.id)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // --- BACK TO TOP BUTTON LOGIC ---
    function initBackToTopButton() {
        const backToTopButton = document.querySelector('.back-to-top');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
    }
});