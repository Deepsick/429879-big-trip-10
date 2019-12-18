import {formatToTitleCase} from '../utils/common';

const generateFilter = (name, activeFilter) => ({
  title: formatToTitleCase(name),
  value: name,
  checked: name === activeFilter,
});

export const generateFilters = (filters) => {
  return Object.values(filters).map((filter) => generateFilter(filter));
};
