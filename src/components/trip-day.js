import AbstractComponent from './abstract-component';
import {formatTagTime} from '../utils/date';

const createTripDayTemplate = (tripDay) => {
  const {count, date} = tripDay;

  return `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${count}</span>
      <time class="day__date" datetime="${formatTagTime(date)}">${date}</time>
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
