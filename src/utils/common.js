import {MONTHS, ESCAPE_NAMES} from '../const';

const MIN_ARRAY_INDEX = 0;

export const formatDateToICO = (date) => {
  return date.toISOString();
};

export const formatDateToTime = (date) => {
  const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
  const minutes = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
  return `${hours}:${minutes}`;
};

export const getFullDate = (date) => {
  return formatDateToICO(date).split(`T`).join(` `);
};

export const formatDateToDay = (date) => {

  const month = MONTHS[date.getUTCMonth()];
  const day = date.getUTCDate();

  return `${month} ${day}`;
};

export const formatToTitleCase = (word) => {
  const firstLetter = word[0].toUpperCase();
  return `${firstLetter}${word.slice(1)}`;
};

export const getRandomIntervalNumber = (min, max) => {
  return min + Math.floor(Math.random() * max);
};

export const isEscKey = (key) => ESCAPE_NAMES.includes(key);

export const getRandomArrayElement = (array) => {
  const randomIndex = getRandomIntervalNumber(MIN_ARRAY_INDEX, array.length);

  return array[randomIndex];
};
