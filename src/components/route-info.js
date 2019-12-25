import {ROUTE_SEPARATOR, ROUTE_REPLACER, ROUTE_COUNT} from '../const';
import {getLastArrayElement, formatDateToDay} from '../utils/common';

import AbstractComponent from './abstract-component';

const createRouteInfoTemplate = (date, route) => (
  `<div class="trip-info__main">
    <h1 class="trip-info__title">${route}</h1>

    <p class="trip-info__dates">${date}</p>
  </div>`
);

const createDate = (points) => {
  const dateFrom = formatDateToDay(points[0].dateFrom);
  const dateTo = formatDateToDay(getLastArrayElement(points).dateTo);

  return `${dateFrom}&nbsp;${ROUTE_SEPARATOR}&nbsp;${dateTo}`;
};

const createRoute = (destinations) => {
  const firstDestination = destinations[0];
  const lastDestination = getLastArrayElement(destinations);
  const middleDestination = destinations.length <= ROUTE_COUNT ? destinations[1] : ROUTE_REPLACER;

  return `${firstDestination} ${ROUTE_SEPARATOR} ${middleDestination} ${ROUTE_SEPARATOR} ${lastDestination}`;
}

export default class RouteInfo extends AbstractComponent {
  constructor(points, destinations) {
    super();
    this._points = points;
    this._destinations = destinations;
    this._route = createRoute(this._destinations);
    this._date = createDate(this._points);
  }

  getTemplate() {
    return createRouteInfoTemplate(this._date, this._route);
  }
}

