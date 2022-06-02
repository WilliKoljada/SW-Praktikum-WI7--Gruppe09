import BusinessObject from './BusinessObjectBO';


export default class BuchungBO extends BusinessObject {

    constructor(ersteller){
        super();
        this.ersteller = ersteller;
    }
   
    // Sets the ersteller of the buchung */
    setErsteller(ersteller) {
    this.ersteller = ersteller;
    }
    /** gets the ersteller of the buchung */
    getErsteller() {
    return this.ersteller;
    }
    
    /**
   * Returns an Array of  BuchungBO from a given JSON structure
   */
    static fromJSON(buchung) {
        let result = [];
    
        if (Array.isArray(buchung)) {
            buchung.forEach((c) => {
            Object.setPrototypeOf(c, BuchungBO.prototype);
            result.push(c);
          })
        } else {
          // Es handelt sich offenbar um ein singuläres Objekt
          let c = buchung;
          Object.setPrototypeOf(c, BuchungBO.prototype);
          result.push(c);
        }
    
        return result;
      }
}