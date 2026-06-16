document.addEventListener('DOMContentLoaded', function () {
    gsap.registerPlugin(ScrollTrigger);

    const cursor = document.getElementById('custom-cursor');
    const themeToggle = document.getElementById('theme-toggle');
    const emailContainer = document.getElementById('email-icon-container'); // Get the email container
    const body = document.body;
    const header = document.getElementById('main-header');
    const heroSection = document.querySelector('.hero-section');

    // --- NEW: MOBILE MENU ELEMENTS ---
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileNavLinks = mobileNav.querySelectorAll('a');

    // --- NEW: MOBILE MENU LOGIC ---
    // Open menu
    hamburgerMenu.addEventListener('click', () => {
        mobileNav.classList.add('is-active');
    });

    // Close menu
    closeMenuBtn.addEventListener('click', () => {
        mobileNav.classList.remove('is-active');
    });

    // Close menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('is-active');
        });
    });

    // --- THEME SWITCHER ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // --- EMAIL ICON ANIMATION ---
    emailContainer.addEventListener('click', () => {
        emailContainer.classList.toggle('expanded');
    });

    // --- CUSTOM CURSOR ---
    document.addEventListener('mousemove', e => {
        gsap.to(cursor, {
            duration: 0.2,
            x: e.clientX,
            y: e.clientY,
        });
    });

    // --- GSAP ANIMATIONS ---
    gsap.from('.highlight::after', {
        width: '0%',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.main-headline',
            start: 'top 80%',
        }
    });

    gsap.from('.main-headline span', {
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // --- NEW: STICKY HEADER SCROLL EFFECT ---
    function handleScroll() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Add the scroll event listener
    window.addEventListener('scroll', handleScroll);




    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        // Create a timeline for a controlled animation sequence
        const aboutTl = gsap.timeline({
            scrollTrigger: {
                trigger: aboutSection,
                start: 'top 70%',
            }
        });

        aboutTl.from(aboutSection.querySelector('.section-title'), { opacity: 0, y: 30, duration: 0.6 })
            .from(aboutSection.querySelectorAll('.about-text p'), { opacity: 0, y: 20, stagger: 0.2, duration: 0.6 }, "-=0.3");
        // .from(aboutSection.querySelector('.resume-button'), { opacity: 0, y: 30, duration: 0.6 }, "-=0.5");
    }

    // --- EXPERIENCE SECTION TAB LOGIC (WITH GSAP ANIMATION) ---
    const tabs = document.querySelectorAll('.tab-btn');
    const contentContainer = document.querySelector('.experience-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();

            // Do nothing if the clicked tab is already active
            if (tab.classList.contains('active')) {
                return;
            }

            const targetId = tab.dataset.tab;
            const targetPanel = document.getElementById(targetId);
            const activePanel = contentContainer.querySelector('.content-panel.active');

            // Fade out the currently active panel
            gsap.to(activePanel, {
                duration: 0.25,
                opacity: 0,
                y: -10,
                onComplete: () => {
                    // Once faded out, remove active classes
                    activePanel.classList.remove('active');
                    document.querySelector('.tab-btn.active').classList.remove('active');
                    
                    // Add active classes to the new tab and panel
                    tab.classList.add('active');
                    targetPanel.classList.add('active');

                    // Fade in the new panel
                    gsap.fromTo(targetPanel, 
                        { opacity: 0, y: 10 }, 
                        { duration: 0.25, opacity: 1, y: 0 }
                    );
                }
            });
        });
    });

    // --- EXPERIENCE SECTION GSAP ANIMATION (Scroll-in) ---
    const experienceSection = document.querySelector('.experience-section');
    if (experienceSection) {
        const experienceTl = gsap.timeline({
            scrollTrigger: {
                trigger: experienceSection,
                start: 'top 70%',
            }
        });

        experienceTl.from(experienceSection.querySelector('.section-title'), { opacity: 0, y: 30, duration: 0.6 })
            .from(experienceSection.querySelector('.experience-card'), { opacity: 0, y: 40, duration: 0.6 }, "-=0.3");
    }

    // --- SKILLS SECTION ANIMATION ---
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        gsap.registerPlugin(ScrollTrigger); // Ensure plugin is registered
        
        const skillsTl = gsap.timeline({
            scrollTrigger: {
                trigger: skillsSection,
                start: 'top 90%', // Triggers earlier (when section is just entering)
                toggleActions: "play none none none" // Plays once and stays there
            }
        });

        skillsTl.from(skillsSection.querySelectorAll('.skill-card'), { 
            opacity: 0, 
            y: 50, 
            stagger: 0.1, 
            duration: 0.5,
            clearProps: "all" // CRITICAL: This ensures they don't get stuck hidden
        });
    }

    // --- NAVBAR ACTIVE STATE LOGIC ---
    const sections = document.querySelectorAll('main[id], section[id]');
    const navLinksDesktop = document.querySelectorAll('.desktop-nav a');
    const navLinksMobile = document.querySelectorAll('.mobile-nav a');

    function updateNavActiveState() {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Add an offset so it activates when section is roughly in the middle of viewport
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        // Update Desktop Nav
        navLinksDesktop.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Update Mobile Nav
        navLinksMobile.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateNavActiveState);
    updateNavActiveState(); // Initial call

    // --- PROJECT FILTERING LOGIC ---
    const projectTabBtns = document.querySelectorAll('.project-tab-btn');
    const projectItems = document.querySelectorAll('.project-item');

    projectTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            projectTabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || filter === category) {
                    item.style.display = 'flex'; // Our cards use display: flex
                    gsap.fromTo(item, { opacity: 0, scale: 0.95 }, { duration: 0.3, opacity: 1, scale: 1, ease: 'power2.out' });
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // --- SKILLS TAB LOGIC ---
    const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
    const skillPanels = document.querySelectorAll('.skill-panel');

    skillTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all skill tabs
            skillTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetId = btn.getAttribute('data-filter');

            skillPanels.forEach(panel => {
                if (panel.id === targetId) {
                    panel.style.display = 'block';
                    gsap.fromTo(panel, { opacity: 0, y: 10 }, { duration: 0.4, opacity: 1, y: 0, ease: 'power2.out' });
                } else {
                    panel.style.display = 'none';
                }
            });
        });
    });

    // --- SCROLL ANIMATIONS FOR CARDS ---
    const cards = document.querySelectorAll('.project-card, .education-card, .publication-section .experience-card, .contact-section .experience-card');
    
    cards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 95%', // trigger slightly later so it definitely fires on mobile
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power3.out',
            clearProps: 'all' // prevents it from getting stuck hidden
        });
    });

});
