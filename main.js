document.addEventListener('DOMContentLoaded', () => {
  // Header scroll effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Navigation menu toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    document.addEventListener('click', (event) => {
      if (navMenu.classList.contains('open') &&
          !navMenu.contains(event.target) &&
          !navToggle.contains(event.target)) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Setup scroll animations for elements within sections (WITH REPLAY)
  setupInternalElementAnimations();

  // Animate skill progress bars on scroll (still plays ONCE)
  animateSkillProgressBarsOnScroll();

  // Highlight active navigation link on scroll
  highlightActiveNavLink();
});


function setupInternalElementAnimations() {
  const elementsToAnimate = document.querySelectorAll('.hidden-on-load');

  if (elementsToAnimate.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -60px 0px"
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }, observerOptions);

  elementsToAnimate.forEach(el => {
    observer.observe(el);
  });
}

function animateSkillProgressBarsOnScroll() {
  const progressFills = document.querySelectorAll('.skills-expertise .progress-fill');

  if (progressFills.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.3,
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fillElement = entry.target;
        const targetWidth = fillElement.getAttribute('data-width');
        if (targetWidth) {
          setTimeout(() => {
            fillElement.style.width = targetWidth;
          }, 150);
        }
        observerInstance.unobserve(fillElement); // Skill bars animate once
      }
    });
  }, observerOptions);

  progressFills.forEach(fill => {
    fill.style.width = '0%';
    observer.observe(fill);
  });
}

function highlightActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 70;

  if (sections.length === 0 || navLinks.length === 0) return;

  let currentSectionId = '';

  const updateActiveLink = () => {
    let foundSection = false;
    let scrollPosition = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - Math.min(100, window.innerHeight * 0.2);
      const sectionBottom = sectionTop + section.offsetHeight + Math.min(100, window.innerHeight * 0.2);

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSectionId = section.getAttribute('id');
        foundSection = true;
      }
    });
    
    if (scrollPosition < sections[0].offsetTop - headerHeight - 50) {
        currentSectionId = sections[0].getAttribute('id');
    }
    else if ((window.innerHeight + scrollPosition) >= document.body.offsetHeight - 20) {
        currentSectionId = sections[sections.length - 1].getAttribute('id');
    }

    navLinks.forEach(link => {
      link.classList.remove('active-link');
      const linkHref = link.getAttribute('href');
      if (linkHref && linkHref.substring(1) === currentSectionId) {
        link.classList.add('active-link');
      }
    });
  };
  
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveLink, 50);
  });

  updateActiveLink();
}