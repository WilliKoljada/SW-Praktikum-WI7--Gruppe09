import BusinessObject from "./BusinessObject";

/**
 * Represents a aktivitaet
 */
export default class AktivitaetBO extends BusinessObject {
  /**
  * Constructs a new aktivitaet
  */
  constructor(name, beschreibung, projektID) {
    super();
    this.name = name;
    this.kapaz = 0;
    this.beschreibung = beschreibung;
    this.projektID = projektID;
  }
	/** Sets the name of the aktivitaetBO */
  setName(name){
    this.name = name;
  }
	/** gets the name of the aktivitaetBO */
  getName(){
    return this.name;
  }
	/** Sets the kapaz of the aktivitaetBO */
  setKapaz(kapaz){
    this.kapaz = kapaz;
  }
	/** gets the kapaz of the aktivitaetBO */
  getKapaz(){
    return this.kapaz;
  }
	/** Sets the beschreibung of the aktivitaetBO */
  setBeschreibung(beschreibung) {
    this.beschreibung = beschreibung;
  }
  /** gets the beschreibung of the aktivitaetBO */
  getBeschreibung() {
    return this.beschreibung;
  }
	/** Sets the projektID of the aktivitaetBO */
  setProjektID(projektID) {
    this.projektID = projektID;
  }
  /** gets the projektID of the aktivitaetBO */
  getProjektID() {
    return this.projektID;
  }

  /**
  * Returns an Array of  AktivitaetBO from a given JSON structure
  */

  static fromJSON(aktivitaet) {
    let result = [];
    if (Array.isArray(aktivitaet)){
    aktivitaet.forEach((a) => {
        Object.setPrototypeOf(a, AktivitaetBO.prototype);
        result.push(a);
      })
    }else{
      // Es handelt sich offenbar um ein singuläres Objekt
      let s = aktivitaet;
      Object.setPrototypeOf(s, AktivitaetBO.prototype);
      result.push(s);
    }
    return result;
  }
}