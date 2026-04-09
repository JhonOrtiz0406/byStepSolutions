/* =============================================
   BY STEP SOLUTIONS — JS principal
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
      a.style.color = a.getAttribute('href') === `#${entry.target.id}`
        ? 'var(--text)'
        : '';
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// ---- Contact form (mailto fallback) ----
function handleSubmit(e) {
  e.preventDefault();
  const notice  = document.getElementById('form-notice');
  const form    = e.target;
  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();

  const body = encodeURIComponent(
    `Nombre: ${name}\nEmail: ${email}\n\n${message}`
  );

  window.location.href =
    `mailto:bystepsolutions@gmail.com` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${body}`;

  notice.textContent = '¡Abriendo tu cliente de correo! Si no se abre, escríbenos directamente a bystepsolutions@gmail.com';
  notice.className   = 'form-notice success';

  setTimeout(() => {
    form.reset();
    notice.textContent = '';
    notice.className = 'form-notice';
  }, 6000);
}

// ---- Scroll-reveal animation ----
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity  = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.service-card, .product-card, .stat-card, .why-list li, .contact-item'
).forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});
