
import {MenuItem} from './const';
import {render, RenderPosition} from './utils/render';

import MenuComponent from './components/menu';
import RouteInfoComponent from './components/route-info';
import StatisticsComponent from './components/statistics';

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
const siteMenuComponent = new MenuComponent(menu);
render(menuTitleElement, siteMenuComponent, RenderPosition.AFTEREND);

const pointsModel = new PointsModel();
const events = generateEvents(EVENT_COUNT);
pointsModel.setPoints(events);

const filterController = new FilterController(filtersTitleElement, pointsModel);
filterController.render();

const statisticsComponent = new StatisticsComponent(pointsModel);
render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);

const tripController = new TripController(tripEventsElement, pointsModel);
statisticsComponent.hide();
tripController.render();

siteMenuComponent.setClickHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripController.show();
      statisticsComponent.hide();
      break;
    case MenuItem.STATS:
      tripController.hide();
      statisticsComponent.show();
      break;
  }
});

