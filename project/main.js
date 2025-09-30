
(function () {
  'use strict';

 
  const revealTargets = [
    '.hero-left',
    '.hero-right',
    '.section .text-content',
    '.section .image-content',
    '.card',
    '.gallery-item',
    '.mythology-item'
  ];

  revealTargets.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      el.classList.add('reveal');
    });
  });


  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
         
          const delay = entry.target.matches('.card, .gallery-item, .mythology-item') 
            ? index * 100 
            : 0;
          
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.15 }
  );

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

 
  const mythologyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          mythologyObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
  );

 
  document.querySelectorAll('.mythology-section').forEach((el) => mythologyObserver.observe(el));
  document.querySelectorAll('.mythology-image-left').forEach((el) => mythologyObserver.observe(el));
  document.querySelectorAll('.mythology-image-right').forEach((el) => mythologyObserver.observe(el));
  document.querySelectorAll('.mythology-text-content').forEach((el) => mythologyObserver.observe(el));


  const venus = document.querySelector('.venus-hero');
  if (venus && window.innerWidth > 768) {
    const strength = 8;
    const scale = 1.02;
    const baseTranslate = 'translateX(15%)';
    let rafId = null;

    const onMove = (e) => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        const rect = venus.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        const rx = (dy * strength).toFixed(2);
        const ry = (-dx * strength).toFixed(2);
        
        venus.style.transform = `${baseTranslate} rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
        venus.style.transition = 'transform 0.2s ease-out';
        
        rafId = null;
      });
    };

    const onLeave = () => {
      venus.style.transform = `${baseTranslate}`;
      venus.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave, { passive: true });
  }

  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });


  let lastScroll = 0;
  const nav = document.querySelector('nav');
  
  const handleScroll = () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      nav.style.background = 'rgba(13, 5, 32, 0.98)';
      nav.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.6)';
    } else {
      nav.style.background = 'rgba(13, 5, 32, 0.95)';
      nav.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
    }
    
    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  const criticalImages = document.querySelectorAll('.venus-hero, .solarsystem-img');
  criticalImages.forEach(img => {
    if (img.loading !== 'eager') {
      img.loading = 'eager';
    }
  });


  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
    document.querySelectorAll('[style*="animation"]').forEach(el => {
      el.style.animation = 'none';
    });
  }


  const modal = document.getElementById('galleryModal');
  if (modal) {
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalClose = document.querySelector('.modal-close');


    const galleryData = {
      venus: { img: 'images/venus.svg', title: 'ВЕНЕРА' },
      solarsystem: { img: 'images/solarsystem.svg', title: 'СОНЯЧНА СИСТЕМА' },
      orbit: { img: 'images/orbita.svg', title: 'ОРБІТА' },
      surface: { img: 'images/Пейзажик.svg', title: 'ПОВЕРХНЯ' },
      lava: { img: 'images/Лава.svg', title: 'ЛАВОВІ ПОТОКИ' },
      structure: { img: 'images/sklad.svg', title: 'БУДОВА' },
      venera13: { img: 'images/Станція венера 13.svg', title: 'ВЕНЕРА-13' },
      orbital: { img: 'images/Супутник.svg', title: 'ОРБІТАЛЬНІ МІСІЇ' },
      telescope: { img: 'images/Телескоп.svg', title: 'СПОСТЕРЕЖЕННЯ' },
      rocket: { img: 'images/Ракета.svg', title: 'ЗАПУСКИ' },
      celestial: { img: 'images/Комета.svg', title: 'НЕБЕСНІ ОБ\'ЄКТИ' }
    };


    document.querySelectorAll('.gallery-card').forEach(card => {
      card.addEventListener('click', function() {
        const modalId = this.getAttribute('data-modal');
        const data = galleryData[modalId];
        const contentEl = document.getElementById(`content-${modalId}`);

        if (data && contentEl) {
          modalImage.src = data.img;
          modalImage.alt = data.title;
          modalTitle.textContent = data.title;
          modalDescription.innerHTML = contentEl.innerHTML;
          modal.style.display = 'block';
          document.body.style.overflow = 'hidden';
        }
      });
    });

   
    const closeModal = () => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    };

    modalClose.addEventListener('click', closeModal);

    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
      }
    });
  }
})();
