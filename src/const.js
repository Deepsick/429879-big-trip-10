const StorePrefix = {
  DESTINATIONS: `destinations-localstorage`,
  OFFERS: `offers-localstorage`,
  POINTS: `points-localstorage`,
};
const STORE_VER = `v1`;

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const SortType = {
  EVENT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`,
};

export const TimeRatio = {
  DOUBLE_DIGIT: 10,
  HOUR: 1,
  SECOND_IN_MILLISECONDS: 1000,
  HOURS_IN_DAY: 24,
  MINUTES_IN_HOUR: 60,
};

export const ESCAPE_NAMES = [`Escape`, `Esc`];
export const HIDDEN_CLASS = `visually-hidden`;
export const Sign = {
  HOUR: `H`,
  EURO: `€`,
  COUNT: `x`,
};

export const TagName = {
  LABEL: `label`,
  LINK: `a`,
};

export const MenuItem = {
  TABLE: `table`,
  STATS: `stats`,
};

export const Emoji = {
  TAXI: `🚕`,
  BUS: `🚌`,
  TRAIN: `🚂`,
  SHIP: `🚢`,
  TRANSPORT: `🚆`,
  DRIVE: `🚗`,
  FLIGHT: `✈️`,
  CHECK: `🏨`,
  SIGHTSEEING: `🏛️`,
  RESTAURANT: `🍴`,
};

export const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

export const Route = {
  POINTS: `points`,
  DESTINATIONS: `destinations`,
  OFFERS: `offers`,
};

export const AUTHORIZATION = `Basic zxlkvckwerqwo=`;
export const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

export const StoreName = {
  POINTS: `${StorePrefix.POINTS}-${STORE_VER}`,
  DESTINATIONS: `${StorePrefix.DESTINATIONS}-${STORE_VER}`,
  OFFERS: `${StorePrefix.OFFERS}-${STORE_VER}`,
};

export const FILTER_ID_PREFIX = `filter-`;
export const ACTIVE_MENU_ITEM_CLASS = `trip-tabs__btn--active`;
export const ROUTE_SEPARATOR = `&mdash;`;
export const ROUTE_REPLACER = `...`;
export const ROUTE_COUNT = 3;
export const OFFER_COUNT = 3;
export const IS_CHECKED = true;

export const Transport = {
  TAXI: `taxi`,
  BUS: `bus`,
  TRAIN: `train`,
  SHIP: `ship`,
  TRANSPORT: `transport`,
  DRIVE: `drive`,
  FLIGHT: `flight`,
};

export const Station = {
  CHECK: `check`,
  SIGHTSEEING: `sightseeing`,
  RESTAURANT: `restaurant`,
};

export const TitlePlaceholder = {
  STATION: `in`,
  TRANSPORT: `to`,
};

export const DEFAULT_TRIP_DAY = {
  count: ``,
  date: ``,
};

export const ButtonText = {
  CANCEL: `Cancel`,
  DELETE: `Delete`,
  SAVE: `Save`,
  SAVING: `Saving...`,
  DELETING: `Deleting...`,
};

export const EVENT_COUNTER = 1;
export const DEBOUNCE_TIMEOUT = 500;
export const SHAKE_ANIMATION_TIMEOUT = 600;
export const CHECK_TYPE_PREFIX = `-in`;
