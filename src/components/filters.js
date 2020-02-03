import {FILTER_ID_PREFIX, TagName} from '../const';
import {formatToTitleCase} from '../utils/common';

import AbstractComponent from './abstract-component';

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createFilterTemplate = (filter) => {
  const {name, checked} = filter;
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${checked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${name}">${formatToTitleCase(name)}</label>
    </div>`
  );
};

const createFiltersTemplate = (filters) => {
  const filtersMarkup = filters.map(createFilterTemplate).join(``);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filters extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this
      .getElement()
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        if (evt.target.tagName.toLowerCase() === TagName.LABEL) {
          const filterName = getFilterNameById(evt.target.htmlFor);
          handler(filterName);
        }
      });
  }

  setActiveItem(filterName) {
    this
    .getElement()
    .querySelector(`input:checked`)
    .checked = false;

    this
    .getElement()
    .querySelector(`#filter-${filterName}`)
    .checked = true;
  }
}

