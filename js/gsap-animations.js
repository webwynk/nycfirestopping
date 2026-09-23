/* ============================================
   NYC Firestopping — GSAP Animations
   ScrollTrigger-based scroll animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Wait for GSAP to load
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Global defaults
  gsap.defaults({
    duration: 0.8,
    ease: 'power3.out',
  });

  // Check reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  const isMobile = window.innerWidth < 640;

  // ==========================================
  // HERO INTRO SEQUENCE
  // ==========================================

  const introTL = gsap.timeline({ delay: 0.05 });

  introTL
    // 1. Nav slides down
    .from('.navbar', {
      y: -60,
      opacity: 0,
      duration: 0.4,
      ease: 'power3.out',
      clearProps: 'all',
    })
    // 3. Hero status pill
    .from('.hero__status-pill', {
      y: 15,
      opacity: 0,
      duration: 0.35,
      ease: 'power3.out',
      clearProps: 'all',
    }, '-=0.2')
    // 4. Hero heading word-by-word
    .from('.hero__heading .word', {
      y: 35,
      opacity: 0,
      duration: 0.4,
      stagger: 0.03,
      ease: 'power3.out',
      clearProps: 'all',
    }, '-=0.25')
    // 5. Subheading
    .from('.hero__subheading', {
      y: 20,
      opacity: 0,
      duration: 0.35,
      ease: 'power3.out',
      clearProps: 'all',
    }, '-=0.25')
    // 6. CTA group
    .from('.hero__cta-group', {
      y: 20,
      opacity: 0,
      duration: 0.35,
      ease: 'power3.out',
      clearProps: 'all',
    }, '-=0.2')
    // 6b. Proof rating
    .from('.hero__proof', {
      y: 15,
      opacity: 0,
      duration: 0.3,
      ease: 'power3.out',
      clearProps: 'all',
    }, '-=0.2')
    // 7. Trust badges
    .from('.hero__badges', {
      y: 15,
      opacity: 0,
      duration: 0.3,
      ease: 'power3.out',
      clearProps: 'all',
    }, '-=0.2')
    // 8. Hero image clip-path reveal
    .from('.hero__image-wrapper', {
      clipPath: 'inset(0 0 0 100%)',
      duration: 0.7,
      ease: 'power3.inOut',
      clearProps: 'clipPath',
    }, '-=0.6');

  // ==========================================
  // UNIVERSAL SCROLL REVEAL — .gsap-reveal
  // ==========================================

  gsap.utils.toArray('.gsap-reveal').forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // ==========================================
  // STAGGER REVEAL — .gsap-stagger-parent
  // ==========================================

  gsap.utils.toArray('.gsap-stagger-parent').forEach((parent) => {
    const children = parent.querySelectorAll('.gsap-stagger-child');
    if (children.length === 0) return;

    gsap.from(children, {
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: parent,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  });

  // ==========================================
  // IMAGE REVEAL — .gsap-image-reveal
  // ==========================================

  gsap.utils.toArray('.gsap-image-reveal').forEach((wrapper) => {
    // Skip hero (already animated in intro)
    if (wrapper.closest('.hero')) return;

    const img = wrapper.querySelector('img');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    tl.from(wrapper, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1,
      ease: 'power4.inOut',
    });

    if (img) {
      tl.from(img, {
        scale: 1.3,
        duration: 1.2,
        ease: 'power2.out',
      }, '<');
    }
  });

  // ==========================================
  // PARALLAX — .gsap-parallax
  // ==========================================

  if (!isMobile) {
    gsap.utils.toArray('.gsap-parallax').forEach((el) => {
      // Skip hero (already handled)
      if (el.closest('.hero__image-wrapper')) return;

      gsap.to(el, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });
  }

  // ==========================================
  // STAT COUNTERS
  // ==========================================

  document.querySelectorAll('.stat-card__number[data-target]').forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const obj = { value: 0 };

    gsap.to(obj, {
      value: target,
      duration: 2,
      ease: 'power2.out',
      snap: { value: 1 },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        el.textContent = Math.floor(obj.value).toLocaleString() + (target >= 100 ? '%' : target >= 15 ? '+' : '');
      },
    });
  });

  // ==========================================
  // PROCESS LINE ANIMATION
  // ==========================================

  const processLine = document.getElementById('processLine');
  const processMobileLine = document.getElementById('processMobileLine');

  if (processLine && !isMobile) {
    gsap.from(processLine, {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 1.2,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: processLine.parentElement,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });
  }

  if (processMobileLine && isMobile) {
    gsap.from(processMobileLine, {
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 1.2,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: processMobileLine.parentElement,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }

  // ==========================================
  // CTA BANNER GRADIENT SHIFT
  // ==========================================

  const ctaBanner = document.querySelector('.cta-banner');
  if (ctaBanner) {
    gsap.to(ctaBanner, {
      backgroundPosition: '100% 50%',
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }


  // ==========================================
  // REFRESH ScrollTrigger on resize
  // ==========================================

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
  });
});
