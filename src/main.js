
import {MenuItem, AUTHORIZATION, END_POINT, StoreName} from './const';
import {render, remove, RenderPosition} from './utils/render';

import Api from './api';
import Store from './api/store.js';
import Provider from './api/provider.js';

import SiteMenuComponent from './components/site-menu';
import RouteInfoComponent from './components/route-info';
import StatisticsComponent from './components/statistics';
import LoadingTripDays from './components/loading-trip-days';

import TripController from './controllers/trip';
import FilterController from './controllers/filter';

import PointsModel from './models/points';
import DestinationsModel from './models/destinations';
import OffersModel from './models/offers';

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

const api = new Api(END_POINT, AUTHORIZATION);
const pointsStore = new Store(StoreName.POINTS, window.localStorage);
const destinationsStore = new Store(StoreName.DESTINATIONS, window.localStorage);
const offersStore = new Store(StoreName.OFFERS, window.localStorage);
const apiWithProvider = new Provider(api, pointsStore, destinationsStore, offersStore);
const tripMainElement = document.querySelector(`.trip-main`);
const menuTitleElement = document.querySelector(`.trip-controls h2:first-child`);
const filtersTitleElement = document.querySelector(`.trip-controls h2:last-child`);
const tripEventsElement = document.querySelector(`.trip-events`);
const addPointButton = document.querySelector(`.trip-main__event-add-btn`);
const siteMenuComponent = new SiteMenuComponent();
const loadingTripDaysComponent = new LoadingTripDays();

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

render(menuTitleElement, siteMenuComponent, RenderPosition.AFTEREND);
render(tripEventsElement, loadingTripDaysComponent);

apiWithProvider
  .getPoints()
  .then((points) => {
    pointsModel.setPoints(points);

    return apiWithProvider.getDestinations();
  })
  .then((destinations) => {
    destinationsModel.setDestinations(destinations);

    return apiWithProvider.getOffers();
  })
  .then((offers) => {
    offersModel.setOffers(offers);
    const routeInfoComponent = new RouteInfoComponent(pointsModel.getPoints(), offersModel);
    render(tripMainElement, routeInfoComponent, RenderPosition.AFTERBEGIN);
    remove(loadingTripDaysComponent);
    const tripController = new TripController(tripEventsElement, pointsModel, destinationsModel, offersModel, apiWithProvider, routeInfoComponent);
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
          statisticsComponent.update();
          statisticsComponent.show();
          break;
      }
    });

    window.addEventListener(`online`, () => {
      document.title = document.title.replace(` [offline]`, ``);

      if (!apiWithProvider.getSynchronize()) {
        apiWithProvider.sync()
          .then((points) => {
            pointsModel.setPoints(points);
            tripController.updatePoints();
          });
      }
    });
  });

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

