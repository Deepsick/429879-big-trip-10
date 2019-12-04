const TYPES = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`,
  `check-in`,
  `sightseeing`,
  `restaurant`,
];

const CITIES = [
  `Chamonix`,
  `Geneva`,
  `Hamburg`,
];

const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
   Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis. 
  Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`,
];

const OFFERS = [
  `Add luggage`,
  `Switch to comfort`,
  `Rent a car`,
];

const Price = {
  MIN: 10,
  MAX: 200,
};

const MIN_INDEX = 0;
let maxIntervalValue;

const getRandomIntervalNumber = (min, max) => {
  return min + Math.floor(Math.random() * max);
};

const getRandomArrayElement = (array) => {
  const randomIndex = getRandomIntervalNumber(MIN_INDEX, array.length);

  return array[randomIndex];
};

const genereateDescription = () => {
  maxIntervalValue = 4;
  let arrayLength = getRandomIntervalNumber(MIN_INDEX, maxIntervalValue);
  const cardDescriptions = new Array(arrayLength)
    .fill(``)
    .map(() => getRandomArrayElement(DESCRIPTIONS));

  return cardDescriptions.join(` `);
};

const generateDate = (date, hours = 0) => {
  date.setHours(date.getHours() + hours);
  return new Date(date);
};

const generateOffer = () => ({
  type: getRandomArrayElement(OFFERS),
  price: getRandomIntervalNumber(Price.MIN, Price.MAX)
});

const generateOffers = () => {
  maxIntervalValue = 3;
  let arrayLength = getRandomIntervalNumber(MIN_INDEX, maxIntervalValue);
  const cardOffers = new Array(arrayLength)
    .fill(``)
    .map(() => generateOffer());

  return cardOffers;
};

const generateCard = () => {
  const now = new Date();
  const randomHours = getRandomIntervalNumber(1, 13);

  return {
    type: getRandomArrayElement(TYPES),
    city: getRandomArrayElement(CITIES),
    photo: `http://picsum.photos/300/150?r=${Math.random()}`,
    description: genereateDescription(),
    startTime: generateDate(now),
    endTime: generateDate(now, randomHours),
    duration: `${randomHours}H`,
    price: getRandomIntervalNumber(10, 300),
    offers: generateOffers()
  };
};


const generateCards = (amount) => {
  return new Array(amount)
  .fill(``)
  .map(generateCard);
};

export {generateCard, generateCards};