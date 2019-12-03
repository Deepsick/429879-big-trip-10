const createFilterMarkup = (filter) => {
  const {title, value, checked} = filter;

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${value}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${value}" ${checked ? checked : ``}>
      <label class="trip-filters__filter-label" for="filter-${value}">${title}</label>
    </div>`
  );
};

export const getFiltersElement = (filters) => {
  const tripFilters = filters.map((filter) => createFilterMarkup(filter));

  return (
    `<form class="trip-filters" action="#" method="get">
      ${tripFilters}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};
