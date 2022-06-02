import BusinessObject from './BusinessObjectBO';


export default class EreignisBO extends BusinessObject {

    constructor(zeitpunkt_ereigniseintritt){
        super();
        this.zeitpunkt_ereigniseintritt = zeitpunkt_ereigniseintritt;
    }
   
    // Sets the zeitpunkt_ereigniseintritt of the EreignisBO */
    setProjektlaufzeit(projektlaufzeit) {
    this.projektlaufzeit = projektlaufzeit;
    }
    /** gets the zeitpunkt_ereigniseintritt of the EreignisBO */
    getProjektlaufzeit() {
    return this.zeitpunkt_ereigniseintritt;
    }
    
    /**
   * Returns an Array of  EreignisBO from a given JSON structure
   */
    static fromJSON(zeitpunkt_ereig) {
        let result = [];
    
        if (Array.isArray(zeitpunkt_ereig)) {
            zeitpunkt_ereig.forEach((c) => {
            Object.setPrototypeOf(c, EreignisBO.prototype);
            result.push(c);
          })
        } else {
          // Es handelt sich offenbar um ein singuläres Objekt
          let c = zeitpunkt_ereig;
          Object.setPrototypeOf(c, EreignisBO.prototype);
          result.push(c);
        }
    
        return result;
      }
}