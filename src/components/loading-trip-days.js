import AbstractComponent from './abstract-component';

const createLoadingTripDays = () => `<p class="trip-events__msg">Loading...</p>`;

export default class LoadingTripDays extends AbstractComponent {
  getTemplate() {
    return createLoadingTripDays();
  }
}
