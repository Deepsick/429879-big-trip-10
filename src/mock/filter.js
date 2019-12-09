import {formatToTitleCase} from '../utils/common';

const generateFilter = (name) => ({
  title: formatToTitleCase(name),
  value: name,
  checked: false,
});

export const generateFilters = (filters) => {
  return filters.map((filter) => generateFilter(filter));
};
