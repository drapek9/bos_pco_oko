/**
 * Main JavaScript file for BOS-PCO & OKO website
 * Handles mobile menu, smooth scrolling, and other interactions
 */

(function() {
    'use strict';

    // ============================================
    // Horní lišta kontaktů – skrytí při scrollu, znovu jen nahoře
    // ============================================
    const topContactBar = document.getElementById('topContactBar');
    if (topContactBar) {
        const scrollThreshold = 12;

        function updateTopContactBar() {
            if (window.scrollY > scrollThreshold) {
                topContactBar.classList.add('top-contact-bar--hidden');
            } else {
                topContactBar.classList.remove('top-contact-bar--hidden');
            }
        }

        window.addEventListener('scroll', updateTopContactBar, { passive: true });
        updateTopContactBar();
    }

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.addEventListener('click', function() {
            const nowOpen = mainNav.classList.toggle('open');
            menuToggle.classList.toggle('is-open', nowOpen);
            menuToggle.setAttribute('aria-expanded', nowOpen ? 'true' : 'false');
        });

        // Close menu when clicking on a link
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('open');
                menuToggle.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = mainNav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                menuToggle.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ============================================
    // Smooth Scrolling for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty hash or just #
            if (href === '#' || href === '') {
                return;
            }

            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Set Current Year in Footer
    // ============================================
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // ============================================
    // Active Navigation Link Highlighting
    // ============================================
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (currentPage === 'index.html' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Call on page load
    setActiveNavLink();

    // ============================================
    // Scroll to Top Button (optional enhancement)
    // ============================================
    function createScrollToTopButton() {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.className = 'scroll-to-top';
        button.setAttribute('aria-label', 'Scroll to top');
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--color-primary);
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 99;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;

        button.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
            } else {
                button.style.opacity = '0';
                button.style.visibility = 'hidden';
            }
        });

        document.body.appendChild(button);
    }

    // Uncomment to enable scroll to top button
    // createScrollToTopButton();

    // ============================================
    // Lazy Loading Images (if needed)
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // Form Validation (if forms are added later)
    // ============================================
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Export for use in other scripts if needed
    window.siteUtils = {
        validateEmail: validateEmail
    };

    // ============================================
    // Scroll-based Animations
    // ============================================
    function initScrollAnimations() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const isContactPage = currentPath === 'kontakt.html';
        const isReferencePage = currentPath === 'reference.html';

        // Elements to animate - cards and interactive elements
        const cardElements = document.querySelectorAll(
            '.service-card, .feature-card, .contact-card, .tech-item, ' +
            '.licence-card, .licence-cta, .contact-method, .person-card, .hours-card, ' +
            '.pconline-feature, .cta-card, .teamviewer-box, .pconline-login, ' +
            '.opening-hours, .note-box, .testimonial-card, .job-card'
        );

        // Text elements to animate
        const textElements = document.querySelectorAll(
            'h2, h3, .hero-text, .page-intro, .licence-intro, .tech-intro, .pconline-intro, .jobs-intro'
        );

        // Combine all elements
        const allElements = [...cardElements, ...textElements];

        // Filter out footer elements - footer should not be animated
        const filteredElements = Array.from(allElements).filter(el => {
            if (!el || el.closest('.footer')) {
                return false;
            }
            /* Reference: skryté recenze za „Další“ bez scroll animace */
            if (el.classList.contains('testimonial-card') && el.hasAttribute('hidden')) {
                return false;
            }
            // Úvodní hero: vlastní vstupní animace zleva (CSS), ne scroll fade
            if (el.closest('.hero--with-visual')) {
                if (el.classList.contains('hero-text')) {
                    return false;
                }
                if (el.classList.contains('cta-card')) {
                    return false;
                }
                const heroCopy = el.closest('.hero-copy');
                if (heroCopy && el.tagName === 'H1' && el.parentElement === heroCopy) {
                    return false;
                }
            }
            return true;
        });

        // Na stránce kontakt nechceme animace na scroll,
        // ale chceme, aby se obsah zobrazil/animoval hned po načtení.
        if (isContactPage) {
            filteredElements.forEach(el => {
                if (!el) return;

                // Omezíme se na prvky v sekci kontakt / kontakt-hero
                if (el.closest('.contact-section') || el.closest('.contact-hero')) {
                    el.classList.add('animate-in');
                    el.style.opacity = '';
                    el.style.transform = '';
                }
            });
            return;
        }

        /* Reference: prvních 6 recenzí hned po načtení se vstupní animací (ne při scrollu) */
        if (isReferencePage) {
            filteredElements.forEach(el => {
                if (!el) return;
                if (el.classList.contains('page-intro') && el.closest('.page-hero')) {
                    el.classList.add('animate-in');
                    el.style.opacity = '';
                    el.style.transform = '';
                }
            });

            const refGrid = document.getElementById('referenceTestimonialsGrid') ||
                document.querySelector('.testimonials-section .testimonials-grid');
            const refCards = refGrid ? refGrid.querySelectorAll('.testimonial-card') : [];
            const initialReviews = 6;
            const staggerMs = 75;

            function refRevealCard(card) {
                card.classList.add('animate-in');
                card.style.opacity = '';
                card.style.transform = '';
            }

            const n = Math.min(initialReviews, refCards.length);
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (reducedMotion) {
                for (let i = 0; i < n; i++) {
                    refRevealCard(refCards[i]);
                }
            } else {
                window.requestAnimationFrame(function() {
                    window.requestAnimationFrame(function() {
                        for (let i = 0; i < n; i++) {
                            (function(idx) {
                                window.setTimeout(function() {
                                    refRevealCard(refCards[idx]);
                                }, idx * staggerMs);
                            })(i);
                        }
                    });
                });
            }

            return;
        }

        // Ensure all elements start hidden (prevent FOUC)
        filteredElements.forEach(el => {
            if (el && !el.classList.contains('animate-in')) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
            }
        });

        if (!('IntersectionObserver' in window)) {
            // Fallback for browsers without IntersectionObserver
            filteredElements.forEach(el => {
                if (el) {
                    el.classList.add('animate-in');
                }
            });
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                // Na stránce kontakt animuj všechny kontaktní karty najednou
                if (isContactPage && entry.target.classList.contains('contact-card')) {
                    const allContactCards = document.querySelectorAll('.contact-card');
                    allContactCards.forEach(card => {
                        card.classList.add('animate-in');
                        observer.unobserve(card);
                    });
                    return;
                }

                entry.target.classList.add('animate-in');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            });
        }, observerOptions);

        filteredElements.forEach(el => {
            if (el) {
                observer.observe(el);
            }
        });
    }

    // ============================================
    // Reference: „Další“ – další dávky recenzí (prvních 6 animuje initScrollAnimations)
    // ============================================
    function initReferenceTestimonialsLoadMore() {
        const grid = document.getElementById('referenceTestimonialsGrid');
        const btn = document.getElementById('referenceTestimonialsMore');
        const cta = document.getElementById('referenceTestimonialsCta');
        if (!grid || !btn) {
            return;
        }

        const cards = grid.querySelectorAll('.testimonial-card');
        const INITIAL_VISIBLE = 6;
        const STEP = 6;

        for (let i = INITIAL_VISIBLE; i < cards.length; i++) {
            cards[i].setAttribute('hidden', '');
        }

        if (cards.length <= INITIAL_VISIBLE && cta) {
            cta.classList.add('is-expanded');
        }

        function syncMoreButton() {
            const hasMore = grid.querySelector('.testimonial-card[hidden]');
            if (hasMore) {
                btn.removeAttribute('hidden');
            } else {
                btn.setAttribute('hidden', '');
            }
        }

        syncMoreButton();

        btn.addEventListener('click', function() {
            const hiddenCards = grid.querySelectorAll('.testimonial-card[hidden]');
            const n = Math.min(STEP, hiddenCards.length);

            for (let j = 0; j < n; j++) {
                const card = hiddenCards[j];
                card.removeAttribute('hidden');
                card.classList.add('animate-in');
                card.style.opacity = '';
                card.style.transform = '';
            }

            syncMoreButton();

            if (n > 0 && cta) {
                cta.classList.add('is-expanded');
            }
        });
    }

    initReferenceTestimonialsLoadMore();
    // Initialize scroll animations immediately to prevent FOUC
    initScrollAnimations();

    // ============================================
    // OKO: lightbox galerie certifikátů
    // ============================================
    function initOkoCertificateLightbox() {
        var openBtn = document.getElementById('openCertGallery');
        var lightbox = document.getElementById('certLightbox');
        if (!openBtn || !lightbox) {
            return;
        }

        var items = [
            { src: 'img/osvedceni-1.jpg', alt: 'Proškolení ACS-Line', title: 'Proškolení ACS-Line' },
            { src: 'img/osvedceni-2.jpg', alt: 'Proškolení FBII', title: 'Proškolení FBII' },
            { src: 'img/osvedceni-3.jpg', alt: 'Proškolení Euroalarm', title: 'Proškolení Euroalarm' },
            { src: 'img/osvedceni-4.jpg', alt: 'Proškolení Paradox Security', title: 'Proškolení Paradox Security' },
            { src: 'img/osvedceni-5.jpg', alt: 'Proškolení Esprit', title: 'Proškolení Esprit' },
            { src: 'img/osvedceni-6.jpg', alt: 'Proškolení Honeywell Galaxy', title: 'Proškolení Honeywell Galaxy' },
            { src: 'img/osvedceni-7.jpg', alt: 'Proškolení Alphatel', title: 'Proškolení Alphatel' },
            { src: 'img/osvedceni-8.jpg', alt: 'Proškolení Dominus', title: 'Proškolení Dominus' },
            { src: 'img/osvedceni-9.jpg', alt: 'Proškolení EPS Lites', title: 'Proškolení EPS Lites' },
            { src: 'img/osvedceni-10.jpg', alt: 'Certifikát Jablotron', title: 'Certifikát Jablotron' }
        ];

        var gridHost = document.getElementById('certLightboxGrid');
        var closeEls = lightbox.querySelectorAll('[data-cert-lightbox-close]');
        var lastFocus = null;
        var gridBuilt = false;

        function buildGrid() {
            if (gridBuilt || !gridHost) {
                return;
            }
            items.forEach(function(item) {
                var fig = document.createElement('figure');
                fig.className = 'cert-lightbox__item';
                fig.setAttribute('role', 'listitem');
                var im = document.createElement('img');
                im.src = item.src;
                im.alt = item.alt;
                im.loading = 'lazy';
                im.decoding = 'async';
                var cap = document.createElement('figcaption');
                cap.textContent = item.title;
                fig.appendChild(im);
                fig.appendChild(cap);
                gridHost.appendChild(fig);
            });
            gridBuilt = true;
        }

        function open() {
            lastFocus = document.activeElement;
            buildGrid();
            var bodyEl = lightbox.querySelector('.cert-lightbox__body');
            if (bodyEl) {
                bodyEl.scrollTop = 0;
            }
            lightbox.removeAttribute('hidden');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('cert-lightbox-open');
            var closeBtn = lightbox.querySelector('.cert-lightbox__close');
            if (closeBtn) {
                closeBtn.focus();
            }
        }

        function close() {
            lightbox.setAttribute('hidden', '');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('cert-lightbox-open');
            if (lastFocus && typeof lastFocus.focus === 'function') {
                lastFocus.focus();
            }
        }

        openBtn.addEventListener('click', function() {
            open();
        });

        closeEls.forEach(function(el) {
            el.addEventListener('click', function() {
                close();
            });
        });

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                close();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (lightbox.hasAttribute('hidden')) {
                return;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                close();
            }
        });
    }

    initOkoCertificateLightbox();

    console.log('BOS-PCO & OKO website loaded successfully');
})();
