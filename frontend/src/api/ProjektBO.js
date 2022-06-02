import BusinessObject from './BusinessObject';


export default class ProjektBO extends BusinessObject {

    constructor(bezeichung, auftraggeber){
        super();
        this.bezeichung = bezeichung;
        this.auftraggeber = auftraggeber;
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
