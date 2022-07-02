import BusinessObject from "./BusinessObject";


export default class ZeitintervallBO extends BusinessObject {
  constructor(datum, startzeit, endzeit, aktivitaetID, personID){
    super();
    this.datum = datum;
    this.startzeit = startzeit;
    this.endzeit = endzeit;
    this.aktivitaetID = aktivitaetID;
    this.personID = personID;
  }
  /** sets the datum of the ZeitintervallBO */
  setDatum(datum) {
    this.datum = datum;
  }
  /** gets the datum of the ZeitintervallBO */
  getDatum() {
    return this.datum;
  }
  /** sets the startzeit of the ZeitintervallBO */
  setStartzeit(startzeit) {
    this.startzeit = startzeit;
  }
  /** gets the startzeit of the ZeitintervallBO */
  getStartzeit() {
    return this.startzeit;
  }
  /** sets the endzeit of the ZeitintervallBO */
  setEndzeit(endzeit) {
    this.endzeit = endzeit;
  }
  /** gets the endzeit of the ZeitintervallBO */
  getEndzeit() {
    return this.endzeit;
  }
  /** sets the personID of the ZeitintervallBO */
  setPersonID(personID) {
    this.personID = personID;
  }
  /** gets the personID of the EreignisBO */
  getPersonID() {
    return this.personID;
  }
  // Sets the aktivitaetID of the ZeitintervallBO */
  setAktivitaetID(aktivitaetID) {
    this.aktivitaetID = aktivitaetID;
  }
  /** gets the aktivitaetID of the ZeitintervallBO */
  getAktivitaetID() {
    return this.aktivitaetID;
  }

  /**
   * Returns an Array of  ZeitintervallBO from a given JSON structure
   */
  static fromJSON(zeit_inter) {
    let result = [];
    if (Array.isArray(zeit_inter)) {
      zeit_inter.forEach((c) => {
        Object.setPrototypeOf(c, ZeitintervallBO.prototype);
        result.push(c);
      })
    }else{
      // Es handelt sich offenbar um ein singuläres Objekt
      let c = zeit_inter;
      Object.setPrototypeOf(c, ZeitintervallBO.prototype);
        result.push(c);
    }
    return result;
  }
}