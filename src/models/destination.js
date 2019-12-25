export default class Destination {
  constructor(data) {
    this.description = data.description;
    this.name = data.name;
    this.pictures = data.pictures;
  }

  // toRAW() {
  //   return {
  //     'id': this.id,
  //     'description': this.description,
  //     'due_date': this.dueDate ? this.dueDate.toISOString() : null,
  //     'tags': Array.from(this.tags),
  //     'repeating_days': this.repeatingDays,
  //     'color': this.color,
  //     'is_favorite': this.isFavorite,
  //     'is_archived': this.isArchive,
  //   };
  // }

  static parseDestination(data) {
    return new Destination(data);
  }

  static parseDestinations(data) {
    return data.map(Destination.parseDestination);
  }

  static clone(data) {
    return new Destination(data.toRAW());
  }
}

