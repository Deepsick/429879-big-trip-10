import {createElement} from '../utils';

const createEventsTemplate = () => `<ul class="trip-events__list"></ul>`;

export default class Events {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEventsTemplate();
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