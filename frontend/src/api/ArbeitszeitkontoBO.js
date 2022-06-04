import BusinessObject from './BusinessObject';


export default class ArbeitszeitkontoBO extends BusinessObject {

    constructor(arbeitspensum){
        super();
        this.arbeitspensum = arbeitspensum;
    }
   
    // Sets the arbeitspensum of the Arbeitszeitkonto */
    setArbeitspensum(arbeitspensum) {
    this.arbeitspensum = arbeitspensum;
    }
    /** gets the arbeitspensum of the Arbeitszeitkonto */
    getArbeitspensum() {
    return this.arbeitspensum;
    }
    
    /**
   * Returns an Array of  ArbeitszeitkontoBO from a given JSON structure
   */
    static fromJSON(arbeitszeitkonto) {
        let result = [];
    
        if (Array.isArray(arbeitszeitkonto)) {
            arbeitszeitkonto.forEach((c) => {
            Object.setPrototypeOf(c, ArbeitszeitkontoBO.prototype);
            result.push(c);
          })
        } else {
          // Es handelt sich offenbar um ein singuläres Objekt
          let c = arbeitszeitkonto;
          Object.setPrototypeOf(c, ArbeitszeitkontoBO.prototype);
          result.push(c);
        }
    
        return result;
      }
}