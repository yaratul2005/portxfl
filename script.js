/**
 * Yaser Ahmmed Ratul - Portfolio JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCustomCursor();
    initMobileMenu();
    initNavbarScroll();
    initScrollReveal();
    initCanvasParticles();
    initProjectsTilt();
    initCopyToClipboard();
    initTypingFooter();
    initContactForm();
});

/* ==========================================================================
   Page Loader & Initial Animations
   ========================================================================== */
function initLoader() {
    const loader = document.getElementById('loader');

    // Hide loader after 2.5 seconds
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');

        // Trigger hero text staggered animation
        setTimeout(() => {
            document.querySelector('.hero-title').classList.add('animate');
        }, 500); // Wait a bit after loader fades

    }, 2500);
}

/* ==========================================================================
   Custom Cursor
   ========================================================================== */
function initCustomCursor() {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    // Check if cursor elements exist (they might be hidden on mobile via CSS, but JS stills runs)
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    // Follow mouse
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Immediate update for dot
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    // Smooth trailing for ring use requestAnimationFrame
    function render() {
        // LERP (Linear Interpolation) for smooth follow
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
        requestAnimationFrame(render);
    }
    render();

    // Add hover effect for interactive elements
    const addHover = () => ring.classList.add('hover');
    const removeHover = () => ring.classList.remove('hover');

    // Attach to existing interactives
    const setupInteractions = () => {
        const interactives = document.querySelectorAll('a, button, .interactive, .skill-card, .project-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', addHover);
            el.addEventListener('mouseleave', removeHover);
        });
    };

    setupInteractions();

    // Setup mutation observer for dynamically added elements (if any)
    const observer = new MutationObserver((mutations) => {
        let shouldSetup = false;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) shouldSetup = true;
        });
        if (shouldSetup) setupInteractions();
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

/* ==========================================================================
   Navbar & Mobile Menu
   ========================================================================== */
function initNavbarScroll() {
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const links = document.querySelectorAll('.mobile-nav-link');

    if (!btn || !overlay) return;

    const toggleMenu = () => {
        btn.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
    };

    btn.addEventListener('click', toggleMenu);

    links.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
}

/* ==========================================================================
   Scroll Reveal (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add revealed class
                entry.target.classList.add('revealed');

                // If it's the first section reveal, add border flash
                if (entry.target.classList.contains('about-text')) {
                    entry.target.classList.add('border-flash');
                }

                // If it's a timeline, trigger line draw
                if (entry.target.classList.contains('timeline-item')) {
                    const timeline = entry.target.closest('.timeline');
                    if (timeline && !timeline.classList.contains('draw-line')) {
                        timeline.classList.add('draw-line');
                    }
                }

                // Unobserve after reveal
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealItems = document.querySelectorAll('.reveal-item');
    revealItems.forEach(item => {
        revealObserver.observe(item);
    });
}

/* ==========================================================================
   Canvas Particles (Hero Section)
   ========================================================================== */
function initCanvasParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Low density network
    const particleCount = window.innerWidth > 768 ? 60 : 30;
    const connectionDistance = 150;
    const goldColor = 'rgba(201, 168, 76, '; // RGB for var(--clr-accent)

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = goldColor + '0.5)';
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        requestAnimationFrame(animate);

        // Only animate if hero is in viewport (optimization)
        const heroRect = document.getElementById('hero').getBoundingClientRect();
        if (heroRect.bottom < 0) return;

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = goldColor + (opacity * 0.2) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('resize', resize);
    init();
    animate();
}

/* ==========================================================================
   3D Tilt Effect (Projects)
   ========================================================================== */
function initProjectsTilt() {
    const cards = document.querySelectorAll('.project-card[data-tilt]');

    // Only apply on non-touch devices
    if (window.matchMedia("(any-pointer: coarse)").matches) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = `transform 0.5s var(--ease-out-expo)`;
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = `none`; // Remove transition during hover to make it snappy to mouse
            setTimeout(() => {
                card.style.transition = `transform 0.1s linear`;
            }, 50);
        });
    });
}

/* ==========================================================================
   Copy to Clipboard (Contact)
   ========================================================================== */
function initCopyToClipboard() {
    const triggers = document.querySelectorAll('.copy-trigger');
    const toast = document.getElementById('toast');
    let toastTimeout;

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const textToCopy = trigger.getAttribute('data-copy');
            if (!textToCopy) return;

            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show toast
                toast.classList.add('show');

                // Hide after 3 seconds
                clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    });
}

/* ==========================================================================
   Typing Animation (Footer)
   ========================================================================== */
function initTypingFooter() {
    const typingElement = document.getElementById('typing-email');
    if (!typingElement) return;

    const textToType = typingElement.getAttribute('data-text');
    let index = 0;
    let isTyping = false;

    const typeText = () => {
        if (index < textToType.length) {
            typingElement.textContent += textToType.charAt(index);
            index++;
            setTimeout(typeText, 100); // 100ms per character
        }
    };

    // Use Intersection Observer to start typing only when footer is visible
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isTyping) {
            isTyping = true;
            setTimeout(typeText, 500); // Small delay before typing starts
        }
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('.footer'));
}

/* ==========================================================================
   Contact Form Handler
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');
    const submitBtn = form?.querySelector('.submit-btn');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset status
        statusDiv.textContent = '';
        statusDiv.className = 'form-status text-mono';

        // UI Loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        const formData = {
            name: form.name.value,
            email: form.email.value,
            message: form.message.value
        };

        try {
            // Updated to live production endpoint
            const response = await fetch('https://yaratul.com/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                statusDiv.textContent = 'Message sent successfully!';
                statusDiv.classList.add('success');
                form.reset();
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (error) {
            statusDiv.textContent = error.message || 'An error occurred. Please try again.';
            statusDiv.classList.add('error');
        } finally {
            // Reset UI Loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}
