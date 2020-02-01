import {Method, Route} from '../const';

import Point from '../models/point.js';
import Destination from '../models/destination';
import Offer from '../models/offer';

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

  createPoint(point) {
    return this._load({
      route: Route.POINTS,
      method: Method.POST,
      body: JSON.stringify(point.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then((response) => response.json())
    .then(Point.parsePoint);
  }

  updatePoint(id, point) {
    return this._load({
      route: `${Route.POINTS}/${id}`,
      method: Method.PUT,
      body: JSON.stringify(point.toRAW()),
      headers: new Headers({'Content-Type': `application/json`}),
    })
    .then((response) => response.json())
    .then(Point.parsePoint);
  }

  deletePoint(id) {
    return this._load({route: `${Route.POINTS}/${id}`, method: Method.DELETE});
  }

  getDestinations() {
    return this._load({route: Route.DESTINATIONS})
      .then((response) => response.json())
      .then(Destination.parseDestinations);
  }

  getOffers() {
    return this._load({route: Route.OFFERS})
      .then((response) => response.json())
      .then(Offer.parseOffers);
  }

  sync(points) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(points),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json());
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
