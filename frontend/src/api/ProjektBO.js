import BusinessObject from "./BusinessObject";


export default class ProjektBO extends BusinessObject {
  constructor(name, auftraggeber, beschreibung, personID, kapazitaet){
    super();
    this.name = name;
    this.auftraggeber = auftraggeber;
    this.beschreibung = beschreibung;
    this.personID = personID;
    this.kapazitaet = kapazitaet;
  }
  /** Sets the name of the projekt */
  setName(name) {
    this.name = name;
  }
  /** gets the name of the projekt */
  getName() {
    return this.name;
  }
  /** Sets the auftraggeber of the projekt */
  setAuftraggeber(auftraggeber) {
    this.auftraggeber = auftraggeber;
  }
  /** gets the auftraggeber of the projekt */
  getAuftraggeber() {
    return this.auftraggeber;
  }
  /** Sets the beschreibung of the projekt */
  setBeschreibung(beschreibung) {
    this.beschreibung = beschreibung;
  }
  /** gets the beschreibung of the projekt */
  getBeschreibung() {
    return this.beschreibung;
  }
  /** Sets the personID of the projekt */
  setPersonID(personID) {
    this.personID = personID;
  }
  /** gets the PersonID of the projekt */
  getPersonID() {
    return this.personID;
  }
  /** Sets the Kapazitaet of the projekt */
  setKapazitaet(kapazitaet) {
    this.kapazitaet = kapazitaet;
  }
  /** gets the Kapazitaet of the projekt */
  getKapazitaet() {
    return this.kapazitaet;
  }

  /**
   * Returns an Array of  ProjektBO from a given JSON structure
   */
  static fromJSON(projekt) {
    let result = [];

    if (Array.isArray(projekt)) {
      projekt.forEach((c) => {
      Object.setPrototypeOf(c, ProjektBO.prototype);
      result.push(c);
      })
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let c = projekt;
      Object.setPrototypeOf(c, ProjektBO.prototype);
      result.push(c);
    }
    return result;
  }
}