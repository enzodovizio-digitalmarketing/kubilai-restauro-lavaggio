/* =========================================================================
   KUBILAI TAPPETI — Landing JS (vanilla, nessuna dipendenza)
   ========================================================================= */
(function () {
  'use strict';
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Anno footer ---------- */
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Header scroll state ---------- */
  var header = $('#siteHeader');
  function onScroll() {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = $('#navToggle');
  function closeMenu() { document.body.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false'); }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('#mobileMenu a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revEls = $$('.reveal');
  if ('IntersectionObserver' in window && revEls.length) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revEls.forEach(function (el) { ro.observe(el); });
  } else {
    revEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Count-up stats ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    var plain = el.getAttribute('data-plain') === '1'; // anni "1970" senza animazione lunga
    var dur = plain ? 1100 : 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toString();
    }
    requestAnimationFrame(step);
  }
  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------- Active nav highlight ---------- */
  var sections = $$('main section[id]');
  var navMap = {};
  $$('.nav-links a').forEach(function (a) {
    var id = a.getAttribute('href').replace('#', ''); navMap[id] = a;
  });
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = navMap[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          $$('.nav-links a').forEach(function (x) { x.classList.remove('active'); });
          a.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { so.observe(s); });
  }

  /* ---------- FAQ accordion ---------- */
  $$('.faq__item').forEach(function (item) {
    var q = $('.faq__q', item), a = $('.faq__a', item);
    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      $$('.faq__item.open').forEach(function (o) {
        o.classList.remove('open'); $('.faq__a', o).style.maxHeight = null; $('.faq__q', o).setAttribute('aria-expanded', 'false');
      });
      if (!open) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; q.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var items = $$('.gallery__item');
  var lb = $('#lightbox'), lbImg = $('#lbImg');
  var srcs = items.map(function (it) { return it.getAttribute('data-full'); });
  var cur = 0;
  function openLB(i) { cur = i; lbImg.src = srcs[i]; lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeLB() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  function go(d) { cur = (cur + d + srcs.length) % srcs.length; lbImg.src = srcs[cur]; }
  items.forEach(function (it, i) { it.addEventListener('click', function () { openLB(i); }); });
  if (lb) {
    $('#lbClose').addEventListener('click', closeLB);
    $('#lbPrev').addEventListener('click', function (e) { e.stopPropagation(); go(-1); });
    $('#lbNext').addEventListener('click', function (e) { e.stopPropagation(); go(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLB(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });
  }

  /* ---------- Form validation + submit ---------- */
  var form = $('#preventivoForm');
  if (form) {
    var setErr = function (field, bad) { field.classList.toggle('invalid', bad); };
    var validEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };

    function validate() {
      var ok = true;
      var nome = $('#nome'), tel = $('#telefono'), email = $('#email'), serv = $('#servizio'), priv = form.querySelector('[name="privacy"]');
      setErr(nome.closest('.field'), !nome.value.trim());            if (!nome.value.trim()) ok = false;
      setErr(tel.closest('.field'), tel.value.trim().length < 5);    if (tel.value.trim().length < 5) ok = false;
      if (email.value.trim()) { var be = !validEmail(email.value.trim()); setErr(email.closest('.field'), be); if (be) ok = false; }
      else setErr(email.closest('.field'), false);
      setErr(serv.closest('.field'), !serv.value);                   if (!serv.value) ok = false;
      if (!priv.checked) ok = false;
      return ok;
    }

    function showSuccess() {
      form.style.display = 'none';
      var s = $('#formSuccess'); s.classList.add('show');
      s.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) {
        var firstBad = form.querySelector('.field.invalid, [name="privacy"]:not(:checked)');
        if (firstBad) firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      var btn = $('#submitBtn'); btn.disabled = true; btn.textContent = 'Invio in corso…';
      // Invio a Google Apps Script → scrive nel Foglio contatti + email.
      // mode:'no-cors' → risposta opaca (non leggibile), ma il POST arriva: consideriamo inviato.
      fetch(form.action, { method: 'POST', body: new FormData(form), mode: 'no-cors' })
        .then(function () { showSuccess(); })
        .catch(function () { showSuccess(); });
    });

    // togli stato errore mentre l'utente scrive
    $$('#preventivoForm input, #preventivoForm select, #preventivoForm textarea').forEach(function (el) {
      el.addEventListener('input', function () { el.closest('.field') && el.closest('.field').classList.remove('invalid'); });
    });
  }
})();
