/**
 * ==========================================================================
 * DHARSHINI - PORTFOLIO INTERACTION SCRIPT
 * Pure Vanilla JavaScript (Zero External Dependencies)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. THEME SWITCHER (DARK & LIGHT MODE WITH LOCALSTORAGE PERSISTENCE)
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeModeText = document.getElementById('themeModeText');
  const htmlRoot = document.documentElement;
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const THEME_STORAGE_KEY = 'dharshini_theme_preference';

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#08080c' : '#fbf8f3');
    }

    if (themeModeText) {
      themeModeText.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
    }

    if (themeToggleBtn) {
      const modeLabel = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
      themeToggleBtn.setAttribute('aria-label', modeLabel);
      themeToggleBtn.setAttribute('title', modeLabel);
    }
  }

  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = htmlRoot.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  /* --------------------------------------------------------------------------
     2. DYNAMIC HERO TYPING ANIMATION
     -------------------------------------------------------------------------- */
  const typedTextEl = document.getElementById('typedText');
  const typingPhrases = [
    'Information Technology Student'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeEffect() {
    if (!typedTextEl) return;

    const currentPhrase = typingPhrases[phraseIndex];

    if (isDeleting) {
      typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 95;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at end of phrase
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  if (typedTextEl) {
    setTimeout(typeEffect, 500);
  }

  /* --------------------------------------------------------------------------
     3. MOBILE SIDEBAR DRAWER & BACKDROP
     -------------------------------------------------------------------------- */
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('active');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    if (mobileNavToggle) {
      mobileNavToggle.classList.add('active');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
    }
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('active');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    if (mobileNavToggle) {
      mobileNavToggle.classList.remove('active');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = sidebar && sidebar.classList.contains('active');
      if (isOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // Close sidebar on clicking any nav item in mobile view
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1200) {
        closeSidebar();
      }
    });
  });

  /* --------------------------------------------------------------------------
     4. SCROLLSPY (ACTIVE LINK HIGHLIGHTING)
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  /* --------------------------------------------------------------------------
     5. SCROLL TO TOP FLOATING BUTTON
     -------------------------------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  function handleScrollTopVisibility() {
    if (!scrollTopBtn) return;
    if (window.pageYOffset > 350) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });
  handleScrollTopVisibility();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. CONTACT FORM HANDLING & VALIDATION
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('contactFormStatus');
  const fSubmitBtn = document.getElementById('fSubmitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fName').value.trim();
      const email = document.getElementById('fEmail').value.trim();
      const msg = document.getElementById('fMsg').value.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !msg) {
        showFormAlert('Please fill out all required fields.', 'error');
        return;
      }

      if (!emailRegex.test(email)) {
        showFormAlert('Please enter a valid email address.', 'error');
        return;
      }

      if (fSubmitBtn) {
        fSubmitBtn.disabled = true;
        fSubmitBtn.innerHTML = '<span>Sending Message...</span>';
      }

      // ── Real email delivery via Web3Forms ────────────────────────────────
      // One free key delivers BOTH this contact form AND the visitor notification.
      // Get yours: https://web3forms.com → enter smartdrip19@gmail.com → Create Key
      const WEB3_KEY = 'YOUR_WEB3FORMS_KEY_HERE'; // ← paste the same key here

      const formData = new FormData();
      formData.append('access_key', WEB3_KEY);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('message', msg);
      formData.append('subject', 'Portfolio Contact: New message from ' + name);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            showFormAlert('Thank you! Your message has been sent successfully.', 'success');
            contactForm.reset();
          } else {
            showFormAlert('Oops! Something went wrong. Please try again or email directly.', 'error');
          }
        })
        .catch(() => {
          showFormAlert('Network error. Please try again or email directly.', 'error');
        })
        .finally(() => {
          if (fSubmitBtn) {
            fSubmitBtn.disabled = false;
            fSubmitBtn.innerHTML = `
              <span>Send Message</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            `;
          }
          setTimeout(() => {
            if (formStatus) formStatus.style.display = 'none';
          }, 6000);
        });
    });
  }

  function showFormAlert(message, type) {
    if (!formStatus) return;
    formStatus.style.display = 'block';
    formStatus.textContent = message;

    if (type === 'error') {
      formStatus.style.background = 'rgba(239, 68, 68, 0.15)';
      formStatus.style.border = '1px solid #ef4444';
      formStatus.style.color = '#f87171';
    } else {
      formStatus.style.background = 'rgba(16, 185, 129, 0.15)';
      formStatus.style.border = '1px solid #10b981';
      formStatus.style.color = '#34d399';
    }
  }
});
