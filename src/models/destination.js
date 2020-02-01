export default class Destination {
  constructor(destination) {
    this.description = destination.description;
    this.name = destination.name;
    this.pictures = destination.pictures;
  }

  toRAW() {
    return {
      description: this.description,
      name: this.name,
      pictures: this.pictures,
    };
  }

  static parseDestination(destination) {
    return new Destination(destination);
  }

  static parseDestinations(destinations) {
    return destinations.map(Destination.parseDestination);
  }

  static clone(destination) {
    return new Destination(destination.toRAW());
  }
}

