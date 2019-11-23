import {getCardElement} from './components/card';
import {getCardListElement} from './components/card-list';
import {getEditCardFormElement} from './components/edit-card';
import {getFiltersElement} from './components/filters';
import {getMenuElement} from './components/menu';
import {getRouteInfoElement} from './components/route-info';
import {getSortElement} from './components/sort';

const CARD_COUNT = 3;

const render = (element, template, position = `beforeend`) => element.insertAdjacentHTML(position, template);

const tripInfoElement = document.querySelector(`.trip-info`);
const menuTitleElement = document.querySelector(`.trip-controls h2:first-child`);
const filtersTitleElement = document.querySelector(`.trip-controls h2:last-child`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(tripInfoElement, getRouteInfoElement(), `afterbegin`);
render(menuTitleElement, getMenuElement(), `afterend`);
render(filtersTitleElement, getFiltersElement(), `afterend`);
render(tripEventsElement, getSortElement());
render(tripEventsElement, getCardListElement());

const cardList = tripEventsElement.querySelector(`.trip-days`);
render(cardList, getEditCardFormElement());
render(cardList, getEditCardFormElement());

new Array(CARD_COUNT).fill(``).forEach(() => render(cardList, getCardElement()));

