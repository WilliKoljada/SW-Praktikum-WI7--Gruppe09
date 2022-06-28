import BusinessObject from "./BusinessObject";

/**
 * Represents a arbeitszeitkonto
 */
export default class ArbeitszeitkontoBO extends BusinessObject {
  /**
  * Constructs a new Areitszeitkonto
  */
  constructor(arbeit, urlaub, krankheit, pause) {
    super();
    this.arbeit = arbeit;
    this.urlaub = urlaub;
    this.krankheit = krankheit;
    this.pause = pause;
  }
	/** Sets the arbeit of the arbeitszeitkontoBO */
  setArbeit(arbeit){
    this.arbeit = arbeit;
  }
	/** gets the arbeit of the arbeitszeitkontoBO */
  getArbeit(){
    return this.arbeit;
  }
	/** Sets the pause of the arbeitszeitkontoBO */
  setPause(pause){
    this.pause = pause;
  }
	/** gets the pause of the arbeitszeitkontoBO */
  getPause(){
    return this.pause;
  }
	/** Sets the urlaub of the arbeitszeitkontoBO */
  setUrlaub(urlaub){
    this.urlaub = urlaub;
  }
	/** gets the urlaub of the arbeitszeitkontoBO */
  getUrlaub(){
    return this.urlaub;
  }
	/** Sets the krankheit of the arbeitszeitkontoBO */
  setKrankheit(krankheit) {
    this.krankheit = krankheit;
  }
  /** gets the krankheit of the arbeitszeitkontoBO */
  getKrankheit() {
    return this.krankheit;
  }

  /**
  * Returns an Array of ArbeitszeitkontoBO from a given JSON structure
  */

  static fromJSON(konto) {
    let result = [];
    if (Array.isArray(konto)){
        konto.forEach((a) => {
            Object.setPrototypeOf(a, ArbeitszeitkontoBO.prototype);
            result.push(a);
        })
    }else{
        // Es handelt sich offenbar um ein singuläres Objekt
        let s = konto;
        Object.setPrototypeOf(s, ArbeitszeitkontoBO.prototype);
        result.push(s);
    }
    return result;
  }
}