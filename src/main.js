import {render, isEscKey} from './utils';
import {FILTERS} from './const';

import EditEventComponent from './components/edit-event';
import EventComponent from './components/event';
import FiltersComponent from './components/filters';
import MenuComponent from './components/menu';
import RouteInfoComponent from './components/route-info';
import SortComponent from './components/sort';
import TripDayComponent from './components/trip-day';
import TripDaysComponent from './components/trip-days';

import {generateEvents} from './mock/event';
import {generateFilters} from './mock/filter';
import {generateMenu} from './mock/menu';
import {generateTripDays} from './mock/trip-day';


const TRIP_DAY_COUNT = 2;


const renderEvent = (eventListElement, event) => {
  const onEscKeyDown = (evt) => {

    if (isEscKey(evt.key)) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceEditToEvent = () => {
    eventListElement.replaceChild(eventComponent.getElement(), editEventComponent.getElement());
  };

  const replaceEventToEdit = () => {
    eventListElement.replaceChild(editEventComponent.getElement(), eventComponent.getElement());
  };

  const eventComponent = new EventComponent(event);
  const editButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);

  editButton.addEventListener(`click`, () => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const editEventComponent = new EditEventComponent(event);

  editEventComponent.getElement().addEventListener(`submit`, replaceEditToEvent);

  render(eventListElement, eventComponent.getElement());
};

const renderTripDay = (tripDayListElement, tripDay) => {
  const {eventsCount} = tripDay;
  const tripDayComponent = new TripDayComponent(tripDay);
  const eventListElement = tripDayComponent.getElement().querySelector('.trip-events__list');
  const events = generateEvents(eventsCount);
  events.forEach((event) => renderEvent(eventListElement, event));

  render(tripDayListElement, tripDayComponent.getElement());
};

const tripInfoElement = document.querySelector(`.trip-info`);
const menuTitleElement = document.querySelector(`.trip-controls h2:first-child`);
const filtersTitleElement = document.querySelector(`.trip-controls h2:last-child`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(tripInfoElement, new RouteInfoComponent().getElement(), `afterbegin`);

const menu = generateMenu();
render(menuTitleElement, new MenuComponent(menu).getElement(), `afterend`);

const filters = generateFilters(FILTERS);
render(filtersTitleElement, new FiltersComponent(filters).getElement(), `afterend`);
render(tripEventsElement, new SortComponent().getElement());
const tripDaysComponent = new TripDaysComponent();
render(tripEventsElement, tripDaysComponent.getElement());

const tripDays = generateTripDays(TRIP_DAY_COUNT);
tripDays.forEach((tripDay) => renderTripDay(tripDaysComponent.getElement(), tripDay));

