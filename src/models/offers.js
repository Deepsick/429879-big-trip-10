export default class Offers {
  constructor() {
    this._offers = [];
  }

  getOffers() {
    return this._offers;
  }

  getTypeOffers(type) {
    return this._offers.find((offer) => offer.type === type);
  }

  setOffers(offers) {
    this._offers = offers;
  }
}

