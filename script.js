'use strict';

// -----------------------------------------------------------------------------
// Custom Premium Cursor
// -----------------------------------------------------------------------------
class CustomCursor {
    constructor() {
        this.dot = document.querySelector('.cursor-dot');
        this.ring = document.querySelector('.cursor-ring');
        
        // Return if mobile (CSS hides it, but stop JS execution)
        if (!this.dot || !this.ring || window.matchMedia("(max-width: 768px)").matches) return;

        this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.mouse = { x: this.pos.x, y: this.pos.y };
        this.speed = 0.15; // easing

        this.init();
    }

    init() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            // Immediate dot follow
            this.dot.style.transform = `translate(calc(${this.mouse.x}px - 50%), calc(${this.mouse.y}px - 50%))`;
        }, { passive: true });

        // Request animation frame for smooth ring lag
        const render = () => {
            this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
            this.pos.y += (this.mouse.y - this.pos.y) * this.speed;
            
            this.ring.style.transform = `translate(calc(${this.pos.x}px - 50%), calc(${this.pos.y}px - 50%))`;
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }
}

// -----------------------------------------------------------------------------
// Magnetic Elements Effect (Buttons, Icons)
// -----------------------------------------------------------------------------
class MagneticEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-magnetic]');
        if(window.matchMedia("(max-width: 768px)").matches) return;
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = el.getBoundingClientRect();
                const x = (e.clientX - left - width / 2) * 0.3; // Magnet strength
                const y = (e.clientY - top - height / 2) * 0.3;
                
                el.style.transform = `translate(${x}px, ${y}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = `translate(0px, 0px)`;
                // Adding a smooth spring back
                el.style.transition = `transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)`;
                setTimeout(() => el.style.transition = '', 500); // clear to allow hover CSS
            });
        });
    }
}

// -----------------------------------------------------------------------------
// 3D Tilt Effect (Cards, Hero Image)
// -----------------------------------------------------------------------------
class TiltEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-tilt]');
        if(window.matchMedia("(max-width: 768px)").matches) return;
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element
                const y = e.clientY - rect.top;  // y position within the element
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation (max 10 degrees)
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }
}

// -----------------------------------------------------------------------------
// Scroll Reveals & Intersection Observers
// -----------------------------------------------------------------------------
class ScrollEngine {
    constructor() {
        this.reveals = document.querySelectorAll('.scroll-reveal');
        this.header = document.getElementById('header');
        this.backToTop = document.getElementById('rToTop');
        this.init();
    }

    init() {
        // Reveal elements on scroll
        const revealOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            });
        }, revealOptions);

        this.reveals.forEach(el => {
            // Add staggered delays for grid items
            if(el.parentElement.classList.contains('interactive-grid') || el.parentElement.classList.contains('edu-grid')) {
                const index = Array.from(el.parentElement.children).indexOf(el);
                el.style.transitionDelay = `${index * 0.1}s`;
            }
            revealObserver.observe(el);
        });

        // Header & BackToTop logic using optimized scroll event
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Back to top click
        if (this.backToTop) {
            this.backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        if (this.backToTop) {
            if (scrollY > 400) {
                this.backToTop.classList.add('show');
            } else {
                this.backToTop.classList.remove('show');
            }
        }
    }
}

// -----------------------------------------------------------------------------
// Navigation Menu (Mobile)
// -----------------------------------------------------------------------------
class Navigation {
    constructor() {
        this.burger = document.querySelector('.burger');
        this.navul = document.querySelector('.navul');
        this.navLinks = document.querySelectorAll('.navLink');
        this.init();
    }

    init() {
        if (!this.burger || !this.navul) return;

        this.burger.addEventListener('click', () => {
            this.toggleMenu();
        });

        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.navul.classList.contains('active')) {
                    this.toggleMenu();
                }
            });
        });
    }

    toggleMenu() {
        const isExpanded = this.burger.getAttribute('aria-expanded') === 'true';
        this.burger.setAttribute('aria-expanded', !isExpanded);
        this.burger.classList.toggle('toggle');
        this.navul.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    }
}

// -----------------------------------------------------------------------------
// Typed.js Initialization
// -----------------------------------------------------------------------------
const initTypedJS = () => {
    const typedElement = document.querySelector('#element');
    if (typedElement && typeof Typed !== 'undefined') {
        new Typed('#element', {
            strings: [
                'Computer Science Graduate.',
                'Full Stack Web Developer.',
                'Web Designer.',
                'UI/UX Enthusiast.',
                'SQL Specialist.',
                'Spring Boot Developer.'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: ''
        });
    }
};

// -----------------------------------------------------------------------------
// Application Bootstrap
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
    new MagneticEffect();
    new TiltEffect();
    new ScrollEngine();
    new Navigation();
    
    // Typed.js slightly delayed to ensure smooth initial load animation
    setTimeout(initTypedJS, 500);
});
