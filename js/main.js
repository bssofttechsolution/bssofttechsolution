/**
 * BS SOFTTECH SOLUTION — Main JavaScript
 * Version: 1.0 | Global IT Services Website
 */

'use strict';

/* ============================================================
   PRELOADER
   ============================================================ */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 800);
});

/* ============================================================
   PARTICLE CANVAS
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  // Skip particles on reduced-motion or narrow screens for performance
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || window.innerWidth < 768) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 1.8 + 0.6,
        opacity: Math.random() * 0.5 + 0.15
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(2, 97, 244, ${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      // Mouse interaction
      const mdx = particles[i].x - mouse.x;
      const mdy = particles[i].y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 207, 255, ${0.2 * (1 - mdist / 120)})`;
        ctx.lineWidth = 0.8;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(2, 97, 244, ${p.opacity})`;
      ctx.fill();
    });
  }

  function update() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
  }

  let lastTime = 0;
  function animate(now) {
    animId = requestAnimationFrame(animate);
    if (now - lastTime < 33) return; // Cap at ~30fps for performance
    lastTime = now;
    draw();
    update();
  }

  // Init
  resize();
  createParticles();
  requestAnimationFrame(animate);

  // Resize handler
  const resizeObs = new ResizeObserver(() => {
    cancelAnimationFrame(animId);
    resize();
    createParticles();
    requestAnimationFrame(animate);
  });
  resizeObs.observe(canvas.parentElement);

  // Mouse tracking
  const hero = document.getElementById('home');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });
  }
})();

/* ============================================================
   TYPING ANIMATION
   ============================================================ */
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const words = [
    'Web Applications',
    'Mobile Apps',
    'Cloud Solutions',
    'AI & ML Systems',
    'Digital Growth',
    'Secure Software',
    'IoT Platforms',
    'Your Vision'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const current = words[wordIndex];
    if (deleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = deleting ? 55 : 100;

    if (!deleting && charIndex === current.length) {
      speed = 2000;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  setTimeout(type, 800);
})();

/* ============================================================
   STICKY HEADER
   ============================================================ */
(function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */
(function initMobileNav() {
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

/* ============================================================
   ACTIVE NAV LINK ON SCROLL
   ============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href') || '';
          link.classList.toggle('active', href === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(s => obs.observe(s));
})();

/* ============================================================
   SCROLL ANIMATION (AOS-like)
   ============================================================ */
(function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-aos-delay') || '0');
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, delay);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => obs.observe(el));
})();

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  let started = false;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function startCounters() {
    if (started) return;
    started = true;
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        counter.textContent = Math.floor(easeOut(progress) * target);
        if (progress < 1) requestAnimationFrame(update);
        else counter.textContent = target;
      }

      requestAnimationFrame(update);
    });
  }

  const obs = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) startCounters();
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) obs.observe(statsSection);
})();

/* ============================================================
   SERVICE TABS FILTER
   ============================================================ */
(function initServiceFilter() {
  const tabs  = document.querySelectorAll('.stab');
  const cards = document.querySelectorAll('.service-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden-filter');
          card.style.animation = 'fadeIn 0.4s ease both';
        } else {
          card.classList.add('hidden-filter');
        }
      });
    });
  });
})();

/* ============================================================
   PORTFOLIO FILTER
   ============================================================ */
(function initPortfolioFilter() {
  const btns  = document.querySelectorAll('.pfbtn');
  const cards = document.querySelectorAll('.portfolio-card');
  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-pf');
      cards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('pf-hidden');
          card.style.animation = 'fadeIn 0.4s ease both';
        } else {
          card.classList.add('pf-hidden');
        }
      });
    });
  });
})();

/* ============================================================
   ABOUT TABS
   ============================================================ */
(function initAboutTabs() {
  const tabs     = document.querySelectorAll('.atab');
  const contents = document.querySelectorAll('.about-tab-content');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(`tab-${tab.getAttribute('data-tab')}`);
      if (target) target.classList.add('active');
    });
  });
})();

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      items.forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });
})();

/* ============================================================
   PRICING TOGGLE
   ============================================================ */
