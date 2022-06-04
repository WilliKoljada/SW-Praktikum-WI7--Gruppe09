import BusinessObject from './BusinessObject'

export default class ProjektarbeitBO extends BusinessObject {

    constructor(bezeichnung){
        super();
        this.bezeichnung = bezeichnung;
    }
   
    /** Sets the bezeichung of the Projektarbeit */
    setBezeichnung(bezeichnung) {
    this.bezeichnung = bezeichnung;
    }
    /** gets the bezeichnung of the Projektarbeit */
    getBezeichnung() {
    return this.bezeichnung;
    }
    
    /**
   * Returns an Array of  ProjektarbeitBO from a given JSON structure
   */
    static fromJSON(bezeichnung) {
        let result = [];
    
        if (Array.isArray(bezeichnung)) {
            bezeichnung.forEach((c) => {
            Object.setPrototypeOf(c, ProjektarbeitBO.prototype);
            result.push(c);
          })
        } else {
          // Es handelt sich offenbar um ein singuläres Objekt
          let c = bezeichnung;
          Object.setPrototypeOf(c, ProjektarbeitBO.prototype);
          result.push(c);
        }
    
        return result;
      }
}