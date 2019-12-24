import {TagName} from '../const';
import AbstractComponent from './abstract-component';
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

export default class Menu extends AbstractComponent {
  constructor(tabs) {
    super();
    this._tabs = tabs;
  }

  getTemplate() {
    return createMenuTemplate(this._tabs);
  }

  setClickHandler(handler) {
    this
      .getElement()
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName.toLowerCase() !== TagName.LINK) {
          return;
        }

        const menuItem = evt.target.textContent.toLowerCase();
        handler(menuItem);
      });
  }

  setActiveItem(menuItem) {
    const item = this.getElement().querySelector(`#${menuItem}`);

    if (item) {
      item.checked = true;
    }
  }
}