(function initPricingToggle() {
  const toggle    = document.getElementById('ptSwitch');
  const monthLabel = document.getElementById('pt-monthly');
  const yearLabel  = document.getElementById('pt-yearly');
  const amounts    = document.querySelectorAll('.pr-amount[data-monthly]');
  const savings    = document.querySelectorAll('.pr-savings');
  if (!toggle) return;

  let isYearly = false;

  toggle.addEventListener('click', () => {
    isYearly = !isYearly;
    toggle.classList.toggle('yearly', isYearly);
    monthLabel.classList.toggle('active', !isYearly);
    yearLabel.classList.toggle('active', isYearly);
    amounts.forEach(el => {
      el.textContent = isYearly
        ? el.getAttribute('data-yearly')
        : el.getAttribute('data-monthly');
    });
    savings.forEach(el => {
      el.style.display = isYearly ? 'inline-block' : 'none';
    });
  });
})();

/* ============================================================
   TESTIMONIAL SWIPER
   ============================================================ */
(function initSwiper() {
  if (typeof Swiper === 'undefined') return;
  new Swiper('.testimonial-swiper', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 24,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    },
    a11y: {
      prevSlideMessage: 'Previous testimonial',
      nextSlideMessage: 'Next testimonial'
    }
  });
})();

/* ============================================================
   SMOOTH SCROLL FOR ALL ANCHOR LINKS
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerHeight = document.getElementById('site-header')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  const fill = document.getElementById('bttFill');
  if (!btn) return;

  const circumference = 2 * Math.PI * 20; // r=20

  function updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollTop / scrollHeight;

    btn.classList.toggle('visible', scrollTop > 500);

    if (fill) {
      fill.style.strokeDashoffset = circumference - (progress * circumference);
    }
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   COOKIE NOTICE
   ============================================================ */
(function initCookieNotice() {
  const notice  = document.getElementById('cookieNotice');
  const accept  = document.getElementById('cookieAccept');
  const decline = document.getElementById('cookieDecline');
  if (!notice) return;

  if (localStorage.getItem('bss_cookie_consent')) {
    notice.style.display = 'none';
    return;
  }

  setTimeout(() => notice.classList.add('show'), 3000);

  function dismiss() {
    notice.classList.remove('show');
    setTimeout(() => { notice.style.display = 'none'; }, 500);
  }

  accept?.addEventListener('click', () => {
    localStorage.setItem('bss_cookie_consent', 'accepted');
    dismiss();
    if (typeof showToast === 'function') {
      showToast('success', 'Preferences Saved', 'Thank you! Your cookie preferences have been saved.');
    }
  });

  decline?.addEventListener('click', () => {
    localStorage.setItem('bss_cookie_consent', 'declined');
    dismiss();
    if (typeof showToast === 'function') {
      showToast('info', 'Preferences Saved', 'Cookie preferences updated. Some features may be limited.');
    }
  });
})();

/* ============================================================
   CONTACT FORM VALIDATION & SUBMISSION
   ============================================================ */
(function initContactForm() {
  const form        = document.getElementById('contactForm');
  if (!form) return;

  const nameInput   = document.getElementById('fname');
  const emailInput  = document.getElementById('femail');
  const msgInput    = document.getElementById('fmessage');
  const nameErr     = document.getElementById('nameError');
  const emailErr    = document.getElementById('emailError');
  const msgErr      = document.getElementById('messageError');
  const submitBtn   = document.getElementById('submitBtn');
  const btnText     = submitBtn?.querySelector('.btn-text');
  const btnLoading  = submitBtn?.querySelector('.btn-loading');
  const successMsg  = document.getElementById('formSuccess');

  function showError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
  }

  function clearErrors() {
    [nameErr, emailErr, msgErr].forEach(e => {
      if (e) { e.textContent = ''; e.classList.remove('show'); }
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function sanitize(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    let valid = true;
    const name  = sanitize(nameInput?.value.trim() || '');
    const email = sanitize(emailInput?.value.trim() || '');
    const msg   = sanitize(msgInput?.value.trim() || '');

    if (!name || name.length < 2) {
      showError(nameErr, 'Please enter your full name (min 2 characters).');
      valid = false;
    }

    if (!email || !validateEmail(email)) {
      showError(emailErr, 'Please enter a valid email address.');
      valid = false;
    }

    if (!msg || msg.length < 10) {
      showError(msgErr, 'Please describe your project (min 10 characters).');
      valid = false;
    }

    if (!valid) return;

    // Simulate form submission
    if (btnText)    btnText.style.display    = 'none';
    if (btnLoading) btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;

    setTimeout(() => {
      if (btnText)    btnText.style.display    = 'inline-flex';
      if (btnLoading) btnLoading.style.display = 'none';
      submitBtn.disabled = false;
      form.reset();
      localStorage.removeItem('bss_form_draft');
      if (successMsg) {
        successMsg.style.display = 'block';
        setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
      }
      if (typeof showToast === 'function') {
        showToast('success', 'Message Sent!', 'Thank you for contacting us. We will respond within 24 hours.');
      }
    }, 2000);
  });
})();

/* ============================================================
   NAVBAR LOGO ICON GLITCH EFFECT
   ============================================================ */
(function initLogoHover() {
  const logos = document.querySelectorAll('.logo-hex');
  logos.forEach(logo => {
    logo.addEventListener('mouseenter', () => {
      logo.style.animation = 'none';
      logo.style.transform = 'scale(1.2) rotate(30deg)';
      logo.style.transition = 'transform 0.3s ease';
    });
    logo.addEventListener('mouseleave', () => {
      logo.style.transform = '';
    });
  });
})();

/* ============================================================
   DYNAMIC YEAR IN FOOTER
   ============================================================ */
(function setYear() {
  const yearEls = document.querySelectorAll('[data-year]');
  const year = new Date().getFullYear();
  yearEls.forEach(el => { el.textContent = year; });
})();

/* ============================================================
   LAZY IMAGE LOADING (for future image assets)
   ============================================================ */
(function initLazyImages() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;
  const imgObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        imgObs.unobserve(img);
      }
    });
  });
  images.forEach(img => imgObs.observe(img));
})();

