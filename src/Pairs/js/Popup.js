import { el, mount } from 'redom';

export const PopupContainer = el('.popup');

export const PopupMessage = el('p.popup__message');

mount(PopupContainer, PopupMessage);

export const BtnClosePopup = el('button.btn popup__btn-close', 'Закрыть', {
  type: 'button',
});

mount(PopupContainer, BtnClosePopup);
