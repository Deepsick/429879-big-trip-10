import nanoid from 'nanoid';
import moment from 'moment';
import _ from 'lodash';

import {render, replace, remove, RenderPosition} from '../utils/render';
import {isEscKey} from '../utils/common';
import {ButtonText, SHAKE_ANIMATION_TIMEOUT, MSECONDS_IN_SECOND} from '../const';

import EditEventComponent from '../components/edit-point';
import EventComponent from '../components/point';

import PointModel from '../models/point.js';

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

const createEmptyPoint = () => ({
  'id': nanoid(),
  'destination': {
    name: ``,
  },
  'type': `flight`,
  'date_from': new Date().toISOString(),
  'date_to': new Date().toISOString(),
  'base_price': ``,
  'offers': [],
  'isAdd': true,
});
export const EmptyPoint = createEmptyPoint();

export default class PointController {
  constructor(container, destinationsModel, offersModel, onDataChange, onViewChange, onFormChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onFormChange = onFormChange;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._mode = Mode.DEFAULT;
    this._point = null;

    this._eventComponent = null;
    this._editEventComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point, mode) {
    const oldEventComponent = this._eventComponent;
    const oldEditEventComponent = this._editEventComponent;
    this._mode = mode;
    this._point = point;

    this._eventComponent = new EventComponent(point);
    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });
    point.availableOffers = this._offersModel.getTypeOffers(point.type).offers;
    this._editEventComponent = new EditEventComponent(point, this._destinationsModel.getDestinations(), this._mode);
    this._editEventComponent.enable();

    this._editEventComponent.setEditButtonClickHandler(() => {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editEventComponent.setSubmitHandler(() => {
      const data = this._editEventComponent.getData();
      this._editEventComponent.setData({
        SAVE: ButtonText.SAVING,
      });
      const offers = this._offersModel.getTypeOffers(data.type).offers;
      data.availableOffers = offers;
      const currentMode = !_.isUndefined(point.isFavorite) ? Mode.DEFAULT : Mode.ADDING;
      this._onDataChange(this, point, data, currentMode);
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

      const currentMode = !_.isUndefined(point.isFavorite) ? Mode.EDIT : Mode.ADDING;
      this._onDataChange(this, point, newPoint, currentMode, false);
    });

    this._editEventComponent.setTimeInputsChangeHandler((evt) => {
      const newPoint = PointModel.clone(point);
      const dateElement = evt.target;
      const date = evt.target.value;
      const convertedDate = moment(date, `DD/MM/YYYY HH:mm`);
      const isDateTo = dateElement.id.includes(`event-end-time`);
      if (isDateTo) {
        newPoint.dateTo = convertedDate;
      } else {
        newPoint.dateFrom = convertedDate;
      }
      const currentMode = !_.isUndefined(point.isFavorite) ? Mode.EDIT : Mode.ADDING;
      this._onDataChange(this, point, newPoint, currentMode, false);
    });

    this._editEventComponent.setPriceChangeHandler((evt) => {
      const newPoint = PointModel.clone(point);
      const value = evt.target.value;
      const currentMode = !_.isUndefined(point.isFavorite) ? Mode.EDIT : Mode.ADDING;
      newPoint.price = value;
      this._onDataChange(this, point, newPoint, currentMode, false);
    });

    this._editEventComponent.setOffersChangeHandler((evt) => {
      const newPoint = PointModel.clone(point);
      const value = evt.target.value;
      const [name, price] = value.split(`|`);
      const index = newPoint.offers.findIndex((offer) => offer.title === name);
      if (index === -1) {
        newPoint.offers.push({
          title: name,
          price,
        });
      } else {
        newPoint.offers.splice(index, 1);
      }
      const currentMode = !_.isUndefined(point.isFavorite) ? Mode.EDIT : Mode.ADDING;
      this._onDataChange(this, point, newPoint, currentMode, false);
    });

    this._editEventComponent.setDestinationInputChangeHandler(() => {
      const newPoint = PointModel.clone(point);
      const destination = this._editEventComponent
        .getElement()
        .querySelector(`.event__input--destination`)
        .value;
      const currentMode = !_.isUndefined(point.isFavorite) ? Mode.EDIT : Mode.ADDING;
      const description = this._destinationsModel.getDestination(destination);
      newPoint.destination = description;
      this._onDataChange(this, point, newPoint, currentMode, false);
    });

    this._editEventComponent.setDeleteButtonClickHandler(() => {
      this._editEventComponent.setData({
        DELETE: ButtonText.DELETING,
      });
      const currentMode = !_.isUndefined(point.isFavorite) ? Mode.EDIT : Mode.ADDING;
      this._onDataChange(this, point, null, currentMode);
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
          this._editEventComponent.applyFlatpickrs();
        } else {
          render(this._container, this._editEventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldEditEventComponent && oldEventComponent) {
          remove(oldEventComponent);
          remove(oldEditEventComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        this._editEventComponent.applyFlatpickrs();
        render(this._container, this._editEventComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  shake() {
    this._editEventComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MSECONDS_IN_SECOND}s`;
    this._eventComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MSECONDS_IN_SECOND}s`;
    setTimeout(() => {
      this._editEventComponent.getElement().style.animation = ``;
      this._eventComponent.getElement().style.animation = ``;

      this._editEventComponent.setData({
        SAVE: ButtonText.SAVE,
        DELETE: ButtonText.DELETE,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
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

  _replaceEditToEvent() {
    if (this._mode === Mode.EDIT) {
      this.render(this._onFormChange(this._point.id), Mode.DEFAULT);
    }
    this._editEventComponent.removeFlatPickrs();
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
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
