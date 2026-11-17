/* =========================================================
   ЛР4, Головна сторінка
   1) предмети ательє періодично з'являються та зникають
      у різних місцях на фоні шапки;
   5) розташування навігаційного меню залежить від ширини екрану.
   ========================================================= */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initHeaderDecor();
  initResponsiveNav();
});

/* ---------- 1. Предмети на фоні шапки ---------- */
const DECOR_ITEMS = ['scissors', 'spool', 'needle', 'button', 'thimble', 'tape'];
const DECOR_MAX = 5;        // максимальна кількість предметів одночасно
const DECOR_INTERVAL = 900; // як часто з'являється новий предмет, мс
const DECOR_LIFETIME = 2600; // скільки предмет залишається видимим, мс

/** Висота великої літери (cap height) шрифту заголовка, px. */
function getCapHeight(element) {
  const style = getComputedStyle(element);
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const metrics = ctx.measureText('Г');
  return metrics.actualBoundingBoxAscent || parseFloat(style.fontSize) * 0.7;
}

function initHeaderDecor() {
  const header = document.querySelector('.site-header');
  const title = header.querySelector('h1');

  const decor = document.createElement('div');
  decor.className = 'header-decor';
  decor.setAttribute('aria-hidden', 'true');
  header.prepend(decor);

  let itemHeight = 0;
  const updateSize = () => {
    // висота предмета перевищує подвоєну висоту великої літери назви
    itemHeight = Math.ceil(getCapHeight(title) * 2 * 1.25);
    header.dataset.capHeight = getCapHeight(title).toFixed(1);
    header.dataset.itemHeight = itemHeight;
  };
  // розмір рахуємо після завантаження веб-шрифтів
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(updateSize);
  updateSize();
  window.addEventListener('resize', updateSize);

  const spawn = () => {
    if (decor.children.length >= DECOR_MAX || document.hidden) return;
    const name = DECOR_ITEMS[Math.floor(Math.random() * DECOR_ITEMS.length)];
    const img = document.createElement('img');
    img.src = `images/items/${name}.svg`;
    img.alt = '';
    img.className = 'decor-item';
    img.style.height = `${itemHeight}px`;

    const maxX = Math.max(0, header.clientWidth - itemHeight);
    const maxY = Math.max(0, header.clientHeight - itemHeight);
    img.style.left = `${Math.random() * maxX}px`;
    img.style.top = `${Math.random() * maxY}px`;
    img.style.transform = `rotate(${Math.round(Math.random() * 60 - 30)}deg)`;

    decor.append(img);
    requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add('visible')));
    setTimeout(() => {
      img.classList.remove('visible');
      img.addEventListener('transitionend', () => img.remove(), { once: true });
    }, DECOR_LIFETIME);
  };

  spawn();
  setInterval(spawn, DECOR_INTERVAL);
}

/* ---------- 5. Навігаційне меню: горизонтально зверху або вертикально праворуч ---------- */
function initResponsiveNav() {
  const nav = document.querySelector('.main-nav');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-toggle';
  toggle.textContent = '☰ Меню';
  toggle.setAttribute('aria-expanded', 'false');
  nav.prepend(toggle);

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // ширина екрану пристрою не більше 768 px
  const query = window.matchMedia('(max-width: 768px)');
  const apply = () => {
    document.body.classList.toggle('nav-vertical', query.matches);
    if (!query.matches) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  };
  apply();
  query.addEventListener('change', apply);
}
