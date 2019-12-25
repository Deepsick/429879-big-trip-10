import FiltersComponent from '../components/filters';
import {FilterType} from '../const';
import {render, replace, RenderPosition} from '../utils/render.js';

export default class Filter {
  constructor(node, pointsModel) {
    this._node = node;
    this._pointsModel = pointsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const node = this._node;
    const oldComponent = this._filterComponent;

    const filters = Object.values(FilterType).map((filter) => ({
      name: filter,
      checked: filter === this._activeFilterType,
    }));
    this._filterComponent = new FiltersComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);
    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(node, this._filterComponent, RenderPosition.AFTEREND);
    }
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
