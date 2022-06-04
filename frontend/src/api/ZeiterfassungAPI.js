import AktivitaetBO from "./AktivitätBO";
import BuchungBO from "./BuchungBO";
import PersonBO from "./PersonBO";
import ProjektBO from "./ProjektBO";
import ArbeitszeitkontoBO from "./ArbeitszeitkontoBO";
import ProjektarbeitBO from "./ProjektarbeitBO";
import ZeitintervallBO from "./ZeitintervallBO";
import ZeitintervallbuchungBO from "./ZeitintervallbuchungBO";
import EreignisbuchungBO from "./EreignisbuchungBO";
import EreignisBO from "./EreignisBO";


/**
 * Abstracts the REST interface of the Python backend with convenient access methods.
 * The class is implemented as a singleton.
 *
 */
export default class ZeiterfassungAPI {

  // Singelton instance
  static #api = null;


  // Local Python backend
  #ZeiterfassungServerBaseURL = '/zeiterfassungapp/';

  // Local http-fake-backend
  //#ZeiterfassungServerBaseURL = '/api/zeiterfassungapp';


  // Aktivitaet related
  #getAllAktivitaetURL = () => `${this.#ZeiterfassungServerBaseURL}/aktivitaet`;
  #addAktivitaetURL = () => `${this.#ZeiterfassungServerBaseURL}/aktivitaet`;
  #getAktivitaetURL = (id) => `${this.#ZeiterfassungServerBaseURL}/aktivitaet/${id}`;
  #updateAktivitaetURL = (id) => `${this.#ZeiterfassungServerBaseURL}/aktivitaet/${id}`;
  #deleteAktivitaetURL = (id) => `${this.#ZeiterfassungServerBaseURL}/aktivitaet/${id}`;


  // Buchung related
  #getAllBuchungURL = () => `${this.#ZeiterfassungServerBaseURL}/buchung`;
  #getBuchungByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/buchung/${id}`;
  #addBuchungURL = (id) => `${this.#ZeiterfassungServerBaseURL}/buchung/${id}/`;
  #updateBuchungURL = (id) => `${this.#ZeiterfassungServerBaseURL}/buchung/${id}`;
  #deleteBuchungIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/buchung/${id}`;

  // Person related
  #getAllPersonURL = () => `${this.#ZeiterfassungServerBaseURL}/person`;
  #getPersonByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/person/${id}`;
  #getPersonByEmailURL = (email) => `${this.#ZeiterfassungServerBaseURL}/person/${email}`;
  #addPersonURL = () => `${this.#ZeiterfassungServerBaseURL}/person`;
  #updatePersonByIdgURL = (id) => `${this.#ZeiterfassungServerBaseURL}/person/${id}/`;
  #deletePersonByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/person/${id}`;

  // Arbeitszeitkonto related
  #getAllArbeitszeitkontoURL = () => `${this.#ZeiterfassungServerBaseURL}/arbeitszeitkonto`;
  #getArbeitszeitkontoByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/arbeitszeitkonto/${id}`;
  #addArbeitszeitkontoByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/arbeitszeitkonto/${id}`;
  #updateArbeitszeitkontoByURL = (id) => `${this.#ZeiterfassungServerBaseURL}/arbeitszeitkonto/${id}`;
  #deleteArbeitszeitkontodURL = (id) => `${this.#ZeiterfassungServerBaseURL}/arbeitszeitkonto/${id}`;

  // Ereignis related
  #getAllEreignisURL = () => `${this.#ZeiterfassungServerBaseURL}/ereignis`;
  #getEreignisByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/ereignis/${id}`;
  #addEreignisByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/ereignis/${id}`;
  #updateEreignisByURL = (id) => `${this.#ZeiterfassungServerBaseURL}/ereignis/${id}`;
  #deleteEreignisByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/ereignis/${id}`;

  // Projekt related
  #getAllProjektsURL = () => `${this.#ZeiterfassungServerBaseURL}/projekt`;
  #getProjektByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/projekt/${id}`;
  #addProjektByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/projekt/${id}`;
  #updateProjektByURL = (id) => `${this.#ZeiterfassungServerBaseURL}/projekt/${id}`;
  #deleteProjektByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/projekt/${id}`;

  // Projektarbeit related
  #getAllProjektarbeitURL = () => `${this.#ZeiterfassungServerBaseURL}/projektarbeit`;
  #getProjektarbeitByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/projektarbeit/${id}`;
  #addProjektarbeitByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/projektarbeit/${id}`;
  #updateProjektarbeitByURL = (id) => `${this.#ZeiterfassungServerBaseURL}/projektarbeit/${id}`;
  #deleteProjektarbeitByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/projektarbeit/${id}`;

