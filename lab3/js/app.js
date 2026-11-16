/* ЛР3 — виведення результатів на сторінку та в консоль */
'use strict';

const $ = id => document.getElementById(id);

/** Побудова HTML-таблиці з масиву об’єктів. */
function table(rows, columns, highlight = () => false) {
  const head = columns.map(([, title]) => `<th>${title}</th>`).join('');
  const body = rows.map(r =>
    `<tr${highlight(r) ? ' class="new"' : ''}>${columns.map(([key]) => `<td>${r[key] ?? '—'}</td>`).join('')}</tr>`
  ).join('');
  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

const SERVICE_COLS = [['id', 'id'], ['name', 'Назва'], ['type', 'Тип'], ['readsDay1', 'Читачі, доба 1'],
  ['readsDay2', 'Читачі, доба 2'], ['duration', 'Тривалість, дн.'], ['price', 'Вартість, грн']];

/* ---------- Завдання 1 ---------- */
$('services-table').innerHTML = table(SERVICES, SERVICE_COLS);
console.table(SERVICES);

const r11 = sortByDurationWithAvgReaders(SERVICES);
$('r11').innerHTML =
  `<p><b>Впорядковані назви:</b></p><ol>${r11.sortedNames.map(n => `<li>${n}</li>`).join('')}</ol>` +
  table(r11.groups.map(g => ({ ...g, services: g.services.join(', ') })),
    [['duration', 'Тривалість, дн.'], ['services', 'Сервіси'], ['avgReaders', 'Середня к-сть читачів']]);
console.log('1.1', r11);

const r12 = findMaxReadsDay2(SERVICES);
$('r12').innerHTML = `<div class="result">Сервіс «<b>${r12.name}</b>» має максимальну кількість читачів за добу_2 — <b>${r12.readsDay2}</b>.<br>Тип сервісу: <b>${r12.type}</b>.</div>`;
console.log('1.2', r12);

const incomplete = { id: 111, name: 'Пошиття штор', type: 'Пошиття', price: 600 };
const complete = { id: 112, name: 'Ремонт куртки', type: 'Ремонт', readsDay1: 30, readsDay2: 41, duration: 3, price: 1000 };
const add1 = addService(SERVICES, incomplete);
const add2 = addService(SERVICES, complete);
$('r13').innerHTML =
  `<div class="result">а) Неповний запис <code>${JSON.stringify(incomplete)}</code> → додано <b>${add1.mode}</b>, позиція ${add1.position + 1}.</div>` +
  table(add1.list, SERVICE_COLS, r => r.id === 111) +
  `<div class="result">б) Повний запис <code>${JSON.stringify(complete)}</code> → вставлено <b>${add2.mode}</b>, позиція ${add2.position + 1}.</div>` +
  table(add2.list, SERVICE_COLS, r => r.id === 112);
console.log('1.3', add1, add2);

const typeSelect = $('type-select');
typeSelect.innerHTML = getTypes(SERVICES).map(t => `<option>${t}</option>`).join('');
function showDuration() {
  const r = durationByType(SERVICES, typeSelect.value);
  $('r14').innerHTML =
    `<div class="result">Тип «<b>${r.type}</b>»: сервісів — ${r.count}, коефіцієнт — <b>×${r.factor}</b>, загальна тривалість — <b>${r.total} дн.</b></div>` +
    table(r.services, [['name', 'Сервіс'], ['base', 'Вказана тривалість'], ['adjusted', 'Розрахована тривалість']]);
  console.log('1.4', r);
}
typeSelect.addEventListener('change', showDuration);
showDuration();

/* ---------- Завдання 2 ---------- */
const registry = createDemoRegistry();
$('users-table').innerHTML = table(registry.all,
  [['surname', 'Прізвище'], ['name', 'Ім’я'], ['age', 'Вік'], ['email', 'E-mail'], ['purpose', 'Мета'], ['date', 'Дата'], ['time', 'Час']]);

function showMonth() {
  const [y, m] = $('month').value.split('-').map(Number);
  const list = registry.byMonthUntil(y, m, $('moment').value);
  $('r21').innerHTML = list.length
    ? `<div class="result">Знайдено користувачів: <b>${list.length}</b></div><ol>${list.map(u => `<li>${u}</li>`).join('')}</ol>`
    : '<div class="result">Немає звернень за заданими умовами.</div>';
  console.log('2.1', list.map(String));
}
$('btn-month').addEventListener('click', showMonth);
showMonth();

const r22 = registry.youngest();
$('r22').innerHTML = `<div class="result">Мінімальний вік: <b>${r22.minAge}</b><br>` +
  r22.users.map(u => `${u.fullName} — E-mail: <b>${u.email}</b>, дата звернення: <b>${u.date}</b>`).join('<br>') + '</div>';
console.log('2.2', r22);

const r23 = registry.classify();
$('r23').innerHTML = table(Object.entries(r23.groups).map(([c, l]) => ({ c, n: l.length, l: l.join(', ') || '—' })),
  [['c', 'Клас'], ['n', 'Кількість'], ['l', 'Користувачі']]);
console.log('2.3', r23.counts);

const r24 = registry.sortByEmail();
$('r24').innerHTML = table(r24.map((u, i) => ({ i: i + 1, ...u })),
  [['i', '№'], ['email', 'E-mail'], ['purpose', 'Мета зворотного зв’язку'], ['fullName', 'Користувач']]);
console.log('2.4', r24);

/* ---------- Тести ---------- */
const results = runAllTests();
const failed = results.filter(r => !r.ok).length;
$('tests').innerHTML = `<ul>${results.map(r =>
  `<li class="${r.ok ? 'pass' : 'fail'}">${r.ok ? '✔' : '✘'} ${r.name}${r.ok ? '' : ' — ' + r.error}</li>`).join('')}</ul>` +
  `<div class="result">Усього тестів: <b>${results.length}</b>, пройдено: <b class="pass">${results.length - failed}</b>, провалено: <b class="fail">${failed}</b></div>`;
