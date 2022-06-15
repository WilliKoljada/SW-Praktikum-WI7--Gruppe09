import BusinessObject from './BusinessObject';

export default class EreignisBO extends BusinessObject {
  constructor(type, bezeichnung, datum, startzeit, endzeit, personID){
    super();

    this.bezeichnung = bezeichnung;
    this.datum = datum;
    this.startzeit = startzeit;
    this.endzeit = endzeit;
    this.personID = personID;
  }

  }

  }
  /** sets the bezeichnung of the EreignisBO */
  setBezeichnung(bezeichnung) {
    this.bezeichnung = bezeichnung;
  }
  /** gets the bezeichnung of the EreignisBO */
  getBezeichnung() {
    return this.bezeichnung;
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