// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Hero background: an animated graph of nodes and connecting vectors that
// reacts to the pointer, rendered on <canvas> for performance.
const heroCanvas = document.querySelector('.hero-graph');

if (heroCanvas && 'requestAnimationFrame' in window) {
    const ctx = heroCanvas.getContext('2d');
    const hero = heroCanvas.closest('.hero');
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#0033a0';

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    const pointer = { x: -9999, y: -9999, active: false };
    const LINK_DIST = 140;
    const POINTER_DIST = 200;

    function resize() {
        const rect = hero.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        heroCanvas.width = width * dpr;
        heroCanvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.min(70, Math.round((width * height) / 18000));
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3
        }));
    }

    function step() {
        ctx.clearRect(0, 0, width, height);

        for (const node of nodes) {
            node.x += node.vx;
            node.y += node.vy;
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;
        }

        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i];
                const b = nodes[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < LINK_DIST) {
                    ctx.strokeStyle = `rgba(16, 19, 26, ${0.12 * (1 - dist / LINK_DIST)})`;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }

            if (pointer.active) {
                const dist = Math.hypot(nodes[i].x - pointer.x, nodes[i].y - pointer.y);
                if (dist < POINTER_DIST) {
                    ctx.strokeStyle = `rgba(0, 51, 160, ${0.5 * (1 - dist / POINTER_DIST)})`;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(pointer.x, pointer.y);
                    ctx.stroke();
                }
            }
        }

        ctx.fillStyle = accent;
        for (const node of nodes) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 1.8, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(step);
    }

    hero.addEventListener('pointermove', (event) => {
        const rect = hero.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
        pointer.active = true;
    });

    hero.addEventListener('pointerleave', () => {
        pointer.active = false;
    });

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(step);
}

// Lightweight scroll-reveal, skipped entirely if API unsupported
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
} else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
}

// Contact form has no backend wired up yet, so just acknowledge the submission
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        contactForm.querySelector('.form-status').textContent = 'Thanks — we\'ll be in touch shortly.';
        contactForm.reset();
    });
}

