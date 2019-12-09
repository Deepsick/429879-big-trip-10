import AbstractComponent from './abstract-component';
import {formatDateToDay, formatDateToICO} from '../utils/common';

const createTripDayTemplate = (tripDay) => {
  const {day, date} = tripDay;

  return `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${day}</span>
      <time class="day__date" datetime="${formatDateToICO(date)}">${formatDateToDay(date)}</time>
    </div>
    <ul class="trip-events__list"></ul>
  </li>`;
};

export default class TripDay extends AbstractComponent {
  constructor(tripDay) {
    super();
    this._tripDay = tripDay;
  }

  getTemplate() {
    return createTripDayTemplate(this._tripDay);
  }
}
