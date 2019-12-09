import AbstractComponent from './abstract-component';

const createRouteInfoTemplate = () => (
  `<div class="trip-info__main">
    <h1 class="trip-info__title">Amsterdam &mdash; ... &mdash; Amsterdam</h1>

    <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;21</p>
  </div>`
);

export default class RouteInfo extends AbstractComponent {
  getTemplate() {
    return createRouteInfoTemplate();
  }
}

