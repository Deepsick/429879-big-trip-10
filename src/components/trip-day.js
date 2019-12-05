import {createElement, formatDateToDay, formatDateToICO} from '../utils';

const createTripDayTemplate = (tripDay) => {
  const {day, date} = tripDay;

  return `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${day}</span>
      <time class="day__date" datetime="${formatDateToICO(date)}">${formatDateToDay(date)}</time>
    </div>
  </li>`;
};

export default class TripDay {
  constructor(tripDay) {
    this._element = null;
    this._tripDay = tripDay;
  }

  getTemplate() {
    return createTripDayTemplate(this._tripDay);
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
