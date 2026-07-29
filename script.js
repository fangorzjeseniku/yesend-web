/* =============================================================
   Yes& — MTG a D&D klub Jeseník
   script.js — mobilní menu, chování hlavičky, kotvy, formulář
   Vše je progresivní vylepšení: bez JS zůstane web plně čitelný.
   ============================================================= */
(function () {
  'use strict';

  /* -----------------------------------------------------------
     1. MOBILNÍ MENU (hamburger + overlay)
     ----------------------------------------------------------- */
  var burger = document.querySelector('.hamburger');
  var menu = document.getElementById('mobile-menu');
  var closeBtn = document.querySelector('.nav-mobile__close');

  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    document.body.classList.add('menu-open');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    if (closeBtn) closeBtn.focus();
  }

  function closeMenu() {
    if (!menu) return;
    menu.hidden = true;
    document.body.classList.remove('menu-open');
    if (burger) {
      burger.setAttribute('aria-expanded', 'false');
      burger.focus();
    }
  }

  if (burger) burger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  /* Klik na odkaz v menu = zavřít menu */
  if (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
  }

  /* Escape zavře menu */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && !menu.hidden) closeMenu();
  });

  /* Když se okno rozšíří na desktop, menu zavřít (ať nezůstane viset) */
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 900 && menu && !menu.hidden) closeMenu();
  });

  /* -----------------------------------------------------------
     2. HLAVIČKA — skrytí při scrollování dolů, návrat při nahoru
     ----------------------------------------------------------- */
  var header = document.querySelector('.header');
  if (header) {
    var lastY = window.scrollY;
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        var goingDown = y > lastY;

        /* Menu otevřené → hlavičku neschovávat */
        if (menu && !menu.hidden) {
          header.classList.remove('is-hidden');
        } else if (y < 10) {
          header.classList.remove('is-hidden');
        } else if (goingDown && y > 80) {
          header.classList.add('is-hidden');
        } else if (!goingDown) {
          header.classList.remove('is-hidden');
        }

        lastY = y;
        ticking = false;
      });
    }, { passive: true });
  }

  /* -----------------------------------------------------------
     3. KOTVY NAPŘÍČ STRÁNKAMI
     Problém: proklik "O nás" z podstránky doskočil na správné místo
     až na druhý klik — prohlížeč skáče na kotvu dřív, než se
     dorenderují obrázky nad ní, takže pozice ujede.
     Řešení: po plném načtení stránky (window.load) doskočit znovu.
     ----------------------------------------------------------- */
  function jumpToHash() {
    if (!window.location.hash) return;
    var id = window.location.hash.slice(1);
    var target = document.getElementById(id);
    if (!target) return;

    /* Skok bez animace — jde o dorovnání pozice, ne o efekt */
    var html = document.documentElement;
    var prev = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    target.scrollIntoView({ block: 'start' });
    html.style.scrollBehavior = prev;
  }

  window.addEventListener('load', function () {
    /* Dvakrát: hned po load a ještě o chvíli později, kdyby
       dopadlo pozdě načtené písmo nebo obrázek. */
    jumpToHash();
    setTimeout(jumpToHash, 120);
  });

  /* Změna kotvy za běhu (např. zpět/vpřed v prohlížeči) */
  window.addEventListener('hashchange', jumpToHash);

  /* -----------------------------------------------------------
     4. VIDEA — přehrávač se vloží až po kliknutí na náhled
     Do té doby je na stránce jen obrázek, takže se nestahuje
     ~1 MB YouTube skriptů na každé video zbytečně dopředu.
     ----------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var facade = e.target.closest && e.target.closest('.video__facade');
    if (!facade) return;

    var id = facade.getAttribute('data-yt');
    if (!id) return;

    /* Pojistka: když YouTube u konkrétního videa odmítá vložení na cizí web
       (stává se např. u nároku na autorská práva k hudbě), stačí tomu videu
       v HTML přidat atribut data-link a klik ho místo vkládání otevře
       přímo na YouTube. */
    if (facade.hasAttribute('data-link')) {
      var t = facade.getAttribute('data-start');
      window.open('https://www.youtube.com/watch?v=' + id + (t ? '&t=' + t : ''), '_blank', 'noopener');
      return;
    }

    var params = 'autoplay=1&rel=0';
    var start = facade.getAttribute('data-start');
    if (start) params += '&start=' + encodeURIComponent(start);

    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?' + params;
    iframe.title = facade.getAttribute('data-title') || 'Video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.setAttribute('allowfullscreen', '');

    facade.parentNode.replaceChild(iframe, facade);
    iframe.focus();
  });

  /* -----------------------------------------------------------
     5. FORMULÁŘ "Chci se přidat"

     Statický web nemá vlastní server, který by e-mail odeslal.
     Řeší to Web3Forms: formulář se pošle na jejich API a ono ho
     přepošle jako e-mail na adresu spojenou s access keyem.
     Návštěvník zůstane na stránce a rovnou vidí potvrzení.

     >>> NEŽ SE WEB NASADÍ: vlož access key níže. <<<
     Získáš ho na https://web3forms.com — zadáš e-mail, klíč ti
     přijde poštou. Bez registrace a zdarma.

     Dokud je klíč prázdný, formulář se chová jako dřív (otevře
     poštovního klienta), aby stránka nikdy nezůstala bez funkce.
     ----------------------------------------------------------- */
  /* Tenhle klíč je podle Web3Forms veřejný — je určený do klientského kódu
     a nedá se s ním číst odeslané zprávy, jen posílat nové. */
  var WEB3FORMS_KEY = 'b06e6ef5-7fc3-49fe-9edf-a2de3aed7b4e';
  var TARGET_MAIL   = 'fangorzjeseniku@gmail.com'; /* záloha pro mailto */

  var form = document.getElementById('join-form');
  var done = document.getElementById('form-done');
  var errBox = document.getElementById('form-error');

  function showDone() {
    form.hidden = true;
    if (errBox) errBox.hidden = true;
    if (done) {
      done.hidden = false;
      done.setAttribute('tabindex', '-1');
      done.focus(); /* čtečka obrazovky oznámí potvrzení */
    }

    /* GA4 — doporučená událost "generate_lead" pro odeslaný formulář.
       Volá se, jen když návštěvník souhlasil s cookies (jinak gtag
       vůbec neexistuje) — viz cookie-consent.js. */
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', { form_name: 'chci_se_pridat' });
    }
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = (form.elements.jmeno.value || '').trim();
      var mail = (form.elements.email.value || '').trim();
      var extra = (form.elements.navic.value || '').trim();
      if (!name || !mail) return; /* required atributy to řeší, jen pro jistotu */

      var subject = 'Yes& — chci se přidat: ' + name;
      var btn = form.querySelector('button[type="submit"]');

      /* --- Varianta bez klíče: poštovní klient návštěvníka --- */
      if (!WEB3FORMS_KEY) {
        window.location.href =
          'mailto:' + TARGET_MAIL +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(
            'Jméno: ' + name + '\n' +
            'E-mail: ' + mail + '\n' +
            'Něco navíc: ' + (extra || '—')
          );
        showDone();
        return;
      }

      /* --- Odeslání na pozadí přes Web3Forms --- */
      if (btn) { btn.disabled = true; btn.textContent = 'Posílám…'; }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: subject,
          from_name: 'Yes& — formulář na webu',
          /* Názvy polí se objeví v e-mailu, proto česky. */
          'Jméno': name,
          'E-mail': mail,
          'Něco navíc': extra || '—',
          /* Honeypot proti botům — pole je skryté, člověk ho nevyplní. */
          botcheck: form.elements.botcheck ? form.elements.botcheck.checked : false
        })
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.success) { showDone(); }
          else { throw new Error(data && data.message ? data.message : 'odeslání selhalo'); }
        })
        .catch(function () {
          /* Když API nedojede, ať přihláška nezmizí — nabídneme e-mail. */
          if (btn) { btn.disabled = false; btn.textContent = 'Chci se přidat'; }
          if (errBox) errBox.hidden = false;
        });
    });
  }
})();
