/* =============================================
   BY STEP SOLUTIONS — JS principal v2
   ============================================= */

// ---- Navbar scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Cierra el menú al hacer clic en un enlace
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.querySelectorAll('a').forEach(a => {
      const isActive = a.getAttribute('href') === `#${entry.target.id}`;
      a.style.color = isActive ? 'var(--text)' : '';
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// ---- Contact form (mailto fallback) ----
function handleSubmit(e) {
  e.preventDefault();
  const notice  = document.getElementById('form-notice');
  const form    = e.target;
  const btn     = form.querySelector('button[type="submit"]');
  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();

  btn.disabled = true;
  btn.textContent = 'Enviando…';

  const body = encodeURIComponent(
    `Nombre: ${name}\nEmail: ${email}\n\n${message}`
  );

  window.location.href =
    `mailto:bystepsolutions@gmail.com` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${body}`;

  setTimeout(() => {
    notice.textContent = '¡Abriendo tu cliente de correo! Si no se abre, escríbenos a bystepsolutions@gmail.com';
    notice.className = 'form-notice success';
    btn.disabled = false;
    btn.textContent = 'Enviar mensaje →';
  }, 400);

  setTimeout(() => {
    form.reset();
    notice.textContent = '';
    notice.className = 'form-notice';
  }, 7000);
}

// ---- Scroll-reveal animation ----
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.service-card, .product-card, .pricing-card, .stat-card, .why-list li, .contact-item, .contact-form'
).forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(22px)';
  el.style.transition = 'opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)';
  revealObserver.observe(el);
});

// ---- Staggered reveal for grids ----
document.querySelectorAll('.services-grid, .products-grid, .pricing-grid, .why-stats').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.07}s`;
  });
});

// ---- Stat counter animation ----
function animateCounter(el, target, suffix = '') {
  const duration = 1600;
  const start    = performance.now();
  const isFloat  = target % 1 !== 0;

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    // ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = isFloat
      ? (eased * target).toFixed(1)
      : Math.round(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

// Observa las stat cards y dispara el contador
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const numEl = entry.target.querySelector('.stat-num');
    if (!numEl || numEl.dataset.animated) return;
    numEl.dataset.animated = 'true';

    const raw = numEl.textContent.trim();
    // Si contiene solo números (con posible %)
    const match = raw.match(/^([\d.]+)(%?)$/);
    if (match) {
      const num    = parseFloat(match[1]);
      const suffix = match[2] || '';
      numEl.textContent = '0' + suffix;
      animateCounter(numEl, num, suffix);
    }

    statObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => statObserver.observe(card));

// ---- Smooth card tilt on mouse (desktop only) ----
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.service-card, .stat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left - rect.width / 2;
      const y      = e.clientY - rect.top  - rect.height / 2;
      const tiltX  = -(y / rect.height) * 5;
      const tiltY  =  (x / rect.width)  * 5;
      card.style.transform = `translateY(-5px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
