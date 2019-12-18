import {render} from '../utils/render';
import {HOUR_SIGN} from '../const';

import PointController, {Mode as PointControllerMode, EmptyPoint} from './point';

import SortComponent, {SortType} from '../components/sort';
import TripDayComponent from '../components/trip-day';
import TripDaysComponent from '../components/trip-days';
import NoTripDaysComponent from '../components/no-trip-days';

import {generateTripDay} from '../mock/trip-day';

const IS_CHECKED = true;

const renderPoints = (pointListElement, points, onDataChange, onViewChange) => {
  return points.map((point) => {
    const pointController = new PointController(pointListElement, onDataChange, onViewChange);
    pointController.render(point, PointControllerMode.DEFAULT);
    return pointController;
  });
};

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointControllers = [];
    this._pointsModel = pointsModel;

    this._creatingPoint = null;

    this._noTripDaysComponent = new NoTripDaysComponent();
    this._sortComponent = new SortComponent();
    this._tripDaysComponent = new TripDaysComponent();
    this._tripDayComponent = null;

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

    const tripDay = generateTripDay();
    this._tripDayComponent = new TripDayComponent(tripDay);
    const newPoints = this._renderPoints(points);
    this._pointControllers = [...this._pointControllers, ...newPoints];

    render(this._tripDaysComponent.getElement(), this._tripDayComponent);
    render(container, this._sortComponent);
    render(container, this._tripDaysComponent);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    const eventListElement = this._tripDayComponent.getElement().querySelector(`.trip-events__list`);
    this._creatingPoint = new PointController(eventListElement, this._onDataChange, this._onViewChange);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
  }

  _removePoints() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    this._tripDayComponent.getElement().querySelector(`.trip-events__list`).innerHTML = ``;
  }

  _renderPoints(points) {
    const eventListElement = this._tripDayComponent.getElement().querySelector(`.trip-events__list`);
    return renderPoints(eventListElement, points, this._onDataChange, this._onViewChange);
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints());
  }

  _onDataChange(pointController, oldData, newData) {
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
      this._pointsModel.removePoint(oldData.id);
      this._updatePoints();
    } else {
      const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

      if (isSuccess) {
        pointController.render(newData, PointControllerMode.DEFAULT);
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
    switch (sortType) {
      case SortType.EVENT:
        sortedEvents = [...this._pointsModel.getPoints()];
        break;
      case SortType.TIME:
        sortedEvents = [...this._pointsModel.getPoints()].sort((left, right) => +right.duration.replace(HOUR_SIGN, ``) - +left.duration.replace(HOUR_SIGN, ``));
        break;
      case SortType.PRICE:
        sortedEvents = [...this._pointsModel.getPoints()].sort((left, right) => right.price - left.price);
        break;
    }
    this._sortComponent.getElement().querySelector(`input[value="${sortType}"]`).checked = IS_CHECKED;
    this._tripDayComponent.getElement().querySelector(`.trip-events__list`).innerHTML = ``;
    this._renderPoints(sortedEvents);
  }
}

