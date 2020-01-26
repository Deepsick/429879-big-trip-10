
import {MenuItem, AUTHORIZATION, END_POINT} from './const';
import {render, RenderPosition} from './utils/render';

import Api from './api';

import SiteMenuComponent from './components/site-menu';
import RouteInfoComponent from './components/route-info';
import StatisticsComponent from './components/statistics';

import TripController from './controllers/trip';
import FilterController from './controllers/filter';

import PointsModel from './models/points';
import DestinationsModel from './models/destinations';
import OffersModel from './models/offers';

const api = new Api(END_POINT, AUTHORIZATION);
const tripMainElement = document.querySelector(`.trip-main`);
const menuTitleElement = document.querySelector(`.trip-controls h2:first-child`);
const filtersTitleElement = document.querySelector(`.trip-controls h2:last-child`);
const tripEventsElement = document.querySelector(`.trip-events`);
const addPointButton = document.querySelector(`.trip-main__event-add-btn`);

const siteMenuComponent = new SiteMenuComponent();
render(menuTitleElement, siteMenuComponent, RenderPosition.AFTEREND);

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

api
  .getPoints()
  .then((points) => {
    pointsModel.setPoints(points);

    return api.getDestinations();
  })
  .then((destinations) => {
    destinationsModel.setDestinations(destinations);

    return api.getOffers();
  })
  .then((offers) => {
    offersModel.setOffers(offers);
    const destinationNames = destinationsModel.getDestinationNames();
    render(tripMainElement, new RouteInfoComponent(pointsModel.getPoints(), destinationNames), RenderPosition.AFTERBEGIN);
    const tripController = new TripController(tripEventsElement, pointsModel, destinationsModel, offersModel, api);
    tripController.render();
    const statisticsComponent = new StatisticsComponent(pointsModel);
    render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
    const filterController = new FilterController(filtersTitleElement, pointsModel);
    filterController.render();

    statisticsComponent.hide();

    addPointButton.addEventListener(`click`, () => {
      tripController.createPoint();
    });

    siteMenuComponent.setClickHandler((menuItem) => {
      siteMenuComponent.setActiveItem(menuItem);
      const tabText = menuItem.textContent.toLowerCase();
      switch (tabText) {
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
  });

