import moment from 'moment';

import {TimeRatio} from '../const';


const addZeroToTime = (time) => {
  return `${time < TimeRatio.DOUBLE_DIGIT ? `0` + time : time}`;
};

export const formatFlatpickrDate = (date) => {
  return moment(new Date(date)).format(`DD/MM/YYYY HH:mm`);
};

export const formatTagTime = (date) => {
  return moment(new Date(date)).format(`YYYY-MM-DD`);
};

export const formatTime = (date) => {
  return moment(new Date(date)).format(`HH:mm`);
};

export const formatDateToDay = (date) => {
  return moment(new Date(date)).format(`MMM D`);
};

export const formatStatisticsDuration = (duration) => {
  return Math.ceil(moment.duration(duration).asHours());
};

export const compareDates = (a, b) => moment(a).diff(b);

export const formatDuration = (duration) => {
  let minutes = Math.floor(duration / TimeRatio.SECOND_IN_MILLISECONDS / TimeRatio.MINUTES_IN_HOUR);
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

