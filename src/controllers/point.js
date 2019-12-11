import {render, replace} from '../utils/render';
import {isEscKey} from '../utils/common';

import EditEventComponent from '../components/edit-event';
import EventComponent from '../components/event';

import {generateOffers, genereateDescription} from '../mock/event';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
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

  render(point) {
    const oldEventComponent = this._eventComponent;
    const oldEditEventComponent = this._editEventComponent;

    this._eventComponent = new EventComponent(point);
    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editEventComponent = new EditEventComponent(point);
    this._editEventComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
    });
    this._editEventComponent.setFavoriteButtonClickHandler(() => this._onDataChange(this, point, {...point, isFavorite: !point.isFavorite}));


    this._editEventComponent.setTypeChangeHandler(() => {
      const type = this._editEventComponent
        .getElement()
        .querySelector(`.event__type-input:checked`)
        .value;
      const offers = generateOffers();
      this._onDataChange(this, point, {...point, type, offers});
    });

    this._editEventComponent.setDestinationInputChangeHandler(() => this._onDataChange(this, point, {...point, description: genereateDescription()}));

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
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }
}
