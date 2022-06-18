import BusinessObject from "./BusinessObject";

export default class EreignisBO extends BusinessObject {
  constructor(type, datum, startzeit, endzeit, personID){
    super();
    this.type = type;
    this.datum = datum;
    this.startzeit = startzeit;
    this.endzeit = endzeit;
    this.personID = personID;
  }
  /** sets the type of the EreignisBO */
  setType(type) {
    this.type = type;
  }
  /** gets the type of the EreignisBO */
  getType() {
    return this.type;
  }
  /** sets the datum of the EreignisBO */
  setDatum(datum) {
    this.datum = datum;
  }
  /** gets the datum of the EreignisBO */
  getDatum() {
    return this.datum;
  }
  /** sets the startzeit of the EreignisBO */
  setStartzeit(startzeit) {
    this.startzeit = startzeit;
  }
  /** gets the startzeit of the EreignisBO */
  getStartzeit() {
    return this.startzeit;
  }
  /** sets the endzeit of the EreignisBO */
  setEndzeit(endzeit) {
    this.endzeit = endzeit;
  }
  /** gets the endzeit of the EreignisBO */
  getEndzeit() {
    return this.endzeit;
  }
  /** sets the personID of the EreignisBO */
  setPersonID(personID) {
    this.personID = personID;
  }
  /** gets the personID of the EreignisBO */
  getPersonID() {
    return this.personID;
  }

  /**
  * Returns an Array of  EreignisBO from a given JSON structure
  */
  static fromJSON(ereignis) {
    let result = [];
    if (Array.isArray(ereignis)) {
      ereignis.forEach((c) => {
      Object.setPrototypeOf(c, EreignisBO.prototype);
      result.push(c);
    })
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let c = ereignis;
      Object.setPrototypeOf(c, EreignisBO.prototype);
      result.push(c);
    }

    return result;
  }
}