/**
 * Main JavaScript file for BOS-PCO & OKO website
 * Handles mobile menu, smooth scrolling, and other interactions
 */

(function() {
    'use strict';

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('open');
            
            // Animate hamburger icon
            const spans = menuToggle.querySelectorAll('span');
            if (mainNav.classList.contains('open')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking on a link
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('open');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = mainNav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
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

        // Elements to animate - cards and interactive elements
        const cardElements = document.querySelectorAll(
            '.service-card, .feature-card, .contact-card, .tech-item, ' +
            '.licence-card, .contact-method, .person-card, .hours-card, ' +
            '.pconline-feature, .cta-card, .teamviewer-box, .pconline-login, ' +
            '.opening-hours, .note-box, .testimonial-card'
        );

        // Text elements to animate
        const textElements = document.querySelectorAll(
            'h2, h3, .hero-text, .page-intro, .licence-intro, .tech-intro, .pconline-intro'
        );

        // Combine all elements
        const allElements = [...cardElements, ...textElements];

        // Filter out footer elements - footer should not be animated
        const filteredElements = Array.from(allElements).filter(el => {
            return el && !el.closest('.footer');
        });

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

    // Initialize scroll animations immediately to prevent FOUC
    initScrollAnimations();

    console.log('BOS-PCO & OKO website loaded successfully');
})();
