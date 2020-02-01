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

const renderPoints = (tripDayContainer, destinations, points, offers, onDataChange, onViewChange, onFormChange) => {
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
      const pointController = new PointController(eventListElement, destinations, offers, onDataChange, onViewChange, onFormChange);
      pointController.render(point, PointControllerMode.DEFAULT);
      return pointController;
    });
};

const renderSortedPoints = (tripDayContainer, destinations, points, offers, onDataChange, onViewChange, onFormChange) => {
  const TripDaySortedComponent = new TripDayComponent(DEFAULT_TRIP_DAY);
  const eventListElement = TripDaySortedComponent.getElement().querySelector(`.trip-events__list`);
  TripDaySortedComponent.getElement().querySelector(`.day__info`).innerHTML = ``;
  render(tripDayContainer.getElement(), TripDaySortedComponent);

  return points.map((point) => {
    const pointController = new PointController(eventListElement, destinations, offers, onDataChange, onViewChange, onFormChange);
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

    this._onDataChange = this._onDataChange.bind(this);
    this._onFormChange = this._onFormChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent.setSortTypeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
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
    this._onViewChange();
    this._creatingTripDay = new TripDayComponent(DEFAULT_TRIP_DAY);
    const eventListElement = this._creatingTripDay.getElement().querySelector(`.trip-events__list`);
    this._creatingPoint = new PointController(eventListElement, this._destinationsModel, this._offersModel, this._onDataChange, this._onViewChange, this._onFormChange);
    render(this._tripDaysComponent.getElement(), this._creatingTripDay, RenderPosition.AFTERBEGIN);
    this._creatingPoint.render(Point.parsePoint(EmptyPoint), PointControllerMode.ADDING);
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

  _onDataChange(pointController, oldData, newData, mode = PointControllerMode.DEFAULT, isSave = true) {
    pointController._editEventComponent.disable();
    const destinations = this._destinationsModel.getDestinationNames();
    if (_.isEqual(oldData, Point.parsePoint(EmptyPoint))) {
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
    } else if (newData === null) {
      if (mode !== PointControllerMode.ADDING) {
        this._api.deletePoint(oldData.id)
          .then(() => {
            this._pointsModel.removePoint(oldData.id);
            this._updatePoints();
            this._routeInfoComponent.update(this._pointsModel.getPoints());
          })
          .catch(() => {
            pointController._editEventComponent.enable();
            pointController.render(oldData, PointControllerMode.EDIT);
            pointController.shake();
          });
      } else {
        this._pointsModel.removePoint(oldData.id);
        this._updatePoints();
        this._routeInfoComponent.update(this._pointsModel.getPoints());
      }
    } else {
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
              this._routeInfoComponent.update(this._pointsModel.getPoints());
              this._creatingPoint = null;
              this._creatingTripDay = null;
              pointController._editEventComponent.setData({
                SAVE: ButtonText.SAVE,
              });
            })
            .catch(() => {
              pointController._editEventComponent.enable();
              pointController.render(newData, PointControllerMode.ADDING);
              pointController.shake();
            });
        } else {
          this._api.updatePoint(oldData.id, newData)
            .then(() => {
              this._pointsModel.updatePoint(oldData.id, newData);
              // pointController.render(newData, mode);
              pointController._editEventComponent.enable();
              if (mode !== PointControllerMode.EDIT) {
                pointController._editEventComponent.setData({
                  SAVE: ButtonText.SAVE,
                });
                this._updatePoints();
              }
              this._routeInfoComponent.update(this._pointsModel.getPoints());
            })
            .catch(() => {
              pointController._editEventComponent.enable();
              pointController.render(newData, PointControllerMode.EDIT);
              pointController.shake();
            });
        }

      } else {
        // this._pointsModel.updatePoint(oldData.id, newData);
        pointController.render(newData, mode);
      }
    }
  }

  _onViewChange() {
    this._removeCreatePoint();
    this._pointControllers.forEach((point) => point.setDefaultView());
  }

  _onFormChange(id) {
    return this._pointsModel.getPoints().find((point) => point.id === id);
  }

  _onFilterChange() {
    this._updatePoints();
  }

  _onSortTypeChange(sortType) {
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
    this._tripDaysComponent.getElement().innerHTML = ``;
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
    if (isSorted) {
      return renderSortedPoints(this._tripDaysComponent, this._destinationsModel, points, this._offersModel, this._onDataChange, this._onViewChange, this._onFormChange);
    }

    return renderPoints(this._tripDaysComponent, this._destinationsModel, points, this._offersModel, this._onDataChange, this._onViewChange, this._onFormChange);
  }

  _updatePoints() {
    this._removePoints();
    if (this._isSorted) {
      this._onSortTypeChange(this._sortType);
    }

    const newPoints = this._renderPoints(this._pointsModel.getPoints(), this.isSorted);
    this._pointControllers = [...this._pointControllers, ...newPoints];
  }
}

