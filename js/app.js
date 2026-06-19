// DGHM Main Application
(function() {
  'use strict';

  // 初始化應用程式
  function init() {
    console.log('DGHM Application Initialized');
    
    // 初始化手機選單
    initMobileMenu();
  }

  // 初始化手機選單功能
  function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const header = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !header) return;

    // 切換選單
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isOpen = header.classList.contains('menu-open');
      
      if (isOpen) {
        header.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      } else {
        header.classList.add('menu-open');
        menuToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // 點擊選單連結時關閉選單
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 480) {
          header.classList.remove('menu-open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // 點擊外部區域時關閉選單
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 480) {
        const isClickInsideNav = e.target.closest('.main-nav');
        const isClickOnToggle = e.target.closest('.mobile-menu-toggle');
        
        if (!isClickInsideNav && !isClickOnToggle && header.classList.contains('menu-open')) {
          header.classList.remove('menu-open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // 視窗大小改變時重置選單狀態
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (window.innerWidth > 480) {
          header.classList.remove('menu-open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      }, 250);
    });
  }

  // DOM 載入完成後初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

