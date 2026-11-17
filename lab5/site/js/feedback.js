/* =========================================================
   ЛР4, сторінка «Зворотній зв'язок»
   4) при наведенні на поле «Детально» змінюється фон, з'являється
      рамка з тінню, а праворуч з'являється підказка (tooltip).
   ========================================================= */
'use strict';

const TOOLTIP_TEXT = 'Дякуючи Вам, ми стаємо кращі! Конкретизуйте мету звернення, будь ласка';

document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('details');
  const field = textarea.closest('.field');
  field.classList.add('details');

  const tooltip = document.createElement('span');
  tooltip.className = 'tooltip';
  tooltip.id = 'details-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.textContent = TOOLTIP_TEXT;
  field.append(tooltip);
  textarea.setAttribute('aria-describedby', tooltip.id);

  textarea.addEventListener('mouseenter', () => {
    textarea.classList.add('hovered');
    tooltip.classList.add('show');
  });
  textarea.addEventListener('mouseleave', () => {
    textarea.classList.remove('hovered');
    tooltip.classList.remove('show');
  });
});
