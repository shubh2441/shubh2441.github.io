/* ════════════════════════════════════════════════════════════
   FlowWMS — Main JavaScript
   Animations · Interactions · UI Logic
════════════════════════════════════════════════════════════ */

'use strict';

/* ── Preloader ─────────────────────────────────────────────── */
(function initPreloader() {
    const preloader  = document.getElementById('preloader');
    const fill       = document.getElementById('preloader-fill');
    const percent    = document.getElementById('preloader-percent');
    let   value      = 0;

    const tick = setInterval(() => {
        const increment = Math.random() * 18 + 5;
        value = Math.min(value + increment, 100);

        fill.style.width   = value + '%';
        percent.textContent = Math.round(value) + '%';

        if (value >= 100) {
            clearInterval(tick);
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = '';
                initHeroAnimations();
            }, 300);
        }
    }, 80);

    document.body.style.overflow = 'hidden';
})();


/* ── Custom Cursor ─────────────────────────────────────────── */
(function initCursor() {
    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = followerX + 'px';
        follower.style.top  = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverTargets = 'a, button, .fcard, .plan-card, .tcard, .team-card';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('hovered'));
        el.addEventListener('mouseleave', () => follower.classList.remove('hovered'));
    });
})();


/* ── Navbar ────────────────────────────────────────────────── */
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('navbar-burger');
    const menu   = document.getElementById('mobile-menu');

    // Deepen shadow on scroll
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile menu toggle
    burger?.addEventListener('click', () => {
        burger.classList.toggle('active');
        menu.classList.toggle('open');
        document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
        link.addEventListener('click', () => {
            burger?.classList.remove('active');
            menu?.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Active nav link highlighting on scroll
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');

    const highlightNav = () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) {
                current = sec.id;
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });
})();


/* ── Typed Text Effect ─────────────────────────────────────── */
function initHeroAnimations() {
    const typed = document.querySelector('.typed-text');
    if (!typed) return;

    const words  = ['Redefined.', 'Simplified.', 'Optimized.', 'Elevated.'];
    let   wIndex = 0;
    let   cIndex = 0;
    let   isDeleting = false;

    function typeLoop() {
        const current = words[wIndex];

        if (isDeleting) {
            typed.textContent = current.slice(0, --cIndex);
        } else {
            typed.textContent = current.slice(0, ++cIndex);
        }

        let delay = isDeleting ? 60 : 100;

        if (!isDeleting && cIndex === current.length) {
            delay = 2200;
            isDeleting = true;
        } else if (isDeleting && cIndex === 0) {
            isDeleting = false;
            wIndex = (wIndex + 1) % words.length;
            delay = 300;
        }

        setTimeout(typeLoop, delay);
    }

    typeLoop();
}


/* ── Scroll Reveal (Intersection Observer) ─────────────────── */
(function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Trigger counter if it's a stat section
                if (entry.target.closest('.stats-section')) {
                    initCounters();
                }
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-badge')
        .forEach(el => observer.observe(el));
})();


/* ── Counter Animation ─────────────────────────────────────── */
let countersStarted = false;

function initCounters() {
    if (countersStarted) return;
    countersStarted = true;

    document.querySelectorAll('.counter').forEach(counter => {
        const target   = parseInt(counter.dataset.target, 10);
        const duration = 1800;
        const start    = performance.now();

        function step(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased    = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(target * eased);

            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    });
}


/* ── Feature Tabs ──────────────────────────────────────────── */
(function initFeatureTabs() {
    const tabs   = document.querySelectorAll('.ftab');
    const panels = document.querySelectorAll('.feature-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const panel = document.getElementById('panel-' + target);
            if (panel) {
                panel.classList.add('active');
                // Re-trigger reveal animations inside the panel
                panel.querySelectorAll('.reveal-left, .reveal-right').forEach(el => {
                    el.classList.remove('visible');
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => el.classList.add('visible'));
                    });
                });
            }
        });
    });

    // Auto-start visible panel
    document.querySelector('.feature-panel.active')
        ?.querySelectorAll('.reveal-left, .reveal-right')
        .forEach(el => el.classList.add('visible'));
})();


