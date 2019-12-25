import {render, replace, remove} from '../utils/render';
import {isEscKey} from '../utils/common';

import EditEventComponent from '../components/edit-point';
import EventComponent from '../components/point';


export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

export const EmptyPoint = {
  destination: ``,
  type: null,
  startTime: null,
  endTime: null,
  price: 0,
  isFavorite: false,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
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

      this._editEventComponent.applyFlatpickrs();
      this._editEventComponent.setSubmitHandler(() => {
        this._replaceEditToEvent();
        const data = this._editEventComponent.getData();
        this._onDataChange(this, point, data);
      });
      this._editEventComponent.setFavoriteButtonClickHandler(() => this._onDataChange(
          this,
          point,
          Object.assign({}, point, {isFavorite: !point.isFavorite})
      ));

      this._editEventComponent.setTypeChangeHandler(() => {
        const type = this._editEventComponent
          .getElement()
          .querySelector(`.event__type-input:checked`)
          .value;
        const offers = generateOffers();
        this._onDataChange(this, point, Object.assign({}, point, {type, offers}));
      });

      this._editEventComponent.setDestinationInputChangeHandler(() => this._onDataChange(
          this,
          point,
          Object.assign({}, point, {description: genereateDescription()})
      ));

      this._editEventComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, point, null));
    });

    this._editEventComponent = new EditEventComponent(point);

    if (oldEventComponent && oldEditEventComponent) {
      replace(this._eventComponent, oldEventComponent);
      replace(this._editEventComponent, oldEditEventComponent);
      return;
    }
    render(this._container, this._eventComponent);
  }

  _replaceEditToEvent() {
    replace(this._eventComponent, this._editEventComponent);

    this._mode = Mode.DEFAULT;
  }

  _replaceEventToEdit() {
    this._onViewChange();
    replace(this._editEventComponent, this._eventComponent);

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
