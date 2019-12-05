const MIN_ARRAY_INDEX = 0;

const MONTHS = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

const RenderPosition = {
  BEFOREEND: `beforeend`,
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
};

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

export const createElement = (template) => {
  const container = document.createElement(`div`);
  container.innerHTML = template;

  return container.firstChild;
};

export const getRandomIntervalNumber = (min, max) => {
  return min + Math.floor(Math.random() * max);
};

export const getRandomArrayElement = (array) => {
  const randomIndex = getRandomIntervalNumber(MIN_ARRAY_INDEX, array.length);

  return array[randomIndex];
};

export const render = (node, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      node.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      node.append(element);
      break;
    case RenderPosition.AFTEREND:
      node.after(element);
      break;
  }
};

