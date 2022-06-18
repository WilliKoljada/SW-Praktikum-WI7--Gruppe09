import BusinessObject from "./BusinessObject";


export default class ProjektBO extends BusinessObject {
  constructor(name, beschreibung, personID){
    super();
    this.name = name;
    this.beschreibung = beschreibung;
    this.personID = personID;
  }
  /** Sets the name of the projekt */
  setName(name) {
    this.name = name;
  }
  /** gets the name of the projekt */
  getName() {
    return this.name;
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