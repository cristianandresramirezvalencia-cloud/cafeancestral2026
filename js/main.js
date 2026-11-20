/* ============================================================
   CAFÉ ANCESTRAL — JavaScript
   Animaciones · Scroll · Navbar · Contador
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR: efecto scroll ── */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ── 2. MENÚ MÓVIL ── */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile-menu');
  const mobileClose = document.querySelector('.nav-mobile-close');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  // Cerrar al hacer clic en link
  document.querySelectorAll('.nav-mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── 3. SCROLL REVEAL (Intersection Observer) ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── 4. CONTADOR ANIMADO (estadísticas) ── */
  const counterEls = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const start = performance.now();
    const isDecimal = String(target).includes('.');

    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ── 5. SMOOTH SCROLL para anchors internos ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── 6. PARALLAX sutil en secciones inmersivas ── */
  const parallaxEls = document.querySelectorAll('.inmersiva-block img.fondo');

  function handleParallax() {
    parallaxEls.forEach(img => {
      const block = img.closest('.inmersiva-block');
      const rect = block.getBoundingClientRect();
      const windowH = window.innerHeight;
      if (rect.top < windowH && rect.bottom > 0) {
        const progress = (windowH - rect.top) / (windowH + rect.height);
        const offset = (progress - 0.5) * 60;
        img.style.transform = `translateY(${offset}px) scale(1.1)`;
      }
    });
  }
  window.addEventListener('scroll', handleParallax, { passive: true });

  /* ── 7. LIGHTBOX simple para galería ── */
  const galeriaItems = document.querySelectorAll('.galeria-item');

  // Crear overlay lightbox
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    display:none; position:fixed; inset:0; z-index:9999;
    background:rgba(0,0,0,0.95); align-items:center; justify-content:center;
    cursor:pointer;
  `;
  lightbox.innerHTML = `
    <div style="position:relative; max-width:90vw; max-height:90vh;">
      <img id="lightbox-img" style="max-width:90vw; max-height:85vh; object-fit:contain; display:block;" src="" alt="">
      <button id="lightbox-close" style="
        position:absolute; top:-2.5rem; right:0;
        background:none; border:none; color:#c9a84c;
        font-size:1.8rem; cursor:pointer; font-family:serif;
      ">✕</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  galeriaItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img').src;
      const lbImg = document.getElementById('lightbox-img');
      lbImg.src = imgSrc;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.id === 'lightbox-close') {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  /* ── 8. Hamburger animation ── */
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    });
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', () => {
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  }

});
