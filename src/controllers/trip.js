import _ from 'lodash';

import {render, RenderPosition, remove} from '../utils/render';
import {formatDateToDay} from '../utils/date';
import {IS_CHECKED, DEFAULT_TRIP_DAY, ButtonText, SortType} from '../const';

import PointController, {Mode as PointControllerMode, EmptyPoint} from './point';

import SortComponent from '../components/sort';
import TripDayComponent from '../components/trip-day';
import TripDaysComponent from '../components/trip-days';
import NoTripDaysComponent from '../components/no-trip-days';

import Point from '../models/point';

const renderPoints = (tripDayContainer, destinations, points, offers, dataChangeHandler, viewChangeHandler, formChangeHandler) => {
  const tripDay = {
    date: ``,
    count: 0,
  };
  let currentTripDayComponent;
  return points
    .map((point) => {
      const day = formatDateToDay(point.dateFrom);
      if (day !== tripDay.date) {
        tripDay.date = day;
        tripDay.count = ++tripDay.count;
        currentTripDayComponent = new TripDayComponent(tripDay);
        render(tripDayContainer.getElement(), currentTripDayComponent);
      }
      const eventListElement = currentTripDayComponent.getElement().querySelector(`.trip-events__list`);
      const pointController = new PointController(eventListElement, destinations, offers, dataChangeHandler, viewChangeHandler, formChangeHandler);
      pointController.render(point, PointControllerMode.DEFAULT);
      return pointController;
    });
};

const renderSortedPoints = (tripDayContainer, destinations, points, offers, dataChangeHandler, viewChangeHandler, formChangeHandler) => {
  const TripDaySortedComponent = new TripDayComponent(DEFAULT_TRIP_DAY);
  const eventListElement = TripDaySortedComponent.getElement().querySelector(`.trip-events__list`);
  TripDaySortedComponent.getElement().querySelector(`.day__info`).innerHTML = ``;
  render(tripDayContainer.getElement(), TripDaySortedComponent);

  return points.map((point) => {
    const pointController = new PointController(eventListElement, destinations, offers, dataChangeHandler, viewChangeHandler, formChangeHandler);
    pointController.render(point, PointControllerMode.DEFAULT);
    return pointController;
  });
};

export default class TripController {
  constructor(container, pointsModel, destinationsModel, offersModel, api, routeInfoComponent) {
    this._container = container;
    this._pointControllers = [];
    this._pointsModel = pointsModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._api = api;
    this._routeInfoComponent = routeInfoComponent;
    this._isSorted = false;
    this._sortType = SortType.EVENT;

    this._creatingPoint = null;
    this._creatingTripDay = null;

    this._noTripDaysComponent = new NoTripDaysComponent();
    this._sortComponent = new SortComponent();
    this._tripDaysComponent = new TripDaysComponent();

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._formChangeHandler = this._formChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);

