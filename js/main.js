/* ════════════════════════════════════════════════════════════
   Nord WMS — Main JavaScript
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


/* ── Live Demo Showcase (tabbed iframes) ───────────────────── */
(function initShowcase() {
    const tabs = document.querySelectorAll('.sc-tab');
    if (!tabs.length) return;

    const desc = document.getElementById('sc-desc');

    const stage = document.querySelector('.sc-stage');
    const guard = document.getElementById('sc-guard');

    document.querySelectorAll('.sc-pane').forEach(pane => {
        const frame = pane.querySelector('iframe');
        frame.addEventListener('load', () => pane.classList.add('is-loaded'));
    });

    function load(pane) {
        const frame = pane.querySelector('iframe');
        if (!frame.getAttribute('src')) frame.src = frame.dataset.src;
    }

    const frames = [...stage.querySelectorAll('iframe')];
    let inStage = false;

    // Armed = iframes are inert, so the embedded app can't take focus, grab wheel/touch input or drag the page to itself.
    function arm(on) {
        guard.classList.toggle('is-off', !on);
        frames.forEach(f => { f.inert = on; });
        if (on && frames.includes(document.activeElement)) {
            document.activeElement.blur();
            window.focus();
        }
    }
    arm(true);
    guard.addEventListener('click', () => arm(false));
    stage.addEventListener('mouseenter', () => { inStage = true; });
    stage.addEventListener('mouseleave', () => { inStage = false; arm(true); });
    ['touchstart', 'wheel'].forEach(ev =>
        document.addEventListener(ev, e => { if (!stage.contains(e.target)) arm(true); }, { passive: true, capture: true }));

    // Start the demo when the section comes into view; hide the iframe once the user scrolls away.
    let started = false;
    new IntersectionObserver(([entry]) => {
        const away = entry.intersectionRatio < 0.2;
        stage.classList.toggle('is-away', away);
        if (!away && !started) {
            started = true;
            load(document.querySelector('.sc-pane.active'));
        }
    }, { threshold: [0, 0.2, 0.4] }).observe(stage);

    // Revert page jumps that don't match the user's own scroll gesture (the embedded app pulling the page back).
    let lastY = window.scrollY;
    let dir = 0, dirUntil = 0, freeUntil = 0, touchY = 0;
    const opts = { passive: true, capture: true };
    const free = (ms) => () => { freeUntil = Date.now() + ms; };
    const resetFree = () => { freeUntil = 0; };

    // Clicks, keys and scrollbar drags legitimately move the page by large steps.
    ['click', 'keydown'].forEach(ev => window.addEventListener(ev, free(2500), opts));
    window.addEventListener('mousedown', () => { freeUntil = Infinity; }, opts);
    window.addEventListener('mouseup', free(400), opts);
    window.addEventListener('blur', resetFree);

    // Smooth-scroll animations arrive as many small steps, so every step without a user gesture is reverted.
    window.addEventListener('wheel', e => { dir = Math.sign(e.deltaY); dirUntil = Date.now() + 700; }, opts);
    window.addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, opts);
    window.addEventListener('touchmove', e => {
        const y = e.touches[0].clientY;
        if (touchY !== y) { dir = Math.sign(touchY - y); dirUntil = Date.now() + 700; }
        touchY = y;
    }, opts);
    window.addEventListener('touchend', () => { dirUntil = Date.now() + 2000; }, opts);

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const d = y - lastY;
        const now = Date.now();
        const interacting = inStage && guard.classList.contains('is-off');
        if (started && d !== 0 && now > freeUntil && !interacting) {
            const byUser = now < dirUntil && Math.sign(d) === dir && Math.abs(d) <= 500;
            if (!byUser) {
                window.scrollTo({ top: lastY, behavior: 'instant' });
                return;
            }
        }
        lastY = y;
    }, { passive: true });

    function activate(tab) {
        tabs.forEach(t => {
            const on = t === tab;
            t.classList.toggle('active', on);
            t.setAttribute('aria-selected', on);
        });
        document.querySelectorAll('.sc-pane').forEach(p => p.classList.remove('active'));

        const pane = document.getElementById('sc-pane-' + tab.dataset.pane);
        load(pane);
        pane.classList.add('active');

        desc.textContent = tab.dataset.desc;
    }

    tabs.forEach(tab => tab.addEventListener('click', () => activate(tab)));
})();


