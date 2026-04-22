/* ================================================================
   CLUBHOUSE CAFE — script.js
   Vanilla JS: navbar scroll, hamburger, menu tabs,
   scroll-reveal, active nav, form validation, lightbox, year
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ────────────────────────────────────────────────────────────
     1. LUCIDE ICONS
  ──────────────────────────────────────────────────────────── */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }


  /* ────────────────────────────────────────────────────────────
     2. NAVBAR — scroll-triggered frosted glass
  ──────────────────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initialise on load


  /* ────────────────────────────────────────────────────────────
     3. HAMBURGER MENU
  ──────────────────────────────────────────────────────────── */
  const hamburger    = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');

  const setMenu = (open) => {
    hamburger.classList.toggle('open', open);
    mobileDrawer.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileDrawer.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () =>
    setMenu(!hamburger.classList.contains('open'))
  );

  // Close on link tap
  document.querySelectorAll('.m-link').forEach(link =>
    link.addEventListener('click', () => setMenu(false))
  );

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setMenu(false);
  });


  /* ────────────────────────────────────────────────────────────
     4. SMOOTH SCROLL — anchor links
  ──────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });


  /* ────────────────────────────────────────────────────────────
     5. ACTIVE NAV LINK on scroll
  ──────────────────────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link =>
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`)
        );
      }
    });
  }, {
    rootMargin: `-${(navbar.offsetHeight || 72) + 10}px 0px -55% 0px`,
    threshold: 0
  });

  sections.forEach(s => sectionObserver.observe(s));


  /* ────────────────────────────────────────────────────────────
     6. SCROLL REVEAL — fade elements in when they enter view
  ──────────────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObs.observe(el));


  /* ────────────────────────────────────────────────────────────
     7. MENU TABS — Drinks / Food switcher
  ──────────────────────────────────────────────────────────── */
  const tabs   = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update tabs
      tabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });

      // Update panels
      panels.forEach(panel => {
        const isActive = panel.id === `tab-${target}`;
        panel.classList.toggle('active', isActive);
        isActive ? panel.removeAttribute('hidden') : panel.setAttribute('hidden', '');
      });

      // Re-trigger reveal animations in newly visible panel
      panels.forEach(panel => {
        if (!panel.hasAttribute('hidden')) {
          panel.querySelectorAll('.reveal-up').forEach(el => {
            el.classList.remove('visible');
            // Small delay to allow layout, then re-observe
            setTimeout(() => revealObs.observe(el), 30);
          });
        }
      });
    });
  });


  /* ────────────────────────────────────────────────────────────
     8. CONTACT FORM VALIDATION
  ──────────────────────────────────────────────────────────── */
  const form       = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Field references
      const nameEl    = document.getElementById('cf-name');
      const emailEl   = document.getElementById('cf-email');
      const messageEl = document.getElementById('cf-message');

      // Error spans
      const errName    = document.getElementById('err-name');
      const errEmail   = document.getElementById('err-email');
      const errMessage = document.getElementById('err-message');

      // Reset
      [nameEl, emailEl, messageEl].forEach(el => el.classList.remove('error'));
      [errName, errEmail, errMessage].forEach(el => (el.textContent = ''));

      let valid = true;

      // Name validation
      if (!nameEl.value.trim() || nameEl.value.trim().length < 2) {
        nameEl.classList.add('error');
        errName.textContent = 'Please enter your name (at least 2 characters).';
        valid = false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailEl.value.trim() || !emailRegex.test(emailEl.value.trim())) {
        emailEl.classList.add('error');
        errEmail.textContent = 'Please enter a valid email address.';
        valid = false;
      }

      // Message validation
      if (!messageEl.value.trim() || messageEl.value.trim().length < 10) {
        messageEl.classList.add('error');
        errMessage.textContent = 'Please write a message (at least 10 characters).';
        valid = false;
      }

      if (!valid) {
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
        return;
      }

      // ── Simulate submission (replace with real endpoint) ──
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Send Message
        `;
        successMsg.hidden = false;
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide success after 5s
        setTimeout(() => { successMsg.hidden = true; }, 5000);
      }, 1200);
    });

    // Live validation — clear errors when user fixes input
    ['cf-name', 'cf-email', 'cf-message'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => {
        el.classList.remove('error');
        const errEl = document.getElementById(`err-${id.replace('cf-', '')}`);
        if (errEl) errEl.textContent = '';
      });
    });
  }


  /* ────────────────────────────────────────────────────────────
     9. GALLERY LIGHTBOX
  ──────────────────────────────────────────────────────────── */
  // Create overlay
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Image preview');
  lb.innerHTML = `
    <div class="lb-bg"></div>
    <div class="lb-wrap">
      <button class="lb-close" aria-label="Close">✕</button>
      <img class="lb-img" src="" alt="" />
      <p class="lb-caption"></p>
    </div>
  `;
  document.body.appendChild(lb);

  const lbStyle = document.createElement('style');
  lbStyle.textContent = `
    #lightbox {
      position:fixed; inset:0; z-index:9999;
      display:none; align-items:center; justify-content:center;
      padding:20px;
    }
    #lightbox.open { display:flex; }
    .lb-bg {
      position:absolute; inset:0;
      background: rgba(16,10,5,.95);
      backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
      cursor:pointer;
    }
    .lb-wrap {
      position:relative; z-index:2;
      max-width:min(90vw,900px);
      display:flex; flex-direction:column; align-items:center; gap:12px;
    }
    .lb-img {
      max-height:80svh; border-radius:12px;
      animation: lbIn 0.25s ease;
      box-shadow: 0 24px 80px rgba(0,0,0,.6);
    }
    @keyframes lbIn {
      from { opacity:0; transform:scale(0.93); }
      to   { opacity:1; transform:scale(1); }
    }
    .lb-caption { color: rgba(245,230,200,.6); font-size:0.85rem; font-style:italic; }
    .lb-close {
      position:absolute; top:-44px; right:0;
      background:none; border:none; cursor:pointer;
      color:#f5e6c8; font-size:1.5rem; opacity:0.6;
      transition:opacity 0.2s;
    }
    .lb-close:hover { opacity:1; }
  `;
  document.head.appendChild(lbStyle);

  const lbImg     = lb.querySelector('.lb-img');
  const lbCap     = lb.querySelector('.lb-caption');
  const lbClose   = lb.querySelector('.lb-close');
  const lbBg      = lb.querySelector('.lb-bg');

  const openLb  = (src, alt) => {
    lbImg.src = src; lbImg.alt = alt;
    lbCap.textContent = alt;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  };
  const closeLb = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.gm-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View image: ${item.querySelector('img')?.alt || ''}`);

    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLb(img.src, img.alt);
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
    });
  });

  lbClose.addEventListener('click', closeLb);
  lbBg.addEventListener('click', closeLb);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lb.classList.contains('open')) closeLb();
  });


  /* ────────────────────────────────────────────────────────────
     10. CURRENT YEAR IN FOOTER
  ──────────────────────────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ────────────────────────────────────────────────────────────
     11. MENU CARD — "Add to order" micro interaction (bonus UX)
     Shows a tiny toast when a menu item is clicked
  ──────────────────────────────────────────────────────────── */
  // Create toast element
  const toast = document.createElement('div');
  toast.id = 'toast';
  const toastStyle = document.createElement('style');
  toastStyle.textContent = `
    #toast {
      position:fixed; bottom:90px; left:50%; transform:translateX(-50%) translateY(20px);
      background: var(--gold); color: var(--espresso);
      padding:10px 22px; border-radius:50px;
      font-family: var(--font-body); font-size:0.85rem; font-weight:600;
      z-index:9000; opacity:0;
      transition: opacity 0.3s, transform 0.3s;
      white-space:nowrap; pointer-events:none;
      box-shadow: 0 8px 28px rgba(212,168,83,.4);
    }
    #toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
  `;
  document.head.appendChild(toastStyle);
  document.body.appendChild(toast);

  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  document.querySelectorAll('.menu-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const name = card.querySelector('.mc-name')?.textContent || 'Item';
      showToast(`☕ ${name} added! Call us to order.`);
    });
  });

}); // end DOMContentLoaded