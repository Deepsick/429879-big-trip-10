import {render, replace} from '../utils/render';
import {isEscKey} from '../utils/common';
import {HOUR_SIGN} from '../const';

import EditEventComponent from '../components/edit-event';
import EventComponent from '../components/event';
import SortComponent, {SortType} from '../components/sort';
import TripDayComponent from '../components/trip-day';
import TripDaysComponent from '../components/trip-days';
import NoTripDaysComponent from '../components/no-trip-days';

import {generateEvents} from '../mock/event';

const renderEvent = (eventListElement, event) => {
  const onEscKeyDown = (evt) => {

    if (isEscKey(evt.key)) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceEditToEvent = () => {
    replace(eventComponent, editEventComponent);
  };

  const replaceEventToEdit = () => {
    replace(editEventComponent, eventComponent);
  };

  const eventComponent = new EventComponent(event);
  eventComponent.setEditButtonClickHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const editEventComponent = new EditEventComponent(event);
  editEventComponent.setSubmitHandler(replaceEditToEvent);

  render(eventListElement, eventComponent);
};

const generateTripEvents = (tripDay) => {
  const {eventsCount} = tripDay;
  const events = generateEvents(eventsCount);

  return events;
};

const renderTripDay = (tripDayListElement, tripDay, events) => {
  const tripDayComponent = new TripDayComponent(tripDay);
  const eventListElement = tripDayComponent.getElement().querySelector(`.trip-events__list`);
  events.forEach((event) => renderEvent(eventListElement, event));

  render(tripDayListElement, tripDayComponent);
};


export default class TripController {
  constructor(container) {
    this._container = container;

    this._noTripDaysComponent = new NoTripDaysComponent();
    this._sortComponent = new SortComponent();
    this._tripDaysComponent = new TripDaysComponent();
  }

  render(tripDays) {
    if (!tripDays.length) {
      render(this._container, this._noTripDaysComponent);
      return;
    }

    let allEvents = [];
    tripDays.forEach((tripDay) => {
      const events = generateTripEvents(tripDay);
      tripDay.events = events;
      allEvents = [...allEvents, ...events];
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
          sortedEvents = [...allEvents].sort((left, right) => +right.duration.replace(HOUR_SIGN, ``) - +left.duration.replace(HOUR_SIGN, ``));
          break;
        case SortType.PRICE:
          sortedEvents = [...allEvents].sort((left, right) => right.price - left.price);
          break;
      }

      this._tripDaysComponent.getElement().innerHTML = ``;
      renderTripDay(this._tripDaysComponent.getElement(), tripDays[0], sortedEvents);
      this._tripDaysComponent.getElement().querySelector(`.day__info`).innerHTML = ``;
    });
  }
}
