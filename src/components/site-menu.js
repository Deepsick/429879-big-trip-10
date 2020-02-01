import {TagName, MenuItem, ACTIVE_MENU_ITEM_CLASS} from '../const';
import {formatToTitleCase} from '../utils/common';

import AbstractComponent from './abstract-component';

const createTabTemplate = (menuItem) => {
  return `<a class="trip-tabs__btn ${menuItem === MenuItem.TABLE ? ACTIVE_MENU_ITEM_CLASS : ``}" href="#">${formatToTitleCase(menuItem)}</a>`;
};

const getTabsTemplate = () => {
  const menu = [];
  Object.values(MenuItem).map((tab) => menu.push(createTabTemplate(tab)));
  return menu;
};

const createMenuTemplate = () => {
  const menu = getTabsTemplate().join(``);
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${menu}
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate();
  }

  setClickHandler(handler) {
    this
      .getElement()
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName.toLowerCase() !== TagName.LINK) {
          return;
        }

        const menuItem = evt.target;
        handler(menuItem);
      });
  }

  setActiveItem(menuItem) {
    this.getElement().querySelector(`.${ACTIVE_MENU_ITEM_CLASS}`).classList.remove(ACTIVE_MENU_ITEM_CLASS);
    menuItem.classList.add(ACTIVE_MENU_ITEM_CLASS);
  }
}

