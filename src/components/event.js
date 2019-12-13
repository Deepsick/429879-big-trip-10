import AbstractComponent from './abstract-component';
import {formatTime, formatDate, formatDuration} from '../utils/common';

const generateOffersMarkup = (offers) => {
  return offers.map((offer) => {
    const {type, price} = offer;
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${type}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </li>`
    );
  });
};


const createEventTemplate = (event) => {
  const {type, description, startTime, endTime, price, offers} = event;
  const offersMarkup = generateOffersMarkup(offers).join(``);

  return `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${description}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${formatDate(startTime)}">${formatTime(startTime)}</time>
          &mdash;
          <time class="event__end-time" datetime="${formatDate(endTime)}">${formatTime(endTime)}</time>
        </p>
        <p class="event__duration">${formatDuration(startTime, endTime)}</p>
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

export default class Event extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  setEditButtonClickHandler(handler) {
    this
      .getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
