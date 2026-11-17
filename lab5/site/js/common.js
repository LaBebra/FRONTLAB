/* =========================================================
   ЛР5: спільний скрипт для всіх сторінок.
   Записує фактичну висоту шапки у CSS-змінну --header-h,
   щоб відступ під фіксовану / абсолютну шапку був правильним
   на будь-якій ширині екрану (шапка на телефоні вища).
   ========================================================= */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const update = () => {
    document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);
  };
  update();

  if ('ResizeObserver' in window) {
    new ResizeObserver(update).observe(header);
  } else {
    window.addEventListener('resize', update); // старі браузери
  }
});
