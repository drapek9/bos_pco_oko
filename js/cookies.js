(function () {
    'use strict';

    var CONSENT_KEY = window.BOS_PCO_CONSENT_KEY || 'bos_pco_cookie_consent';
    var GA_ID = window.BOS_PCO_GA_ID || 'G-GHN6P1M2K1';

    function getConsent() {
        try {
            return localStorage.getItem(CONSENT_KEY);
        } catch (e) {
            return null;
        }
    }

    function setConsent(value) {
        try {
            localStorage.setItem(CONSENT_KEY, value);
        } catch (e) {
            /* localStorage unavailable */
        }
    }

    function getBanner() {
        return document.getElementById('cookieConsent');
    }

    function showBanner() {
        var banner = getBanner();
        if (!banner) {
            return;
        }
        banner.hidden = false;
        requestAnimationFrame(function () {
            banner.classList.add('cookie-consent--visible');
        });
    }

    function hideBanner() {
        var banner = getBanner();
        if (!banner) {
            return;
        }
        banner.classList.remove('cookie-consent--visible');
        banner.hidden = true;
    }

    function updateCookiesPageUI() {
        var status = document.getElementById('cookieConsentStatus');
        if (!status) {
            return;
        }

        var consent = getConsent();
        if (consent === 'accepted') {
            status.textContent = 'Analytické cookies máte povolené.';
        } else if (consent === 'rejected') {
            status.textContent = 'Analytické cookies máte odmítnuté.';
        } else {
            status.textContent = 'Zatím jste nevyjádřili souhlas s analytickými cookies.';
        }
    }

    function applyConsentToGtag(granted) {
        if (typeof gtag !== 'function') {
            return;
        }
        gtag('consent', 'update', {
            'analytics_storage': granted ? 'granted' : 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
        });
    }

    function acceptCookies() {
        setConsent('accepted');
        applyConsentToGtag(true);
        if (typeof gtag === 'function') {
            gtag('config', GA_ID, { 'send_page_view': true });
        }
        hideBanner();
        updateCookiesPageUI();
    }

    function rejectCookies() {
        setConsent('rejected');
        applyConsentToGtag(false);
        hideBanner();
        updateCookiesPageUI();
    }

    function createBanner() {
        if (getBanner()) {
            return;
        }

        var banner = document.createElement('div');
        banner.id = 'cookieConsent';
        banner.className = 'cookie-consent';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-labelledby', 'cookieConsentTitle');
        banner.setAttribute('aria-describedby', 'cookieConsentDesc');
        banner.hidden = true;
        banner.innerHTML =
            '<div class="cookie-consent__inner">' +
                '<div class="cookie-consent__text">' +
                    '<p id="cookieConsentTitle" class="cookie-consent__title">Cookies na tomto webu</p>' +
                    '<p id="cookieConsentDesc" class="cookie-consent__desc">Používáme cookies, které nám pomáhají web vylepšovat a nabídnout vám lepší uživatelský zážitek. Měření spustíme až po vašem souhlasu. Více v <a href="cookies.html">zásadách cookies</a>.</p>' +
                '</div>' +
                '<div class="cookie-consent__actions">' +
                    '<button type="button" class="cookie-consent__btn cookie-consent__btn--reject" data-cookie-action="reject">Odmítnout</button>' +
                    '<button type="button" class="cookie-consent__btn cookie-consent__btn--accept" data-cookie-action="accept">Povolit</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(banner);

        banner.addEventListener('click', function (event) {
            var action = event.target.getAttribute('data-cookie-action');
            if (action === 'accept') {
                acceptCookies();
            } else if (action === 'reject') {
                rejectCookies();
            }
        });
    }

    function bindCookiesPageButtons() {
        document.querySelectorAll('[data-cookie-action]').forEach(function (button) {
            if (button.closest('#cookieConsent')) {
                return;
            }

            button.addEventListener('click', function () {
                var action = button.getAttribute('data-cookie-action');
                if (action === 'accept') {
                    acceptCookies();
                } else if (action === 'reject') {
                    rejectCookies();
                }
            });
        });
    }

    function init() {
        createBanner();
        bindCookiesPageButtons();

        if (!getConsent()) {
            showBanner();
        }

        updateCookiesPageUI();
    }

    window.BosPcoCookies = {
        accept: acceptCookies,
        reject: rejectCookies,
        getConsent: getConsent
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