    this._sortComponent.setSortTypeHandler(this._sortTypeChangeHandler);
    this._pointsModel.setFilterChangeHandler(this._filterChangeHandler);
  }

  render() {
    const points = this._pointsModel.getPoints();
    const container = this._container;
    if (!points.length) {
      render(container, this._noTripDaysComponent);
      return;
    }

    const newPoints = this._renderPoints(points, this.isSorted);
    this._pointControllers = [...this._pointControllers, ...newPoints];

    render(container, this._sortComponent);
    render(container, this._tripDaysComponent);
  }

  createPoint() {
    this._viewChangeHandler();
    this._creatingTripDay = new TripDayComponent(DEFAULT_TRIP_DAY);
    const eventListElement = this._creatingTripDay.getElement().querySelector(`.trip-events__list`);
    this._creatingPoint = new PointController(eventListElement, this._destinationsModel, this._offersModel, this._dataChangeHandler, this._viewChangeHandler, this._formChangeHandler);
    render(this._tripDaysComponent.getElement(), this._creatingTripDay, RenderPosition.AFTERBEGIN);
    this._creatingPoint.render(Point.parsePoint(EmptyPoint), PointControllerMode.ADDING);
  }

  updatePoints() {
    this._updatePoints();
  }

  hide() {
    this._sortComponent.hide();
    this._noTripDaysComponent.hide();
    this._tripDaysComponent.hide();
  }

  show() {
    this._sortComponent.show();
    this._noTripDaysComponent.show();
    this._tripDaysComponent.show();
  }

  _dataChangeHandler(pointController, oldData, newData, mode = PointControllerMode.DEFAULT, isSave = true) {
    pointController._editPointComponent.disable();
    const destinations = this._destinationsModel.getDestinationNames();
    if (_.isEqual(oldData, Point.parsePoint(EmptyPoint))) {
      this._createEmptyPoint(newData, oldData, pointController, destinations);
    } else if (newData === null) {
      this._deletePoint(mode, oldData, pointController);
    } else {
      this._updatePoint(newData, oldData, destinations, isSave, mode, pointController);
    }
  }

  _createEmptyPoint(newData, oldData, pointController, destinations) {
    if (newData === null) {
      pointController.destroy();
      this._updatePoints();
    } else {

      if (!newData.destination || !destinations.includes(newData.destination.name)) {
        newData.destination = {name: ``};
      }

      if (newData.dateTo.diff(newData.dateFrom) < 0) {
        newData.dateTo = oldData.dateTo;
        newData.dateFrom = oldData.dateFrom;
      }

      if (!Number.isInteger(+newData.price)) {
        newData.price = oldData.price;
      }

      pointController.render(newData, PointControllerMode.ADDING);
    }
  }

  _deletePoint(mode, oldData, pointController) {
    if (mode !== PointControllerMode.ADDING) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
          this._routeInfoComponent.update(this._pointsModel.getAllPoints());
        })
        .catch(() => {
          pointController._editPointComponent.enable();
          pointController.render(oldData, PointControllerMode.EDIT);
          pointController.shake();
        });
    } else {
      this._pointsModel.removePoint(oldData.id);
      pointController.destroy();
      this._updatePoints();
      this._routeInfoComponent.update(this._pointsModel.getAllPoints());
    }
  }

  _updatePoint(newData, oldData, destinations, isSave, mode, pointController) {

    if (!Number.isInteger(+newData.price)) {
      newData.price = oldData.price;
    }

    if (newData.dateTo.diff(newData.dateFrom) < 0) {
      newData.dateTo = oldData.dateTo;
      newData.dateFrom = oldData.dateFrom;
    }

    if (!newData.destination || !destinations.includes(newData.destination.name)) {
      newData.destination = oldData.destination;
    }

    if (isSave) {
      if (mode === PointControllerMode.ADDING) {
        newData.isFavorite = false;
        this._api.createPoint(newData)
          .then((point) => {
            this._pointsModel.addPoint(point);
            this._pointsModel.removePoint(newData.id);
            this._updatePoints();
            this._routeInfoComponent.update(this._pointsModel.getAllPoints());
            this._creatingPoint = null;
            this._creatingTripDay = null;
            pointController._editPointComponent.setData({
              SAVE: ButtonText.SAVE,
            });
          })
          .catch(() => {
            pointController._editPointComponent.enable();
            pointController.render(newData, PointControllerMode.ADDING);
            pointController.shake();
          });
      } else {
        this._api.updatePoint(oldData.id, newData)
          .then(() => {
            this._pointsModel.updatePoint(oldData.id, newData);
            pointController._editPointComponent.enable();
            if (mode !== PointControllerMode.EDIT) {
              pointController._editPointComponent.setData({
                SAVE: ButtonText.SAVE,
              });
              this._updatePoints();
            }
            this._routeInfoComponent.update(this._pointsModel.getAllPoints());
          })
          .catch(() => {
            pointController._editPointComponent.enable();
            pointController.render(newData, PointControllerMode.EDIT);
            pointController.shake();
          });
      }
    } else {
      pointController.render(newData, mode);
    }
  }

  _viewChangeHandler() {
    this._removeCreatePoint();
    this._pointControllers.forEach((point) => point.setDefaultView());
  }

  _formChangeHandler(id) {
    return this._pointsModel.getPoints().find((point) => point.id === id);
  }

  _filterChangeHandler() {
    this._updatePoints();
  }

  _sortTypeChangeHandler(sortType) {
    let sortedEvents = [];
    this._isSorted = true;
    switch (sortType) {
      case SortType.EVENT:
        sortedEvents = [...this._pointsModel.getPoints()];
        this._isSorted = false;
        this._sortType = SortType.EVENT;
        break;
      case SortType.TIME:
        sortedEvents = [...this._pointsModel.getPoints()].sort((left, right) => right.duration - left.duration);
        this._sortType = SortType.TIME;
        break;
      case SortType.PRICE:
        this._sortType = SortType.PRICE;
        sortedEvents = [...this._pointsModel.getPoints()].sort((left, right) => right.price - left.price);
        break;
    }

    this._sortComponent.getElement().querySelector(`input[value="${sortType}"]`).checked = IS_CHECKED;
    this._renderPoints(sortedEvents, this._isSorted);
  }

  _removeCreatePoint() {
    if (this._creatingPoint) {
      this._creatingPoint.destroy();
      remove(this._creatingTripDay);
      this._creatingTripDay.removeElement();
      this._creatingPoint = null;
      this._creatingTripDay = null;
    }
  }

  _removePoints() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    this._tripDaysComponent.getElement().innerHTML = ``;
  }

  _renderPoints(points, isSorted = false) {
    this._tripDaysComponent.getElement().innerHTML = ``;
    if (isSorted) {
      return renderSortedPoints(this._tripDaysComponent, this._destinationsModel, points, this._offersModel, this._dataChangeHandler, this._viewChangeHandler, this._formChangeHandler);
    }

    return renderPoints(this._tripDaysComponent, this._destinationsModel, points, this._offersModel, this._dataChangeHandler, this._viewChangeHandler, this._formChangeHandler);
  }

  _updatePoints() {
    this._removePoints();
    if (this._isSorted) {
      this._sortTypeChangeHandler(this._sortType);
    }

    const newPoints = this._renderPoints(this._pointsModel.getPoints(), this.isSorted);
    this._pointControllers = [...this._pointControllers, ...newPoints];
  }
}

