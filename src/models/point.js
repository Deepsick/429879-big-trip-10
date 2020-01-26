import moment from 'moment';

export default class Point {
  constructor(data) {
    this.id = data.id;
    this.price = +data.base_price;
    this.dateFrom = moment(new Date(data.date_from));
    this.dateTo = moment(new Date(data.date_to));
    this.destination = data.destination;
    this.isFavorite = data.is_favorite;
    this.type = data.type;
    this.duration = moment(this.dateTo).diff(this.dateFrom);
    this.offers = data.offers;
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

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
