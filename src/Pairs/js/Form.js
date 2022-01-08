import { el, mount } from 'redom';

// форма
export const Form = el('form.form');
// размер игрового поля
export const INITIAL_CELLS = 4;

export const InputCells = el('input#cells.form__input form__input-cells', {
  type: 'number',
  min: 2,
  step: 2,
  max: 10,
});

mount(Form, InputCells);

const LabelForInputCells = el(
  'label.form__label form__label-cells',
  'Карточек по вертикали/горизонтали:',
  {
    for: 'cells',
  },
);

mount(Form, LabelForInputCells);

// таймер
export const TIME_LIMIT = 20000;
export const CheckboxTimer = el('input#timer.form__checkbox visually-hidden', {
  type: 'checkbox',
  checked: false,
});

mount(Form, CheckboxTimer);

export const LabelForCheckboxTimer = el(
  'label.form__label form__label-timer label-for-checkbox',
  {
    for: 'timer',
  },
);

mount(Form, LabelForCheckboxTimer);

// вывод количества оставшихся секунд
export const InputSeconds = el('input#seconds.form__input form__input-timer', {
  type: 'number',
  readonly: true,
});

mount(Form, InputSeconds);

// кнопка ввода
export const BtnSubmit = el('button.btn btn__submit', 'Начнем игру!', {
  type: 'submit',
});

// кнопка сброса
export const BtnReset = el('button.btn btn__reset', 'Обновить', {
  type: 'reset',
});

// контейнер для кнопок
const BtnContainer = el('.btn-container', [BtnReset, BtnSubmit]);

mount(Form, BtnContainer);
