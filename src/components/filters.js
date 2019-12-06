import {createElement} from '../utils';

const createFilterTemplate = (filter) => {
  const {title, value, checked} = filter;

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${value}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${value}" ${checked ? checked : ``}>
      <label class="trip-filters__filter-label" for="filter-${value}">${title}</label>
    </div>`
  );
};

const createFiltersTemplate = (filters) => {
  const tripFilters = filters.map((filter) => createFilterTemplate(filter)).join(``);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${tripFilters}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filters {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
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

