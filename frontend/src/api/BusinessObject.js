/**
 * Base class for all BusinessObjects, which has an ID field by default.
 */
 export default class BusinessObject {

    /**
     * The null constructor.
     */
    constructor() {
      this.id = 0;
      this.creation_date = ""
    }

    /**
     * Sets the ID of this BusinessObject.
     *
     * @param {*} aId - the new ID of this BusinessObject
     */
    setID(aId) {
      this.id = aId;
    }

    /**
     * Returns the ID of this BusinessObject.
     */
    getID() {
      return this.id;
    }

    /**
     * Sets the creation_date of this BusinessObject.
     *
     * @param {*} date - the new creation Date of this BusinessObject
     */
    set_creation_date(date) {
      this.creation_date = date;
    }

    /**
     * Returns the creation_date of this BusinessObject.
     */
    get_creation_date() {
      return this.creation_date;
    }

    /**
     * Returns a string representation of this Object. This is useful for debugging purposes.
     */
    toString() {
      let result = "";
      for (var prop in this) {
        result += prop + ": " + this[prop] + " ";
      }
      return result;
    }
  }