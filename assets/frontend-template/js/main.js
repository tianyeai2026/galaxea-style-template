/* ============================================
   Galaxea 风格模板 - 交互脚本
   包含：导航滚动变色、汉堡菜单动画、全屏滚动、
        右侧导航点、滚动进入动画、社交栏
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ========== 导航栏滚动效果 ==========
  const navbar = document.getElementById('navbar');

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ========== 汉堡菜单（含横线动画） ==========
  const hamburger = document.getElementById('hamburger');
  const fullscreenMenu = document.getElementById('fullscreenMenu');
  const menuClose = document.getElementById('menuClose');
  const menuLinks = document.querySelectorAll('.menu-link');

  function openMenu() {
    fullscreenMenu.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    fullscreenMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (fullscreenMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuClose.addEventListener('click', closeMenu);
  menuLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && fullscreenMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // ========== 首页全屏滚动 Swiper ==========
  let homeSwiper = null;

  if (window.Swiper) {
    homeSwiper = new Swiper('.home-swiper', {
      direction: 'vertical',
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 800,
      mousewheel: {
        thresholdDelta: 30,
        sensitivity: 1,
      },
      keyboard: {
        enabled: true,
      },
      pagination: {
        el: '.home-pagination',
        clickable: true,
        renderBullet: function (index, className) {
          const num = String(index + 1).padStart(2, '0');
          return '<span class="' + className + '">' + num + '</span>';
        },
      },
      on: {
        slideChange: function () {
          handleScroll();
          updateSideDots(this.activeIndex);
        },
      },
    });
  }

  // ========== 右侧导航点 ==========
  const sideDots = document.querySelectorAll('.side-dot');

  function updateSideDots(activeIndex) {
    sideDots.forEach(function (dot, i) {
      if (i === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  sideDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      const index = parseInt(this.getAttribute('data-index'), 10);
      if (homeSwiper) {
        homeSwiper.slideTo(index);
      }
    });
  });

  // ========== 触摸滑动支持（全屏滚动） ==========
  let touchStartY = 0;
  let touchEndY = 0;
  const touchThreshold = 50;

  const swiperContainer = document.querySelector('.home-swiper');

  if (swiperContainer) {
    swiperContainer.addEventListener('touchstart', function (e) {
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    swiperContainer.addEventListener('touchend', function (e) {
      touchEndY = e.changedTouches[0].screenY;
      const diff = touchStartY - touchEndY;

      if (Math.abs(diff) > touchThreshold && homeSwiper) {
        if (diff > 0) {
          homeSwiper.slideNext();
        } else {
          homeSwiper.slidePrev();
        }
      }
    }, { passive: true });
  }

  // ========== 滚动进入动画（IntersectionObserver） ==========
  const animateElements = document.querySelectorAll('.feature-card, .news-card, .scene-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });

    animateElements.forEach(function (el, index) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease ' + (index % 3) * 0.1 + 's, transform 0.6s ease ' + (index % 3) * 0.1 + 's';
      observer.observe(el);
    });
  }

  // ========== 社交图标悬停（预留二维码弹窗） ==========
  const socialItems = document.querySelectorAll('.social-item');
  socialItems.forEach(function (item) {
    item.addEventListener('click', function () {
      // 预留：可替换为弹出二维码、跳转链接等
      console.log('Social icon clicked:', item.title);
    });
  });

  // ========== 导航链接高亮（根据当前滚动位置） ==========
  const navLinks = document.querySelectorAll('.nav-link');
  // 简单示例：点击时切换 active
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      this.classList.add('active');
    });
  });

});
