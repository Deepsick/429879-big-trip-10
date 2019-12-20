import {render, RenderPosition} from './utils/render';

import MenuComponent from './components/menu';
import RouteInfoComponent from './components/route-info';

import TripController from './controllers/trip';
import FilterController from './controllers/filter';

import {generateMenu} from './mock/menu';
import {generateEvents} from './mock/event';

import PointsModel from './models/points';

const EVENT_COUNT = 3;


const tripInfoElement = document.querySelector(`.trip-info`);
const menuTitleElement = document.querySelector(`.trip-controls h2:first-child`);
const filtersTitleElement = document.querySelector(`.trip-controls h2:last-child`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(tripInfoElement, new RouteInfoComponent(), RenderPosition.AFTERBEGIN);

const menu = generateMenu();
render(menuTitleElement, new MenuComponent(menu), RenderPosition.AFTEREND);

const pointsModel = new PointsModel();
const events = generateEvents(EVENT_COUNT);
pointsModel.setPoints(events);

const filterController = new FilterController(filtersTitleElement, pointsModel);
filterController.render();

const tripController = new TripController(tripEventsElement, pointsModel);
tripController.render();

