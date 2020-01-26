import {render, RenderPosition} from '../utils/render';
import {formatDateToDay} from '../utils/date';
import {IS_CHECKED, DEFAULT_TRIP_DAY} from '../const';

import PointController, {Mode as PointControllerMode, EmptyPoint} from './point';

import SortComponent, {SortType} from '../components/sort';
import TripDayComponent from '../components/trip-day';
import TripDaysComponent from '../components/trip-days';
import NoTripDaysComponent from '../components/no-trip-days';

const renderPoints = (tripDayContainer, destinations, points, offers, onDataChange, onViewChange) => {
  const tripDay = {
    date: ``,
    count: 0,
  };
  let currentTripDayComponent;
  return points.map((point) => {
    const day = formatDateToDay(point.dateFrom);
    if (day !== tripDay.date) {
      tripDay.date = day;
      tripDay.count = ++tripDay.count;
      currentTripDayComponent = new TripDayComponent(tripDay);
      render(tripDayContainer.getElement(), currentTripDayComponent);
    }
    const eventListElement = currentTripDayComponent.getElement().querySelector(`.trip-events__list`);
    const pointController = new PointController(eventListElement, destinations, offers, onDataChange, onViewChange);
    pointController.render(point, PointControllerMode.DEFAULT);
    return pointController;
  });
};

const renderSortedPoints = (tripDayContainer, destinations, points, offers, onDataChange, onViewChange) => {
  const TripDaySortedComponent = new TripDayComponent(DEFAULT_TRIP_DAY);
  const eventListElement = TripDaySortedComponent.getElement().querySelector(`.trip-events__list`);
  TripDaySortedComponent.getElement().querySelector(`.day__info`).innerHTML = ``;
  render(tripDayContainer.getElement(), TripDaySortedComponent);

  return points.map((point) => {
    const pointController = new PointController(eventListElement, destinations, offers, onDataChange, onViewChange);
    pointController.render(point, PointControllerMode.DEFAULT);
    return pointController;
  });
};

export default class TripController {
  constructor(container, pointsModel, destinationsModel, offersModel, api) {
    this._container = container;
    this._pointControllers = [];
    this._pointsModel = pointsModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._api = api;

    this._creatingPoint = null;

    this._noTripDaysComponent = new NoTripDaysComponent();
    this._sortComponent = new SortComponent();
    this._tripDaysComponent = new TripDaysComponent();

    this._onDataChange = this._onDataChange.bind(this);
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

    const newPoints = this._renderPoints(points);
    this._pointControllers = [...this._pointControllers, ...newPoints];

    render(container, this._sortComponent);
    render(container, this._tripDaysComponent);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }
    const newTripDayComponent = new TripDayComponent(DEFAULT_TRIP_DAY);
    const eventListElement = newTripDayComponent.getElement().querySelector(`.trip-events__list`);
    this._creatingPoint = new PointController(eventListElement, this._destinationsModel, this._offersModel, this._onDataChange, this._onViewChange);
    render(this._tripDaysComponent.getElement(), newTripDayComponent, RenderPosition.AFTERBEGIN);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
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

  _removePoints() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    this._tripDaysComponent.getElement().innerHTML = ``;
  }

  _renderPoints(points, isSorted = false) {
    if (isSorted) {
      return renderSortedPoints(this._tripDaysComponent, this._destinationsModel, points, this._offersModel, this._onDataChange, this._onViewChange);
    }

    return renderPoints(this._tripDaysComponent, this._destinationsModel, points, this._offersModel, this._onDataChange, this._onViewChange);
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints());
  }

  _onDataChange(pointController, oldData, newData, mode = PointControllerMode.DEFAULT, isSave = true) {

    if (oldData === EmptyPoint) {
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._pointsModel.addPoint(newData);
        pointController.render(newData, PointControllerMode.DEFAULT);

        const destroyedPoint = this._pointControllers.pop();
        destroyedPoint.destroy();

        this._pointControllers = [].concat(pointController, this._pointControllers);
      }
    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
        });
    } else {
      console.log(pointController, oldData, newData, mode, isSave);
      if (isSave) {
        this._api.updatePoint(oldData.id, newData);
      }
      const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

      if (isSuccess) {
        pointController.render(newData, mode);
      }
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((point) => point.setDefaultView());
  }

  _onFilterChange() {
    this._updatePoints();
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = [];
    let isSorted = true;
    switch (sortType) {
      case SortType.EVENT:
        sortedEvents = [...this._pointsModel.getPoints()];
        isSorted = false;
        break;
      case SortType.TIME:
        sortedEvents = [...this._pointsModel.getPoints()].sort((left, right) => right.duration - left.duration);
        break;
      case SortType.PRICE:
        sortedEvents = [...this._pointsModel.getPoints()].sort((left, right) => right.price - left.price);
        break;
    }

    this._sortComponent.getElement().querySelector(`input[value="${sortType}"]`).checked = IS_CHECKED;
    this._tripDaysComponent.getElement().innerHTML = ``;
    this._renderPoints(sortedEvents, isSorted);
  }
}

