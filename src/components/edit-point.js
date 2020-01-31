import flatpickr from 'flatpickr';
import moment from 'moment';
import he from 'he';
import debounce from 'lodash/debounce';
import 'flatpickr/dist/flatpickr.css';

import {getTitlePlaceholder, formatToTitleCase} from '../utils/common';
import {formatFlatpickrDate} from '../utils/date';
import {ButtonText, DEBOUNCE_TIMEOUT, Station, Transport} from '../const';

import {Mode} from '../controllers/point';

import PointModel from '../models/point';

import AbstractSmartComponent from './abstract-smart-component';

const CHECK_TYPE_PREFIX = `-in`;

const createoffersMarkup = (offers, availableOffers) => {
  return availableOffers.map((offer) => {
    const {title, price} = offer;
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer" ${offers.find((pointOffer) => pointOffer.title === offer.title) ? `checked` : ``} value="${title}">
        <label class="event__offer-label" for="event-offer-${title}-1">
          <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  });
};

const createOfferSection = (offers, availableOffers) => {
  if (!availableOffers.length) {
    return ``;
  }

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${createoffersMarkup(offers, availableOffers).join(``)}
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
  return destinations.map((destination) => `<option value="${destination.name}"></option>`);
};

const createPicturesMarkup = (pictures) => {
  return pictures.map((picture) => {
    const {src, description} = picture;

    return (
      `<img class="event__photo" src="${src}" alt="${description}">`
    );
  });
};

const createDescription = (destination) => {
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

const createTypeList = (type) => {
  const transportInputs = Object.values(Transport).map((transportType) => {
    return (
      `<div class="event__type-item">
        <input id="event-type-${transportType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${transportType} ${transportType === type ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${transportType}" for="event-type-${transportType}-1">${formatToTitleCase(transportType)}</label>
      </div>`
    );
  });

  const activityInputs = Object.values(Station).map((activityType) => {
    if (activityType === `check`) {
      activityType += CHECK_TYPE_PREFIX;
    }
    return (
      `<div class="event__type-item">
        <input id="event-type-${activityType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${activityType} ${activityType === type ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${activityType}" for="event-type-${activityType}-1">${formatToTitleCase(activityType)}</label>
      </div>`
    );
  });

  return (
    `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" value=${type}>
      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Transfer</legend>
          ${transportInputs.join(``)}
        </fieldset>
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Activity</legend>
          ${activityInputs.join(``)}
        </fieldset>
      </div>
    </div>`
  );
};

export const createEditPointTemplate = ({type, destination, dateFrom, dateTo, price, isFavorite, offers, availableOffers}, destinations, isAdd, externalData) => {
  const {name} = destination;
  const deleteButtonText = externalData.DELETE;
  const saveButtonText = externalData.SAVE;
  const cancelButtonText = externalData.CANCEL;

  return `<form class="event  event--edit" action="#" method="post">
    <header class="event__header">
      ${createTypeList(type)}

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${formatToTitleCase(type)} ${getTitlePlaceholder(type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(name)}" list="destination-list-1" required>
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

    ${!name ? `` :
    `<section class="event__details">
      ${createOfferSection(offers, availableOffers)}
      ${createDescription(destination)}
    </section>`}
  </form>`;
};

const parseFormData = (formData, isFavorite, id, destinations, availableOffers) => {
  const dateFrom = formData.get(`event-start-time`);
  const dateTo = formData.get(`event-end-time`);
  const offers = formData.getAll(`event-offer`);
  const preparedDestination = destinations.find((destination) => destination.name === formData.get(`event-destination`));
  const preparedOffers = offers.map((offer) => {
    const price = availableOffers.find((availableOffer) => availableOffer.title === offer).price;
    return {
      title: offer,
      price,
    };
  });
  return new PointModel({
    id,
    'base_price': formData.get(`event-price`),
    'date_from': moment(dateFrom, `DD/MM/YYYY HH:mm`),
    'date_to': moment(dateTo, `DD/MM/YYYY HH:mm`),
    'destination': preparedDestination,
    'is_favorite': isFavorite,
    'type': formData.get(`event-type`),
    'offers': preparedOffers,
  });
};

export default class EditPoint extends AbstractSmartComponent {
  constructor(point, destinations, isAdd = Mode.EDIT) {
    super();
    this._point = point;
    this._destinations = destinations;
    this._isAdd = isAdd === Mode.ADDING;
    this._flatpickrs = [];
    this._externalData = ButtonText;
    this._isDisabled = false;

    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
    this._favoriteButtonClickHandler = null;
    this._typeChangeHandler = null;
    this._destinationInputChangeHandler = null;
    this._editButtonClickHandler = null;
    this._offersChangeHandler = null;
    this._priceChangeHandler = null;
    this._timeInputsChangeHandler = null;
  }

  removeElement() {
    this.removeFlatPickrs();
    super.removeElement();
  }

  getTemplate() {
    return createEditPointTemplate(this._point, this._destinations, this._isAdd, this._externalData);
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
    this.setEditButtonClickHandler(this._editButtonClickHandler);
    this.setOffersChangeHandler(this._offersChangeHandler);
    this.setPriceChangeHandler(this._priceChangeHandler);
    this.setTimeInputsChangeHandler(this._timeInputsChangeHandler);
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
    return parseFormData(formData, this._point.isFavorite, this._point.id, this._destinations, this._point.availableOffers);
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
    if (!this._isAdd) {
      this
        .getElement()
        .querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, handler);

      this._editButtonClickHandler = handler;
    }
  }

  setTimeInputsChangeHandler(handler) {
    this
      .getElement()
      .querySelectorAll(`.event__input--time`)
      .forEach((time) => time.addEventListener(`change`, handler));

    this._timeInputsChangeHandler = handler;
  }

  setPriceChangeHandler(handler) {
    this
      .getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`change`, handler);

    this._priceChangeHandler = handler;
  }

  setOffersChangeHandler(handler) {
    if (!this._isAdd && this._point.availableOffers.length) {
      this
      .getElement()
        .querySelector(`.event__available-offers`)
        .addEventListener(`click`, (evt) => {
          const target = evt.target;
          if (target.classList.contains(`event__offer-checkbox`)) {
            handler(evt);
          }
        });

      this._offersChangeHandler = handler;
    }
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
    if (!this._isAdd) {
      this
        .getElement()
        .querySelector(`.event__favorite-btn`)
        .addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));

      this._favoriteButtonClickHandler = handler;
    }
  }

  disable() {
    const buttons = this.getElement().querySelectorAll(`button`);
    const inputs = this.getElement().querySelectorAll(`input`);

    buttons.forEach((button) => {
      button.disabled = true;
    });
    inputs.forEach((input) => {
      input.disabled = true;
    });

    this.__isDisabled = true;
  }

  enable() {
    if (this.__isDisabled) {
      const buttons = this.getElement().querySelectorAll(`button`);
      const inputs = this.getElement().querySelectorAll(`input`);

      buttons.forEach((button) => {
        button.disabled = false;
      });
      inputs.forEach((input) => {
        input.disabled = false;
      });
    }
  }
}
