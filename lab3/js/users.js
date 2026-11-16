/* ==========================================================
   ЛР3, Завдання 2 (варіант 9) — користувачі зворотного зв’язку
   Підхід: об’єктно-орієнтований JS (класи, наслідування,
   інкапсуляція, гетери, статичні методи)
   ========================================================== */
'use strict';

const PURPOSE = Object.freeze({
  CLAIM: 'претензія',
  WISH: 'побажання',
  COOPERATION: 'співпраця',
  ERROR: 'наявність помилки',
});

/** Базовий клас — особа. */
class Person {
  constructor(surname, name, age) {
    this.surname = surname;
    this.name = name;
    this.age = age;
  }
  get fullName() {
    return `${this.surname} ${this.name}`;
  }
}

/** Користувач, що звернувся через форму зворотного зв’язку. */
class User extends Person {
  constructor(surname, name, age, email, purpose, date, time) {
    super(surname, name, age);
    this.email = email;
    this.purpose = purpose;
    this.date = date;   // 'YYYY-MM-DD'
    this.time = time;   // 'HH:MM'
  }

  /** Момент звернення як об’єкт Date. */
  get moment() {
    return new Date(`${this.date}T${this.time}:00`);
  }

  /** Номер місяця звернення (1–12). */
  get month() {
    return Number(this.date.slice(5, 7));
  }

  /** Класифікація користувача згідно з варіантом. */
  get category() {
    if (this.age < 25 && this.purpose === PURPOSE.WISH) return 'активна молодь';
    if (this.age > 60 && this.purpose === PURPOSE.CLAIM) return 'похилий претензійний';
    if (this.age > 25 && this.age < 60 && this.purpose !== PURPOSE.CLAIM) return 'середній без претензій';
    return 'інші';
  }

  toString() {
    return `${this.fullName}, ${this.age} р., ${this.email}, «${this.purpose}», ${this.date} ${this.time}`;
  }
}

/** Реєстр користувачів з методами обробки. */
class UserRegistry {
  #users = [];

  static CATEGORIES = ['активна молодь', 'похилий претензійний', 'середній без претензій', 'інші'];

  constructor(users = []) {
    users.forEach(u => this.add(u));
  }

  add(user) {
    if (!(user instanceof User)) throw new TypeError('Очікується об’єкт класу User');
    this.#users.push(user);
    return this;
  }

  get all() {
    return [...this.#users];
  }

  get size() {
    return this.#users.length;
  }

  /**
   * 2.1 Користувачі, що звернулися протягом заданого місяця
   *     станом на заданий момент часу (звернення не пізніше цього моменту).
   * @param {number} year   рік
   * @param {number} month  місяць (1–12)
   * @param {string} moment момент часу 'YYYY-MM-DDTHH:MM'
   */
  byMonthUntil(year, month, moment) {
    const limit = new Date(moment);
    return this.#users
      .filter(u => u.moment.getFullYear() === year && u.month === month && u.moment <= limit)
      .sort((a, b) => a.moment - b.moment);
  }

  /** 2.2 Користувач(і) з мінімальним віком: E-mail та дата звернення. */
  youngest() {
    const minAge = Math.min(...this.#users.map(u => u.age));
    return {
      minAge,
      users: this.#users.filter(u => u.age === minAge).map(u => ({ fullName: u.fullName, email: u.email, date: u.date })),
    };
  }

  /** 2.3 Поділ на класи та кількість у кожному класі. */
  classify() {
    const result = Object.fromEntries(UserRegistry.CATEGORIES.map(c => [c, []]));
    this.#users.forEach(u => result[u.category].push(u.fullName));
    const counts = Object.fromEntries(Object.entries(result).map(([c, list]) => [c, list.length]));
    return { groups: result, counts };
  }

  /** 2.4 Сортування за E-mail в алфавітному порядку з виведенням мети звернення. */
  sortByEmail() {
    return [...this.#users]
      .sort((a, b) => a.email.localeCompare(b.email))
      .map(u => ({ email: u.email, purpose: u.purpose, fullName: u.fullName }));
  }
}

/** 10 облікових записів користувачів. */
function createDemoRegistry() {
  return new UserRegistry([
    new User('Шевченко', 'Олена',   23, 'olena.shev@gmail.com',  PURPOSE.WISH,        '2026-10-03', '10:15'),
    new User('Коваленко', 'Андрій', 34, 'a.kovalenko@ukr.net',   PURPOSE.COOPERATION, '2026-10-07', '14:40'),
    new User('Бондар', 'Ірина',     67, 'iryna.bondar@i.ua',     PURPOSE.CLAIM,       '2026-10-12', '09:05'),
    new User('Ткаченко', 'Максим',  19, 'max.tk@gmail.com',      PURPOSE.WISH,        '2026-10-15', '19:30'),
    new User('Мельник', 'Софія',    45, 'sofia.melnyk@ukr.net',  PURPOSE.ERROR,       '2026-10-21', '12:00'),
    new User('Кравчук', 'Степан',   72, 'kravchuk.s@meta.ua',    PURPOSE.CLAIM,       '2026-10-28', '16:45'),
    new User('Олійник', 'Дарина',   29, 'daryna.oliinyk@gmail.com', PURPOSE.CLAIM,    '2026-11-02', '11:20'),
    new User('Поліщук', 'Богдан',   21, 'bogdan.pol@i.ua',       PURPOSE.COOPERATION, '2026-11-05', '08:50'),
    new User('Лисенко', 'Марта',    52, 'marta.lysenko@gmail.com', PURPOSE.WISH,      '2026-11-09', '17:10'),
    new User('Гнатюк', 'Ярослав',   61, 'y.hnatiuk@ukr.net',     PURPOSE.CLAIM,       '2026-11-14', '13:35'),
  ]);
}

if (typeof module !== 'undefined') {
  module.exports = { PURPOSE, Person, User, UserRegistry, createDemoRegistry };
}
