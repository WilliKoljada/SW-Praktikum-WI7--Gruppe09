import BusinessObject from "./BusinessObjectBO";

/**
 * Represents an account object of a customer.
 */
export default class ZeitintervallbuchungBO extends BusinessObject  {

  /**
   * Constructs a new ZeitintervallbuchungBO
   *
   */



  /**
   * Returns an Array of  ZeitintervallbuchungBO from a given JSON structure
   */
  static fromJSON(zeit_inter) {
    let result = [];

    if (Array.isArray(zeit_inter)) {
        zeit_inter.forEach((a) => {
        Object.setPrototypeOf(a, ZeitintervallbuchungBO.prototype);
        result.push(a);
      })
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let a = zeit_inter;
      Object.setPrototypeOf(a, ZeitintervallbuchungBO.prototype);
      result.push(a);
    }

    return result;
  }
}