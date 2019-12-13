import moment from 'moment';


import {MONTHS, ESCAPE_NAMES, TimeRatio} from '../const';

const MIN_ARRAY_INDEX = 0;

export const formatDate = (date) => {
  return moment(date).format(`DD/MM/YYYY hh:mm`);
};

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

const addZeroToTime = (time) => {
  return `${time < TimeRatio.DOUBLE_DIGIT ? `0` + time : time}`;
};

export const formatDuration = (startDate, endDate) => {
  const HOUR = 1;
  const mseconds = moment(endDate).diff(moment(startDate));
  let minutes = Math.floor(mseconds / TimeRatio.SECOND_IN_MILLISECONDS / TimeRatio.MINUTES_IN_HOUR);
  const days = Math.floor(minutes / TimeRatio.MINUTES_IN_HOUR / TimeRatio.HOURS_IN_DAY);
  const hours = Math.floor((minutes - (days * TimeRatio.HOURS_IN_DAY * TimeRatio.MINUTES_IN_HOUR)) / TimeRatio.MINUTES_IN_HOUR);
  minutes = minutes - days * TimeRatio.HOURS_IN_DAY * TimeRatio.MINUTES_IN_HOUR - hours * TimeRatio.MINUTES_IN_HOUR;

  if (days !== 0) {
    return `${addZeroToTime(days)}D ${addZeroToTime(hours)}H ${addZeroToTime(minutes)}M`;
  }

  if (hours < HOUR) {
    return `${addZeroToTime(minutes)}M`;
  }

  return `${addZeroToTime(hours)}H ${addZeroToTime(minutes)}M`;
};

export const getFullDate = (date) => {
  return formatDate(date).split(`T`).join(` `);
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
