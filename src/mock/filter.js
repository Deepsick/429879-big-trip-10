import {formatToTitleCase} from '../utils';

const generateFilter = (name) => ({
  title: formatToTitleCase(name),
  value: name,
  checked: false,
});

export const generateFilters = (filters) => {
  return filters.map((filter) => generateFilter(filter));
};
