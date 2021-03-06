import BusinessObject from "./BusinessObject";


export default class PersonBO extends BusinessObject {
    constructor(vorname, nachname, email, benutzername, google_id, role){
        super();
        this.google_id = google_id;
        this.vorname = vorname;
        this.nachname = nachname;
        this.email = email;
        this.benutzername = benutzername;
        this.role = role
    }
    // Sets the google_id of the PersonBO */
    setGoogle_id(google_id) {
      this.google_id = google_id;
    }
    /** gets the google_id of the PersonBO */
    getGoogle_id() {
     return this.google_id;
    }
    // Sets the vorname of the PersonBO */
    setVorname(vorname) {
      this.vorname = vorname;
    }
    /** gets the vorname of the PersonBO */
    getVorname() {
      return this.vorname;
    }
    // Sets the nachname of the PersonBO */
    setNachname(nachname) {
      this.nachname = nachname;
    }
    /** gets the nachname of the PersonBO */
    getNachname() {
      return this.nachname;
    }
    // Sets the email of the PersonBO */
    setEmail(email) {
      this.email = email;
    }
    /** gets the email of the PersonBO */
    getEmail() {
      return this.email;
    }
    // Sets the benutzername of the PersonBO */
    setBenutzername(benutzername) {
      this.benutzername = benutzername;
    }
    /** gets the benutzername of the PersonBO */
    getBenutzername() {
      return this.benutzername;
    }
    // Sets the role of the PersonBO */
    setRole(role) {
      this.role = role;
    }
    /** gets the role of the PersonBO */
    getRole() {
      return this.role;
    }

    /**
   * Returns an Array of  PersonBO from a given JSON structure
   */
    static fromJSON(person){
        let result = [];

        if(Array.isArray(person)){
          person.forEach((c) => {
            Object.setPrototypeOf(c, PersonBO.prototype);
            result.push(c);
          })
        }else{
          // Es handelt sich offenbar um ein singuläres Objekt
          let c = person;
          Object.setPrototypeOf(c, PersonBO.prototype);
          result.push(c);
        }

        return result;
      }
}