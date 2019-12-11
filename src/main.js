import {render, RenderPosition} from './utils/render';
import {FILTERS} from './const';

import FiltersComponent from './components/filters';
import MenuComponent from './components/menu';
import RouteInfoComponent from './components/route-info';
import TripController from './controllers/trip';

import {generateFilters} from './mock/filter';
import {generateMenu} from './mock/menu';
import {generateTripDays} from './mock/trip-day';

const TRIP_DAY_COUNT = 2;


const tripInfoElement = document.querySelector(`.trip-info`);
const menuTitleElement = document.querySelector(`.trip-controls h2:first-child`);
const filtersTitleElement = document.querySelector(`.trip-controls h2:last-child`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(tripInfoElement, new RouteInfoComponent(), RenderPosition.AFTERBEGIN);

const menu = generateMenu();
render(menuTitleElement, new MenuComponent(menu), RenderPosition.AFTEREND);

const filters = generateFilters(FILTERS);
render(filtersTitleElement, new FiltersComponent(filters), RenderPosition.AFTEREND);

const tripDays = generateTripDays(TRIP_DAY_COUNT);
const tripController = new TripController(tripEventsElement);
tripController.render(tripDays);