/* ── Demo Tabs — switches between real app screenshots ────── */
(function initDemoTabs() {
    const tabs        = document.querySelectorAll('.demo-tab');
    const urlBar      = document.getElementById('demo-url-bar');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;

            const shot = tab.dataset.shot;
            const url  = tab.dataset.url || '';

            // Swap active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Swap active screenshot image
            document.querySelectorAll('.demo-shot').forEach(img => {
                img.classList.toggle('active', img.dataset.shot === shot);
            });

            // Placeholders are shown only via onerror — no class toggling needed

            // Update URL bar
            if (urlBar && url) urlBar.textContent = '🔒 ' + url;
        });
    });
})();


/* ── Pricing Toggle (Monthly / Annual) ────────────────────── */
(function initPricingToggle() {
    const toggle = document.getElementById('billing-toggle');
    if (!toggle) return;

    toggle.addEventListener('change', () => {
        const isAnnual = toggle.checked;
        document.querySelectorAll('.price[data-monthly]').forEach(el => {
            el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
        });
    });
})();


/* ── FAQ Accordion ─────────────────────────────────────────── */
(function initFAQ() {
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item  = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq-item.open').forEach(i => {
                i.classList.remove('open');
            });

            // Open clicked (if it was closed)
            if (!isOpen) item.classList.add('open');
        });
    });
})();


/* ── Contact Form ──────────────────────────────────────────── */
(function initContactForm() {
    const form    = document.getElementById('contact-form');
    const success = document.getElementById('form-success');

    if (!form) return;

    // Simple input validation helper
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Live error clearing
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => field.classList.remove('error'));
    });

    form.addEventListener('submit', e => {
        e.preventDefault();

        const firstName = form.firstName;
        const lastName  = form.lastName;
        const email     = form.email;
        const company   = form.company;

        let valid = true;

        [firstName, lastName, company].forEach(f => {
            if (!f.value.trim()) { f.classList.add('error'); valid = false; }
        });

        if (!validateEmail(email.value)) {
            email.classList.add('error');
            valid = false;
        }

        if (!valid) return;

        // Simulate submission — replace with real endpoint
        const submitBtn = form.querySelector('[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        setTimeout(() => {
            form.reset();
            submitBtn.disabled   = false;
            submitBtn.innerHTML  = 'Send Message <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
            success.classList.add('visible');
            success.style.display = 'block';

            setTimeout(() => {
                success.classList.remove('visible');
                success.style.display = 'none';
            }, 6000);
        }, 1200);
    });
})();


/* ── Smooth Scroll ─────────────────────────────────────────── */
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
})();


/* ── Parallax (subtle hero blobs) ─────────────────────────── */
(function initParallax() {
    const blobs = document.querySelectorAll('.blob');
    if (!blobs.length) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const y = window.scrollY;
                blobs.forEach((blob, i) => {
                    const speed = (i + 1) * 0.12;
                    blob.style.transform = `translateY(${y * speed}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();


/* ── Hover tilt on Dashboard Mockup ───────────────────────── */
(function initMockupTilt() {
    const mockup = document.querySelector('.dashboard-mockup');
    if (!mockup) return;

    mockup.addEventListener('mousemove', e => {
        const rect   = mockup.getBoundingClientRect();
        const x      = (e.clientX - rect.left) / rect.width  - 0.5;
        const y      = (e.clientY - rect.top)  / rect.height - 0.5;
        const rotY   = x * 8;
        const rotX   = -y * 4;

        mockup.style.transform =
            `perspective(1200px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
    });

    mockup.addEventListener('mouseleave', () => {
        mockup.style.transform =
            'perspective(1200px) rotateY(-5deg) rotateX(2deg)';
        mockup.style.transition = 'transform .5s ease';
        setTimeout(() => mockup.style.transition = '', 500);
    });
})();


/* ── Number shimmer on hover (stat cards) ─────────────────── */
(function initStatHover() {
    document.querySelectorAll('.stat-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            const num = item.querySelector('.stat-item__number');
            if (num) {
                num.style.transform = 'scale(1.05)';
                num.style.transition = 'transform .2s ease';
            }
        });
        item.addEventListener('mouseleave', () => {
            const num = item.querySelector('.stat-item__number');
            if (num) num.style.transform = '';
        });
    });
})();
