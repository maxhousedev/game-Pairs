import { el, mount, setChildren, setStyle, setAttr, unmount } from 'redom';
import '../scss/styles.scss';

import shuffleDurschenfeld from '../../utils/shuffleDurschenfeld';
import generateArrOfRepeatitions from '../../utils/generateArrOfRepeatitions';

import {
  Form,
  InputCells,
  CheckboxTimer,
  LabelForCheckboxTimer,
  InputSeconds,
  BtnSubmit,
  INITIAL_CELLS,
  TIME_LIMIT,
} from './Form';
import { PopupContainer, PopupMessage, BtnClosePopup } from './Popup';

export default class Pairs {
  constructor() {
    this.container = el('#pair-game.container');
    this.title = el('h1.title', 'Пары');
    this.Form = Form;
    this.InputCells = InputCells;
    this.CardList = el('ul.card-list');
    this.CheckboxTimer = CheckboxTimer;
    this.LabelForCheckboxTimer = LabelForCheckboxTimer;
    this.InputSeconds = InputSeconds;
    this.PopupContainer = PopupContainer;
    this.PopupMessage = PopupMessage;
    this.BtnSubmit = BtnSubmit;
    this.BtnClosePopup = BtnClosePopup;

    this.gameProps = {
      defaultCells: 4,
      timeLimit: 60,
    };

    this.gameState = {
      clickCounter: 0,
      openedCards: 0,
      prevCard: null,
      nextCard: null,
    };

    setAttr(this.InputCells, { value: this.gameProps.defaultCells });
    this.LabelForCheckboxTimer.textContent = `Успеть за ${parseInt(
      this.gameProps.timeLimit,
      10,
    )} сек`;
    setAttr(this.InputSeconds, { value: this.gameProps.timeLimit });
    setChildren(this.container, [this.title, this.Form, this.CardList]);
  }

  #setGridCSS = (cells) => {
    // сетка для списка
    setStyle(this.CardList, {
      gridTemplateColumns: `repeat(${cells}, 2.25em)`,
      gridTemplateRows: `repeat(${cells}, 3em)`,
    });
  };

  #createCardLayout = (cardNumber) => {
    const Cards = [];

    const shuffledArrOfNumbers = shuffleDurschenfeld(
      generateArrOfRepeatitions(cardNumber / 2),
    );

    for (let i = 0; i < cardNumber; i++) {
      const Card = el(`li#${i}.card`, shuffledArrOfNumbers[i], {
        'data-cardnum': shuffledArrOfNumbers[i],
      });

      Cards.push(Card);
    }

    this.Cards = Cards;
  };

  #mountPopup = (message) => {
    document.body.classList.add('no-scroll');
    mount(this.container, this.PopupContainer);
    this.PopupMessage.textContent = message;
  };

  #startCountdown = () => {
    const SECONDS_TIME_IS_RUNNIG_OUT = 10;
    let secondsCountdown = parseInt(this.InputSeconds.value, 10);

    this.timerID = setInterval(() => {
      if (secondsCountdown === 0) {
        clearInterval(this.timerID);
        this.InputSeconds.classList.remove('time-is-runningout');
        const message = 'Игра окончена! Время истекло!';
        this.#mountPopup(message);
      } else {
        --secondsCountdown;
        if (secondsCountdown === SECONDS_TIME_IS_RUNNIG_OUT) {
          this.InputSeconds.classList.add('time-is-runningout');
        }
        this.InputSeconds.value = secondsCountdown;
      }
    }, 1000);
  };

  #handlerOnCardClick = (e) => {
    e.currentTarget.classList.add('is-opened');
    ++this.gameState.clickCounter;

    if (
      this.gameState.clickCounter === 1 ||
      this.gameState.clickCounter % 2 !== 0
    ) {
      this.gameState.prevCard = e.currentTarget;
    } else {
      this.gameState.nextCard = e.currentTarget;
    }

    const compareCards = (prev, next) => {
      let matched = false;

      if (prev && next) {
        const CARD_IS_OPEN_DELAY = 1000;
        matched =
          prev.getAttribute('data-cardnum') ===
          next.getAttribute('data-cardnum');
        // проверка совпадений
        if (matched) {
          // оставить открытыми
          prev.classList.add('stay-opened');
          next.classList.add('stay-opened');
        } else {
          // скрыть с задержкой
          setTimeout(() => {
            prev.classList.remove('is-opened');
            next.classList.remove('is-opened');
          }, CARD_IS_OPEN_DELAY);
        }
      }

      return matched;
    };
    // сравниваем карточки
    if (compareCards(this.gameState.prevCard, this.gameState.nextCard)) {
      this.gameState.openedCards += 2;
    }

    if (this.gameState.openedCards === this.cardsNumber) {
      const message = `Вы выиграли! Выполнено ходов - ${this.gameState.clickCounter}.`;
      this.#mountPopup(message);
    }
  };

  #handlerOnClosePopup = () => {
    BtnSubmit.classList.remove('game');
    setAttr(this.CheckboxTimer, { disabled: false });
    document.body.classList.remove('no-scroll');
    unmount(this.container, this.PopupContainer);
  };

  //* начать игру
  #startGame = () => {
    BtnSubmit.classList.add('game');

    setAttr(this.InputCells, { readOnly: true });
    setAttr(this.CheckboxTimer, { disabled: true });

    if (this.CheckboxTimer.checked) {
      this.#startCountdown();
    }

    this.Cards.forEach((Card) => {
      Card.addEventListener('click', this.#handlerOnCardClick);
    });

    this.BtnClosePopup.addEventListener('click', this.#handlerOnClosePopup);
  };

  #handlerOnFormSubmit = (e) => {
    e.preventDefault();
    // размер игрового поля
    const cellsNumber = this.InputCells.value;

    this.#setGridCSS(cellsNumber);
    // количество карточек
    this.cardsNumber = cellsNumber ** 2;

    this.#createCardLayout(this.cardsNumber);
    setChildren(this.CardList, this.Cards);

    this.#startGame();
  };

  #handlerOnFormReset = (e) => {
    e.preventDefault();
    setAttr(this.InputCells, { value: INITIAL_CELLS, readOnly: false });
    setAttr(this.InputSeconds, { value: TIME_LIMIT / 1000 });
    setAttr(this.CardList, { style: '' });
    clearInterval(this.timerID);
    setAttr(this.CheckboxTimer, { disabled: false });
    BtnSubmit.classList.remove('game');
    setChildren(this.CardList, []);
  };

  //* инициализация
  init(parentElement) {
    mount(parentElement, this.container);
    this.Form.addEventListener('submit', this.#handlerOnFormSubmit);
    this.Form.addEventListener('reset', this.#handlerOnFormReset);
  }

  //* удаление
  destroy() {
    this.Form.removeEventListener('submit', this.#handlerOnFormSubmit);
    this.Form.removeEventListener('reset', this.#handlerOnFormReset);
    this.Cards.forEach((Card) => {
      Card.removeEventListener('click', this.#handlerOnCardClick);
    });
    this.BtnClosePopup.removeEventListener('click', this.#handlerOnClosePopup);
    this.container.remove();
  }
}
