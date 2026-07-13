(function() {
  'use strict';
  
  // ============================================================
  // DETECT TOUCH DEVICE
  // ============================================================
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  const isMobile = window.innerWidth < 768;
  
  // ============================================================
  // LOADING SCREEN
  // ============================================================
  const loadingScreen = document.getElementById('loading-screen');
  const progressBar = document.getElementById('loadingProgressBar');
  const loadingWords = document.querySelectorAll('.loading-word');
  let progress = 0;

  loadingWords.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('active');
      setTimeout(() => el.classList.add('pulse'), 400);
    }, i * 200 + 100);
  });

  const loadInterval = setInterval(() => {
    progress += Math.random() * 6 + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initAnimations();
        document.querySelector('.page')?.classList.add('active', 'page-enter');
      }, 500);
    }
    progressBar.style.width = progress + '%';
  }, 120);

  // ============================================================
  // CUSTOM CURSOR - Only on non-touch devices
  // ============================================================
  const cursor = document.getElementById('customCursor');
  if (!isTouch && cursor) {
    let cursorX = 0, cursorY = 0;
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .work-item, .glass-card, .social-link, .process-step').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  // ============================================================
  // NAVIGATION - Touch Friendly
  // ============================================================
  const navToggle = document.getElementById('navToggle');
  const navbarNav = document.getElementById('navbarNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const pageTransition = document.getElementById('pageTransition');

  if (navToggle && navbarNav) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = navbarNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open);
      navToggle.innerHTML = open ? '<i class="fas fa-times icon"></i>' : '<i class="fas fa-bars icon"></i>';
    });

    // Close on outside click (mobile)
    document.addEventListener('click', (e) => {
      if (navbarNav.classList.contains('is-open') && 
          !navbarNav.contains(e.target) && 
          !navToggle.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navbarNav.classList.contains('is-open')) {
        closeMobileNav();
      }
    });
  }

  function closeMobileNav() {
    if (navbarNav) {
      navbarNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.innerHTML = '<i class="fas fa-bars icon"></i>';
    }
  }

  // ============================================================
  // PAGE NAVIGATION
  // ============================================================
  function navigateTo(page) {
    if (page === window.location.pathname) return;
    
    pageTransition.classList.add('active');
    
    setTimeout(() => {
      window.location.href = page;
    }, 400);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        closeMobileNav();
        navigateTo(href);
      }
    });
  });

  // ============================================================
  // NAVBAR SCROLL EFFECT
  // ============================================================
  const liquidNav = document.getElementById('liquidNav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (liquidNav) {
      liquidNav.classList.toggle('is-scrolled', currentScroll > 60);
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // ============================================================
  // SCROLL REVEAL - Intersection Observer
  // ============================================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Animate counters
        const counter = entry.target.querySelector('.stat-count');
        if (counter && !counter.dataset.animated) {
          animateCounter(entry.target);
        }
        
        // Animate skill bars
        const bars = entry.target.querySelectorAll('.skill-bar');
        if (bars.length) {
          animateSkills(entry.target);
        }
      }
    });
  }, { 
    threshold: isMobile ? 0.1 : 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => {
    // Check if already visible
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
    }
    revealObserver.observe(el);
  });

  // ============================================================
  // STAT COUNTERS
  // ============================================================
  function animateCounter(card) {
    const numEl = card.querySelector('.stat-count');
    if (!numEl || numEl.dataset.animated) return;
    numEl.dataset.animated = 'true';
    const target = parseInt(numEl.getAttribute('data-target')) || 0;
    const obj = { val: 0 };
    
    if (typeof anime !== 'undefined') {
      anime({
        targets: obj,
        val: target,
        duration: isMobile ? 1500 : 2000,
        round: 1,
        easing: 'easeOutExpo',
        update: () => { numEl.textContent = obj.val; }
      });
    } else {
      numEl.textContent = target;
    }
  }

  // ============================================================
  // SKILL BARS
  // ============================================================
  function animateSkills(container) {
    container.querySelectorAll('.skill-bar').forEach(bar => {
      if (bar.dataset.animated) return;
      bar.dataset.animated = 'true';
      const width = bar.getAttribute('data-width');
      setTimeout(() => {
        bar.style.width = width + '%';
      }, isMobile ? 100 : 200);
    });
  }

  // ============================================================
  // TESTIMONIALS - Touch Swipe Support
  // ============================================================
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dotsWrap = document.getElementById('testimonialDots');
  let tIndex = 0, tTimer;
  let touchStartX = 0, touchEndX = 0;

  if (testimonialCards.length && dotsWrap) {
    // Build dots
    testimonialCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonial-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      dot.addEventListener('click', () => { setTestimonial(i); resetAutoRotate(); });
      dotsWrap.appendChild(dot);
    });

    function setTestimonial(i) {
      testimonialCards[tIndex].classList.remove('is-active');
      dotsWrap.children[tIndex].classList.remove('is-active');
      tIndex = (i + testimonialCards.length) % testimonialCards.length;
      testimonialCards[tIndex].classList.add('is-active');
      dotsWrap.children[tIndex].classList.add('is-active');
    }

    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    
    if (prevBtn) prevBtn.addEventListener('click', () => { setTestimonial(tIndex - 1); resetAutoRotate(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { setTestimonial(tIndex + 1); resetAutoRotate(); });

    // Touch swipe support
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel && isTouch) {
      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            setTestimonial(tIndex + 1);
          } else {
            setTestimonial(tIndex - 1);
          }
          resetAutoRotate();
        }
      }, { passive: true });
    }

    function resetAutoRotate() {
      clearInterval(tTimer);
      if (!isMobile || !isTouch) {
        tTimer = setInterval(() => setTestimonial(tIndex + 1), 5000);
      }
    }
    resetAutoRotate();
  }

  // ============================================================
  // CONTACT FORM
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<span>Sending…</span>';
      btn.disabled = true;
      
      setTimeout(() => {
        const success = document.getElementById('formSuccess');
        if (success) {
          success.style.display = 'flex';
          if (typeof anime !== 'undefined') {
            anime({
              targets: success,
              opacity: [0, 1],
              translateY: [-10, 0],
              duration: 500,
              easing: 'easeOutCubic'
            });
          } else {
            success.style.opacity = '1';
            success.style.transform = 'translateY(0)';
          }
        }
        contactForm.reset();
        btn.innerHTML = original;
        btn.disabled = false;
        
        setTimeout(() => {
          if (success) {
            if (typeof anime !== 'undefined') {
              anime({
                targets: success,
                opacity: [1, 0],
                translateY: [0, -10],
                duration: 400,
                easing: 'easeInCubic'
              });
            } else {
              success.style.opacity = '0';
              success.style.transform = 'translateY(-10px)';
            }
          }
        }, 5000);
      }, 1500);
    });
  }

  // ============================================================
  // HERO ANIMATIONS
  // ============================================================
  function initAnimations() {
    const handwrittenChars = document.querySelectorAll('.handwritten-text');
    if (handwrittenChars.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (typeof anime !== 'undefined') {
        anime({
          targets: handwrittenChars,
          opacity: [0, 1],
          translateY: [20, 0],
          duration: isMobile ? 40 : 60,
          delay: anime.stagger(isMobile ? 20 : 35),
          easing: 'easeOutQuad'
        });
      } else {
        handwrittenChars.forEach(el => el.style.opacity = '1');
      }
    } else {
      handwrittenChars.forEach(el => el.style.opacity = '1');
    }

    // Hero title - split into letters and reveal in sequence
    const heroTitle = document.querySelector('.hero-title');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (heroTitle) {
      const fullText = heroTitle.textContent.trim().replace(/\s+/g, ' ');
      heroTitle.setAttribute('aria-label', fullText);

      heroTitle.querySelectorAll('.hero-title-line').forEach(line => {
        line.setAttribute('aria-hidden', 'true');
        const chars = line.textContent.split('');
        line.innerHTML = chars.map(ch => {
          if (ch === ' ') return '&nbsp;';
          return `<span class="hero-letter">${ch}</span>`;
        }).join('');
      });

      const letters = heroTitle.querySelectorAll('.hero-letter');

      if (letters.length && !reduceMotion && typeof anime !== 'undefined') {
        anime({
          targets: letters,
          opacity: [0, 1],
          translateY: [36, 0],
          rotate: [4, 0],
          duration: isMobile ? 550 : 750,
          delay: anime.stagger(isMobile ? 28 : 40, { start: isMobile ? 350 : 650 }),
          easing: 'easeOutExpo'
        });
      } else {
        letters.forEach(l => { l.style.opacity = '1'; l.style.transform = 'none'; });
      }
    }

    // Hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && typeof anime !== 'undefined') {
      anime({
        targets: heroSubtitle,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: isMobile ? 600 : 800,
        delay: isMobile ? 600 : 1000,
        easing: 'easeOutExpo'
      });
    } else if (heroSubtitle) {
      heroSubtitle.style.opacity = '1';
    }
  }

  // ============================================================
  // SCROLL CUE
  // ============================================================
  document.getElementById('scrollCue')?.addEventListener('click', () => {
    const workSection = document.getElementById('work');
    if (workSection) {
      const top = workSection.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });

  // ============================================================
  // PARALLAX - Only on desktop
  // ============================================================
  if (!isTouch) {
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      const img = document.querySelector('.producer-image-container');
      if (img) {
        img.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      }
      const heroPortrait = document.querySelector('.hero-portrait-frame');
      if (heroPortrait) {
        heroPortrait.style.transform = `translate3d(${x * 14}px, ${y * 10}px, 0) rotate(${x * 1.5}deg)`;
      }
    });
  }

  // ============================================================
  // MARQUEE HERO - Portfolio Carousel
  // ============================================================
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    const marqueeImages = [
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=60', title: 'Urban Wilderness', desc: 'Documentary', tag: '2023' },
      { src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=60', title: 'Midnight Echoes', desc: 'Music Video', tag: '2023' },
      { src: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=60', title: 'NexTech Vision', desc: 'Commercial', tag: '2022' },
      { src: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=60', title: 'The Last Light', desc: 'Short Film', tag: '2022' },
      { src: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=600&auto=format&fit=crop&q=60', title: 'Annual Vision', desc: 'Corporate', tag: '2021' },
      { src: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=600&auto=format&fit=crop&q=60', title: 'Global Festival', desc: 'Event Coverage', tag: '2021' },
    ];

    function buildMarquee() {
      const items = [...marqueeImages, ...marqueeImages];
      marqueeTrack.innerHTML = items.map((img, i) => `
        <div class="marquee-hero-item" data-index="${i}">
          <img src="${img.src}" alt="${img.title}" loading="lazy" decoding="async">
          <div class="tag">${img.tag}</div>
          <div class="overlay">
            <h3>${img.title}</h3>
            <p>${img.desc}</p>
          </div>
        </div>
      `).join('');
    }
    buildMarquee();

    let isPaused = false;
    const pauseBtn = document.getElementById('marqueePause');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', function() {
        isPaused = !isPaused;
        marqueeTrack.classList.toggle('paused', isPaused);
        this.innerHTML = isPaused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
      });
    }

    // Touch: pause on tap, resume after delay
    document.querySelectorAll('.marquee-hero-item').forEach(item => {
      item.addEventListener('touchstart', () => {
        if (!isPaused) marqueeTrack.classList.add('paused');
      }, { passive: true });
      
      item.addEventListener('touchend', () => {
        setTimeout(() => {
          if (!isPaused) marqueeTrack.classList.remove('paused');
        }, 3000);
      }, { passive: true });
    });

    // Desktop: hover pause
    if (!isTouch) {
      document.querySelectorAll('.marquee-hero-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
          if (!isPaused) marqueeTrack.classList.add('paused');
        });
        item.addEventListener('mouseleave', () => {
          if (!isPaused) marqueeTrack.classList.remove('paused');
        });
      });
    }
  }

  // ============================================================
  // HANDLE RESIZE
  // ============================================================
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Re-check visible elements
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('visible');
        }
      });
    }, 250);
  }, { passive: true });

})();