/* ── Mobile screenshot lightbox ────────────────────────────── */
(function initPhoneLightbox() {
    const box = document.getElementById('lightbox');
    const shots = [...document.querySelectorAll('.phone-shot')];
    if (!box || !shots.length) return;

    const img = box.querySelector('.lightbox__img');
    const cap = box.querySelector('.lightbox__cap');
    let list = [];
    let index = 0;
    let opener = null;

    const hasImage = (fig) => { const i = fig.querySelector('img'); return i && !i.hidden; };

    function show(i) {
        index = (i + list.length) % list.length;
        const fig = list[index];
        const src = fig.querySelector('img');
        img.src = src.currentSrc || src.src;
        img.alt = src.alt;
        cap.textContent = fig.querySelector('figcaption').textContent;
    }

    function open(fig) {
        list = shots.filter(hasImage);
        if (!list.includes(fig)) return;
        opener = fig.querySelector('.phone-shot__device');
        show(list.indexOf(fig));
        box.hidden = false;
        document.body.style.overflow = 'hidden';
        box.querySelector('.lightbox__close').focus();
    }

    function close() {
        box.hidden = true;
        img.removeAttribute('src');
        document.body.style.overflow = '';
        opener?.focus();
    }

    shots.forEach(fig => {
        const device = fig.querySelector('.phone-shot__device');
        device.tabIndex = 0;
        device.setAttribute('role', 'button');
        device.setAttribute('aria-label', 'View ' + fig.querySelector('figcaption').textContent + ' screenshot full size');
        device.addEventListener('click', () => open(fig));
        device.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(fig); }
        });
    });

    box.addEventListener('click', e => { if (e.target === box || e.target.closest('.lightbox__close')) close(); });
    box.querySelector('.lightbox__prev').addEventListener('click', () => show(index - 1));
    box.querySelector('.lightbox__next').addEventListener('click', () => show(index + 1));

    document.addEventListener('keydown', e => {
        if (box.hidden) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') show(index - 1);
        else if (e.key === 'ArrowRight') show(index + 1);
    });

    let touchX = null;
    box.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', e => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    }, { passive: true });
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

    // Initialize EmailJS
    emailjs.init({
        publicKey: 'zk1xLib941HEa_f4t'
    });

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
        const interest  = form.interest;
        const message   = form.message;

        let valid = true;

        [firstName, lastName, company].forEach(f => {
            if (!f.value.trim()) { f.classList.add('error'); valid = false; }
        });

        if (!validateEmail(email.value)) {
            email.classList.add('error');
            valid = false;
        }

        if (!valid) return;

        // Prepare template parameters
        const templateParams = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            company: company.value,
            interest: interest.value || 'Not specified',
            message: message.value || 'No additional message provided'
        };

        // Send via EmailJS
        const submitBtn = form.querySelector('[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        emailjs.send('service_51j9dbo', 'template_by84x9e', templateParams)
            .then(() => {
                form.reset();
                submitBtn.disabled   = false;
                submitBtn.innerHTML  = 'Send Message <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
                success.classList.add('visible');
                success.style.display = 'block';

                setTimeout(() => {
                    success.classList.remove('visible');
                    success.style.display = 'none';
                }, 6000);
            })
            .catch((error) => {
                console.error('EmailJS Error:', error);
                submitBtn.disabled   = false;
                submitBtn.innerHTML  = 'Send Message <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
                
                // Show error message
                const errorMsg = document.createElement('div');
                errorMsg.className = 'form-error';
                errorMsg.textContent = 'Failed to send message. Please try again.';
                form.insertBefore(errorMsg, submitBtn);
                
                setTimeout(() => errorMsg.remove(), 5000);
            });
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
