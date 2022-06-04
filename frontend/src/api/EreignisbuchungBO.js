import BusinessObject from "./BusinessObject";

/**
 * Represents an account object of a customer.
 */
export default class EreignisbuchungBO extends BusinessObject  {

  /**
   * Constructs a new EreignisbuchungBO
   *
   */



  /**
   * Returns an Array of  EreignisbuchungBO from a given JSON structure
   */
  static fromJSON(ereignis) {
    let result = [];

    if (Array.isArray(ereignis)) {
        ereignis.forEach((a) => {
        Object.setPrototypeOf(a, EreignisbuchungBO.prototype);
        result.push(a);
      })
    } else {
      // Es handelt sich offenbar um ein singuläres Objekt
      let a = ereignis;
      Object.setPrototypeOf(a, EreignisbuchungBO.prototype);
      result.push(a);
    }

    return result;
  }
}