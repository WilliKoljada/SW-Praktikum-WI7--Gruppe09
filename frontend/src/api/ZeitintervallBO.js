import BusinessObject from './BusinessObject';


export default class ZeitintervallBO extends BusinessObject {
  constructor(datum, start, end, aktivitaetID, userID){
    super();
    this.datum = datum;
    this.start = start;
    this.end = end;
    this.aktivitaetID = aktivitaetID;
    this.userID = userID;
  }

  // Sets the datum of the ZeitintervallBO */
  setDatum(datum) {
    this.datum = datum;
  }

  /** gets the datum of the ZeitintervallBO */
  getDatum() {
    return this.datum;
  }

  // Sets the start of the ZeitintervallBO */
  setStart(start) {
    this.start = start;
  }

  /** gets the start of the ZeitintervallBO */
  getStart() {
    return this.start;
  }

  // Sets the end of the ZeitintervallBO */
  setEnd(end) {
    this.end = end;
  }

  /** gets the end of the ZeitintervallBO */
  getEnd() {
    return this.end;
  }

  // Sets the aktivitaetID of the ZeitintervallBO */
  setAktivitaetID(aktivitaetID) {
    this.aktivitaetID = aktivitaetID;
  }

  /** gets the aktivitaetID of the ZeitintervallBO */
  getAktivitaetID() {
    return this.aktivitaetID;
  }

  // Sets the userID of the ZeitintervallBO */
  setUserID(userID) {
    this.userID = userID;
  }

  /** gets the userID of the ZeitintervallBO */
  getUserID() {
    return this.userID;
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