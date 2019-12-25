import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.css';

import AbstractSmartComponent from './abstract-smart-component';


const createoffersMarkup = (offers) => {
  return offers.map((offer) => {
    const {type, price} = offer;
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-1" type="checkbox" name="event-offer-${type}" checked>
        <label class="event__offer-label" for="event-offer-${type}-1">
          <span class="event__offer-title">${type}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  });
};

export const createEditEventTemplate = ({type, city, photo, description, startTime, endTime, price, isFavorite, offers}) => {
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
          ${type} at
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>

      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>

    <section class="event__details">

      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${createoffersMarkup(offers).join(``)}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            <img class="event__photo" src="${photo}" alt="Event photo">
            <img class="event__photo" src="${photo}" alt="Event photo">
          </div>
        </div>
      </section>
    </section>
  </form>`;
};

const parseFormData = (formData) => {
  return {
    id: Math.random(),
    offers: [],
    city: formData.get(`event-destination`),
    type: formData.get(`event-type`),
    startTime: formData.get(`event-start-time`),
    endTime: formData.get(`event-end-time`),
    price: formData.get(`event-price`),
    isFavorite: formData.get(`event-favorite`),
    photo: `http://picsum.photos/300/150?r=${Math.random()}`,
    description: `lorem impsum`,
    duration: `10H`,
  };
};

export default class EditEvent extends AbstractSmartComponent {
  constructor(event) {
    super();
    this._event = event;
    this._flatpickrs = [];

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
    return createEditEventTemplate(this._event);
  }

  rerender() {
    super.rerender();

    this._applyFlatpickrs();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);
    this.setTypeChangeHandler(this._typeChangeHandler);
    this.setDestinationInputChangeHandler(this._destinationInputChangeHandler);
  }


  reset() {
    const event = this._event;

    this._isDateShowing = !!event.endTime;
    this._currentDescription = event.description;

    this.rerender();
  }

  applyFlatpickrs() {
    const timeElements = Array.from(this.getElement().querySelectorAll(`.event__input--time`));
    timeElements.forEach((dateElement) => {
      this._flatpickrs.push(flatpickr(dateElement, {
        allowInput: true,
        defaultDate: dateElement.id.includes(`event-end-time`) ? this._event.endTime : this._event.startTime,
        dateFormat: `d/m/Y H:i`,
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

    return parseFormData(formData);
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

    this._deleteButtonClickHandler = handler;
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