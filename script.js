(() => {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = [...document.querySelectorAll('.nav-link')];
  const progress = document.getElementById('scrollProgress');
  const glow = document.getElementById('cursorGlow');

  // Mobile navigation
  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'بستن منو' : 'باز کردن منو');
  });

  navItems.forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  // Reveal elements as they enter the viewport
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Scroll progress and active navigation state
  const sections = [...document.querySelectorAll('main section[id]')];
  let ticking = false;
  const updateScrollUI = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
    const marker = window.scrollY + window.innerHeight * 0.33;
    let current = 'home';
    sections.forEach(section => {
      if (section.offsetTop <= marker) current = section.id;
    });
    navItems.forEach(link => {
      const active = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', active);
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });
  updateScrollUI();

  // Subtle pointer light on devices with a fine pointer
  if (window.matchMedia('(pointer: fine)').matches && glow) {
    window.addEventListener('pointermove', event => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
      glow.style.opacity = '1';
    }, { passive: true });
    document.addEventListener('pointerleave', () => { glow.style.opacity = '0'; });
  }

  // Automatically keep the footer year current
  const year = document.getElementById('year');
  if (year) year.textContent = new Intl.DateTimeFormat('fa-IR-u-nu-latn', { year: 'numeric' }).format(new Date());
})();