/* ============================================================
   SERVICE CARD TILT EFFECT (desktop)
   ============================================================ */
(function initTiltEffect() {
  if (window.matchMedia('(hover: none)').matches) return;
  const cards = document.querySelectorAll('.service-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ============================================================
   PORTFOLIO CARD 3D HOVER
   ============================================================ */
(function initPortfolioHover() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ============================================================
   KEYBOARD NAVIGATION ACCESSIBILITY
   ============================================================ */
(function initA11y() {
  // Skip to main content enhancement
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const openNav = document.getElementById('navLinks');
      const hamburger = document.getElementById('hamburger');
      if (openNav?.classList.contains('open')) {
        openNav.classList.remove('open');
        hamburger?.classList.remove('open');
        hamburger?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }
  });
})();

/* ============================================================
   CONSOLE BRANDING
   ============================================================ */
(function consoleBranding() {
  const styles = [
    'color: #0261F4',
    'font-size: 14px',
    'font-weight: bold',
    'padding: 8px'
  ].join(';');

  console.log('%c⬡ BS SOFTTECH SOLUTION', styles);
  console.log('%cGlobal IT Services | bssofttech.com', 'color: #00CFFF; font-size: 12px;');
})();

/* ============================================================
   LIVE CHAT WIDGET
   ============================================================ */
(function initLiveChat() {
  const chatToggle = document.getElementById('chatToggle');
  const chatWindow = document.getElementById('chatWindow');
  const chatMinimize = document.getElementById('chatMinimize');
  const chatInputForm = document.getElementById('chatInputForm');
  const chatInput = document.getElementById('chatInput');
  const chatBody = document.getElementById('chatBody');
  const quickBtns = document.querySelectorAll('.quick-btn');

  if (!chatToggle || !chatWindow) return;

  // Toggle chat window
  chatToggle.addEventListener('click', () => {
    chatToggle.classList.toggle('active');
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
      setTimeout(() => chatInput?.focus(), 350);
    }
  });

  // Minimize chat
  chatMinimize?.addEventListener('click', () => {
    chatToggle.classList.remove('active');
    chatWindow.classList.remove('active');
  });

  // Quick action buttons
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.dataset.msg;
      if (msg) {
        addUserMessage(msg);
        setTimeout(() => getBotResponse(msg), 800);
      }
    });
  });

  // Form submit
  chatInputForm?.addEventListener('submit', e => {
    e.preventDefault();
    const msg = chatInput.value.trim();
    if (!msg) return;
    addUserMessage(msg);
    chatInput.value = '';
    setTimeout(() => getBotResponse(msg), 800);
  });

  function addUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message user';
    msgDiv.innerHTML = `
      <div class="msg-content"><p>${escapeHtml(text)}</p></div>
      <span class="msg-time">${getCurrentTime()}</span>
    `;
    chatBody.appendChild(msgDiv);
    scrollToBottom();
    // Hide quick actions after first message
    const quickActions = document.querySelector('.chat-quick-actions');
    if (quickActions) quickActions.style.display = 'none';
  }

  function addBotMessage(html) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message bot';
    msgDiv.innerHTML = `
      <div class="msg-content">${html}</div>
      <span class="msg-time">${getCurrentTime()}</span>
    `;
    chatBody.appendChild(msgDiv);
    scrollToBottom();
  }

  function getBotResponse(userMsg) {
    const lower = userMsg.toLowerCase();
    let response = '';

    if (lower.includes('quote') || lower.includes('price') || lower.includes('cost')) {
      response = `<p>We'd love to provide you a customized quote!</p>
        <p>Please fill out our <a href="#contact" onclick="closeChat()">contact form</a> with your project details, and our team will get back to you within 24 hours with a detailed proposal.</p>`;
    } else if (lower.includes('service')) {
      response = `<p>We offer a comprehensive range of IT services:</p>
        <p>&#10148; Web & App Development<br>&#10148; Cloud Solutions & DevOps<br>&#10148; AI & Machine Learning<br>&#10148; Cybersecurity<br>&#10148; Digital Marketing<br>&#10148; IT Consulting & more!</p>
        <p>Check our <a href="#services" onclick="closeChat()">services section</a> for details.</p>`;
    } else if (lower.includes('support') || lower.includes('help')) {
      response = `<p>Our support team is here to help! &#128588;</p>
        <p>For immediate assistance:<br>&#9993; Email: bssofttechsolution@gmail.com<br>&#9742; Phone: +91 620 481 1752</p>
        <p>Or describe your issue here and we'll guide you!</p>`;
    } else if (lower.includes('partner') || lower.includes('collaboration')) {
      response = `<p>We're always open to strategic partnerships! &#129309;</p>
        <p>Email us at: partnerships@bssofttech.com</p>
        <p>Or schedule a call through our <a href="#contact" onclick="closeChat()">contact page</a>.</p>`;
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      response = `<p>Hello there! &#128075; Great to hear from you!</p>
        <p>How can we assist you today? Feel free to ask about our services, pricing, or anything else!</p>`;
    } else if (lower.includes('location') || lower.includes('office') || lower.includes('address')) {
      response = `<p>&#128205; <strong>BS SOFTTECH SOLUTION</strong></p>
        <p>Pailanhat, Joka, Kolkata, West Bengal, India – 700104<br>We serve clients globally!</p>
        <p>&#9993; bssofttechsolution@gmail.com</p>`;
    } else {
      response = `<p>Thanks for your message! &#128522;</p>
        <p>Our team will review your inquiry and respond shortly. For faster assistance, you can also:</p>
        <p>&#9993; Email: bssofttechsolution@gmail.com<br>&#9742; Call: +91 620 481 1752</p>`;
    }

    addBotMessage(response);
  }

  function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Global function to close chat
  window.closeChat = function() {
    chatToggle.classList.remove('active');
    chatWindow.classList.remove('active');
  };
})();

