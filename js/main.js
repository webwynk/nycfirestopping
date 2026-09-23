/* ============================================
   NYC Firestopping — Main JS
   Lenis smooth scroll, nav behavior, scroll spy
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Lenis Smooth Scroll ----
  let lenis;
  try {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync with GSAP if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  } catch(e) {
    console.log('Lenis not loaded, using native scroll');
  }

  // ---- Navigation: Hamburger ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');
  let menuTimeline = null;

  function openMenu() {
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (typeof gsap !== 'undefined') {
      menuTimeline = gsap.timeline();
      menuTimeline
        .fromTo(mobileMenu, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .fromTo(mobileLinks, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out' }, '-=0.1');
    }
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    if (menuTimeline) {
      menuTimeline.reverse();
      setTimeout(() => {
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }, 400);
    } else {
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  }

  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();

      const target = document.querySelector(href);
      if (!target) return;

      const navHeight = window.innerWidth >= 1024 ? 72 : 64;

      if (lenis) {
        lenis.scrollTo(target, { offset: -navHeight });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Navbar: Background on Scroll ----
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;
  let navHidden = false;

  function handleNavScroll() {
    const scrollY = window.scrollY;

    // Add scrolled class for background
    if (scrollY > 100) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }

    // Hide/show on scroll direction
    if (scrollY > 400) {
      if (scrollY > lastScrollY && !navHidden) {
        // Scrolling down
        navHidden = true;
        navbar.style.transform = 'translateY(-100%)';
        navbar.style.transition = 'transform 0.3s ease-out';
      } else if (scrollY < lastScrollY && navHidden) {
        // Scrolling up
        navHidden = false;
        navbar.style.transform = 'translateY(0)';
      }
    } else {
      navHidden = false;
      navbar.style.transform = 'translateY(0)';
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ---- Scroll Spy ----
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');

  function updateScrollSpy() {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('is-active');
          if (link.getAttribute('data-section') === id) {
            link.classList.add('is-active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateScrollSpy, { passive: true });

  // ---- Testimonial Slider ----
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  let currentSlide = 0;
  let autoAdvance;

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('is-active'));
    dots.forEach(d => d.classList.remove('is-active'));

    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    const activeSlide = slides[currentSlide];
    activeSlide.classList.add('is-active');
    dots[currentSlide].classList.add('is-active');

    // GSAP animation
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(activeSlide, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    }
  }

  if (prevBtn && nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      resetAutoAdvance();
    });

    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      resetAutoAdvance();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetAutoAdvance();
    });
  });

  function resetAutoAdvance() {
    clearInterval(autoAdvance);
    autoAdvance = setInterval(() => goToSlide(currentSlide + 1), 6000);
  }

  autoAdvance = setInterval(() => goToSlide(currentSlide + 1), 6000);

  // Pause on hover
  const slider = document.getElementById('testimonialSlider');
  if (slider) {
    slider.addEventListener('mouseenter', () => clearInterval(autoAdvance));
    slider.addEventListener('mouseleave', () => resetAutoAdvance());
  }
});