  // Zeitintervall related
  #getAllZeitintervallURL = () => `${this.#ZeiterfassungServerBaseURL}/zeitintervall`;
  #getZeitintervallByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/zeitintervall/${id}`;
  #addZeitintervallByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/zeitintervall/${id}`;
  #updateZeitintervallByURL = (id) => `${this.#ZeiterfassungServerBaseURL}/zeitintervall/${id}`;
  #deleteZeitintervallByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/zeitintervall/${id}`;

  // Zeitintervallbuchung related
  #getAllZeitintervallbuchunglURL = () => `${this.#ZeiterfassungServerBaseURL}/zeitintervallbuchung`;
  #getZeitintervallbuchungByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/zeitintervallbuchung/${id}`;
  #addZeitintervallbuchungByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/zeitintervallbuchung/${id}`;
  #updateZeitintervallbuchungByURL = (id) => `${this.#ZeiterfassungServerBaseURL}/zeitintervallbuchung/${id}`;
  #deleteZeitintervallbuchungByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/zeitintervallbuchung/${id}`;


  // Ereignisbuchung related
  #getAllEreignisbuchunglURL = () => `${this.#ZeiterfassungServerBaseURL}/ereignisbuchung`;
  #getEreignisbuchungByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/ereignisbuchung/${id}`;
  #addEreignisbuchungByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/ereignisbuchung/${id}`;
  #updateEreignisbuchungByURL = (id) => `${this.#ZeiterfassungServerBaseURL}/ereignisbuchung/${id}`;
  #deleteEreignisbuchungByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/ereignisbuchung/${id}`;


  /**
   * Get the Singelton instance
   *
   * @public
   */
  static getAPI() {
    if (this.#api == null) {
      this.#api = new ZeiterfassungAPI();
    }
    return this.#api;
  }

  /**
   *  Returns a Promise which resolves to a json object.
   *  The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500.
   *  fetchAdvanced throws an Error also an server status errors
   */
  #fetchAdvanced = (url, init) => fetch(url, init)
    .then(res => {
      // The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500.
      if (!res.ok) {
        throw Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    }
    )

  /**
   * Returns a formatter to format currencys of the transactions
   *
   * @public
   */


  /**
   * Returns the code for the currency
   *
   * @public
   */


  /**
   * Returns a Promise, which resolves to an Array of CustomerBOs
   *
   * @public
   */
  getAktivitaeten() {
    return this.#fetchAdvanced(this.#getAllAktivitaetURL()).then((responseJSON) => {
      let aktivitaetBOs = AktivitaetBO.fromJSON(responseJSON);
      // console.info(customerBOs);
      return new Promise(function (resolve) {
        resolve(aktivitaetBOs);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to a CustomerBO
   *
   * @param {Number} AktivitaetID to be retrieved
   * @public
   */
  getAktivitaet(AktivitaetID) {
    return this.#fetchAdvanced(this.#getAktivitaetURL(AktivitaetID)).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON, but only need one object
      let responseAktivitaetID = AktivitaetID.fromJSON(responseJSON)[0];
      // console.info(responseCustomerBO);
      return new Promise(function (resolve) {
        resolve(responseAktivitaetID);
      })
    })
  }

  /**
   * Adds a customer and returns a Promise, which resolves to a new CustomerBO object with the
   * firstName and lastName of the parameter customerBO object.
   *
   * @param {AktivitaetBO} AktivitaetBO to be added. The ID of the new customer is set by the backend
   * @public
   */
  addAktivitaet(aktivitaetBO) {
    return this.#fetchAdvanced(this.#addAktivitaetURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(aktivitaetBO)
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON, but only need one object
      let responseaktivitaetBO = aktivitaetBO.fromJSON(responseJSON)[0];
      // console.info(accountBOs);
      return new Promise(function (resolve) {
        resolve(responseaktivitaetBO);
      })
    })
  }