/* ============================================================
   PORTFOLIO LIGHTBOX
   ============================================================ */
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbTitle = document.getElementById('lbTitle');
  const lbDesc = document.getElementById('lbDesc');
  const lbTags = document.getElementById('lbTags');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const lbCurrent = document.getElementById('lbCurrent');
  const lbTotal = document.getElementById('lbTotal');

  if (!lightbox) return;

  const portfolioItems = document.querySelectorAll('.pc-img');
  let currentIndex = 0;

  const projectData = [
    {
      title: 'FinTech Banking Platform',
      desc: 'A comprehensive digital banking platform with real-time transactions, analytics, and multi-currency support.',
      tags: ['React', 'Node.js', 'PostgreSQL'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80'
    },
    {
      title: 'HealthCare Mobile App',
      desc: 'An all-in-one patient-doctor platform with telemedicine, appointment booking, and health tracking features.',
      tags: ['Flutter', 'Firebase', 'AI Diagnosis'],
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop&q=80'
    },
    {
      title: 'AI Inventory Management',
      desc: 'Machine learning-powered inventory system predicting demand, reducing waste by 40% for a retail chain.',
      tags: ['Python', 'TensorFlow', 'AWS'],
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop&q=80'
    },
    {
      title: 'Enterprise Cloud Migration',
      desc: 'Migrated a 500-employee enterprise to AWS cloud, reducing infrastructure costs by 60% with zero downtime.',
      tags: ['AWS', 'Terraform', 'Docker'],
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&q=80'
    },
    {
      title: 'SaaS Dashboard Redesign',
      desc: 'Complete UX overhaul of a SaaS product that increased user engagement by 78% and reduced churn rate.',
      tags: ['Figma', 'User Research', 'A/B Testing'],
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&q=80'
    },
    {
      title: 'Multi-Vendor Marketplace',
      desc: 'A Shopify-powered marketplace serving 1000+ vendors with custom features, analytics, and payment systems.',
      tags: ['Shopify', 'React', 'Stripe'],
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&q=80'
    }
  ];

  if (lbTotal) lbTotal.textContent = projectData.length;

  portfolioItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentIndex = index;
      showProject(currentIndex);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  lbClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  lbPrev?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + projectData.length) % projectData.length;
    showProject(currentIndex);
  });

  lbNext?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % projectData.length;
    showProject(currentIndex);
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbPrev?.click();
    if (e.key === 'ArrowRight') lbNext?.click();
  });

  function showProject(index) {
    const project = projectData[index];
    if (!project) return;
    
    lbImage.style.backgroundImage = 'url(' + project.image + ')';
    lbTitle.textContent = project.title;
    lbDesc.textContent = project.desc;
    lbTags.innerHTML = project.tags.map(t => `<span>${t}</span>`).join('');
    if (lbCurrent) lbCurrent.textContent = index + 1;
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
})();

