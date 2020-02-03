import nanoid from 'nanoid';
import moment from 'moment';
import _ from 'lodash';

import {render, replace, remove, RenderPosition} from '../utils/render';
import {isEscKey} from '../utils/common';
import {ButtonText, SHAKE_ANIMATION_TIMEOUT, TimeRatio} from '../const';

import EditPointComponent from '../components/edit-point';
import PointComponent from '../components/point';

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
  constructor(container, destinationsModel, offersModel, dataChangeHandler, viewChangeHandler, formChangeHandler) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
    this._formChangeHandler = formChangeHandler;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._mode = Mode.DEFAULT;
    this._point = null;

    this._pointComponent = null;
    this._editPointComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  render(point, mode) {
    const oldPointComponent = this._pointComponent;
    const oldEditPointComponent = this._editPointComponent;
    this._mode = mode;
    this._point = point;
    this._point.availableOffers = this._offersModel.getTypeOffers(point.type).offers;

    this._pointComponent = new PointComponent(point);
    this._pointComponent.setEditButtonClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    this._editPointComponent = new EditPointComponent(this._point, this._destinationsModel.getDestinations(), this._mode);
    this._editPointComponent.enable();

    this._editPointComponent.setEditButtonClickHandler(() => {
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    });

    this._editPointComponent.setSubmitHandler(() => {
      const data = this._editPointComponent.getData();
      this._editPointComponent.setData({
        SAVE: ButtonText.SAVING,
      });
      const offers = this._offersModel.getTypeOffers(data.type).offers;
      data.availableOffers = offers;
      const currentMode = !_.isUndefined(this._point.isFavorite) ? Mode.DEFAULT : Mode.ADDING;
      this._dataChangeHandler(this, this._point, data, currentMode);
    });

    this._editPointComponent.setFavoriteButtonClickHandler(() => {
      const newPoint = PointModel.clone(this._point);
      newPoint.isFavorite = !newPoint.isFavorite;
      this._dataChangeHandler(this, this._point, newPoint, Mode.EDIT);
    });

    this._editPointComponent.setTypeChangeHandler(() => {
      const newPoint = PointModel.clone(this._point);
      const type = this._editPointComponent
        .getElement()
        .querySelector(`.event__type-input:checked`)
        .value;
      const offers = this._offersModel.getTypeOffers(type).offers;
      newPoint.type = type;
      newPoint.availableOffers = offers;

      const currentMode = !_.isUndefined(this._point.isFavorite) ? Mode.EDIT : Mode.ADDING;
      this._dataChangeHandler(this, this._point, newPoint, currentMode, false);
    });

    this._editPointComponent.setTimeInputsChangeHandler((evt) => {
      const newPoint = PointModel.clone(this._point);
      const dateElement = evt.target;
      const date = evt.target.value;
      const convertedDate = moment(date, `DD/MM/YYYY HH:mm`);
      const isDateTo = dateElement.id.includes(`event-end-time`);
      if (isDateTo) {
        newPoint.dateTo = convertedDate;
      } else {
        newPoint.dateFrom = convertedDate;
      }
      const currentMode = !_.isUndefined(this._point.isFavorite) ? Mode.EDIT : Mode.ADDING;
      this._dataChangeHandler(this, this._point, newPoint, currentMode, false);
    });

    this._editPointComponent.setPriceChangeHandler((evt) => {
      const newPoint = PointModel.clone(this._point);
      const value = evt.target.value;
      const currentMode = !_.isUndefined(this._point.isFavorite) ? Mode.EDIT : Mode.ADDING;
      newPoint.price = value;
      this._dataChangeHandler(this, this._point, newPoint, currentMode, false);
    });

    this._editPointComponent.setOffersChangeHandler((evt) => {
      const newPoint = PointModel.clone(this._point);
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
      const currentMode = !_.isUndefined(this._point.isFavorite) ? Mode.EDIT : Mode.ADDING;
      this._dataChangeHandler(this, this._point, newPoint, currentMode, false);
    });

    this._editPointComponent.setDestinationInputChangeHandler(() => {
      const newPoint = PointModel.clone(this._point);
      const destination = this._editPointComponent
        .getElement()
        .querySelector(`.event__input--destination`)
        .value;
      const currentMode = !_.isUndefined(point.isFavorite) ? Mode.EDIT : Mode.ADDING;
      const description = this._destinationsModel.getDestination(destination);
      newPoint.destination = description;
      this._dataChangeHandler(this, point, newPoint, currentMode, false);
    });

    this._editPointComponent.setDeleteButtonClickHandler(() => {
      this._editPointComponent.setData({
        DELETE: ButtonText.DELETING,
      });
      const currentMode = !_.isUndefined(this._point.isFavorite) ? Mode.EDIT : Mode.ADDING;
      this._dataChangeHandler(this, this._point, null, currentMode);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldPointComponent && oldEditPointComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._editPointComponent, oldEditPointComponent);
          this._replaceEditToPoint();
          oldEditPointComponent.removeFlatPickrs();
        } else {
          render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.EDIT:
        if (oldPointComponent && oldEditPointComponent) {
          oldEditPointComponent.removeFlatPickrs();
          this._editPointComponent.applyFlatpickrs();
          replace(this._pointComponent, oldPointComponent);
          replace(this._editPointComponent, oldEditPointComponent);
        } else {
          this._editPointComponent.applyFlatpickrs();
          render(this._container, this._editPointComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldEditPointComponent && oldPointComponent) {
          remove(oldPointComponent);
          remove(oldEditPointComponent);
          oldEditPointComponent.removeFlatPickrs();
        }
        document.addEventListener(`keydown`, this._escKeyDownHandler);
        this._editPointComponent.applyFlatpickrs();
        render(this._container, this._editPointComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  shake() {
    this._editPointComponent.addAnimation(`shake ${SHAKE_ANIMATION_TIMEOUT / TimeRatio.SECOND_IN_MILLISECONDS}s`);
    this._pointComponent.addAnimation(`shake ${SHAKE_ANIMATION_TIMEOUT / TimeRatio.SECOND_IN_MILLISECONDS}s`);
    setTimeout(() => {
      this._editPointComponent.removeAnimation();
      this._pointComponent.removeAnimation();

      this._editPointComponent.setData({
        SAVE: ButtonText.SAVE,
        DELETE: ButtonText.DELETE,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  destroy() {
    this._editPointComponent.removeFlatPickrs();
    remove(this._pointComponent);
    remove(this._editPointComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceEditToPoint() {
    this._editPointComponent.removeFlatPickrs();
    if (this._mode === Mode.EDIT) {
      this.render(this._formChangeHandler(this._point.id), Mode.DEFAULT);
    }
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    replace(this._pointComponent, this._editPointComponent);
    this._mode = Mode.DEFAULT;
  }

  _replacePointToEdit() {
    this._viewChangeHandler();
    replace(this._editPointComponent, this._pointComponent);
    this._editPointComponent.applyFlatpickrs();
    this._mode = Mode.EDIT;
  }

  _escKeyDownHandler(evt) {
    if (isEscKey(evt.key)) {
      if (this._mode === Mode.ADDING) {
        this.destroy();
        return;
      }
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }
}
