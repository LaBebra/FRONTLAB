/* =========================================================
   ЛР4, сторінка «Каталог сервісів»
   2) меню з випадаючими підменю підсервісів (за кліком);
   3) ілюстративне фото при наведенні мишки стає фліп-картою.
   ========================================================= */
'use strict';

/* Структура меню: розділ -> сервіс (картка) -> підсервіси */
const MENU = [
  {
    title: 'Жіночий одяг',
    services: [
      { card: 1, name: 'Пошиття сукні', subs: ['Повсякденна сукня', 'Ділова сукня', 'Вечірня сукня'] },
      { card: 2, name: 'Весільна сукня', subs: ['Сукня з корсетом', 'Сукня зі шлейфом', 'Фата та болеро'] },
      { card: 6, name: 'Вишиванка', subs: ['Машинна вишивка', 'Ручна вишивка'] },
    ],
  },
  {
    title: 'Чоловічий одяг',
    services: [
      { card: 3, name: 'Класичний костюм', subs: ['Костюм-двійка', 'Костюм-трійка', 'Жилет'] },
      { card: 4, name: 'Сорочка на замовлення', subs: ['Класична сорочка', 'Сорочка з монограмою'] },
    ],
  },
  {
    title: 'Верхній та дитячий одяг',
    services: [
      { card: 5, name: 'Пальто', subs: ['Демісезонне пальто', 'Зимове пальто з утеплювачем'] },
      { card: 7, name: 'Шкільна форма', subs: ['Форма для хлопчиків', 'Форма для дівчаток'] },
    ],
  },
  {
    title: 'Дім та ремонт',
    services: [
      { card: 8, name: 'Пошиття штор', subs: ['Штори та тюль', 'Ламбрекени', 'Покривала'] },
      { card: 9, name: 'Ремонт та підгонка', subs: ['Підшивання', 'Заміна блискавки', 'Вшивання по фігурі'] },
    ],
  },
];

/* Зворотна сторона фліп-карт: умови та догляд за виробом */
const CARE = {
  1: { title: 'Догляд за шовком', items: ['Делікатне ручне прання при 30 °C', 'Не викручувати, сушити в розправленому вигляді', 'Прасувати з виворіту через тканину'] },
  2: { title: 'Умови пошиття', items: ['Передоплата 50 %', 'Перша примірка через 10 днів', 'Лише хімчистка, прасування парою'] },
  3: { title: 'Догляд за вовною', items: ['Тільки хімічна чистка', 'Зберігати на плічках у чохлі', 'Відпарювати, а не прасувати'] },
  4: { title: 'Догляд за бавовною', items: ['Прання при 40 °C', 'Не використовувати відбілювач', 'Прасувати вологою'] },
  5: { title: 'Догляд за кашеміром', items: ['Хімчистка 1 раз на сезон', 'Чистити щіткою по ворсу', 'Сушити горизонтально'] },
  6: { title: 'Догляд за льоном', items: ['Прання при 30-40 °C, вишивкою всередину', 'Не замочувати з кольоровими речами', 'Прасувати вологою з виворіту'] },
  7: { title: 'Умови пошиття', items: ['Знижка 10 % при замовленні 2 комплектів', 'Тканина стійка до зминання', 'Прання при 40 °C'] },
  8: { title: 'Умови замовлення', items: ['Безкоштовний замір вдома', 'Блекаут: прання при 30 °C', 'Вуаль: делікатний режим без віджиму'] },
  9: { title: 'Умови ремонту', items: ['Виріб має бути чистим', 'Термін 1-2 дні', 'Гарантія на шви 6 місяців'] },
};

document.addEventListener('DOMContentLoaded', () => {
  buildDropdownMenu();
  buildFlipCards();
});

/* ---------- 2. Випадаюче підменю ---------- */
function buildDropdownMenu() {
  const nav = document.getElementById('catalog-menu');
  const list = document.createElement('ul');

  MENU.forEach((section, index) => {
    const item = document.createElement('li');
    item.className = 'menu-item';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'menu-trigger';
    trigger.textContent = section.title;
    trigger.id = `menu-trigger-${index}`;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', `submenu-${index}`);

    const sub = document.createElement('ul');
    sub.className = 'submenu';
    sub.id = `submenu-${index}`;
    sub.innerHTML = section.services.map(s => `
      <li class="sub-group">${s.name}</li>
      ${s.subs.map(name => `<li><a href="#service-${s.card}" data-card="${s.card}">${name}</a></li>`).join('')}
    `).join('');

    item.append(trigger, sub);
    list.append(item);
  });
  nav.append(list);

  const closeAll = except => {
    nav.querySelectorAll('.menu-item.open').forEach(el => {
      if (el === except) return;
      el.classList.remove('open');
      el.querySelector('.menu-trigger').setAttribute('aria-expanded', 'false');
    });
  };

  // клік по тексту меню відкриває / закриває підменю
  nav.addEventListener('click', event => {
    const trigger = event.target.closest('.menu-trigger');
    if (trigger) {
      const item = trigger.parentElement;
      closeAll(item);
      const open = item.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(open));
      return;
    }
    const link = event.target.closest('.submenu a');
    if (link) {
      event.preventDefault();
      closeAll();
      const card = document.getElementById(`service-${link.dataset.card}`);
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.remove('highlight');
      void card.offsetWidth; // перезапуск анімації
      card.classList.add('highlight');
    }
  });

  // клік поза меню або клавіша Escape закривають підменю
  document.addEventListener('click', event => {
    if (!nav.contains(event.target)) closeAll();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeAll();
  });
}

/* ---------- 3. Фліп-карти ---------- */
function buildFlipCards() {
  document.querySelectorAll('.service-card').forEach(card => {
    const id = Number(card.id.replace('service-', ''));
    const img = card.querySelector('img');
    const care = CARE[id];
    if (!img || !care) return;

    const flip = document.createElement('div');
    flip.className = 'flip';
    flip.innerHTML = `
      <div class="flip-inner">
        <div class="flip-front"></div>
        <div class="flip-back">
          <h4>${care.title}</h4>
          <ul>${care.items.map(text => `<li>${text}</li>`).join('')}</ul>
        </div>
      </div>`;
    img.replaceWith(flip);
    flip.querySelector('.flip-front').append(img);

    flip.addEventListener('mouseenter', () => flip.classList.add('flipped'));
    flip.addEventListener('mouseleave', () => flip.classList.remove('flipped'));
  });
}
