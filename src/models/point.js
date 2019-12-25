export default class Point {
  constructor(data) {
    this.id = data.id;
    this.price = data.base_price;
    this.dateFrom = new Date(data.date_from);
    this.dateTo = new Date(data.date_to);
    this.destination = data.destination;
    this.isFavorite = data.is_favorite;
    this.type = data.type;
    this.offers = data.offers;
  }

  toRAW() {
    return {
      'id': this.id,
      'description': this.description,
      'due_date': this.dueDate ? this.dueDate.toISOString() : null,
      'tags': Array.from(this.tags),
      'repeating_days': this.repeatingDays,
      'color': this.color,
      'is_favorite': this.isFavorite,
      'is_archived': this.isArchive,
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
