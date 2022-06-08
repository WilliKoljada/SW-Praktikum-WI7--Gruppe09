export default class BusinessObject {

    constructor() {
      this.id = 0;
      this.creation_date = 0;
    }
  
    // Sets the id of the BusinessObject */
    setID(id) {
      this.id = id;
    }

    /** gets the id of the BusinessObject */
    getID() {
      return this.id;
    }

    // Sets the creation_date of the BusinessObject */
    setCreation_date(creation_date) {
      this.creation_date = creation_date
    }
    /** gets the creation_date of the BusinessObject */
    getCreation_date() {
      return this.creation_date
    }
  
  toString() {
    let result = "";
    for (var prop in this) {
      result += prop + ": " + this[prop] + " ";
    }

    return result;
  }
}