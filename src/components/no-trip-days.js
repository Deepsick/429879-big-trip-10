import {createElement} from '../utils';

const createNoTripDaysTemplate = () => `<p class="trip-events__msg">Click New Event to create your first point</p>`;

export default class NoTripDays {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNoTripDaysTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
