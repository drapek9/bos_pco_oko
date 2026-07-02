window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

window.BOS_PCO_GA_ID = 'G-GHN6P1M2K1';
window.BOS_PCO_CONSENT_KEY = 'bos_pco_cookie_consent';

function bosPcoHasAnalyticsConsent() {
    try {
        return localStorage.getItem(window.BOS_PCO_CONSENT_KEY) === 'accepted';
    } catch (e) {
        return false;
    }
}

gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'wait_for_update': 500
});

if (bosPcoHasAnalyticsConsent()) {
    gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
    });
}
