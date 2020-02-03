import nanoid from "nanoid";

import Point from "../models/point";
import Destination from "../models/destination";
import Offer from "../models/offer";

const getSyncedPoints =
  (items) => items.filter(({success}) => success).map(({payload}) => payload.point);

export default class Provider {
  constructor(api, pointsStore, destinationsStore, offersStore) {
    this._api = api;
    this._isSynchronized = true;

    this._pointsStore = pointsStore;
    this._destinationsStore = destinationsStore;
    this._offersStore = offersStore;
  }

  getPoints() {
    if (this._isOnLine()) {
      return this._api.getPoints()
        .then((points) => {
          points.forEach((point) => this._pointsStore.setItem(point.id, point.toRAW()));
          return points;
        });
    }

    const storedPoints = Object.values(this._pointsStore.getAll());
    this._isSynchronized = false;
    return Promise.resolve(Point.parsePoints(storedPoints));
  }

  createPoint(point) {
    if (this._isOnLine()) {
      return this._api.createPoint(point)
        .then(((newPoint) => {
          this._pointsStore.setItem(newPoint.id, newPoint.toRAW());
          return newPoint;
        }));
    }

    const fakeId = nanoid();
    const fakeNewPoint = Point.parsePoint(Object.assign({}, point.toRAW(), {id: fakeId}));
    this._pointsStore.setItem(fakeNewPoint.id, Object.assign({}, fakeNewPoint.toRAW(), {offline: true}));
    this._isSynchronized = false;
    return Promise.resolve(fakeNewPoint);
  }

  updatePoint(id, data) {
    if (this._isOnLine()) {
      return this._api.updatePoint(id, data)
        .then(((newPoint) => {
          this._pointsStore.setItem(newPoint.id, newPoint.toRAW());
          return newPoint;
        }));
    }

    const fakeUpdatedPoint = Point.parsePoint(Object.assign({}, data.toRAW(), {id}));

    this._pointsStore.setItem(id, Object.assign({}, fakeUpdatedPoint.toRAW(), {offline: true}));
    this._isSynchronized = false;
    return Promise.resolve(fakeUpdatedPoint);
  }

  deletePoint(id) {
    if (this._isOnLine()) {
      return this._api.deletePoint(id)
        .then(() => this._pointsStore.removeItem(id));
    }

    this._pointsStore.removeItem(id);
    this._isSynchronized = false;
    return Promise.resolve();
  }

  getDestinations() {
    if (this._isOnLine()) {
      return this._api.getDestinations()
        .then((destinations) => {
          destinations.forEach((destination) => this._destinationsStore.setItem(destination.name, destination.toRAW()));
          return destinations;
        });
    }

    const storedDestinations = Object.values(this._destinationsStore.getAll());
    return Promise.resolve(Destination.parseDestinations(storedDestinations));
  }

  getOffers() {
    if (this._isOnLine()) {
      return this._api.getOffers()
        .then((offers) => {
          offers.forEach((offer) => this._offersStore.setItem(offer.type, offer.toRAW()));
          return offers;
        });
    }

    const storedOffers = Object.values(this._offersStore.getAll());
    return Promise.resolve(Offer.parseOffers(storedOffers));
  }

  sync() {
    if (this._isOnLine()) {
      const storedPoints = Object.values(this._pointsStore.getAll());
      return this._api.sync(storedPoints)
        .then((response) => {
          storedPoints.filter((point) => point.offline).forEach((point) => {
            this._pointsStore.removeItem(point.id);
          });

          const createdPoints = response.created;
          const updatedPoints = getSyncedPoints(response.updated);
          [...createdPoints, ...updatedPoints].forEach((point) => {
            this._pointsStore.setItem(point.id, point);
          });

          this._isSynchronized = true;
          const storedSyncPoints = Object.values(this._pointsStore.getAll());
          return Promise.resolve(Point.parsePoints(storedSyncPoints));
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
