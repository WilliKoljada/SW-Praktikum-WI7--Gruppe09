import BusinessObject from './BusinessObject';


export default class ZeitintervallBO extends BusinessObject {

    constructor(projektlaufzeit){
        super();
        this.projektlaufzeit = projektlaufzeit;
    }
   
    // Sets the projektlaufzeit of the ZeitintervallBO */
    setProjektlaufzeit(projektlaufzeit) {
    this.projektlaufzeit = projektlaufzeit;
    }
    /** gets the projektlaufzeit of the ZeitintervallBO */
    getProjektlaufzeit() {
    return this.projektlaufzeit;
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
        } else {
          // Es handelt sich offenbar um ein singuläres Objekt
          let c = zeit_inter;
          Object.setPrototypeOf(c, ZeitintervallBO.prototype);
          result.push(c);
        }
    
        return result;
      }
}