import BusinessObject from './BusinessObject';


export default class PersonBO extends BusinessObject {

    constructor(google_id, vorname, nachname, email, benutzername){
        super();
        this.google_id = google_id;
        this.vorname = vorname;
        this.nachname = nachname;
        this.email = email;
        this.benutzername = benutzername;
    }
    // * Sets a google_id
    setgoogle_id(google_id) {
    this.google_id = google_id;
    }
    // Gets google_id
    getgoogle_id() {
    return this.google_id;
    }
    // * Sets a vorname
    setvorname(vorname) {
    this.vorname = vorname;
    }  
    // Gets vorname
    getvorname() {
    return this.vorname;
    }
    // * Sets nachname
    setnachname(nachname) {
    this.nachname = nachname;
    }
    // Gets nachname
    getnachname() {
    return this.nachname;
    }
    // * Sets email
    setemail(email) {
    this.email = email;
    }
    // Gets email
    getemail() {
    return this.email;
    }
    // * Sets benutzername
    setbenutzername(benutzername) {
    this.benutzername = benutzername;
    }
    // Gets benutzername
    getbenutzername() {
    return this.benutzername;
    }
   

    static fromJSON(person) {
    // Objekt anhand einer JSON-Struktur erstellen
    let p = Object.setPrototypeOf(person, PersonBO.prototype);
    return p;
    }
}