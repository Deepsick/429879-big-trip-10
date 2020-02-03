import {ROUTE_SEPARATOR, ROUTE_REPLACER, ROUTE_COUNT} from '../const';
import {getLastElement} from '../utils/common';
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
  if (points.length) {
    const dateFrom = formatDateToDay(points[0].dateFrom);
    const dateTo = formatDateToDay(getLastElement(points).dateTo);

    return `${dateFrom}&nbsp;${ROUTE_SEPARATOR}&nbsp;${dateTo}`;
  }
  return ``;
};

const createRoute = (points) => {
  if (points.length) {
    const firstDestination = points[0].destination.name;
    const lastDestination = getLastElement(points).destination.name;
    const middleDestination = points.length <= ROUTE_COUNT ? points[1].destination.name : ROUTE_REPLACER;

    return `${firstDestination} ${ROUTE_SEPARATOR} ${middleDestination} ${ROUTE_SEPARATOR} ${lastDestination}`;
  }

  return ``;
};

const getTotalPrice = (points, allOffers) => {
  let totalPrice = 0;
  points.forEach((point) => {
    const {offers, price, type} = point;
    const availableOffers = allOffers.getTypeOffers(type);
    const filteredOffers = availableOffers.offers.filter((availableOffer) => {
      return offers.some((offer) => availableOffer.title === offer.title);
    });
    totalPrice += +price;
    filteredOffers.forEach((offer) => {
      totalPrice += +offer.price;
    });
  });

  return totalPrice;
};

export default class RouteInfo extends AbstractComponent {
  constructor(points, offers) {
    super();
    this._points = points;
    this._offers = offers;
    this._route = createRoute(this._points);
    this._date = createDate(this._points);
    this._totalPrice = getTotalPrice(this._points, this._offers);
  }

  getTemplate() {
    return createRouteInfoTemplate(this._date, this._route, this._totalPrice);
  }

  update(points) {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();
    this._points = points;
    this._route = createRoute(this._points);
    this._date = createDate(this._points);
    this._totalPrice = getTotalPrice(this._points, this._offers);
    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);
  }
}

