// Animation Functions

class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.isPaused = false;
        this.animationFrames = new Set();
    }

    // Initialize intersection observer for scroll animations
    initScrollAnimations() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    entry.target.classList.add('visible');
                    this.animatedElements.add(entry.target);
                    
                    // Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all elements with animate-on-scroll class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });

        this.observers.set('scroll', observer);
    }

    // Parallax effect for hero background (optimized)
    initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;

        let ticking = false;
        const handleParallax = () => {
            if (this.isPaused || ticking) return;
            
            ticking = true;
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach(element => {
                    const speed = element.dataset.parallax || 0.5;
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });
                ticking = false;
            });
        };

        window.addEventListener('scroll', handleParallax, { passive: true });
    }

    // Stagger animations for elements
    staggerAnimation(selector, delay = 100) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach((element, index) => {
            element.style.animationDelay = `${index * delay}ms`;
            element.classList.add('fade-in');
        });
    }

    // Counter animation for statistics (with pause support)
    animateCounter(element, start, end, duration) {
        const range = end - start;
        const startTime = performance.now();
        let animationId;
        
        const updateCounter = (currentTime) => {
            if (this.isPaused) {
                animationId = requestAnimationFrame(updateCounter);
                return;
            }
            
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Easing function (easeOutQuart)
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(start + (range * easeProgress));
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                animationId = requestAnimationFrame(updateCounter);
                this.animationFrames.add(animationId);
            } else {
                this.animationFrames.delete(animationId);
            }
        };
        
        animationId = requestAnimationFrame(updateCounter);
        this.animationFrames.add(animationId);
    }

    // Typewriter effect
    typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }

    // Magnetic button effect
    initMagneticButtons() {
        const magneticButtons = document.querySelectorAll('[data-magnetic]');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Smooth reveal animation
    revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');
        
        reveals.forEach((reveal, index) => {
            const windowHeight = window.innerHeight;
            const elementTop = reveal.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
                reveal.style.transitionDelay = `${index * 0.1}s`;
            }
        });
    }

    // Pause animations for performance
    pause() {
        this.isPaused = true;
    }
    
    // Resume animations
    resume() {
        this.isPaused = false;
    }
    
    // Clean up observers and animations
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animatedElements.clear();
        
        // Cancel all running animation frames
        this.animationFrames.forEach(id => cancelAnimationFrame(id));
        this.animationFrames.clear();
    }
}

// Initialize animation controller
const animationController = new AnimationController();