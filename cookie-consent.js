/* =============================================================
   Yes& — souhlas s cookies (Google Analytics)

   Proč tenhle soubor existuje: GA4 posílá data na Google servery
   a ukládá si cookie v prohlížeči. Podle GDPR/ePrivacy to smíme
   dělat až po souhlasu návštěvníka — takže dokud nekliknou na
   "Přijmout", GA4 se vůbec nenačte (žádný skript, žádná cookie,
   žádný požadavek na googletagmanager.com).

   Volba se pamatuje v localStorage, takže se banner příště
   neukazuje znovu. Odkaz "Nastavení cookies" v patičce umožní
   volbu kdykoliv změnit.
   ============================================================= */
(function () {
  'use strict';

  var GA_ID = 'G-2XNE1XJPR0';
  var STORAGE_KEY = 'yesend_cookie_consent'; /* 'granted' | 'denied' */

  function loadGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  function hideBanner() {
    var el = document.getElementById('cookie-banner');
    if (el) el.remove();
  }

  function showBanner() {
    if (document.getElementById('cookie-banner') || !document.body) return;

    var el = document.createElement('div');
    el.id = 'cookie-banner';
    el.className = 'cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Souhlas s používáním cookies');
    el.innerHTML =
      '<p class="cookie-banner__text">' +
        'Používáme Google Analytics, abychom viděli, jak web funguje. ' +
        'Data se začnou sbírat, jen když souhlasíte.' +
      '</p>' +
      '<div class="cookie-banner__actions">' +
        '<button type="button" class="cookie-banner__btn cookie-banner__btn--ghost" id="cookie-deny">Odmítnout</button>' +
        '<button type="button" class="cookie-banner__btn cookie-banner__btn--accent" id="cookie-accept">Přijmout</button>' +
      '</div>';

    document.body.appendChild(el);

    document.getElementById('cookie-accept').addEventListener('click', function () {
      try { localStorage.setItem(STORAGE_KEY, 'granted'); } catch (e) {}
      loadGA();
      hideBanner();
    });
    document.getElementById('cookie-deny').addEventListener('click', function () {
      try { localStorage.setItem(STORAGE_KEY, 'denied'); } catch (e) {}
      hideBanner();
    });
  }

  /* Odkaz "Nastavení cookies" v patičce — kdykoliv volbu znovu otevře. */
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('#cookie-settings-link');
    if (!link) return;
    e.preventDefault();
    showBanner();
  });

  var consent = null;
  try { consent = localStorage.getItem(STORAGE_KEY); } catch (e) { /* soukromé prohlížení apod. */ }

  if (consent === 'granted') {
    loadGA();
  } else if (consent !== 'denied') {
    showBanner();
  }
})();
