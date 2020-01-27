import {render, replace, remove, RenderPosition} from '../utils/render';
import {isEscKey} from '../utils/common';

import EditEventComponent from '../components/edit-point';
import EventComponent from '../components/point';

import PointModel from '../models/point.js';

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

export const EmptyPoint = {
  destination: {
    name: ``,
  },
  type: `taxi`,
  dateFrom: new Date(),
  dateTo: new Date(),
  price: ``,
  offers: [],
  isAdd: true,
};

export default class PointController {
  constructor(container, destinationsModel, offersModel, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._mode = Mode.DEFAULT;

    this._eventComponent = null;
    this._editEventComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point, mode) {
    const oldEventComponent = this._eventComponent;
    const oldEditEventComponent = this._editEventComponent;
    this._mode = mode;

    this._eventComponent = new EventComponent(point);
    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });
    point.availableOffers = this._offersModel.getTypeOffers(point.type).offers;
    this._editEventComponent = new EditEventComponent(point, this._destinationsModel.getDestinations());

    this._editEventComponent.setEditButtonClickHandler(() => {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });
    this._editEventComponent.setSubmitHandler(() => {
      this._editEventComponent.setData({
        SAVE: `Saving...`,
      });
      const data = this._editEventComponent.getData();
      this._onDataChange(this, point, data);
      this._replaceEditToEvent();
    });
    this._editEventComponent.setFavoriteButtonClickHandler(() => {
      const newPoint = PointModel.clone(point);
      newPoint.isFavorite = !newPoint.isFavorite;
      this._onDataChange(this, point, newPoint, Mode.EDIT);
    });

    this._editEventComponent.setTypeChangeHandler(() => {
      const newPoint = PointModel.clone(point);
      const type = this._editEventComponent
        .getElement()
        .querySelector(`.event__type-input:checked`)
        .value;
      const offers = this._offersModel.getTypeOffers(type).offers;
      newPoint.type = type;
      newPoint.availableOffers = offers;
      this._onDataChange(this, point, newPoint, Mode.EDIT, false);
    });

    this._editEventComponent.setDestinationInputChangeHandler(() => {
      const newPoint = PointModel.clone(point);
      const destination = this._editEventComponent
        .getElement()
        .querySelector(`.event__input--destination`)
        .value;
      const description = this._destinationsModel.getDestination(destination);
      newPoint.destination = description;
      this._onDataChange(this, point, newPoint, Mode.EDIT, false);
    });

    this._editEventComponent.setDeleteButtonClickHandler(() => {
      this._editEventComponent.setData({
        DELETE: `Deleting...`,
      });
      this._onDataChange(this, point, null);
    });
    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventComponent && oldEditEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._editEventComponent, oldEditEventComponent);
          this._replaceEditToEvent();
        } else {
          render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.EDIT:
        if (oldEventComponent && oldEditEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._editEventComponent, oldEditEventComponent);
          this._replaceEventToEdit();
        } else {
          render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldEditEventComponent && oldEventComponent) {
          remove(oldEventComponent);
          remove(oldEditEventComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._editEventComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  _replaceEditToEvent() {
    replace(this._eventComponent, this._editEventComponent);

    this._mode = Mode.DEFAULT;
  }

  _replaceEventToEdit() {
    this._onViewChange();
    replace(this._editEventComponent, this._eventComponent);
    this._editEventComponent.applyFlatpickrs();
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    if (isEscKey(evt.key)) {
      this._replaceEditToEvent(evt);
      this._editEventComponent.removeFlatPickrs();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._editEventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}
