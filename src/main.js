import {getCardElement} from './components/card';
import {getCardListElement} from './components/card-list';
import {getEditCardFormElement} from './components/edit-card';
import {getFiltersElement} from './components/filters';
import {getMenuElement} from './components/menu';
import {getRouteInfoElement} from './components/route-info';
import {getSortElement} from './components/sort';

import {FILTERS} from './const';

import {generateCards} from './mock/card';
import {generateFilters} from './mock/filter';
import {generateMenu} from './mock/menu';


const CARD_COUNT = 3;

const render = (element, template, position = `beforeend`) => element.insertAdjacentHTML(position, template);

const tripInfoElement = document.querySelector(`.trip-info`);
const menuTitleElement = document.querySelector(`.trip-controls h2:first-child`);
const filtersTitleElement = document.querySelector(`.trip-controls h2:last-child`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(tripInfoElement, getRouteInfoElement(), `afterbegin`);

const menu = generateMenu();
render(menuTitleElement, getMenuElement(menu), `afterend`);

const filters = generateFilters(FILTERS);
render(filtersTitleElement, getFiltersElement(filters), `afterend`);
render(tripEventsElement, getSortElement());
render(tripEventsElement, getCardListElement());

const cardList = tripEventsElement.querySelector(`.trip-days`);

const cards = generateCards(CARD_COUNT);
render(cardList, getEditCardFormElement(cards[0]));
cards.forEach((card) => render(cardList, getCardElement(card)));

