import {Method, Route} from './const';

import Point from './models/point.js';
import Destination from './models/destination';

const checkStatus = (response) => {
  const {status, statusText} = response;
  if (status >= 200 && status < 300) {
    return response;
  } else {
    throw new Error(`${status}: ${statusText}`);
  }
};

const Api = class {
  constructor(endpoint, authorization) {
    this._endpoint = endpoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({route: Route.POINTS})
      .then((response) => response.json())
      .then(Point.parsePoints);
  }

  createPoint() {

  }

  updatePoint() {

  }

  deletePoint() {

  }

  getDestinations() {
    return this._load({route: Route.DESTINATIONS})
      .then((response) => response.json())
      .then(Destination.parseDestinations);
  }

  getOffers() {

  }

  _load({route, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endpoint}/${route}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default Api;
