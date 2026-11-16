/* ============================================================
   Дарья Иванова — интерактивность лендинга
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header on scroll ---------- */
  const header = document.getElementById('header');
  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Gentle parallax ---------- */
  const parallaxItems = document.querySelectorAll('[data-parallax]');
  if (parallaxItems.length && !reduceMotion && window.innerWidth > 900) {
    let ticking = false;
    function applyParallax() {
      parallaxItems.forEach((el) => {
        const factor = parseFloat(el.dataset.parallax) || 0;
        const rect = el.getBoundingClientRect();
        const centerDelta = (rect.top + rect.height / 2) - window.innerHeight / 2;
        const safeDelta = Math.max(-400, Math.min(400, centerDelta));
        el.style.setProperty('--py', (safeDelta * factor).toFixed(1) + 'px');
      });
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(applyParallax); }
    }, { passive: true });
    applyParallax();
  }

  /* ---------- Mobile navigation ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  function closeNav() {
    burger.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }
  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('open', !isOpen);
  });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeNav();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeNav(); });

  /* ---------- Active nav item ---------- */
  const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- Lightbox ---------- */
  const galleries = {
    case1: [
      { src: 'assets/c1-living-01.webp', alt: 'Гостиная загородного дома с антресолью', caption: 'Гостиная · зона отдыха' },
      { src: 'assets/c1-living-02.webp', alt: 'Гостиная, вид в сторону прихожей', caption: 'Гостиная · вид в сторону прихожей' },
      { src: 'assets/c1-living-03.webp', alt: 'Гостиная с камином при вечернем освещении', caption: 'Гостиная · вечерний сценарий света' },
      { src: 'assets/c1-bath-01.webp', alt: 'Санузел с плиткой шалфея и подсветкой', caption: 'Санузел · плитка шалфея и подсветка' },
      { src: 'assets/c1-bath-02.webp', alt: 'Санузел с деревянной панелью и душевой', caption: 'Санузел · дерево и душевая зона' },
      { src: 'assets/c1-bath-03.webp', alt: 'Фрагмент отделки душевой зоны санузла', caption: 'Санузел · фрагмент отделки' },
      { src: 'assets/c1-draw-01.webp', alt: 'Планировочное решение первого этажа', caption: 'Планировочное решение · 1-й этаж' },
      { src: 'assets/c1-draw-02.webp', alt: 'План расстановки светильников первого этажа', caption: 'План расстановки светильников' },
      { src: 'assets/c1-draw-03.webp', alt: 'План групп включения первого этажа', caption: 'План групп включения' },
      { src: 'assets/c1-draw-04.webp', alt: 'План электрооборудования первого этажа', caption: 'План электрооборудования' },
      { src: 'assets/c1-draw-05.webp', alt: 'Спецификации электрооборудования', caption: 'Спецификации электрооборудования' },
      { src: 'assets/c1-draw-06.webp', alt: 'Развёртки стен комнаты отдыха', caption: 'Развёртки стен комнаты отдыха' },
      { src: 'assets/c1-draw-07.webp', alt: 'Развёртки стен санузла', caption: 'Развёртки стен санузла' }
    ],
    case2: [
      { src: 'assets/case2-kitchen.webp', alt: 'Кухня-гостиная площадью 27,6 м²', caption: 'Кухня-гостиная · 27,6 м²' },
      { src: 'assets/c2-hall-01.webp', alt: 'Прихожая в трёхкомнатной квартире', caption: 'Прихожая' },
      { src: 'assets/c2-bedroom-01.webp', alt: 'Спальня с тёплым вечерним светом', caption: 'Спальня · вечерний свет' },
      { src: 'assets/c2-bedroom-02.webp', alt: 'Спальня с рабочим местом и экраном', caption: 'Спальня · рабочее место' },
      { src: 'assets/c2-kids-01.webp', alt: 'Детская с рабочим местом у окна', caption: 'Детская · рабочее место у окна' },
      { src: 'assets/c2-kids-02.webp', alt: 'Детская с кроватью и письменным столом', caption: 'Детская · стол и спальное место' },
      { src: 'assets/c2-kids-03.webp', alt: 'Детская для футболиста со спортивной зоной', caption: 'Детская · спортивная зона' },
      { src: 'assets/c2-kids-04.webp', alt: 'Детская для футболиста, другой ракурс', caption: 'Детская · другой ракурс' },
      { src: 'assets/c2-bath-01.webp', alt: 'Санузел с подсвеченным зеркалом', caption: 'Санузел · зеркало с подсветкой' },
      { src: 'assets/c2-bath-02.webp', alt: 'Санузел с ванной и душевой', caption: 'Санузел · ванна и душ' },
      { src: 'assets/c2-bath-03.webp', alt: 'Санузел, зона душевой', caption: 'Санузел · душевая' },
      { src: 'assets/c2-bath-04.webp', alt: 'Санузел с серой плиткой', caption: 'Санузел · отделка плиткой' },
      { src: 'assets/c2-bath-05.webp', alt: 'Санузел, раковина и зеркало', caption: 'Санузел · раковина и зеркало' },
      { src: 'assets/c2-bath-06.webp', alt: 'Санузел, фрагмент душевой зоны', caption: 'Санузел · фрагмент' },
      { src: 'assets/c2-draw-01.webp', alt: 'Планировочное решение трёхкомнатной квартиры', caption: 'Планировочное решение' },
      { src: 'assets/c2-draw-02.webp', alt: 'План расстановки светильников', caption: 'План расстановки светильников' },
      { src: 'assets/c2-draw-03.webp', alt: 'План электрооборудования', caption: 'План электрооборудования' },
      { src: 'assets/c2-draw-04.webp', alt: 'План отделки прихожей', caption: 'План отделки прихожей' },
      { src: 'assets/c2-draw-05.webp', alt: 'План отделки кухни-гостиной', caption: 'План отделки кухни-гостиной' }
    ],
    case3: [
      { src: 'assets/c3-living-01.webp', alt: 'Гостиная загородного дома 100 м²', caption: 'Гостиная · зона отдыха' },
      { src: 'assets/c3-living-02.webp', alt: 'Гостиная-столовая загородного дома', caption: 'Гостиная · столовая зона' },
      { src: 'assets/c3-hall-01.webp', alt: 'Прихожая загородного дома', caption: 'Прихожая' },
      { src: 'assets/case3-bedroom.webp', alt: 'Спальня с каскадным изголовьем из деревянных реек и контурной подсветкой', caption: 'Спальня · каскадное изголовье с подсветкой' },
      { src: 'assets/c3-bedroom-01.webp', alt: 'Спальня с зелёной стеной и круглым зеркалом', caption: 'Спальня · другой ракурс' },
      { src: 'assets/c3-kids-01.webp', alt: 'Детская с двумя рабочими местами у окна', caption: 'Детская · рабочая зона у окна' },
      { src: 'assets/case3-kids.webp', alt: 'Детская с двухъярусной кроватью и стеллажом', caption: 'Детская · двухъярусная кровать' },
      { src: 'assets/c3-kitchen-01.webp', alt: 'Кухня с готовой мебелью масс-маркет', caption: 'Кухня' },
      { src: 'assets/c3-bath-01.webp', alt: 'Санузел с растениями и деревом', caption: 'Санузел' },
      { src: 'assets/c3-draw-01.webp', alt: 'Планировочное решение загородного дома', caption: 'Планировочное решение' },
      { src: 'assets/c3-draw-02.webp', alt: 'План групп включения', caption: 'План групп включения' },
      { src: 'assets/c3-draw-03.webp', alt: 'План электрооборудования', caption: 'План электрооборудования' },
      { src: 'assets/c3-draw-04.webp', alt: 'План отделки стен гостиной', caption: 'План отделки стен гостиной' }
    ],
    drawings: [
      { src: 'assets/drawing-walls.webp', alt: 'Развёртки стен кухни', caption: 'Развёртки стен · ArchiCAD' },
      { src: 'assets/drawing-moldings.webp', alt: 'План отделки детской', caption: 'План отделки детской · ArchiCAD' },
      { src: 'assets/drawing-slats.webp', alt: 'План отделки рейками', caption: 'Узлы и спецификации · ArchiCAD' },
      { src: 'assets/drawing-bathroom.webp', alt: 'План отделки стен ванной', caption: 'План отделки ванной · ArchiCAD' }
    ]
  };

  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lightboxImage');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbCounter = document.getElementById('lightboxCounter');
  let currentGallery = [];
  let currentIndex = 0;
  let lastFocused = null;

  function renderLightbox() {
    const item = currentGallery[currentIndex];
    if (!item) return;
    lbImage.src = item.src;
    lbImage.alt = item.alt;
    lbCaption.textContent = item.caption;
    lbCounter.textContent = (currentIndex + 1) + ' / ' + currentGallery.length;
  }
  function openLightbox(key, trigger) {
    currentGallery = galleries[key] || [];
    if (!currentGallery.length) return;
    currentIndex = 0;
    lastFocused = trigger || document.activeElement;
    renderLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('lightboxClose').focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }
  function shift(direction) {
    currentIndex = (currentIndex + direction + currentGallery.length) % currentGallery.length;
    renderLightbox();
  }

  document.querySelectorAll('[data-gallery]').forEach((btn) => {
    btn.addEventListener('click', () => openLightbox(btn.dataset.gallery, btn));
  });
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', () => shift(-1));
  document.getElementById('lightboxNext').addEventListener('click', () => shift(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') shift(-1);
    if (e.key === 'ArrowRight') shift(1);
  });

  /* ---------- Request form ---------- */
  const form = document.getElementById('requestForm');
  const success = document.getElementById('formSuccess');
  const successText = document.getElementById('successText');
  const resetBtn = document.getElementById('formReset');

  function setError(fieldName, message) {
    const input = form.elements[fieldName];
    const errorEl = form.querySelector('[data-error-for="' + fieldName + '"]');
    if (input) input.classList.toggle('invalid', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  }

  function validateForm() {
    let valid = true;
    const name = form.elements.name.value.trim();
    const contact = form.elements.contact.value.trim();
    const consent = form.elements.consent.checked;

    if (name.length < 2) {
      setError('name', 'Укажите ваше имя');
      valid = false;
    } else setError('name', '');

    const contactOk = contact.length >= 5 && (/@/.test(contact) || /\d/.test(contact));
    if (!contactOk) {
      setError('contact', 'Укажите телефон или Telegram');
      valid = false;
    } else setError('contact', '');

    if (!consent) {
      setError('consent', 'Нужно ваше согласие на связь');
      valid = false;
    } else setError('consent', '');

    return valid ? { name, contact, message: form.elements.message.value.trim() } : null;
  }

  const submitBtn = form.querySelector('button[type="submit"]');

  async function deliverRequest(data) {
    const payload = {
      name: data.name,
      contact: data.contact,
      message: data.message,
      date: new Date().toLocaleString('ru-RU'),
      page: location.href,
    };

    // Локальная копия на случай проблем со связью
    try {
      const saved = JSON.parse(localStorage.getItem('darya_requests') || '[]');
      saved.push(payload);
      localStorage.setItem('darya_requests', JSON.stringify(saved));
    } catch (err) { /* storage may be unavailable */ }

    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || 'Ошибка отправки');
      return { delivered: true };
    } catch (error) {
      return { delivered: false, error: error.message };
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = validateForm();
    if (!data) {
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
      else if (!form.elements.consent.checked) form.elements.consent.focus();
      return;
    }

    const originalLabel = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Отправляем…</span><span class="btn__circle" aria-hidden="true">…</span>';

    const result = await deliverRequest(data);

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalLabel;

    if (result.delivered) {
      successText.textContent = 'Спасибо, ' + data.name + '! Заявка отправлена — мы свяжемся с вами, чтобы обсудить квартиру и выбрать удобное время для консультации.';
    } else {
      successText.textContent = 'Спасибо, ' + data.name + '! Не удалось отправить заявку автоматически (' + result.error + '). Она сохранена в этом браузере — пожалуйста, напишите мне в Telegram: @darya_f_ivanova';
    }
    form.hidden = true;
    success.hidden = false;
  });

  ['name', 'contact'].forEach((fieldName) => {
    form.elements[fieldName].addEventListener('input', () => setError(fieldName, ''));
  });
  form.elements.consent.addEventListener('change', () => setError('consent', ''));

  resetBtn.addEventListener('click', () => {
    form.reset();
    ['name', 'contact', 'consent'].forEach((f) => setError(f, ''));
    success.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });
})();
