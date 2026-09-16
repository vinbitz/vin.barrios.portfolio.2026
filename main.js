/* ==========================================================================
   MARVIN BARRIOS — TECH MARKETER PORTFOLIO
   Interactive Engine: Canva Draggables + Clouted 3D Perspective Stack
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Draggable Canva Text Boxes ("Marvin" & "Marketer.")
  const canvaDragWrappers = document.querySelectorAll('.canva-drag-wrapper');
  
  canvaDragWrappers.forEach(wrapper => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseDown = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;

      isDragging = true;
      const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
      startX = clientX - currentX;
      startY = clientY - currentY;

      wrapper.classList.add('is-dragging');
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);

      currentX = clientX - startX;
      currentY = clientY - startY;

      wrapper.style.transform = `translate(${currentX}px, ${currentY}px)`;
    };

    const onMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        wrapper.classList.remove('is-dragging');
      }
    };

    wrapper.addEventListener('dblclick', () => {
      currentX = 0;
      currentY = 0;
      wrapper.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      wrapper.style.transform = 'translate(0px, 0px)';
      setTimeout(() => {
        wrapper.style.transition = '';
      }, 400);
    });

    wrapper.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    wrapper.addEventListener('touchstart', onMouseDown, { passive: false });
    window.addEventListener('touchmove', onMouseMove, { passive: false });
    window.addEventListener('touchend', onMouseUp);
  });

  // 2. Numbers Counting Animation Engine
  const animateCounter = (el) => {
    if (el.dataset.animated === 'true') return;
    const rawTarget = el.getAttribute('data-target');
    if (!rawTarget) return;
    el.dataset.animated = 'true';
    const target = parseFloat(rawTarget);
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 1600; // ms
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = ease * target;

      let displayVal;
      if (decimals > 0) {
        displayVal = currentVal.toFixed(decimals);
      } else if (target >= 1000) {
        displayVal = Math.floor(currentVal).toLocaleString();
      } else {
        displayVal = Math.floor(currentVal);
      }

      el.textContent = `${prefix}${displayVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        let finalVal;
        if (decimals > 0) {
          finalVal = target.toFixed(decimals);
        } else if (target >= 1000) {
          finalVal = target.toLocaleString();
        } else {
          finalVal = target;
        }
        el.textContent = `${prefix}${finalVal}${suffix}`;
      }
    };

    requestAnimationFrame(update);
  };

  const triggerCounters = (container) => {
    if (!container) return;
    const counters = container.querySelectorAll('.stat-number[data-target], .work-stat-num[data-target], .card-stat-big[data-target]');
    counters.forEach(c => animateCounter(c));
  };

  // Scroll observer to animate stats counters when scrolled into view
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerCounters(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    const statsBox = document.querySelector('.stats-box');
    if (statsBox) counterObserver.observe(statsBox);

    const workCards = document.querySelectorAll('.work-project-card');
    workCards.forEach(card => counterObserver.observe(card));

    const workSection = document.getElementById('work');
    if (workSection) counterObserver.observe(workSection);
  } else {
    const statsBox = document.querySelector('.stats-box');
    if (statsBox) triggerCounters(statsBox);
    const workSection = document.getElementById('work');
    if (workSection) triggerCounters(workSection);
  }

  // Immediate counter check on page load if elements are already in viewport
  setTimeout(() => {
    const checkViewport = (el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        triggerCounters(el);
      }
    };
    checkViewport(document.querySelector('.stats-box'));
    checkViewport(document.getElementById('work'));
  }, 350);

  // 3. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.clouted-nav-links');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.style.display === 'flex';
      navMenu.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = '#FFFFFF';
        navMenu.style.padding = '24px';
        navMenu.style.borderRadius = '16px';
        navMenu.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        navMenu.style.marginTop = '8px';
      }
    });
  }

  // 5. Logo Dot Breathing Animation
  const logoDot = document.querySelector('.clouted-brand .dot');
  if (logoDot) {
    let toggle = false;
    setInterval(() => {
      logoDot.style.color = toggle ? '#8C52FF' : '#109EF2';
      toggle = !toggle;
    }, 2400);
  }

  // 6. Interactive 3D Magnetic Tilt for Portrait & Samsung Cards
  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 7. Voucher Copy-to-Clipboard Feature
  const copyButtons = document.querySelectorAll('.btn-copy-code');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const code = btn.getAttribute('data-code');
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          const originalText = btn.textContent;
          btn.textContent = 'Copied! ✓';
          btn.style.backgroundColor = '#10B981';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
          }, 2000);
        }).catch(() => {
          btn.textContent = 'Copied! ✓';
        });
      }
    });
  });

  // 9. Modal Popup Data & Handling
  const modalBackdrop = document.getElementById('detailsModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  const modalDetails = {
    'video-review': {
      title: 'I Tried the Galaxy S26 Ultra… Here’s What Surprised Me',
      subtitle: 'Tech Review & Hands-on Impressions · Marvin Barrios',
      body: `
        <div class="modal-video-container">
          <iframe src="https://www.youtube-nocookie.com/embed/3FxIm-m1eGE?autoplay=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <p style="color: #4B5563; line-height: 1.6; margin-bottom: 18px;">
          Hands-on deep dive with Samsung's latest flagship. Analyzing the new Galaxy AI capabilities, Nightography camera optics, benchmark speeds, and real-world student creator workflows.
        </p>
        <a href="https://youtu.be/3FxIm-m1eGE" target="_blank" rel="noopener noreferrer" class="btn-reel-link" style="background: #FF0000; color: #FFF; border-color: #CC0000; display: inline-flex;">
          <span style="font-size: 1rem;">▶</span> Watch on YouTube ↗
        </a>
      `
    },
    'video-run': {
      title: 'How I Started Running + Galaxy Manila Marathon 2026 Giveaway',
      subtitle: 'Fitness Vlog & Community Giveaway · Marvin Barrios',
      body: `
        <div class="modal-video-container">
          <iframe src="https://www.youtube-nocookie.com/embed/CdPMPd-swMI?autoplay=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <p style="color: #4B5563; line-height: 1.6; margin-bottom: 18px;">
          My personal running journey, training preparation for the Galaxy Manila Marathon 2026, tracking heart-rate zones with the Galaxy Watch, and hosting a community giveaway.
        </p>
        <a href="https://youtu.be/CdPMPd-swMI" target="_blank" rel="noopener noreferrer" class="btn-reel-link" style="background: #FF0000; color: #FFF; border-color: #CC0000; display: inline-flex;">
          <span style="font-size: 1rem;">▶</span> Watch on YouTube ↗
        </a>
      `
    },
    'video-work': {
      title: 'My First Week as a Cloud Intern in BGC, Taguig!',
      subtitle: 'Career & Tech Internship Vlog · Marvin Barrios',
      body: `
        <div class="modal-video-container">
          <iframe src="https://www.youtube-nocookie.com/embed/1_ACqtRjlvc?autoplay=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <p style="color: #4B5563; line-height: 1.6; margin-bottom: 18px;">
          A day-in-the-life vlog working as a tech and cloud intern in Bonifacio Global City (BGC), Taguig. Navigating enterprise cloud environments, office culture, and student productivity.
        </p>
        <a href="https://youtu.be/1_ACqtRjlvc" target="_blank" rel="noopener noreferrer" class="btn-reel-link" style="background: #FF0000; color: #FFF; border-color: #CC0000; display: inline-flex;">
          <span style="font-size: 1rem;">▶</span> Watch on YouTube ↗
        </a>
      `
    },
    'skill-lifecycle': {
      title: 'Project Lifecycle & Strategy',
      subtitle: 'End-to-end campaign execution from discovery to retrospective',
      body: `<p>Expertise in aligning business goals with sprint deliverables, ensuring creative and marketing outputs meet hard KPIs.</p>`
    },
    'skill-fullstack': {
      title: 'Full Stack Tech Marketing',
      subtitle: 'Bridging acquisition, conversion, activation, and data analytics',
      body: `<p>Proficient in growth funnels, customer journey mapping, UTM tracking architectures, SEO, and paid performance ads.</p>`
    },
    'skill-copywriting': {
      title: 'High-Conversion Copywriting',
      subtitle: 'Words that drive action across every digital touchpoint',
      body: `<p>Specializing in value-driven landing pages, email marketing automation sequences, and viral social hooks.</p>`
    },
    'skill-video': {
      title: 'Content Creation & Video Production',
      subtitle: 'Scriptwriting, filming, high-retention video editing, and motion design',
      body: `<p>Directing multimedia stories with high visual fidelity tailored for modern social algorithms.</p>`
    },
    'skill-event': {
      title: 'Tech Event Management & Hackathons',
      subtitle: 'Logistics, sponsorship acquisition, community roadshows',
      body: `<p>Organized regional student tech summits, hackathons, and webinars engaging thousands of young innovators.</p>`
    },
    'skill-integrated': {
      title: 'Integrated Omnichannel Marketing',
      subtitle: 'Connecting PR, offline campus activations, and digital channels',
      body: `<p>Ensuring brand voice consistency across offline physical touchpoints, ambassador networks, and online channels.</p>`
    },
    'reel-s26': {
      title: 'Galaxy S26 Ultra · Flagship Galaxy AI',
      subtitle: 'Samsung Members Star · @marvinbarrios',
      body: `
        <div class="modal-reel-container">
          <iframe src="https://www.instagram.com/reel/DVMNTDLEmyO/embed/" class="modal-reel-iframe" frameborder="0" scrolling="no" allowtransparency="true" allow="encrypted-media;"></iframe>
        </div>
        <p style="color: #4B5563; line-height: 1.6; margin-bottom: 18px; text-align: center;">
          Hands-on feature showcase for the new Samsung Galaxy S26 Ultra: testing Galaxy AI productivity features, camera optics, and creator workflows.
        </p>
        <div style="text-align: center;">
          <a href="https://www.instagram.com/reel/DVMNTDLEmyO/" target="_blank" rel="noopener noreferrer" class="btn-reel-external">
            Watch Full Reel on Instagram App ↗
          </a>
        </div>
      `
    },
    'reel-s25': {
      title: 'Galaxy S25 · Nightography & Performance',
      subtitle: 'Samsung Members Star · @marvinbarrios',
      body: `
        <div class="modal-reel-container">
          <iframe src="https://www.instagram.com/reel/DFg3_2Wy3-r/embed/" class="modal-reel-iframe" frameborder="0" scrolling="no" allowtransparency="true" allow="encrypted-media;"></iframe>
        </div>
        <p style="color: #4B5563; line-height: 1.6; margin-bottom: 18px; text-align: center;">
          Everyday power and low-light Nightography performance with the Galaxy S25 series for campus creators.
        </p>
        <div style="text-align: center;">
          <a href="https://www.instagram.com/reel/DFg3_2Wy3-r/" target="_blank" rel="noopener noreferrer" class="btn-reel-external">
            Watch Full Reel on Instagram App ↗
          </a>
        </div>
      `
    },
    'reel-fold8': {
      title: 'Galaxy Z Fold 8 · Dual-Screen Multitasking',
      subtitle: 'Samsung Members Star · @marvinbarrios',
      body: `
        <div class="modal-reel-container">
          <iframe src="https://www.instagram.com/reel/DbGNbIZTv2t/embed/" class="modal-reel-iframe" frameborder="0" scrolling="no" allowtransparency="true" allow="encrypted-media;"></iframe>
        </div>
        <p style="color: #4B5563; line-height: 1.6; margin-bottom: 18px; text-align: center;">
          Next-generation foldable form factors highlighting split-screen productivity and multitasking for students and founders.
        </p>
        <div style="text-align: center;">
          <a href="https://www.instagram.com/reel/DbGNbIZTv2t/" target="_blank" rel="noopener noreferrer" class="btn-reel-external">
            Watch Full Reel on Instagram App ↗
          </a>
        </div>
      `
    },
    'reel-fold7': {
      title: 'Galaxy Z Fold 7 · FlexCam & Portability',
      subtitle: 'Samsung Members Star · @marvinbarrios',
      body: `
        <div class="modal-reel-container">
          <iframe src="https://www.instagram.com/reel/DL4_bQ3ybpK/embed/" class="modal-reel-iframe" frameborder="0" scrolling="no" allowtransparency="true" allow="encrypted-media;"></iframe>
        </div>
        <p style="color: #4B5563; line-height: 1.6; margin-bottom: 18px; text-align: center;">
          Hands-free recording and creator vlogging on the move with FlexCam on Galaxy Fold 7.
        </p>
        <div style="text-align: center;">
          <a href="https://www.instagram.com/reel/DL4_bQ3ybpK/" target="_blank" rel="noopener noreferrer" class="btn-reel-external">
            Watch Full Reel on Instagram App ↗
          </a>
        </div>
      `
    },
    'reel-a57': {
      title: 'Galaxy A57 / A37 · Awesome Super AMOLED',
      subtitle: 'Samsung Members Star · @marvinbarrios',
      body: `
        <div class="modal-reel-container">
          <iframe src="https://www.instagram.com/reel/DWTwFfgEveS/embed/" class="modal-reel-iframe" frameborder="0" scrolling="no" allowtransparency="true" allow="encrypted-media;"></iframe>
        </div>
        <p style="color: #4B5563; line-height: 1.6; margin-bottom: 18px; text-align: center;">
          Vibrant Super AMOLED displays and accessible flagship features built for university students.
        </p>
        <div style="text-align: center;">
          <a href="https://www.instagram.com/reel/DWTwFfgEveS/" target="_blank" rel="noopener noreferrer" class="btn-reel-external">
            Watch Full Reel on Instagram App ↗
          </a>
        </div>
      `
    },
    'reel-a56': {
      title: 'Galaxy A56 / A36 · 2-Day Battery Life & Daily Routine',
      subtitle: 'Samsung Members Star · @marvinbarrios',
      body: `
        <div class="modal-reel-container">
          <iframe src="https://www.instagram.com/reel/DGrM0MKTo1N/embed/" class="modal-reel-iframe" frameborder="0" scrolling="no" allowtransparency="true" allow="encrypted-media;"></iframe>
        </div>
        <p style="color: #4B5563; line-height: 1.6; margin-bottom: 18px; text-align: center;">
          Endurance testing and all-day student routine with Galaxy A56 and A36.
        </p>
        <div style="text-align: center;">
          <a href="https://www.instagram.com/reel/DGrM0MKTo1N/" target="_blank" rel="noopener noreferrer" class="btn-reel-external">
            Watch Full Reel on Instagram App ↗
          </a>
        </div>
      `
    },
    'reel-creator': {
      title: 'Campus Life & Behind-The-Scenes',
      subtitle: 'Samsung Members Star · @marvinbarrios',
      body: `
        <div class="modal-reel-container">
          <iframe src="https://www.instagram.com/reel/DYuFCt6yIgx/embed/" class="modal-reel-iframe" frameborder="0" scrolling="no" allowtransparency="true" allow="encrypted-media;"></iframe>
        </div>
        <p style="color: #4B5563; line-height: 1.6; margin-bottom: 18px; text-align: center;">
          Experiential campus activations, tech roadshows, and ambassador community life with Samsung Southeast Asia &amp; Oceania.
        </p>
        <div style="text-align: center;">
          <a href="https://www.instagram.com/reel/DYuFCt6yIgx/" target="_blank" rel="noopener noreferrer" class="btn-reel-external">
            Watch Full Reel on Instagram App ↗
          </a>
        </div>
      `
    }
  };

  const openModal = (key) => {
    const data = modalDetails[key];
    if (data && modalBackdrop) {
      modalTitle.textContent = data.title;
      modalSubtitle.textContent = data.subtitle;
      modalBody.innerHTML = data.body;
      modalBackdrop.classList.add('active');
    }
  };

  const closeModal = () => {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      modalBody.innerHTML = '';
    }
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-open-modal');
      openModal(key);
    });
  });

  // 10. Samsung Reel Tabs Switcher
  const reelTabButtons = document.querySelectorAll('.reel-tab-btn');
  reelTabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const container = btn.closest('.reel-preview-container');
      if (!container) return;

      const targetId = btn.getAttribute('data-target-pane');
      if (!targetId) return;

      // Update active button
      container.querySelectorAll('.reel-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active pane
      container.querySelectorAll('.reel-pane').forEach(pane => {
        pane.classList.remove('active');
      });

      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
        // Lazy load iframe if needed
        const iframe = targetPane.querySelector('iframe[data-src]');
        if (iframe && !iframe.getAttribute('src')) {
          iframe.setAttribute('src', iframe.getAttribute('data-src'));
        }
      }
    });
  });

  // 9B. Samsung Single-Tab Voucher Engine
  const voucherFormBox = document.getElementById('voucherFormBox');
  const voucherEmailInput = document.getElementById('voucherEmailInput');
  const btnClaimVoucher = document.getElementById('btnClaimVoucher');
  const voucherRevealedBox = document.getElementById('voucherRevealedBox');
  const revealedCodeDisplay = document.getElementById('revealedCodeDisplay');
  const btnCopyRevealed = document.getElementById('btnCopyRevealed');
  const copyBtnText = document.getElementById('copyBtnText');
  const revealedSubnote = document.getElementById('revealedSubnote');
  const vouchersRemainingCount = document.getElementById('vouchersRemainingCount');

  if (btnClaimVoucher && voucherEmailInput) {
    let voucherCodes = [];
    const TOTAL_VOUCHERS = 1000;

    // Fetch full 1,000 codes from json
    fetch('assets/data/samsung-vouchers.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          voucherCodes = data;
        }
      })
      .catch(err => {
        console.warn('Could not load samsung-vouchers.json, using fallback codes:', err);
      });

    // Check if code was already claimed on this device
    const claimedCode = localStorage.getItem('marvin_samsung_claimed_code');
    const claimedEmail = localStorage.getItem('marvin_samsung_claimed_email');

    const updateRemainingDisplay = () => {
      if (!vouchersRemainingCount) return;
      const claimedOffset = claimedCode ? 1 : 0;
      const remaining = Math.max(0, TOTAL_VOUCHERS - claimedOffset);
      vouchersRemainingCount.textContent = remaining;
    };

    if (claimedCode) {
      if (voucherEmailInput) {
        voucherEmailInput.value = claimedEmail || 'Claimed on this device';
        voucherEmailInput.disabled = true;
      }
      btnClaimVoucher.disabled = true;
      btnClaimVoucher.textContent = 'Claimed on This Device ✓';
      btnClaimVoucher.style.opacity = '0.7';
      btnClaimVoucher.style.cursor = 'default';

      if (voucherRevealedBox && revealedCodeDisplay) {
        voucherRevealedBox.style.display = 'block';
        revealedCodeDisplay.textContent = claimedCode;
        if (revealedSubnote && claimedEmail) {
          revealedSubnote.textContent = `A copy of your code was claimed for ${claimedEmail}. Use it at checkout on samsung.com!`;
        }
      }
    }

    updateRemainingDisplay();

    // Claim Action
    btnClaimVoucher.addEventListener('click', () => {
      const email = voucherEmailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailRegex.test(email)) {
        voucherEmailInput.focus();
        voucherEmailInput.style.borderColor = '#EA3829';
        voucherEmailInput.style.boxShadow = '0 0 0 3px rgba(234, 56, 41, 0.2)';
        setTimeout(() => {
          voucherEmailInput.style.borderColor = '';
          voucherEmailInput.style.boxShadow = '';
        }, 2200);
        return;
      }

      // Already claimed check
      if (localStorage.getItem('marvin_samsung_claimed_code')) {
        return;
      }

      // Pick next available code
      let selectedCode = '';
      if (voucherCodes.length > 0) {
        const randIdx = Math.floor(Math.random() * voucherCodes.length);
        selectedCode = voucherCodes[randIdx];
      } else {
        const randId = Math.floor(1000 + Math.random() * 9000);
        selectedCode = `CRPSTARSMBPC202410-${randId}`;
      }

      // Save to localStorage (1 per device)
      try {
        localStorage.setItem('marvin_samsung_claimed_code', selectedCode);
        localStorage.setItem('marvin_samsung_claimed_email', email);
        localStorage.setItem('marvin_samsung_claimed_time', new Date().toISOString());
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }

      // Update UI
      voucherEmailInput.disabled = true;
      btnClaimVoucher.disabled = true;
      btnClaimVoucher.textContent = 'Claimed on This Device ✓';
      btnClaimVoucher.style.opacity = '0.7';
      btnClaimVoucher.style.cursor = 'default';

      if (voucherRevealedBox && revealedCodeDisplay) {
        voucherRevealedBox.style.display = 'block';
        revealedCodeDisplay.textContent = selectedCode;
        if (revealedSubnote) {
          revealedSubnote.textContent = `Voucher code unlocked for ${email}! Valid exclusively on samsung.com at checkout.`;
        }
      }

      updateRemainingDisplay();

      // Attempt automatic copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(selectedCode).then(() => {
          if (copyBtnText) {
            copyBtnText.textContent = 'Copied! ✓';
            setTimeout(() => {
              copyBtnText.textContent = 'Copy Code';
            }, 2500);
          }
        }).catch(() => {});
      }
    });

    // Copy Revealed Code Button
    if (btnCopyRevealed) {
      btnCopyRevealed.addEventListener('click', () => {
        const codeToCopy = (revealedCodeDisplay && revealedCodeDisplay.textContent) || claimedCode || '';
        if (!codeToCopy) return;

        const handleSuccess = () => {
          if (copyBtnText) {
            const originalText = copyBtnText.textContent;
            copyBtnText.textContent = 'Copied! ✓';
            btnCopyRevealed.style.background = '#00B074';
            setTimeout(() => {
              copyBtnText.textContent = originalText;
              btnCopyRevealed.style.background = '';
            }, 2000);
          }
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(codeToCopy).then(handleSuccess).catch(() => {
            fallbackCopy(codeToCopy, handleSuccess);
          });
        } else {
          fallbackCopy(codeToCopy, handleSuccess);
        }
      });
    }

    const fallbackCopy = (text, callback) => {
      const tempInput = document.createElement('input');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      try {
        document.execCommand('copy');
        if (callback) callback();
      } catch (e) {
        console.warn('Copy failed:', e);
      }
      document.body.removeChild(tempInput);
    };

    // Auto-switch to Creator Mode if user clicks any link to #vouchers while in Executive Mode
    document.querySelectorAll('a[href="#vouchers"]').forEach(link => {
      link.addEventListener('click', (e) => {
        if (document.body.classList.contains('dark-mode')) {
          e.preventDefault();
          if (typeof setPortfolioMode === 'function') {
            setPortfolioMode(false);
          }
          setTimeout(() => {
            const voucherSec = document.getElementById('vouchers');
            if (voucherSec) {
              voucherSec.scrollIntoView({ behavior: 'smooth' });
            }
          }, 150);
        }
      });
    });
  }

  // Smooth scroll handler for "See My Work" and all #work links
  document.querySelectorAll('a[href="#work"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const workSec = document.getElementById('work');
      if (workSec) {
        workSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 10. Recommendations Carousel
  const recCards = document.querySelectorAll('.rec-card');
  let currentRecIndex = 0;
  const prevRecBtn = document.getElementById('recPrev');
  const nextRecBtn = document.getElementById('recNext');

  if (prevRecBtn && nextRecBtn && recCards.length > 0) {
    const updateRecDisplay = () => {
      recCards.forEach((card, idx) => {
        card.style.display = (window.innerWidth <= 768)
          ? (idx === currentRecIndex ? 'block' : 'none')
          : 'block';
      });
    };

    prevRecBtn.addEventListener('click', () => {
      currentRecIndex = (currentRecIndex - 1 + recCards.length) % recCards.length;
      updateRecDisplay();
    });

    nextRecBtn.addEventListener('click', () => {
      currentRecIndex = (currentRecIndex + 1) % recCards.length;
      updateRecDisplay();
    });

    window.addEventListener('resize', updateRecDisplay);
  }

  // GSAP Smooth Reveal Animation
  const triggerRevealAnimation = () => {
    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline();
      tl.fromTo('.hero-title', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'all' }
      )
      .fromTo('.canva-drag-wrapper', 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.15, clearProps: 'scale,opacity' }, 
        '-=0.4'
      )
      .fromTo('.hero-subtext', 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'all' }, 
        '-=0.3'
      )
      .fromTo('.flip-card-container, .hero-portrait-card', 
        { opacity: 0, scale: 0.95 }, 
        { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out', clearProps: 'all' }, 
        '-=0.4'
      );
    }
  };

  // Initial GSAP reveal entry on first page visit
  if (typeof gsap !== 'undefined') {
    triggerRevealAnimation();
  }

  // 12. Canva "Red Boom" Click Effect (from Visual Media slide)
  const createRedBoom = (x, y) => {
    if (x === undefined || y === undefined) return;

    const boomWrapper = document.createElement('div');
    boomWrapper.className = 'click-boom-wrapper';
    boomWrapper.style.left = `${x}px`;
    boomWrapper.style.top = `${y}px`;

    // Dynamic rotation and scale variations for organic comic feel
    const randomRot = (Math.random() - 0.5) * 44; // -22deg to +22deg
    const randomScale = 0.85 + Math.random() * 0.4; // 0.85 to 1.25

    boomWrapper.innerHTML = `
      <div class="boom-main-burst" style="--rot: ${randomRot}deg; --scale: ${randomScale};">
        <svg viewBox="0 0 100 100" class="boom-svg" aria-hidden="true">
          <polygon points="50,0 58,28 84,6 74,34 100,28 80,50 98,72 73,66 84,94 58,73 50,100 42,73 16,94 27,66 2,72 20,50 0,28 26,34 16,6 42,28" fill="#EA3829" />
        </svg>
      </div>
      <div class="boom-sparks" aria-hidden="true">
        <span class="boom-spark sp-1"></span>
        <span class="boom-spark sp-2"></span>
        <span class="boom-spark sp-3"></span>
        <span class="boom-spark sp-4"></span>
        <span class="boom-spark sp-5"></span>
        <span class="boom-spark sp-6"></span>
      </div>
    `;

    document.body.appendChild(boomWrapper);

    // Auto-remove after animation completes (420ms)
    setTimeout(() => {
      if (boomWrapper.parentNode) {
        boomWrapper.parentNode.removeChild(boomWrapper);
      }
    }, 450);
  };

  // 13. Floating Multiplayer Cursors Reactive Click Reaction
  const floatingCursors = document.querySelectorAll('.floating-cursor');

  // Listen on pointerdown across the document for instantaneous tactile feedback
  window.addEventListener('pointerdown', (e) => {
    // Only primary button (left click) or touch
    if (e.button !== undefined && e.button !== 0) return;
    if (e.target.isContentEditable || e.target.closest('[contenteditable="true"]')) return;
    createRedBoom(e.clientX, e.clientY);

    // Subtle click hop reaction on floating multiplayer cursors
    if (floatingCursors.length > 0) {
      floatingCursors.forEach((cursor, idx) => {
        setTimeout(() => {
          cursor.classList.add('cursor-clicked');
          setTimeout(() => {
            cursor.classList.remove('cursor-clicked');
          }, 180);
        }, idx * 45);
      });
    }
  });

  // ==========================================================================
  // 14. 3D FLIP CARD & GLOW DARK MODE CONTROLLER
  // ==========================================================================
  const flipCard = document.getElementById('portraitFlipCard');
  const modeToggleBtn = document.getElementById('modeToggleBtn');

  // Mode Controller: light or dark
  let isDarkMode = false;

  const setPortfolioMode = (dark, animate = true) => {
    isDarkMode = dark;

    // 1. Flip hero portrait card
    if (flipCard) {
      flipCard.classList.toggle('is-flipped', isDarkMode);
    }

    // 2. Toggle global dark mode on body
    document.body.classList.toggle('dark-mode', isDarkMode);

    // 3. Update mode toggle button in navbar
    if (modeToggleBtn) {
      const icon = modeToggleBtn.querySelector('.mode-btn-icon');
      const text = modeToggleBtn.querySelector('.mode-btn-text');
      if (isDarkMode) {
        if (icon) icon.textContent = '☀️';
        if (text) text.textContent = 'Creator Mode';
        modeToggleBtn.title = 'Switch to Creator Mode';
      } else {
        if (icon) icon.textContent = '🌙';
        if (text) text.textContent = 'Executive Mode';
        modeToggleBtn.title = 'Switch to Executive Mode';
      }
    }

    // 4. Refresh ScrollTrigger & Trigger stats counter animations
    if (window.ScrollTrigger) {
      setTimeout(() => ScrollTrigger.refresh(), 120);
    }
    document.querySelectorAll('[data-target]').forEach(el => {
      el.dataset.animated = 'false';
      animateCounter(el);
    });

    try {
      localStorage.setItem('marvin_dark_mode', isDarkMode ? 'true' : 'false');
    } catch (e) {
      console.warn(e);
    }
  };
  window.setPortfolioMode = setPortfolioMode;

  // Flip card click handler
  if (flipCard) {
    flipCard.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.closest('a') || e.target.closest('button')) return;
      setPortfolioMode(!isDarkMode);
    });
  }

  // Navbar Mode Button click handler
  if (modeToggleBtn) {
    modeToggleBtn.addEventListener('click', () => {
      setPortfolioMode(!isDarkMode);
    });
  }

  // Clean up any stale localStorage items from previous test edits
  try {
    localStorage.removeItem('marvin_exec_experience_items');
    localStorage.removeItem('marvin_exec_skills_items');
    const savedMode = localStorage.getItem('marvin_dark_mode');
    if (savedMode === 'true') {
      setPortfolioMode(true, false);
    }
  } catch (e) {
    console.warn(e);
  }
});

