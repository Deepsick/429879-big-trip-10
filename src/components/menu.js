import {createElement} from '../utils';

const createTabTemplate = (menuItem) => {
  const {title, link, active} = menuItem;

  return `<a class="trip-tabs__btn  ${active ? `trip-tabs__btn--active` : ``}" href="${link}">${title}</a>`;
};

const createMenuTemplate = (tabs) => {
  const menu = tabs.map((tab) => createTabTemplate(tab)).join(``);
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${menu}
    </nav>`
  );
};

export default class Menu {
  constructor(tabs) {
    this._tabs = tabs;
    this._element = null;
  }

  getTemplate() {
    return createMenuTemplate(this._tabs);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

