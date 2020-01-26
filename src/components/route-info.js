import {ROUTE_SEPARATOR, ROUTE_REPLACER, ROUTE_COUNT} from '../const';
import {getLastArrayElement} from '../utils/common';
import {formatDateToDay} from '../utils/date';

import AbstractComponent from './abstract-component';

const createRouteInfoTemplate = (date, route, price) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${route}</h1>

      <p class="trip-info__dates">${date}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>
  </section>`
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
};

const getTotalPrice = (points) => {
  let totalPrice = 0;
  points.forEach((point) => {
    const {offers, price} = point;
    totalPrice += price;

    offers.forEach((offer) => {
      totalPrice += offer.price;
    });
  });

  return totalPrice;
};

export default class RouteInfo extends AbstractComponent {
  constructor(points, destinations) {
    super();
    this._points = points;
    this._destinations = destinations;
    this._route = createRoute(this._destinations);
    this._date = createDate(this._points);
    this._totalPrice = getTotalPrice(this._points);
  }

  getTemplate() {
    return createRouteInfoTemplate(this._date, this._route, this._totalPrice);
  }
}

