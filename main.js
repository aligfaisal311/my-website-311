// import './style.css';

document.addEventListener('DOMContentLoaded', () => {

    // Canvas Fluid Effect
    initFluidBackground();

    // Navigation Active State
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath || (currentPath === 'index.html' && link.getAttribute('href') === './')) {
            link.classList.add('active');
        }
    });

    // Mobile Menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
        });
    }

    // Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === target) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // Scroll Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // observer.unobserve(entry.target); // Keep observing for re-animation if desired
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Mouse Parallax Effect
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        }

        const cards = document.querySelectorAll('.card-premium');
        cards.forEach((card, index) => {
            const factor = (index + 1) * 0.005;
            card.style.transform = `translate3d(${moveX * factor}px, ${moveY * factor}px, 0) translateY(0)`;
        });
    });
});

function initFluidBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'fluid-bg';
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '-2',
        pointerEvents: 'none',
        opacity: '0.4'
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() * 0.5 + 0.5) * 2; // Flowing right
            this.vy = (Math.random() - 0.5) * 0.2;
            this.life = Math.random() * 100 + 100;
            this.opacity = Math.random() * 0.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Add subtle sine wave for fluid feel
            this.y += Math.sin(this.x * 0.01) * 0.1;

            if (this.x > width || this.y < 0 || this.y > height) {
                this.reset();
                this.x = 0;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(6, 182, 212, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    };

    animate();
}

