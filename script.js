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
  let isSubmitting = false;

  // ── Web3Forms Access Key ──────────────────────────────────────────────────
  // Configured to deliver submissions to: smartdrip19@gmail.com
  // Obtain your free access key in 30 seconds at: https://web3forms.com
  // Enter smartdrip19@gmail.com -> Click "Create Access Key" -> Paste key below:
  const WEB3_KEY = '1bc8c11a-8ea9-400f-b3a4-8860f5718929';

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (isSubmitting) return; // Prevent duplicate submissions

      const nameInput = document.getElementById('fName');
      const emailInput = document.getElementById('fEmail');
      const msgInput = document.getElementById('fMsg');
      const botcheck = document.getElementById('botcheck');

      // Honeypot check - reject bots
      if (botcheck && botcheck.checked) {
        return;
      }

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const msg = msgInput ? msgInput.value.trim() : '';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Client-side validations
      if (!name) {
        showFormAlert('Please enter your name.', 'error');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!email) {
        showFormAlert('Please enter your email address.', 'error');
        if (emailInput) emailInput.focus();
        return;
      }

      if (!emailRegex.test(email)) {
        showFormAlert('Please enter a valid email address (e.g. name@example.com).', 'error');
        if (emailInput) emailInput.focus();
        return;
      }

      if (!msg || msg.length < 5) {
        showFormAlert('Please enter a message (at least 5 characters).', 'error');
        if (msgInput) msgInput.focus();
        return;
      }

      // Check if Web3Forms key is configured
      if (!WEB3_KEY || WEB3_KEY === 'YOUR_WEB3FORMS_KEY_HERE') {
        showFormAlert('Configuration Required: Web3Forms access key is missing. Please generate a free key at web3forms.com for smartdrip19@gmail.com and paste it into script.js.', 'error');
        console.warn('[Contact Form] Missing Web3Forms access key. Register smartdrip19@gmail.com at https://web3forms.com to obtain your key.');
        return;
      }

      // Set Loading State
      isSubmitting = true;
      if (fSubmitBtn) {
        fSubmitBtn.disabled = true;
        fSubmitBtn.innerHTML = `
          <svg class="spin-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          <span>Sending Message...</span>
        `;
      }

      try {
        const payload = {
          access_key: WEB3_KEY,
          name: name,
          email: email,
          message: msg,
          subject: `Portfolio Contact: New message from ${name}`,
          from_name: 'Portfolio Contact Form'
        };

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
          showFormAlert('Message sent successfully! Thank you for contacting me.', 'success');
          contactForm.reset();
        } else {
          showFormAlert(data.message || 'Submission failed. Please try again or email directly to smartdrip19@gmail.com.', 'error');
        }
      } catch (err) {
        showFormAlert('Network error occurred. Please check your connection or email directly to smartdrip19@gmail.com.', 'error');
      } finally {
        isSubmitting = false;
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
          if (formStatus && formStatus.dataset.type === 'success') {
            formStatus.style.display = 'none';
          }
        }, 8000);
      }
    });
  }

  function showFormAlert(message, type) {
    if (!formStatus) return;
    formStatus.style.display = 'block';
    formStatus.textContent = message;
    formStatus.dataset.type = type;

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
