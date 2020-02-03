import FiltersComponent from '../components/filters';
import {FilterType} from '../const';
import {render, replace, RenderPosition} from '../utils/render.js';

export default class Filter {
  constructor(node, pointsModel) {
    this._node = node;
    this._pointsModel = pointsModel;
    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._pointsModel.setDataChangeHandler(this._dataChangeHandler);
  }

  render() {
    const node = this._node;
    const oldComponent = this._filterComponent;
    const filters = Object.values(FilterType).map((filter) => ({
      name: filter,
      checked: filter === this._activeFilterType,
    }));
    this._filterComponent = new FiltersComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._filterChangeHandler);
    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(node, this._filterComponent, RenderPosition.AFTEREND);
    }
  }

  _filterChangeHandler(filterType) {
    this._pointsModel.setFilter(filterType);
    const filteredPoints = this._pointsModel.getPoints();
    if (!filteredPoints.length) {
      this._pointsModel.setFilter(this._activeFilterType);
      return;
    }
    this._activeFilterType = filterType;
    this._filterComponent.setActiveItem(this._activeFilterType);
  }

  _dataChangeHandler() {
    this.render();
  }
}
