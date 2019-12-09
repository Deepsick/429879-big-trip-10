import AbstractComponent from './abstract-component';

const createNoTripDaysTemplate = () => `<p class="trip-events__msg">Click New Event to create your first point</p>`;

export default class NoTripDays extends AbstractComponent {
  getTemplate() {
    return createNoTripDaysTemplate();
  }
}
