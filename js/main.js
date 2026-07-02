/**
 * Main JavaScript file for BOS-PCO & OKO website
 * Handles mobile menu, smooth scrolling, and other interactions
 */

(function() {
    'use strict';

    /**
     * Výška „lepící“ horní části (lišta kontaktů, pokud je vidět + hlavička) + rezerva pro kotvy.
     */
    function getStickyHeaderScrollOffset() {
        const hdr = document.querySelector('.header');
        const bar = document.getElementById('topContactBar');
        let offset = (hdr ? hdr.getBoundingClientRect().height : 72) + 16;
        if (bar && !bar.classList.contains('top-contact-bar--hidden')) {
            offset += bar.getBoundingClientRect().height;
        }
        return offset;
    }

    function scrollToHashTarget() {
        const raw = window.location.hash;
        if (!raw || raw === '#') {
            return;
        }
        let target = null;
        try {
            target = document.querySelector(raw);
        } catch (err1) {
            /* neplatný selektor v URL */
        }
        if (!target && raw.length > 1) {
            try {
                target = document.querySelector('#' + CSS.escape(decodeURIComponent(raw.slice(1))));
            } catch (err2) {
                return;
            }
        }
        if (!target) {
            return;
        }
        const y = target.getBoundingClientRect().top + window.pageYOffset - getStickyHeaderScrollOffset();
        window.scrollTo({ top: Math.max(0, y), behavior: 'auto' });
    }

    function scheduleScrollToHashTarget() {
        window.requestAnimationFrame(function() {
            window.requestAnimationFrame(scrollToHashTarget);
        });
    }

    function getCurrentPageName() {
        const segment = window.location.pathname.split('/').pop();
        return segment && segment !== '' ? segment : 'index.html';
    }

    function parseNavLinkTarget(href) {
        if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return null;
        }
        const hashIndex = href.indexOf('#');
        const hash = hashIndex >= 0 ? href.slice(hashIndex) : '';
        const pathPart = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
        if (!pathPart) {
            return null;
        }
        if (/^https?:\/\//i.test(pathPart)) {
            try {
                const url = new URL(pathPart);
                const page = url.pathname.split('/').pop();
                return { page: page && page !== '' ? page : 'index.html', hash: hash };
            } catch (err) {
                return null;
            }
        }
        const page = pathPart.split('/').pop();
        return { page: page && page !== '' ? page : 'index.html', hash: hash };
    }

    function navLinkIsSamePageWithoutHash(href) {
        const target = parseNavLinkTarget(href);
        if (!target || target.hash) {
            return false;
        }
        return target.page === getCurrentPageName();
    }

    function closeMobileNav() {
        const mainNav = document.getElementById('mainNav');
        const menuToggle = document.getElementById('menuToggle');
        if (mainNav && mainNav.classList.contains('open')) {
            mainNav.classList.remove('open');
            if (menuToggle) {
                menuToggle.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    }

    function scrollPageToTop() {
        const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: instant ? 'auto' : 'smooth' });
        if (window.history.replaceState) {
            const path = window.location.pathname + window.location.search;
            if (window.location.hash) {
                window.history.replaceState(null, '', path);
            }
        }
    }

    function bindHashScrollOnReady() {
        if (!window.location.hash) {
            return;
        }
        scheduleScrollToHashTarget();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindHashScrollOnReady);
    } else {
        bindHashScrollOnReady();
    }
    window.addEventListener('load', bindHashScrollOnReady);
    window.addEventListener('hashchange', scrollToHashTarget);

    // ============================================
    // Horní lišta kontaktů – skrytí při scrollu, znovu jen nahoře
    // ============================================
    const topContactBar = document.getElementById('topContactBar');
    const header = document.querySelector('.header');
    if (topContactBar) {
        const scrollThreshold = 12;

        function updateTopContactBar() {
            if (window.scrollY > scrollThreshold) {
                topContactBar.classList.add('top-contact-bar--hidden');
                if (header) {
                    header.classList.add('header--scrolled');
                }
            } else {
                topContactBar.classList.remove('top-contact-bar--hidden');
                if (header) {
                    header.classList.remove('header--scrolled');
                }
            }
        }

        window.addEventListener('scroll', updateTopContactBar, { passive: true });
        updateTopContactBar();
    }

    // ============================================
    // OKO / BOS-PCO: logo v hlavičce jen přescrolluje nahoru (bez odchodu na Domů)
    // ============================================
    (function initHeaderLogoScrollTopOnSubpages() {
        const body = document.body;
        if (!body.classList.contains('page-oko') && !body.classList.contains('page-bos-pco')) {
            return;
        }
        const logo = document.querySelector('.header a.logo');
        if (!logo) {
            return;
        }
        logo.addEventListener('click', function(e) {
            if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
                return;
            }
            e.preventDefault();
            scrollPageToTop();
            closeMobileNav();
        });
    })();

    // ============================================
    // Domů / BOS-PCO / OKO / Kontakt: na stejné stránce jen scroll nahoru
    // ============================================
    (function initNavSamePageScrollTop() {
        const mainNav = document.getElementById('mainNav');
        if (!mainNav) {
            return;
        }
        mainNav.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function(e) {
                if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
                    return;
                }
                const href = link.getAttribute('href');
                if (!navLinkIsSamePageWithoutHash(href)) {
                    return;
                }
                e.preventDefault();
                scrollPageToTop();
            });
        });
    })();

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

            /* Logo v hlavičce na OKO / BOS-PCO řeší initHeaderLogoScrollTopOnSubpages */
            if (anchor.classList.contains('logo') && anchor.closest('.header')) {
                return;
            }
            
            // Skip empty hash or just #
            if (href === '#' || href === '') {
                return;
            }

            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const headerOffset = getStickyHeaderScrollOffset();
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
    // Domů – hero karty: výška loga OKO = výška loga BOS (referenční)
    // ============================================
    (function initHeroCtaMatchOkoLogoToBos() {
        const grid = document.querySelector('.hero--with-visual .hero-cta-grid');
        if (!grid) return;

        const bosLogo = grid.querySelector('.cta-bos .cta-logo');
        const okoLogo = grid.querySelector('.cta-oko .cta-logo');
        if (!bosLogo || !okoLogo) return;

        let rafId = 0;

        function apply() {
            const h = bosLogo.getBoundingClientRect().height;
            if (h < 1) return;
            okoLogo.style.height = h + 'px';
            okoLogo.style.width = 'auto';
        }

        function schedule() {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(apply);
        }

        function bindResize() {
            if ('ResizeObserver' in window) {
                const ro = new ResizeObserver(schedule);
                ro.observe(grid);
            }
            window.addEventListener('resize', schedule, { passive: true });
        }

        function start() {
            schedule();
            bindResize();
        }

        if (bosLogo.complete && bosLogo.naturalHeight > 0) {
            start();
        } else {
            bosLogo.addEventListener('load', start, { once: true });
        }

        okoLogo.addEventListener('load', schedule);

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(schedule);
        }
    })();

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
        const isIndexPage = currentPath === 'index.html';
        const isBosPcoPage = currentPath === 'bos-pco.html';
        const isOkoPage = currentPath === 'oko.html';
        const testimonialsStaggerPage = isIndexPage || isBosPcoPage || isOkoPage;

        // Elements to animate - cards and interactive elements
        const cardElements = document.querySelectorAll(
            '.service-card, .feature-card, .contact-card, .tech-item, ' +
            '.licence-card, .licence-cta, .contact-method, .person-card, .hours-card, ' +
            '.pconline-feature, .cta-card, .teamviewer-box, .pconline-login, ' +
            '.opening-hours, .note-box, .testimonial-card, .job-card'
        );

        // Text elements to animate
        const textElements = document.querySelectorAll(
            'h2, h3, .hero-text, .page-intro, .licence-intro, .tech-intro, .pconline-intro, .jobs-intro, .section-intro'
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
            /* Podstránky BOS-PCO / OKO: .page-subtitle + .page-intro v hero – CSS animace */
            if (el.closest('.page-hero--entrance') &&
                (el.classList.contains('page-intro') || el.classList.contains('page-subtitle'))) {
                return false;
            }
            /* OKO: plovoucí benefit karty mezi hero a službami – hned viditelné */
            if (el.closest('.oko-hero-bridge')) {
                return false;
            }
            /* Index + BOS-PCO / OKO: sekce Reference – postupně po najetí (IntersectionObserver níže) */
            if (testimonialsStaggerPage) {
                const ts = el.closest('.testimonials-section');
                if (ts) {
                    if (el.classList.contains('testimonial-card') && !el.hasAttribute('hidden')) {
                        return false;
                    }
                    if (el.tagName === 'H2' && el.parentElement &&
                        el.parentElement.classList.contains('container') && ts.contains(el)) {
                        return false;
                    }
                    if (el.classList.contains('section-intro') && ts.contains(el)) {
                        return false;
                    }
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

        /* BOS-PCO / OKO: hero .page-intro bez page-hero--entrance – hned viditelný jako dříve */
        if (isBosPcoPage || isOkoPage) {
            filteredElements.forEach(el => {
                if (!el) return;
                if (el.classList.contains('page-intro') && el.closest('.page-hero') &&
                    !el.closest('.page-hero--entrance')) {
                    el.classList.add('animate-in');
                    el.style.opacity = '';
                    el.style.transform = '';
                }
            });
        }

        if (isOkoPage) {
            document.querySelectorAll(
                '.oko-hero-bridge .feature-card, .oko-hero-bridge .feature-card h3, #oko-why-cards-heading'
            ).forEach(function(el) {
                if (!el) return;
                el.classList.add('animate-in');
                el.style.opacity = '';
                el.style.transform = '';
            });
        }

        // Ensure all elements start hidden (prevent FOUC)
        filteredElements.forEach(el => {
            if (el && !el.classList.contains('animate-in')) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
            }
        });

        function revealTestimonialsReferenceSection() {
            if (!testimonialsStaggerPage) {
                return;
            }
            const refSection = document.querySelector('.testimonials-section');
            if (!refSection) {
                return;
            }
            // Guard: aby se animace nespustila víckrát při opakovaném intersection
            if (refSection.dataset.referenceRevealed === '1') {
                return;
            }
            refSection.dataset.referenceRevealed = '1';

            const refGrid = document.getElementById('bosPcoTestimonialsGrid') ||
                document.getElementById('okoTestimonialsGrid') ||
                refSection.querySelector(':scope > .container > .testimonials-grid');
            const heading = refSection.querySelector(':scope > .container > h2');
            const intro = refSection.querySelector(':scope > .container > .section-intro');
            const refCards = refGrid
                ? refGrid.querySelectorAll('.testimonial-card:not([hidden])')
                : [];

            function refReveal(el) {
                if (!el) {
                    return;
                }
                el.classList.add('animate-in');
                el.style.opacity = '';
                el.style.transform = '';
            }

            // Postupné odhalování (vizuálně znatelnější stagger)
            const introDelayMs = 200;
            const cardsStartDelayMs = 400;
            const staggerMs = 120;
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (reducedMotion) {
                refReveal(heading);
                refReveal(intro);
                refCards.forEach(refReveal);
            } else {
                // Nadpis hned, perex a pak karty s postupným staggerem
                refReveal(heading);
                window.setTimeout(function() {
                    refReveal(intro);
                }, introDelayMs);

                refCards.forEach(function(card, idx) {
                    window.setTimeout(function() {
                        refReveal(card);
                    }, cardsStartDelayMs + idx * staggerMs);
                });
            }
        }

        if (!('IntersectionObserver' in window)) {
            // Fallback for browsers without IntersectionObserver
            filteredElements.forEach(el => {
                if (el) {
                    el.classList.add('animate-in');
                }
            });
            revealTestimonialsReferenceSection();
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
            if (el && !el.classList.contains('animate-in')) {
                observer.observe(el);
            }
        });

        if (testimonialsStaggerPage) {
            const refSection = document.querySelector('.testimonials-section');
            if (refSection) {
                const refSectionObserver = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (!entry.isIntersecting) {
                            return;
                        }
                        revealTestimonialsReferenceSection();
                        refSectionObserver.unobserve(entry.target);
                    });
                }, observerOptions);
                refSectionObserver.observe(refSection);
            }
        }
    }

    // ============================================
    // Reference (BOS-PCO / OKO): „Další“ – dávky recenzí
    // ============================================
    function initTestimonialsLoadMore(gridId, btnId, ctaId) {
        const grid = document.getElementById(gridId);
        const btn = document.getElementById(btnId);
        const cta = ctaId ? document.getElementById(ctaId) : null;
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

    initTestimonialsLoadMore('bosPcoTestimonialsGrid', 'bosPcoTestimonialsMore', 'bosPcoTestimonialsCta');
    initTestimonialsLoadMore('okoTestimonialsGrid', 'okoTestimonialsMore', 'okoTestimonialsCta');
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
            { src: 'img/osvedceni-1.jpg', alt: 'Osvědčení o školení ACS-Line', title: 'Proškolení ACS-Line' },
            { src: 'img/osvedceni-2.jpg', alt: 'Osvědčení o školení FBII', title: 'Proškolení FBII' },
            { src: 'img/osvedceni-3.jpg', alt: 'Osvědčení o školení Euroalarm', title: 'Proškolení Euroalarm' },
            { src: 'img/osvedceni-4.jpg', alt: 'Osvědčení o školení Paradox Security', title: 'Proškolení Paradox Security' },
            { src: 'img/osvedceni-5.jpg', alt: 'Osvědčení o školení Esprit', title: 'Proškolení Esprit' },
            { src: 'img/osvedceni-6.jpg', alt: 'Osvědčení o školení Honeywell Galaxy', title: 'Proškolení Honeywell Galaxy' },
            { src: 'img/osvedceni-7.jpg', alt: 'Osvědčení o školení Alphatel', title: 'Proškolení Alphatel' },
            { src: 'img/osvedceni-8.jpg', alt: 'Osvědčení o školení Dominus', title: 'Proškolení Dominus' },
            { src: 'img/osvedceni-9.jpg', alt: 'Osvědčení o školení EPS Lites', title: 'Proškolení EPS Lites' },
            { src: 'img/osvedceni-10.jpg', alt: 'Certifikát výrobce Jablotron', title: 'Certifikát Jablotron' }
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
