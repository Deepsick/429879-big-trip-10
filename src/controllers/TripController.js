import {render, replace} from '../utils/render';
import {isEscKey} from '../utils/common';

import EditEventComponent from '../components/edit-event';
import EventComponent from '../components/event';
import SortComponent from '../components/sort';
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

const renderTripDay = (tripDayListElement, tripDay) => {
  const {eventsCount} = tripDay;
  const tripDayComponent = new TripDayComponent(tripDay);
  const eventListElement = tripDayComponent.getElement().querySelector(`.trip-events__list`);
  const events = generateEvents(eventsCount);
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

    tripDays.forEach((tripDay) => renderTripDay(this._tripDaysComponent.getElement(), tripDay));
    render(this._container, this._sortComponent);
    render(this._container, this._tripDaysComponent);
  }
}
