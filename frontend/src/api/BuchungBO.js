
import BusinessObject from './BusinessObject';


export default class BuchungBO extends BusinessObject {

    constructor(ersteller){
        super();
        this.ersteller = ersteller;
    }
   
    // sets a ersteller
    setersteller(ersteller) {
    this.ersteller = ersteller;
    }
    // gets a ersteller
    getersteller() {
    return this.ersteller;
    }
    
    static fromJSON(buchung) {
    // Objekt anhand einer JSON-Struktur erstellen
    let p = Object.setPrototypeOf(buchung, BuchungBO.prototype);
    return p;
    }
}