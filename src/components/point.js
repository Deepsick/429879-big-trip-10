import AbstractComponent from './abstract-component';
import {OFFER_COUNT} from '../const';
import {getTitlePlaceholder, formatToTitleCase} from '../utils/common';
import {formatTime, formatDuration, formatTagTime} from '../utils/date';

const START_INDEX = 0;

const createOfferTemplate = (offer) => {
  const {title, price} = offer;

  return (
    `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
    </li>`
  );
};

const generateOffersMarkup = (offers, availableOffers) => {
  const offerNodes = [];
  const filteredOffers = availableOffers.filter((availableOffer) => {
    return offers.some((offer) => availableOffer.title === offer.title);
  });

  filteredOffers.slice(START_INDEX, OFFER_COUNT).forEach((offer) => {
    offerNodes.push(createOfferTemplate(offer));
  });

  return offerNodes;
};


const createPointTemplate = (point) => {
  const {type, destination, dateFrom, dateTo, price, offers, availableOffers, duration} = point;
  const offersMarkup = generateOffersMarkup(offers, availableOffers).join(``);

  return `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${formatToTitleCase(type)} ${getTitlePlaceholder(type)} ${destination.name}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${formatTagTime(dateFrom)}">${formatTime(dateFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime="${formatTagTime(dateTo)}">${formatTime(dateTo)}</time>
        </p>
        <p class="event__duration">${formatDuration(duration)}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersMarkup}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class Point extends AbstractComponent {
  constructor(point) {
    super();
    this._point = point;
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  setEditButtonClickHandler(handler) {
    this
      .getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }

  addAnimation(animation) {
    this.getElement().style.animation = animation;
  }

  removeAnimation() {
    this.getElement().style.animation = ``;
  }
}
