import {getRandomIntervalNumber} from '../utils';


const Day = {
  MIN: 1,
  MAX: 12,
};

const Events = {
  MIN: 0,
  MAX: 5,
};

const generateTripDay = () => {
  return {
    day: getRandomIntervalNumber(Day.MIN, Day.MAX),
    date: new Date(),
    eventsCount: getRandomIntervalNumber(Events.MIN, Events.MAX),
  };
};


const generateTripDays = (amount) => {
  return new Array(amount)
    .fill(``)
    .map(generateTripDay);
};

export {generateTripDays};