/* ============================================================
   VIDEO MODAL
   ============================================================ */
(function initVideoModal() {
  const videoModal = document.getElementById('videoModal');
  const videoFrame = document.getElementById('videoFrame');
  const videoClose = document.getElementById('videoClose');
  const playBtns = document.querySelectorAll('[data-video]');

  if (!videoModal) return;

  playBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const videoUrl = btn.dataset.video;
      if (videoUrl) {
        videoFrame.src = videoUrl;
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  videoClose?.addEventListener('click', closeVideo);
  videoModal?.addEventListener('click', e => {
    if (e.target === videoModal) closeVideo();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
      closeVideo();
    }
  });

  function closeVideo() {
    videoModal.classList.remove('active');
    videoFrame.src = '';
    document.body.style.overflow = '';
  }
})();

/* ============================================================
   TOAST NOTIFICATIONS SYSTEM
   ============================================================ */
window.showToast = function(type, title, message, duration = 5000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: 'fa-check',
    error: 'fa-times',
    warning: 'fa-exclamation',
    info: 'fa-info'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i class="fas ${icons[type] || icons.info}"></i></div>
    <div class="toast-content">
      <strong>${title}</strong>
      <p>${message}</p>
    </div>
    <button class="toast-close" aria-label="Close notification"><i class="fas fa-times"></i></button>
  `;

  container.appendChild(toast);

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn?.addEventListener('click', () => removeToast(toast));

  if (duration > 0) {
    setTimeout(() => removeToast(toast), duration);
  }

  function removeToast(el) {
    el.classList.add('fade-out');
    setTimeout(() => el.remove(), 300);
  }
};

/* ============================================================
   PAGE PROGRESS BAR
   ============================================================ */
(function initPageProgress() {
  const progressBar = document.getElementById('pageProgress');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

/* ============================================================
   CUSTOM CURSOR (Desktop Only)
   ============================================================ */
(function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.innerWidth < 1025) return;

  const follower = document.getElementById('cursorFollower');
  const dot = document.getElementById('cursorDot');
  
  if (!follower || !dot) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animate() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  // Hover effects
  const hoverElements = document.querySelectorAll('a, button, .service-card, .portfolio-card, input, textarea');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hover'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
  });

  // Click effect
  document.addEventListener('mousedown', () => dot.classList.add('click'));
  document.addEventListener('mouseup', () => dot.classList.remove('click'));
})();

/* Cookie consent handled by initCookieNotice() above */

/* Contact form handled by initContactForm() above */

/* ============================================================
   NEWSLETTER FORM
   ============================================================ */
(function initNewsletter() {
  const newsletterForm = document.querySelector('.nl-form');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="email"]');
    const email = emailInput?.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showToast('error', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }

    const submitBtn = this.querySelector('button');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    setTimeout(() => {
      showToast('success', 'Subscribed!', 'Welcome aboard! You will receive our latest updates and offers.');
      emailInput.value = '';
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
})();

/* Smooth scroll handled by initSmoothScroll() above */

/* Lazy loading handled by initLazyImages() above */

/* ============================================================
   REVEAL ON SCROLL ANIMATIONS
   ============================================================ */
(function initRevealAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.15, rootMargin: '-50px' });

  reveals.forEach(el => revealObserver.observe(el));
})();

/* ============================================================
   PERFORMANCE OPTIMIZATION
   ============================================================ */
(function optimizePerformance() {
  // Defer non-critical resources
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Preload critical fonts
      const fontLinks = document.querySelectorAll('link[rel="preload"][as="font"]');
      fontLinks.forEach(link => link.rel = 'stylesheet');
    });
  }

  // Reduce motion for users who prefer it
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', 'none');
    document.documentElement.style.setProperty('--transition-med', 'none');
    document.documentElement.style.setProperty('--transition-slow', 'none');
  }
})();

/* ============================================================
   CONSOLE CREDITS UPDATE
   ============================================================ */
console.log('%c\u2705 Website fully enhanced & optimized!', 'color: #10D876; font-size: 12px;');
console.log('%c\u2709 Contact: bssofttechsolution@gmail.com', 'color: #7A9ABF; font-size: 11px;');

/* ============================================================
   GLOBAL PRESENCE COUNTER ANIMATION
   ============================================================ */
(function initGlobalCounters() {
  const counters = document.querySelectorAll('.g-stat-num[data-count]');
  if (!counters.length) return;

  let started = false;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function startCounters() {
    if (started) return;
    started = true;
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const duration = 2200;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        counter.textContent = Math.floor(easeOut(progress) * target);
        if (progress < 1) requestAnimationFrame(update);
        else counter.textContent = target;
      }

      requestAnimationFrame(update);
    });
  }

  const obs = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) startCounters();
  }, { threshold: 0.3 });

  const globalSection = document.querySelector('.global-section');
  if (globalSection) obs.observe(globalSection);
})();

/* ============================================================
   PARALLAX SCROLL EFFECT
   ============================================================ */
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const blobs = document.querySelectorAll('.blob');
  const heroMesh = document.querySelector('.hero-gradient-mesh');

  let ticking = false;

  function updateParallax() {
    const scrollY = window.pageYOffset;
    const factor = 0.3;

    blobs.forEach((blob, i) => {
      const speed = (i + 1) * factor * 0.15;
      blob.style.transform = `translateY(${scrollY * speed}px)`;
    });

    if (heroMesh) {
      heroMesh.style.transform = `translateY(${scrollY * 0.08}px)`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
})();

/* ============================================================
   FORM AUTO-SAVE TO LOCALSTORAGE
   ============================================================ */
(function initFormAutoSave() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const STORAGE_KEY = 'bss_form_draft';
  const fields = ['fname', 'femail', 'fphone', 'fservice', 'fbudget', 'fmessage'];

  // Restore saved draft
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      fields.forEach(id => {
        const el = document.getElementById(id);
        if (el && saved[id]) el.value = saved[id];
      });
    }
  } catch (e) { /* ignore parse errors */ }

  // Save on input (debounced)
  let saveTimer;
  form.addEventListener('input', () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const draft = {};
      fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) draft[id] = el.value;
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      } catch (e) { /* storage full — ignore */ }
    }, 500);
  });

  // Clear draft on successful submit
  form.addEventListener('submit', () => {
    setTimeout(() => {
      localStorage.removeItem(STORAGE_KEY);
    }, 2500);
  });
})();

/* ============================================================
   FOCUS TRAP FOR LIGHTBOX & MODALS
   ============================================================ */
(function initFocusTrap() {
  function trapFocus(modal) {
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    modal.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  const lightbox = document.getElementById('lightbox');
  const videoModal = document.getElementById('videoModal');
  const chatWindow = document.getElementById('chatWindow');

  if (lightbox) trapFocus(lightbox);
  if (videoModal) trapFocus(videoModal);
  if (chatWindow) trapFocus(chatWindow);
})();

/* ============================================================
   STAGGER REVEAL ON SCROLL (Activate children)
   ============================================================ */
(function initStaggerReveal() {
  if (!('IntersectionObserver' in window)) return;

  const staggerContainers = document.querySelectorAll('.stagger-children');

  const staggerObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, i * 80);
        });
        staggerObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '-30px' });

  staggerContainers.forEach(container => {
    Array.from(container.children).forEach(child => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(25px)';
      child.style.transition = 'opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)';
    });
    staggerObs.observe(container);
  });
})();

/* ============================================================
   SECTION HEADING PARALLAX TEXT
   ============================================================ */
(function initTextReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const titles = document.querySelectorAll('.section-title');

  const titleObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('title-visible');
        titleObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  titles.forEach(t => titleObs.observe(t));
})();
