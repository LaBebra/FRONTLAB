/* ==========================================================
   ЛР3, Завдання 1 (варіант 9) — сервіси ательє
   Підхід: масиви, методи масивів та функції
   ========================================================== */
'use strict';

/** Початкові 10 записів про сервіси.
 *  duration — тривалість надання сервісу у днях. */
const SERVICES = [
  { id: 101, name: 'Пошиття сукні',         type: 'Пошиття',     readsDay1: 120, readsDay2: 135, duration: 7,  price: 2800 },
  { id: 102, name: 'Весільна сукня',        type: 'Пошиття',     readsDay1: 210, readsDay2: 260, duration: 30, price: 15000 },
  { id: 103, name: 'Класичний костюм',      type: 'Пошиття',     readsDay1: 95,  readsDay2: 110, duration: 21, price: 9500 },
  { id: 104, name: 'Сорочка на замовлення', type: 'Пошиття',     readsDay1: 80,  readsDay2: 72,  duration: 5,  price: 1400 },
  { id: 105, name: 'Пальто',                type: 'Пошиття',     readsDay1: 66,  readsDay2: 90,  duration: 21, price: 8000 },
  { id: 106, name: 'Заміна блискавки',      type: 'Ремонт',      readsDay1: 150, readsDay2: 140, duration: 1,  price: 250 },
  { id: 107, name: 'Підшивання брюк',       type: 'Ремонт',      readsDay1: 175, readsDay2: 160, duration: 1,  price: 150 },
  { id: 108, name: 'Латки та штопка',       type: 'Ремонт',      readsDay1: 40,  readsDay2: 55,  duration: 2,  price: 300 },
  { id: 109, name: 'Перешивання за фігурою', type: 'Перешивання', readsDay1: 88,  readsDay2: 97,  duration: 5,  price: 900 },
  { id: 110, name: 'Вишиванка',             type: 'Вишивка',     readsDay1: 130, readsDay2: 180, duration: 14, price: 3500 },
];

const FIELDS = ['id', 'name', 'type', 'readsDay1', 'readsDay2', 'duration', 'price'];

/** Глибока копія масиву записів (щоб функції не змінювали вхідні дані). */
const cloneList = list => list.map(s => ({ ...s }));

/* ---------- 1.1 Впорядкування назв за тривалістю + середня кількість читачів ---------- */
/**
 * Повертає:
 *  sortedNames — назви сервісів, впорядковані за зростанням тривалості;
 *  groups      — для кожної тривалості: перелік сервісів і середня кількість
 *                користувачів (усереднення і по двох добах, і по кількості сервісів).
 */
function sortByDurationWithAvgReaders(list) {
  const sorted = cloneList(list).sort((a, b) => a.duration - b.duration || a.name.localeCompare(b.name, 'uk'));
  const sortedNames = sorted.map(s => `${s.name} (${s.duration} дн.)`);

  const byDuration = sorted.reduce((acc, s) => {
    (acc[s.duration] ||= []).push(s);
    return acc;
  }, {});

  const groups = Object.entries(byDuration).map(([duration, items]) => {
    const sum = items.reduce((total, s) => total + (s.readsDay1 + s.readsDay2) / 2, 0);
    return {
      duration: Number(duration),
      services: items.map(s => s.name),
      avgReaders: Math.round((sum / items.length) * 100) / 100,
    };
  });

  return { sortedNames, groups };
}

/* ---------- 1.2 Сервіс із максимальною кількістю читачів за добу_2 ---------- */
function findMaxReadsDay2(list) {
  if (!list.length) return null;
  const best = list.reduce((max, s) => (s.readsDay2 > max.readsDay2 ? s : max));
  return { name: best.name, type: best.type, readsDay2: best.readsDay2 };
}

/* ---------- 1.3 Додавання нового запису ---------- */
/** Перевірка, чи заповнені всі поля запису. */
function isComplete(record) {
  return FIELDS.every(f => record[f] !== undefined && record[f] !== null && record[f] !== '');
}

/**
 * Якщо в записі бракує хоч якоїсь інформації — додаємо в кінець списку;
 * якщо вся інформація є — список впорядковується за зростанням вартості
 * і запис вставляється на своє місце.
 */
function addService(list, record) {
  const result = cloneList(list);
  if (!isComplete(record)) {
    result.push({ ...record });
    return { list: result, position: result.length - 1, mode: 'в кінець (неповні дані)' };
  }
  result.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  let index = result.findIndex(s => s.price > record.price);
  if (index === -1) index = result.length;
  result.splice(index, 0, { ...record });
  return { list: result, position: index, mode: 'за зростанням вартості' };
}

/* ---------- 1.4 Тривалість надання декількох сервісів одночасно за типом ---------- */
/**
 * 1 сервіс       — тривалість як вказано;
 * 2–3 сервіси    — тривалість кожного × 1,1;
 * більше 3       — тривалість кожного × 2.
 */
function durationByType(list, type) {
  const items = list.filter(s => s.type === type);
  const count = items.length;
  let factor;
  if (count === 0) factor = 0;
  else if (count === 1) factor = 1;
  else if (count <= 3) factor = 1.1;
  else factor = 2;

  const services = items.map(s => ({
    name: s.name,
    base: s.duration,
    adjusted: Math.round(s.duration * factor * 100) / 100,
  }));
  const total = Math.round(services.reduce((t, s) => t + s.adjusted, 0) * 100) / 100;
  return { type, count, factor, services, total };
}

/** Список унікальних типів сервісів. */
const getTypes = list => [...new Set(list.map(s => s.type))];

if (typeof module !== 'undefined') {
  module.exports = { SERVICES, sortByDurationWithAvgReaders, findMaxReadsDay2, isComplete, addService, durationByType, getTypes };
}
