import {ESCAPE_NAMES, Transport, TitlePlaceholder} from '../const';

export const formatToTitleCase = (word) => {
  const firstLetter = word[0].toUpperCase();
  return `${firstLetter}${word.slice(1)}`;
};

export const isEscKey = (key) => ESCAPE_NAMES.includes(key);

export const getLastElement = (points) => points[points.length - 1];

export const getTitlePlaceholder = (action) => {
  return Object.values(Transport).includes(action) ? TitlePlaceholder.TRANSPORT : TitlePlaceholder.STATION;
};

export const isTransport = (type) => Object.values(Transport).includes(type);

export const getUniqueItems = (points) => Array.from(new Set(points));
