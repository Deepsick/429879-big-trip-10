import moment from 'moment';
import {ESCAPE_NAMES, TimeRatio} from '../const';

export const formatDate = (date) => {
  return moment(date).format(`DD/MM/YYYY hh:mm`);
};

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const formatDateToDay = (date) => {
  return moment(date).format(`MMM D`);
};

const addZeroToTime = (time) => {
  return `${time < TimeRatio.DOUBLE_DIGIT ? `0` + time : time}`;
};

export const formatDuration = (startDate, endDate) => {
  const mseconds = moment(endDate).diff(moment(startDate));
  let minutes = Math.floor(mseconds / TimeRatio.SECOND_IN_MILLISECONDS / TimeRatio.MINUTES_IN_HOUR);
  const days = Math.floor(minutes / TimeRatio.MINUTES_IN_HOUR / TimeRatio.HOURS_IN_DAY);
  const hours = Math.floor((minutes - (days * TimeRatio.HOURS_IN_DAY * TimeRatio.MINUTES_IN_HOUR)) / TimeRatio.MINUTES_IN_HOUR);
  minutes = minutes - days * TimeRatio.HOURS_IN_DAY * TimeRatio.MINUTES_IN_HOUR - hours * TimeRatio.MINUTES_IN_HOUR;

  if (days !== 0) {
    return `${addZeroToTime(days)}D ${addZeroToTime(hours)}H ${addZeroToTime(minutes)}M`;
  }

  if (hours < TimeRatio.HOUR) {
    return `${addZeroToTime(minutes)}M`;
  }

  return `${addZeroToTime(hours)}H ${addZeroToTime(minutes)}M`;
};

export const getFullDate = (date) => {
  return formatDate(date).split(`T`).join(` `);
};

export const formatToTitleCase = (word) => {
  const firstLetter = word[0].toUpperCase();
  return `${firstLetter}${word.slice(1)}`;
};

export const isEscKey = (key) => ESCAPE_NAMES.includes(key);

export const getLastArrayElement = (array) => array[array.length - 1];
