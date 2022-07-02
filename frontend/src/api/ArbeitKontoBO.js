import BusinessObject from "./BusinessObject";

/**
 * Represents a arbeitkonto
 */
export default class ArbeitKontoBO extends BusinessObject {
  /**
  * Constructs a new aktivitaet
  */
  constructor(arbeit, urlaub, krankheit, pause) {
    super();
    this.arbeit = arbeit;
    this.urlaub = urlaub;
    this.krankheit = krankheit;
    this.pause = pause;
  }
	/** Sets the arbeit of the arbeitKontoBO */
  setArbeit(arbeit){
    this.arbeit = arbeit;
  }
	/** gets the arbeit of the arbeitKontoBO */
  getArbeit(){
    return this.arbeit;
  }
	/** Sets the pause of the arbeitKontoBO */
  setPause(pause){
    this.pause = pause;
  }
	/** gets the pause of the arbeitKontoBO */
  getPause(){
    return this.pause;
  }
	/** Sets the urlaub of the arbeitKontoBO */
  setUrlaub(urlaub){
    this.urlaub = urlaub;
  }
	/** gets the urlaub of the arbeitKontoBO */
  getUrlaub(){
    return this.urlaub;
  }
	/** Sets the krankheit of the arbeitKontoBO */
  setKrankheit(krankheit) {
    this.krankheit = krankheit;
  }
  /** gets the krankheit of the arbeitKontoBO */
  getKrankheit() {
    return this.krankheit;
  }

  /**
  * Returns an Array of  ArbeitKontoBO from a given JSON structure
  */

  static fromJSON(konto) {
    let result = [];
    if (Array.isArray(konto)){
        konto.forEach((a) => {
            Object.setPrototypeOf(a, ArbeitKontoBO.prototype);
            result.push(a);
        })
    }else{
        // Es handelt sich offenbar um ein singuläres Objekt
        let s = konto;
        Object.setPrototypeOf(s, ArbeitKontoBO.prototype);
        result.push(s);
    }
    return result;
  }
}