  /**
   * Updates a customer and returns a Promise, which resolves to a CustomerBO.
   *
   * @param {AktivitaetBO} aktivitaetBO to be updated
   * @public
   */
  updateAktivitaet(aktivitaetBO) {
    return this.#fetchAdvanced(this.#updateAktivitaetURL(aktivitaetBO.getId()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(aktivitaetBO)
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON
      let responseAktivitaetBO = AktivitaetBO.fromJSON(responseJSON)[0];
      // console.info(accountBOs);
      return new Promise(function (resolve) {
        resolve(responseAktivitaetBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to an Array of AccountBOs
   *
   * @param {Number} aktivitaetID to be deleted
   * @public
   */
  deleteAktivitaet(aktivitaetID) {
    return this.#fetchAdvanced(this.#deleteAktivitaetURL(aktivitaetID), {
      method: 'DELETE'
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON
      let responseAktivitaetID = AktivitaetBO.fromJSON(responseJSON)[0];
      // console.info(accountBOs);
      return new Promise(function (resolve) {
        resolve(responseAktivitaetID);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to an Array of AccountBOs
   *
   * @param {Number} customerID to be deleted
   * @public
   */
//   searchCustomer(customerName) {
//     return this.#fetchAdvanced(this.#searchCustomerURL(customerName)).then((responseJSON) => {
//       let customerBOs = CustomerBO.fromJSON(responseJSON);
//       // console.info(customerBOs);
//       return new Promise(function (resolve) {
//         resolve(customerBOs);
//       })
//     })
//   }


  /**
   * Returns a Promise, which resolves to an Array of AccountBOs
   *
   * @param {Number} personID for which the the accounts should be retrieved
   * @public
   */
  getAllPerson() {
    return this.#fetchAdvanced(this.#getAllPersonURL())
      .then((responseJSON) => {
        let personBos = PersonBO.fromJSON(responseJSON);
        // console.info(accountBOs);
        return new Promise(function (resolve) {
          resolve(personBos);
        })
      })
  }


  /**
   * Returns a Promise, which resolves to an Array of AccountBOs
   *
   * @param {Number} PersonID for which the the accounts should be retrieved
   * @public
   */
  getPersonByID(PersonID) {
    return this.#fetchAdvanced(this.#getPersonByIdURL(PersonID))
      .then((responseJSON) => {
        let PersonID = PersonBO.fromJSON(responseJSON);
        // console.info(accountBOs);
        return new Promise(function (resolve) {
          resolve(PersonID);
        })
      })
  }


 /**
   * Returns a Promise, which resolves to an Array of AccountBOs
   *
   * @param {Number} PersonID for which the the accounts should be retrieved
   * @public
   */
  getPersonByMail(PersonID) {
    return this.#fetchAdvanced(this.#getPersonByEmailURL(PersonID))
      .then((responseJSON) => {
        let PersonID = PersonBO.fromJSON(responseJSON);
        // console.info(accountBOs);
        return new Promise(function (resolve) {
          resolve(PersonID);
        })
      })
  }


 /**
   * Returns a Promise, which resolves to an AccountBOs
   *
   * @param {Number} personID for which the the accounts should be added to
   * @public
   */
  addPerson(personID) {
    return this.#fetchAdvanced(this.#addPersonURL(personID), {
      method: 'POST'
    })
      .then((responseJSON) => {
        // We always get an array of AccountBO.fromJSON, but only need one object
        let personBO = PersonBO.fromJSON(responseJSON)[0];
        // console.info(accountBO);
        return new Promise(function (resolve) {
          // We expect only one new account
          resolve(personBO);
        })
      })
  }

/**
   * Updates a customer and returns a Promise, which resolves to a CustomerBO.
   *
   * @param {PersonBO} personID to be updated
   * @public
   */
updatePeson(personID) {
    return this.#fetchAdvanced(this.#updatePersonByIdgURL(personID.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(personID)
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON
      let responsePersonID = PersonBO.fromJSON(responseJSON)[0];
      // console.info(accountBOs);
      return new Promise(function (resolve) {
        resolve(responsePersonID);
      })
    })
  }


  /**
   * Deletes the given Person and returns a Promise, which resolves to an PersonBO
   *
   * @param personID to be deleted
   * @public
   */
  deletePerson (personID) {
    return this.#fetchAdvanced(this.#deletePersonByIdURL(personID), {
      method: 'DELETE'
    })
      .then((responseJSON) => {
        // We always get an array of AccountBO.fromJSON, but only need one object
        let personBO = PersonBO.fromJSON(responseJSON)[0];
        // console.info(accountBOs);
        return new Promise(function (resolve) {
          resolve(personBO);
        })
      })
  }



  /**
   * Returns a Promise, which resolves to a balance
   *
   * @param {Number} buchungID for which the balance should be retrieved
   * @public
   */
  getBuchungen(buchungID) {
    return this.#fetchAdvanced(this.#getAllBuchungURL(buchungID))
      .then(responseJSON => {
        // console.log(responseJSON)
        return new Promise(function (resolve) {
          resolve(responseJSON);
        })
      })
  }

  /**
   * Returns a Promise, which resolves to an Array of BuchungBO
   *
   * @param {Number} buchungID for which the credit transactions should be retrieved
   * @public
   */
  getBuchungsID(buchungID) {
    return this.#fetchAdvanced(this.#getBuchungByIdURL(buchungID))
      .then(responseJSON => {
        let buchungID = BuchungBO.fromJSON(responseJSON);
        // console.info(transactionBOs);
        return new Promise(function (resolve) {
          resolve(buchungID);
        })
      })
  }



  /**
   * Returns a Promise, which resolves to the new TransactionBO
   *
   * @param {TransactionBO} buchungID object
   * @public
   */
  addBuchung(buchungID) {
    return this.#fetchAdvanced(this.#addBuchungURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(buchungID)
    }).then((responseJSON) => {
      // We always get an array of TransactionBO.fromJSON, but only need one object
      let buchungBO = BuchungBO.fromJSON(responseJSON)[0];
      // console.info(accountBO);
      return new Promise(function (resolve) {
        // We expect only one new account
        resolve(buchungBO);
      })
    })
  }

      /**
   * Updates a buchung and returns a Promise, which resolves to a BuchungBO.
   *
   * @param {BuchungBO} buchungID to be updated
   * @public
   */
