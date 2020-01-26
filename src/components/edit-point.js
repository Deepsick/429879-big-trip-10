import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

import {getTitlePlaceholder} from '../utils/common';
import {formatFlatpickrDate} from '../utils/date';
import {ButtonText} from '../const';

import PointModel from '../models/point';

import AbstractSmartComponent from './abstract-smart-component';

const createoffersMarkup = (offers) => {
  return offers.map((offer) => {
    const {title, price} = offer;
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer" value='${title}-${price}'>
        <label class="event__offer-label" for="event-offer-${title}-1">
          <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  });
};

const createOfferSection = (isAdd, offers) => {
  if (isAdd) {
    return ``;
  }

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${createoffersMarkup(offers).join(``)}
      </div>
    </section>`
  );
};

const createFavoriteButtonMarkup = (isAdd, isFavorite) => {
  if (isAdd) {
    return ``;
  }

  return (
    `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
    <label class="event__favorite-btn" for="event-favorite-1">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>`
  );
};

const createRollupButtonMarkup = (isAdd) => {
  if (isAdd) {
    return ``;
  }

  return (
    `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`
  );
};

const createDatalist = (destinations) => {
  return destinations.map((destination) => `<option value="${destination}"></option>`);
};

const createPicturesMarkup = (pictures) => {
  return pictures.map((picture) => {
    const {src, description} = picture;

    return (
      `<img class="event__photo" src="${src}" alt="${description}">`
    );
  });
};

const createDescription = (isAdd, destination) => {
  if (isAdd) {
    return ``;
  }

  const {description, pictures} = destination;
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
    
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${createPicturesMarkup(pictures).join(``)}
        </div>
      </div>
    </section>`
  );
};

export const createEditPointTemplate = ({type, destination, dateFrom, dateTo, price, isFavorite, offers, isAdd}, destinations, externalData) => {
  const {name} = destination;

  const deleteButtonText = externalData.DELETE;
  const saveButtonText = externalData.SAVE;
  const cancelButtonText = externalData.CANCEL;

  return `<form class="event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>

            <div class="event__type-item">
              <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
              <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
              <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
              <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
              <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
              <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
              <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
            </div>
          </fieldset>

          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>

            <div class="event__type-item">
              <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type} ${getTitlePlaceholder(type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${createDatalist(destinations).join(``)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
      <button class="event__reset-btn" type="reset">${isAdd ? cancelButtonText : deleteButtonText}</button>
      ${createFavoriteButtonMarkup(isAdd, isFavorite)}
      ${createRollupButtonMarkup(isAdd)}
    </header>

    <section class="event__details">
      ${createOfferSection(isAdd, offers)}
      ${createDescription(isAdd, destination)}
    </section>
  </form>`;
};

const parseFormData = (formData, id, isFavorite) => {
  const dateFrom = formData.get(`event-start-time`);
  const dateTo = formData.get(`event-end-time`);
  const offers = formData.getAll(`event-offer`);
  const preparedOffers = offers.map((offer) => {
    const [title, price] = offer.split(`-`);
    return {
      title,
      price,
    };
  });

  return new PointModel({
    id,
    'base_price': formData.get(`event-price`),
    'date_from': dateFrom,
    'date_to': dateTo,
    'destination': formData.get(`event-destination`),
    'is_favorite': isFavorite,
    'type': formData.get(`event-type`),
    'offers': preparedOffers,
  });
};

export default class EditPoint extends AbstractSmartComponent {
  constructor(point, destinations) {
    super();
    this._point = point;
    this._destinations = destinations;
    this._flatpickrs = [];
    this._externalData = ButtonText;

    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
    this._favoriteButtonClickHandler = null;
    this._typeChangeHandler = null;
    this._destinationInputChangeHandler = null;
  }

  removeElement() {
    this.removeFlatPickrs();
    super.removeElement();
  }

  getTemplate() {
    return createEditPointTemplate(this._point, this._destinations, this._externalData);
  }

  rerender() {
    super.rerender();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);
    this.setTypeChangeHandler(this._typeChangeHandler);
    this.setDestinationInputChangeHandler(this._destinationInputChangeHandler);
  }


  reset() {
    this.rerender();
  }

  applyFlatpickrs() {
    const timeElements = Array.from(this.getElement().querySelectorAll(`.event__input--time`));
    timeElements.forEach((dateElement) => {
      this._flatpickrs.push(flatpickr(dateElement, {
        allowInput: true,
        defaultDate: dateElement.id.includes(`event-end-time`) ? formatFlatpickrDate(this._point.dateTo) : formatFlatpickrDate(this._point.dateFrom),
        dateFormat: `d/m/Y h:i`,
      }));
    });
  }

  removeFlatPickrs() {
    if (this._flatpickrs.length) {
      this._flatpickrs.forEach((dataPicker) => dataPicker.destroy());
      this._flatpickrs = [];
    }
  }

  getData() {
    const form = this.getElement();
    const formData = new FormData(form);
    return parseFormData(formData, this._point.id, this._point.isFavorite);
  }

  setData(data) {
    this._externalData = Object.assign({}, ButtonText, data);
    this.rerender();
  }

  setTypeChangeHandler(handler) {
    this
      .getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`change`, handler);

    this._typeChangeHandler = handler;
  }

  setDestinationInputChangeHandler(handler) {
    this
      .getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, handler);

    this._destinationInputChangeHandler = handler;
  }

  setEditButtonClickHandler(handler) {
    this
      .getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }

  setDeleteButtonClickHandler(handler) {
    this
      .getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, () => {
        handler();
        this.removeFlatPickrs();
      });

    this._deleteButtonClickHandler = handler;
  }

  setSubmitHandler(handler) {
    this
      .getElement()
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();
        handler();
        this.removeFlatPickrs();
      });

    this._submitHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    this
      .getElement()
      .querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, handler);

    this._favoriteButtonClickHandler = handler;
  }
}
