/* ==========================================================
   ЛР3 — тестування програмно реалізованих завдань.
   Запуск у Node.js:  node js/tests.js
   У браузері результати виводяться на сторінку index.html.
   ========================================================== */
'use strict';

function runAllTests() {
  const isNode = typeof window === 'undefined';
  // У браузері const/class з інших скриптів не є властивостями window,
  // тому збираємо їх в об’єкти явно.
  const S = isNode ? require('./services.js')
    : { SERVICES, sortByDurationWithAvgReaders, findMaxReadsDay2, addService, durationByType };
  const U = isNode ? require('./users.js')
    : { PURPOSE, Person, User, UserRegistry, createDemoRegistry };
  const results = [];

  const test = (name, fn) => {
    try { fn(); results.push({ name, ok: true }); }
    catch (e) { results.push({ name, ok: false, error: e.message }); }
  };
  const eq = (actual, expected, msg = '') => {
    const a = JSON.stringify(actual), b = JSON.stringify(expected);
    if (a !== b) throw new Error(`${msg} очікувалось ${b}, отримано ${a}`);
  };

  /* ---------- Завдання 1 ---------- */
  test('1.1 Назви впорядковані за зростанням тривалості', () => {
    const { sortedNames } = S.sortByDurationWithAvgReaders(S.SERVICES);
    const durations = sortedNames.map(n => Number(n.match(/\((\d+) дн\.\)/)[1]));
    eq(durations, [...durations].sort((a, b) => a - b));
    eq(sortedNames.length, 10);
  });
  test('1.1 Середня кількість читачів для тривалості 21 день = 90.25', () => {
    // Костюм (95+110)/2 = 102.5; Пальто (66+90)/2 = 78; середнє = 90.25
    const g = S.sortByDurationWithAvgReaders(S.SERVICES).groups.find(x => x.duration === 21);
    eq(g.avgReaders, 90.25);
    eq(g.services.length, 2);
  });
  test('1.1 Вхідний масив не змінюється', () => {
    const before = JSON.stringify(S.SERVICES);
    S.sortByDurationWithAvgReaders(S.SERVICES);
    eq(JSON.stringify(S.SERVICES), before);
  });
  test('1.2 Максимум читачів за добу_2 — «Весільна сукня», тип «Пошиття»', () => {
    eq(S.findMaxReadsDay2(S.SERVICES), { name: 'Весільна сукня', type: 'Пошиття', readsDay2: 260 });
  });
  test('1.2 Порожній список → null', () => eq(S.findMaxReadsDay2([]), null));
  test('1.3 Неповний запис додається в кінець', () => {
    const r = S.addService(S.SERVICES, { id: 111, name: 'Пошиття штор', type: 'Пошиття', price: 600 });
    eq(r.list.length, 11);
    eq(r.list[10].id, 111);
  });
  test('1.3 Повний запис вставляється за зростанням вартості', () => {
    const rec = { id: 112, name: 'Ремонт куртки', type: 'Ремонт', readsDay1: 30, readsDay2: 41, duration: 3, price: 1000 };
    const r = S.addService(S.SERVICES, rec);
    const prices = r.list.map(s => s.price);
    eq(prices, [...prices].sort((a, b) => a - b));
    eq(r.list[r.position].id, 112);
  });
  test('1.3 Повний запис з найбільшою ціною — останній', () => {
    const rec = { id: 113, name: 'Вечірня сукня', type: 'Пошиття', readsDay1: 1, readsDay2: 1, duration: 20, price: 50000 };
    const r = S.addService(S.SERVICES, rec);
    eq(r.position, 10);
  });
  test('1.4 Один сервіс типу «Вишивка» → тривалість без змін (14)', () => {
    const r = S.durationByType(S.SERVICES, 'Вишивка');
    eq([r.count, r.factor, r.total], [1, 1, 14]);
  });
  test('1.4 Три сервіси «Ремонт» → ×1,1 (1.1 + 1.1 + 2.2 = 4.4)', () => {
    const r = S.durationByType(S.SERVICES, 'Ремонт');
    eq([r.count, r.factor, r.total], [3, 1.1, 4.4]);
  });
  test('1.4 П’ять сервісів «Пошиття» → ×2 (84 × 2 = 168)', () => {
    const r = S.durationByType(S.SERVICES, 'Пошиття');
    eq([r.count, r.factor, r.total], [5, 2, 168]);
  });

  /* ---------- Завдання 2 ---------- */
  const reg = U.createDemoRegistry();
  test('2.0 Створено 10 облікових записів (клас User успадковує Person)', () => {
    eq(reg.size, 10);
    eq(reg.all.every(u => u instanceof U.User && u instanceof U.Person), true);
  });
  test('2.0 До реєстру не можна додати не-User', () => {
    let thrown = false;
    try { reg.add({ name: 'x' }); } catch (e) { thrown = e instanceof TypeError; }
    eq(thrown, true);
  });
  test('2.1 Жовтень 2026 станом на 15.10 20:00 → 4 користувачі', () => {
    eq(reg.byMonthUntil(2026, 10, '2026-10-15T20:00').map(u => u.surname), ['Шевченко', 'Коваленко', 'Бондар', 'Ткаченко']);
  });
  test('2.1 Листопад 2026 станом на 05.11 08:00 → 1 користувач', () => {
    eq(reg.byMonthUntil(2026, 11, '2026-11-05T08:00').length, 1);
  });
  test('2.2 Мінімальний вік 19 — max.tk@gmail.com, 2026-10-15', () => {
    eq(reg.youngest(), { minAge: 19, users: [{ fullName: 'Ткаченко Максим', email: 'max.tk@gmail.com', date: '2026-10-15' }] });
  });
  test('2.3 Кількість у класах: 2 / 3 / 3 / 2', () => {
    eq(reg.classify().counts, { 'активна молодь': 2, 'похилий претензійний': 3, 'середній без претензій': 3, 'інші': 2 });
  });
  test('2.3 Граничні випадки: вік 25 і 60 потрапляють в «інші»', () => {
    eq(new U.User('А', 'Б', 25, 'a@a', U.PURPOSE.WISH, '2026-01-01', '10:00').category, 'інші');
    eq(new U.User('А', 'Б', 60, 'a@a', U.PURPOSE.CLAIM, '2026-01-01', '10:00').category, 'інші');
  });
  test('2.4 Сортування за E-mail в алфавітному порядку', () => {
    const emails = reg.sortByEmail().map(x => x.email);
    eq(emails, [...emails].sort((a, b) => a.localeCompare(b)));
    eq(emails[0], 'a.kovalenko@ukr.net');
  });

  return results;
}

if (typeof window === 'undefined') {
  const res = runAllTests();
  res.forEach(r => console.log(`${r.ok ? '✔ PASS' : '✘ FAIL'}  ${r.name}${r.ok ? '' : '  → ' + r.error}`));
  const failed = res.filter(r => !r.ok).length;
  console.log(`\nУсього: ${res.length}, пройдено: ${res.length - failed}, провалено: ${failed}`);
  process.exitCode = failed ? 1 : 0;
}