updateBuchung(buchungID) {
    return this.#fetchAdvanced(this.#updateBuchungURL(buchungID.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(buchungID)
    }).then((responseJSON) => {
      // We always get an array of BuchungBO.fromJSON
      let responsebuchungID = BuchungBO.fromJSON(responseJSON)[0];
      // console.info(BuchungBO);
      return new Promise(function (resolve) {
        resolve(responsebuchungID);
      })
    })
  }
  deleteBuchung (BuchugnID) {
    return this.#fetchAdvanced(this.#deleteBuchungIdURL(BuchugnID), {
      method: 'DELETE'
    })
      .then((responseJSON) => {
        // We always get an array of AccountBO.fromJSON, but only need one object
        let BuchugnID = BuchungBO.fromJSON(responseJSON)[0];
        // console.info(accountBOs);
        return new Promise(function (resolve) {
          resolve(BuchugnID);
        })
      })
  }

  /**
   * Returns a Promise, which resolves to an Array of ArbeitszeitkontoBO
   * 
   * @public
   */
   getAllArbeitszeitkonten() {
    return this.#fetchAdvanced(this.#getAllArbeitszeitkontoURL()).then((responseJSON) => {
      let ArbeitszeitkontoBOs = ArbeitszeitkontoBO.fromJSON(responseJSON);
      // console.info(customerBOs);
      return new Promise(function (resolve) {
        resolve(ArbeitszeitkontoBOs);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to a ArbeitszeitkontoBO
   * 
   * @param {Number} ArbeitszeitkontoID to be retrieved
   * @public
   */
  getArbeitszeitkonto(ArbeitszeitkontoID) {
    return this.#fetchAdvanced(this.#getArbeitszeitkontoByIdURL(ArbeitszeitkontoID)).then((responseJSON) => {
      // We always get an array of ArbeitszeitkontoBOs.fromJSON, but only need one object
      let responseArbeitszeitkontoBO = ArbeitszeitkontoBO.fromJSON(responseJSON)[0];
      // console.info(responseArbeitszeitkontoBO);
      return new Promise(function (resolve) {
        resolve(responseArbeitszeitkontoBO);
      })
    })
  }

  /**
   * Adds a customer and returns a Promise, which resolves to a new ArbeitszeitkontoBO object with the 
   * firstName and lastName of the parameter ArbeitszeitkontoBO object.
   * 
   * @param {ArbeitszeitkontoBO} ArbeitszeitkontoBO to be added. The ID of the new customer is set by the backend
   * @public
   */
  addArbeitszeitkonto(arbeitszeitkontoBO) {
    return this.#fetchAdvanced(this.#addArbeitszeitkontoByIdURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(arbeitszeitkontoBO)
    }).then((responseJSON) => {
      // We always get an array of CustomerBOs.fromJSON, but only need one object
      let responseArbeitszeitkontoBO = ArbeitszeitkontoBO.fromJSON(responseJSON)[0];
      // console.info(accountBOs);
      return new Promise(function (resolve) {
        resolve(responseArbeitszeitkontoBO);
      })
    })
  }

  /**
   * Updates a customer and returns a Promise, which resolves to a ArbeitszeitkontoBO.
   * 
   * @param {ArbeitszeitkontoBO} arbeitszeitkontoBO to be updated
   * @public
   */
  updateArbeiteszeitkonto(arbeitszeitkontoBO) {
    return this.#fetchAdvanced(this.#updateArbeitszeitkontoByURL(arbeitszeitkontoBO.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(arbeitszeitkontoBO)
    }).then((responseJSON) => {
      // We always get an array of ArbeitszeitkontoBO.fromJSON
      let responseArbeitszeitkontoBO = ArbeitszeitkontoBO.fromJSON(responseJSON)[0];
      // console.info(accountBOs);
      return new Promise(function (resolve) {
        resolve(responseArbeitszeitkontoBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to an Array of ArbeitszeitkontoBO
   * 
   * @param {Number} arbeitszeitkontoBO to be deleted
   * @public
   */
  deleteArbeitszeitkonto(arbeitszeitkontoBO) {
    return this.#fetchAdvanced(this.#deleteArbeitszeitkontodURL(arbeitszeitkontoBO), {
      method: 'DELETE'
    }).then((responseJSON) => {
      // We always get an array of ArbeitszeitkontoBO.fromJSON
      let responseaAbeitszeitkontoBO = ArbeitszeitkontoBO.fromJSON(responseJSON)[0];
      // console.info(accountBOs);
      return new Promise(function (resolve) {
        resolve(responseaAbeitszeitkontoBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to an Array of ArbeitszeitkontoBO
   * 
   * @public
   */
   getAllEreignis() {
    return this.#fetchAdvanced(this.#getAllEreignisURL()).then((responseJSON) => {
      let ereignisBO = EreignisBO.fromJSON(responseJSON);
      // console.info(customerBOs);
      return new Promise(function (resolve) {
        resolve(ereignisBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to a EreignisBO
   * 
   * @param {Number} EreignisID to be retrieved
   * @public
   */
  getEreignis(EreignisID) {
    return this.#fetchAdvanced(this.#getEreignisByIdURL(EreignisID)).then((responseJSON) => {
      // We always get an array of EreignisBO.fromJSON, but only need one object
      let responseEreignisID = EreignisBO.fromJSON(responseJSON)[0];
      // console.info(responseArbeitszeitkontoBO);
      return new Promise(function (resolve) {
        resolve(responseEreignisID);
      })
    })
  }

  /**
   * Adds a customer and returns a Promise, which resolves to a new EreignisBO object with the 
   * firstName and lastName of the parameter EreignisBO object.
   * 
   * @param {EreignisBO} EreignisBO to be added. The ID of the new Ereignis is set by the backend
   * @public
   */
  addEreignis(arbeitszeitkontoBO) {
    return this.#fetchAdvanced(this.#addEreignisByIdURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(arbeitszeitkontoBO)
    }).then((responseJSON) => {
      // We always get an array of EreignisBO.fromJSON, but only need one object
      let responseEreignisBO = EreignisBO.fromJSON(responseJSON)[0];
      // console.info(accountBOs);
      return new Promise(function (resolve) {
        resolve(responseEreignisBO);
      })
    })
  }

  /**
   * Updates a customer and returns a Promise, which resolves to a EreignisBO.
   * 
   * @param {EreignisBO} EreignisBO to be updated
   * @public
   */
  updateEreignis(ereignisBO) {
    return this.#fetchAdvanced(this.#updateEreignisByURL(ereignisBO.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(ereignisBO)
    }).then((responseJSON) => {
      // We always get an array of EreignisBO.fromJSON
      let responseEreignisBO = EreignisBO.fromJSON(responseJSON)[0];
      // console.info(accountBOs);
      return new Promise(function (resolve) {
        resolve(responseEreignisBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to an Array of ArbeitszeitkontoBO
   * 
   * @param {Number} ereignisID to be deleted
   * @public
   */
  deleteEreignis(ereignisID) {
    return this.#fetchAdvanced(this.#deleteEreignisByIdURL(ereignisID), {
      method: 'DELETE'
    }).then((responseJSON) => {
      // We always get an array of ArbeitszeitkontoBO.fromJSON
      let responseaAbeitszeitkontoBO = EreignisbuchungBO.fromJSON(responseJSON)[0];
      // console.info(accountBOs);
      return new Promise(function (resolve) {
        resolve(responseaAbeitszeitkontoBO);
      })
    })
  }
  
  /**
   * Returns a Promise, which resolves to a ProjektBO
   * 
   * @param {Number} projektID to be retrieved
   * @public
   */
   getProjekt(projektID) {
    return this.#fetchAdvanced(this.#getAllProjektsURL(projektID)).then((responseJSON) => {
      // We always get an array of ProjektBOs.fromJSON, but only need one object
      let responseProjektBO = ProjektBO.fromJSON(responseJSON)[0];
      // console.info(responseCProjektBO);
      return new Promise(function (resolve) {
        resolve(responseProjektBO);
      })
    })
  }

  /**
   * Adds a customer and returns a Promise, which resolves to a new ProjektBO object with the 
   * firstName and lastName of the parameter ProjektBO object.
   * 
   * @param {ProjektBO} projektBO to be added. The ID of the new Projekt is set by the backend
   * @public
   */
  addProjekt(projektBO) {
    return this.#fetchAdvanced(this.#addProjektByIdURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(projektBO)
    }).then((responseJSON) => {
      // We always get an array of ProjektBO.fromJSON, but only need one object
      let responseProjektBO = ProjektBO.fromJSON(responseJSON)[0];
      // console.info(ProjektBOs);
      return new Promise(function (resolve) {
        resolve(responseProjektBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to a ProjektBO
   * 
   * @param {Number} projektID to be retrieved
   * @public
   */
   getProjektById(projektID) {
    return this.#fetchAdvanced(this.#getProjektByIdURL(projektID)).then((responseJSON) => {
      // We always get an array of ProjektBO.fromJSON, but only need one object
      let responseProjektBO = ProjektBO.fromJSON(responseJSON)[0];
      // console.info(responseProjektBO);
      return new Promise(function (resolve) {
        resolve(responseProjektBO);
      })
    })
  }
  /**
   * Updates a projects and returns a Promise, which resolves to a ProjektBO.
   * 
   * @param {ProjektBO} projektBO to be updated
   * @public
   */
  updateProjekt(projektBO) {
    return this.#fetchAdvanced(this.#updateProjektByURL(projektBO.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(projektBO)
    }).then((responseJSON) => {
      // We always get an array of ProjektBO.fromJSON
      let responseProjektBO = ProjektBO.fromJSON(responseJSON)[0];
      // console.info(ProjektBOs);
      return new Promise(function (resolve) {
        resolve(responseProjektBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to an Array of projektIDs
   * 
   * @param {Number} projektID to be deleted
   * @public
   */
  deleteProjekt(projektID) {
    return this.#fetchAdvanced(this.#deleteProjektByIdURL(projektID), {
      method: 'DELETE'
    }).then((responseJSON) => {
      // We always get an array of ProjektBO.fromJSON
      let responseProjektBO = ProjektBO.fromJSON(responseJSON)[0];
      // console.info(ProjektBOs);
      return new Promise(function (resolve) {
        resolve(responseProjektBO);
      })
    })
  }
  /**
   * Returns a Promise, which resolves to an Array of ProjektarbeitBO
   * 
   * @public
   */
   getAllAllProjektarbeit() {
    return this.#fetchAdvanced(this.#getAllProjektarbeitURL()).then((responseJSON) => {
      let responseProjektarbeitBO = ProjektarbeitBO.fromJSON(responseJSON);
      // console.info(customerBOs);
      return new Promise(function (resolve) {
        resolve(responseProjektarbeitBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to a ArbeitszeitkontoBOs
   * 
   * @param {Number} projektarbeitID to be retrieved
   * @public
   */
  getProjektarbeit(projektarbeitID) {
    return this.#fetchAdvanced(this.#getProjektarbeitByIdURL(projektarbeitID)).then((responseJSON) => {
      // We always get an array of ProjektarbeitBOs.fromJSON, but only need one object
      let responseArbeitszeitkontoBOs = ProjektarbeitBO.fromJSON(responseJSON)[0];
      // console.info(responseProjektarbeitBOs);
      return new Promise(function (resolve) {
        resolve(responseArbeitszeitkontoBOs);
      })
    })
  }

  /**
   * Adds a customer and returns a Promise, which resolves to a new ProjektarbeitBO object with the 
   * firstName and lastName of the parameter ArbeitszeitkontoBO object.
   * 
   * @param {ProjektarbeitBO} projektarbeitBO to be added. The ID of the new projects is set by the backend
   * @public
   */
  addProjektarbeit(projektarbeitBO) {
    return this.#fetchAdvanced(this.#addProjektarbeitByIdURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(projektarbeitBO)
    }).then((responseJSON) => {
      // We always get an array of ProjektarbeitBOs.fromJSON, but only need one object
      let responseProjektarbeitBO = ProjektarbeitBO.fromJSON(responseJSON)[0];
      // console.info(accountBOs);
      return new Promise(function (resolve) {
        resolve(responseProjektarbeitBO);
      })
    })
  }

  /**
   * Updates a customer and returns a Promise, which resolves to a ProjektarbeitBO.
   * 
   * @param {ProjektarbeitBO} projektarbeitBO to be updated
   * @public
   */
  updateProjektarbeit(projektarbeitBO) {
    return this.#fetchAdvanced(this.#updateProjektarbeitByURL(projektarbeitBO.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(projektarbeitBO)
    }).then((responseJSON) => {
      // We always get an array of ProjektarbeitBO.fromJSON
      let responseProjektarbeitBO = ProjektarbeitBO.fromJSON(responseJSON)[0];
      // console.info(ProjektarbeitBOs);
      return new Promise(function (resolve) {
        resolve(responseProjektarbeitBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to an Array of ProjektarbeitBO
   * 
   * @param {Number} projektarbeitBO to be deleted
   * @public
   */
  deleteProjektarbeit(projektarbeitBO) {
    return this.#fetchAdvanced(this.#deleteProjektarbeitByIdURL(projektarbeitBO), {
      method: 'DELETE'
    }).then((responseJSON) => {
      // We always get an array of ProjektarbeitBO.fromJSON
      let responseProjektarbeitBO = ProjektarbeitBO.fromJSON(responseJSON)[0];
      // console.info(ProjektarbeitBOs);
      return new Promise(function (resolve) {
        resolve(responseProjektarbeitBO);
      })
    })
  }
  /**
   * Returns a Promise, which resolves to an Array of ArbeitszeitkontoBO
   * 
   * @public
   */
   getAllZeitintervall() {
    return this.#fetchAdvanced(this.#getAllZeitintervallURL()).then((responseJSON) => {
      let responseZeitintervallBO = ZeitintervallBO.fromJSON(responseJSON);
      // console.info(customerBOs);
      return new Promise(function (resolve) {
        resolve(responseZeitintervallBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to a ZeitintervallBO
   * 
   * @param {Number} zeitintervallID to be retrieved
   * @public
   */
  getZeitintervallById(zeitintervallID) {
    return this.#fetchAdvanced(this.#getZeitintervallByIdURL(zeitintervallID)).then((responseJSON) => {
      // We always get an array of ZeitintervallBO.fromJSON, but only need one object
      let responseZeitintervallBO = ZeitintervallBO.fromJSON(responseJSON)[0];
      // console.info(responseZeitintervallBOs);
      return new Promise(function (resolve) {
        resolve(responseZeitintervallBO);
      })
    })
  }

  /**
   * Adds a customer and returns a Promise, which resolves to a new ZeitintervallBO object with the 
   * firstName and lastName of the parameter ArbeitszeitkontoBO object.
   * 
   * @param {ZeitintervallBO} zeitintervallID to be added. The ID of the new Ereignis is set by the backend
   * @public
   */
  addZeitintervall(zeitintervallID) {
    return this.#fetchAdvanced(this.#addZeitintervallByIdURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(zeitintervallID)
    }).then((responseJSON) => {
      // We always get an array of ZeitintervallBO.fromJSON, but only need one object
      let responseZeitintervallBO = ZeitintervallBO.fromJSON(responseJSON)[0];
      // console.info(ZeitintervallBOs);
      return new Promise(function (resolve) {
        resolve(responseZeitintervallBO);
      })
    })
  }

  /**
   * Updates a customer and returns a Promise, which resolves to a zeitintervallBO.
   * 
   * @param {}ZeitintervallBO zeitintervallBO to be updated
   * @public
   */
  updateZeitintervall(zeitintervallBO) {
    return this.#fetchAdvanced(this.#updateZeitintervallByURL(zeitintervallBO.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(zeitintervallBO)
    }).then((responseJSON) => {
      // We always get an array of ZeitintervallBO.fromJSON
      let responseZeitintervallBO = ZeitintervallBO.fromJSON(responseJSON)[0];
      // console.info(ZeitintervallBOs);
      return new Promise(function (resolve) {
        resolve(responseZeitintervallBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to an Array of ZeitintervallBO
   * 
   * @param {Number} ZeitintervallID to be deleted
   * @public
   */
  deleteZeitintervall(ZeitintervallID) {
    return this.#fetchAdvanced(this.#deleteZeitintervallByIdURL(ZeitintervallID), {
      method: 'DELETE'
    }).then((responseJSON) => {
      // We always get an array of ZeitintervallBO.fromJSON
      let responseaZeitintervallBO = ZeitintervallBO.fromJSON(responseJSON)[0];
      // console.info(ZeitintervallBOs);
      return new Promise(function (resolve) {
        resolve(responseaZeitintervallBO);
      })
    })
  }
  /**
   * Returns a Promise, which resolves to an Array of ZeitintervallbuchungBO
   * 
   * @public
   */
   getAllAllZeitintervallbuchung() {
    return this.#fetchAdvanced(this.#getAllZeitintervallbuchunglURL()).then((responseJSON) => {
      let responseZeitintervallbuchungBO = ZeitintervallbuchungBO.fromJSON(responseJSON);
      // console.info(customerBOs);
      return new Promise(function (resolve) {
        resolve(responseZeitintervallbuchungBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to a ZeitintervallbuchungBO
   * 
   * @param {Number} zeitintervallbuchungID to be retrieved
   * @public
   */
  getZeitintervallbuchungById(zeitintervallbuchungID) {
    return this.#fetchAdvanced(this.#getZeitintervallbuchungByIdURL(zeitintervallbuchungID)).then((responseJSON) => {
      // We always get an array of ZeitintervallbuchungBOs.fromJSON, but only need one object
      let responseZeitintervallbuchungBO = ZeitintervallbuchungBO.fromJSON(responseJSON)[0];
      // console.info(responseZeitintervallbuchungBOs);
      return new Promise(function (resolve) {
        resolve(responseZeitintervallbuchungBO);
      })
    })
  }

  /**
   * Adds a customer and returns a Promise, which resolves to a new ZeitintervallbuchungBO object with the 
   * firstName and lastName of the parameter ZeitintervallbuchungBO object.
   * 
   * @param {ZeitintervallbuchungBO} projektarbeitBO to be added. The ID of the new Zeitintervallbuchung is set by the backend
   * @public
   */
  addZeitintervallbuchung(zeitintervallbuchungBO) {
    return this.#fetchAdvanced(this.#addZeitintervallbuchungByIdURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(zeitintervallbuchungBO)
    }).then((responseJSON) => {
      // We always get an array of ZeitintervallbuchungBO.fromJSON, but only need one object
      let responseZeitintervallbuchungBO = ZeitintervallbuchungBO.fromJSON(responseJSON)[0];
      // console.info(ZeitintervallbuchungBOs);
      return new Promise(function (resolve) {
        resolve(responseZeitintervallbuchungBO);
      })
    })
  }

  /**
   * Updates a customer and returns a Promise, which resolves to a ZeitintervallbuchungBO.
   * 
   * @param {ZeitintervallbuchungBO} zeitintervallbuchungBO to be updated
   * @public
   */
  updateZeitintervallbuchung(zeitintervallbuchungBO) {
    return this.#fetchAdvanced(this.#updateZeitintervallbuchungByURL(zeitintervallbuchungBO.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(zeitintervallbuchungBO)
    }).then((responseJSON) => {
      // We always get an array of ZeitintervallbuchungBO.fromJSON
      let responseZeitintervallbuchungBO = ZeitintervallbuchungBO.fromJSON(responseJSON)[0];
      // console.info(ZeitintervallbuchungBOs);
      return new Promise(function (resolve) {
        resolve(responseZeitintervallbuchungBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to an Array of ZeitintervallbuchungBO
   * 
   * @param {Number} zeitintervallbuchungBO to be deleted
   * @public
   */
  deleteZeitintervallbuchung(zeitintervallbuchungBO) {
    return this.#fetchAdvanced(this.#deleteZeitintervallbuchungByIdURL(zeitintervallbuchungBO), {
      method: 'DELETE'
    }).then((responseJSON) => {
      // We always get an array of ZeitintervallbuchungBO.fromJSON
      let responseZeitintervallbuchungBO = ZeitintervallbuchungBO.fromJSON(responseJSON)[0];
      // console.info(ZeitintervallbuchungBOs);
      return new Promise(function (resolve) {
        resolve(responseZeitintervallbuchungBO);
      })
    })
  }
  /**
   * Returns a Promise, which resolves to an Array of EreignisbuchungBO
   * 
   * @public
   */
   getAllEreignisbuchung() {
    return this.#fetchAdvanced(this.#getAllEreignisbuchunglURL()).then((responseJSON) => {
      let EreignisbuchungBOs = EreignisbuchungBO.fromJSON(responseJSON);
      // console.info(EreignisbuchungBOs);
      return new Promise(function (resolve) {
        resolve(EreignisbuchungBOs);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to a EreignisbuchungBO
   * 
   * @param {Number} ereignisbuchungID to be retrieved
   * @public
   */
  getEreignisbuchung(ereignisbuchungID) {
    return this.#fetchAdvanced(this.#getEreignisbuchungByIdURL(ereignisbuchungID)).then((responseJSON) => {
      // We always get an array of EreignisbuchungBOs.fromJSON, but only need one object
      let responseEreignisbuchungBO = EreignisbuchungBO.fromJSON(responseJSON)[0];
      // console.info(responseEreignisbuchungBO);
      return new Promise(function (resolve) {
        resolve(responseEreignisbuchungBO);
      })
    })
  }

  /**
   * Adds a customer and returns a Promise, which resolves to a new EreignisbuchungBO object with the 
   * firstName and lastName of the parameter customerBO object.
   * 
   * @param {EreignisbuchungBO} ereignisbuchungBO to be added. The ID of the new Ereignisbuchung is set by the backend
   * @public
   */
  addEreignisbuchung(ereignisbuchungBO) {
    return this.#fetchAdvanced(this.#addEreignisbuchungByIdURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(ereignisbuchungBO)
    }).then((responseJSON) => {
      // We always get an array of EreignisbuchungBOs.fromJSON, but only need one object
      let responseEreignisbuchungBO = EreignisbuchungBO.fromJSON(responseJSON)[0];
      // console.info(EreignisbuchungBOs);
      return new Promise(function (resolve) {
        resolve(responseEreignisbuchungBO);
      })
    })
  }

  /**
   * Updates a customer and returns a Promise, which resolves to a EreignisbuchungBO.
   * 
   * @param {EreignisbuchungBO} ereignisbuchungBO to be updated
   * @public
   */
  updateEreignisbuchung(ereignisbuchungBO) {
    return this.#fetchAdvanced(this.#updateEreignisbuchungByURL(ereignisbuchungBO.getId()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(ereignisbuchungBO)
    }).then((responseJSON) => {
      // We always get an array of EreignisbuchungBOs.fromJSON
      let responseEreignisbuchungBO = EreignisbuchungBO.fromJSON(responseJSON)[0];
      // console.info(EreignisbuchungBOs);
      return new Promise(function (resolve) {
        resolve(responseEreignisbuchungBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to an Array of EreignisbuchungBOs
   * 
   * @param {Number} ereignisbuchungID to be deleted
   * @public
   */
  deleteEreignisbuchung(ereignisbuchungID) {
    return this.#fetchAdvanced(this.#deleteEreignisbuchungByIdURL(ereignisbuchungID), {
      method: 'DELETE'
    }).then((responseJSON) => {
      // We always get an array of EreignisbuchungBOs.fromJSON
      let responseEreignisbuchungBO = EreignisbuchungBO.fromJSON(responseJSON)[0];
      // console.info(EreignisbuchungBOs);
      return new Promise(function (resolve) {
        resolve(responseEreignisbuchungBO);
      })
    })
  }
}