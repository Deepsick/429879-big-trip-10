import moment from 'moment';

import {compareDates} from '../utils/date';

export default class Point {
  constructor(point) {
    this.id = point.id;
    this.price = +point.base_price;
    this.dateFrom = moment(new Date(point.date_from));
    this.dateTo = moment(new Date(point.date_to));
    this.destination = point.destination;
    this.isFavorite = point.is_favorite;
    this.type = point.type;
    this.duration = compareDates(this.dateTo, this.dateFrom);
    this.offers = point.offers;
  }

  toRAW() {
    const preparedOffers = this.offers.map((offer) => {
      const {title, price} = offer;
      return {
        title,
        price: +price,
      };
    });

    return {
      'id': this.id,
      'base_price': this.price,
      'date_from': this.dateFrom,
      'date_to': this.dateTo,
      'destination': this.destination,
      'is_favorite': this.isFavorite,
      'type': this.type,
      'offers': preparedOffers,
    };
  }

  static parsePoint(point) {
    return new Point(point);
  }

  static parsePoints(points) {
    return points.map(Point.parsePoint);
  }

  static clone(point) {
    return new Point(point.toRAW());
  }
}
