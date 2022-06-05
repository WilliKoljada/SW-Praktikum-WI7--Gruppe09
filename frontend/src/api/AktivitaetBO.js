import BusinessObject from "./BusinessObject";

/**
 * Represents a aktivitaet
 */
 export default class AktivitaetBO extends BusinessObject {
    /**
   * Constructs a new aktivitaet
   */
    constructor(kapPerTag, aBezeichung) {
        super();
        this.kapaz = kapPerTag;
        this.bezeich = aBezeichung;
    }

/** Sets the kapPerTag of the aktivitaet */
    setKapazitaet(kapPerTag){
        this.kapaz = kapPerTag;
    }

/** gets the kapPerTag of the aktivitaet */
    getkapPerTag(kapPerTag){
        this.kapPerTag = kapPerTag;
    }

/** Sets the bezeichnung of the aktivitaet */
    setAdress(aBezeichung){
        this.bezeich = aBezeichung;
    }
    

/** gets the bezeichnung of the aktivitaet */    
    getBezeichnung(){
        return this.aBezeichung;
    }


  /**
   * Returns an Array of  AktivitaetBO from a given JSON structure
   */

  static fromJSON(kapazitaet) {
    let result = [];

    if (Array.isArray(kapazitaet)) {
    kapazität.forEach((a) => {
        Object.setPrototypeOf(a, AktivitaetBO.prototype);
        result.push(a);
      })
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let s = kapazitaet;
      Object.setPrototypeOf(s, AktivitaetBO.prototype);
      result.push(s);
    }
    return result;
  }
}