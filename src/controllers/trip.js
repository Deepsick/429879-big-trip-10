import {render} from '../utils/render';
import {HOUR_SIGN} from '../const';

import PointController from './point';

import SortComponent, {SortType} from '../components/sort';
import TripDayComponent from '../components/trip-day';
import TripDaysComponent from '../components/trip-days';
import NoTripDaysComponent from '../components/no-trip-days';

import {generateEvents} from '../mock/event';

const generateTripEvents = (tripDay) => {
  const {eventsCount} = tripDay;
  const events = generateEvents(eventsCount);

  return events;
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._events = [];
    this._pointControllers = [];

    this._noTripDaysComponent = new NoTripDaysComponent();
    this._sortComponent = new SortComponent();
    this._tripDaysComponent = new TripDaysComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(tripDays) {
    if (!tripDays.length) {
      render(this._container, this._noTripDaysComponent);
      return;
    }

    const renderTripDay = (tripDayListElement, tripDay, events) => {
      const tripDayComponent = new TripDayComponent(tripDay);
      const eventListElement = tripDayComponent.getElement().querySelector(`.trip-events__list`);
      events.forEach((event) => {
        const pointController = new PointController(eventListElement, this._onDataChange, this._onViewChange);
        pointController.render(event);
        this._pointControllers = [...this._pointControllers, pointController];
      });

      render(tripDayListElement, tripDayComponent);
    };

    tripDays.forEach((tripDay) => {
      const events = generateTripEvents(tripDay);
      tripDay.events = events;
      this._events = [...this._events, ...events];
      renderTripDay(this._tripDaysComponent.getElement(), tripDay, events);
    });

    render(this._container, this._sortComponent);
    render(this._container, this._tripDaysComponent);

    this._sortComponent.setSortTypeHandler((sortType) => {
      let sortedEvents = [];

      this._tripDaysComponent.getElement().innerHTML = ``;
      switch (sortType) {
        case SortType.EVENT:
          tripDays.forEach((tripDay) => {
            renderTripDay(this._tripDaysComponent.getElement(), tripDay, tripDay.events);
          });
          return;
        case SortType.TIME:
          sortedEvents = [...this._events].sort((left, right) => +right.duration.replace(HOUR_SIGN, ``) - +left.duration.replace(HOUR_SIGN, ``));
          break;
        case SortType.PRICE:
          sortedEvents = [...this._events].sort((left, right) => right.price - left.price);
          break;
      }

      this._tripDaysComponent.getElement().innerHTML = ``;
      renderTripDay(this._tripDaysComponent.getElement(), tripDays[0], sortedEvents);
      this._tripDaysComponent.getElement().querySelector(`.day__info`).innerHTML = ``;
    });
  }

  _onDataChange(eventController, oldEvent, newEvent) {
    const index = this._events.findIndex((event) => event.id === oldEvent.id);
    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newEvent, this._events.slice(index + 1));

    eventController.render(this._events[index]);
  }

  _onViewChange() {
    this._pointControllers.forEach((point) => point.setDefaultView());
  }
}
