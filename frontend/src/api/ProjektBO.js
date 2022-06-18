import BusinessObject from "./BusinessObject";


export default class ProjektBO extends BusinessObject {

    constructor(name, beschreibung, personID){
        super();
        this.name = name;
        this.beschreibung = beschreibung;
        this.personID = personID;

    }
    /** Sets the bezeichung of the projekt */
        setName(name) {
      this.name = name;
    }
    /** gets the bezeichung of the projekt */
    getName() {
    return this.name;
    }
    /** Sets the bezeichung of the projekt */
    setBezeichnung(bezeichung) {
    this.bezeichung = bezeichung;
    }
    /** gets the bezeichung of the projekt */
    getBezeichnung() {
    return this.bezeichung;
    }
    /** Sets the auftraggeber of the projekt */
    setAuftraggeber(auftraggeber) {
    this.auftraggeber = auftraggeber;
    }  
    /** sets the Auftraggeber of the projekt */
    getAuftraggeber() {
        return this.auftraggeber;
    }
    /** Sets the Erteller_ID of the projekt */
    setErteller_ID(Erteller_ID) {
      this.Erteller_ID = Erteller_ID;
      }
      /** gets the Erteller_ID of the projekt */
      getErteller_ID() {
      return this.Erteller_ID;
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
