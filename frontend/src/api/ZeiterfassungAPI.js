import AktivitaetBO from "./AktivitätBO";
import BuchungBO from "./BuchungBO";
import PersonBO from "./PersonBO";


/**
 * Abstracts the REST interface of the Python backend with convenient access methods.
 * The class is implemented as a singleton. 
 * 
 * @author [Christoph Kunz](https://github.com/christophkunz)
 */
export default class ZeiterfassungAPI {

  // Singelton instance
  static #api = null;


  // Local Python backend
  #ZeiterfassungServerBaseURL = '/zeiterfassungapp/';

  // Local http-fake-backend 
  //#ZeiterfassungServerBaseURL = '/api/bank';


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
    return this.#fetchAdvanced(this.#updateAktivitaetURL(aktivitaetBO.getID()), {
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
  getBuchungsID(accountID) {
    return this.#fetchAdvanced(this.#getBuchungByIdURL(accountID))
      .then(responseJSON => {
        let BuchungBOs = BuchungBO.fromJSON(responseJSON);
        // console.info(transactionBOs);
        return new Promise(function (resolve) {
          resolve(BuchungBOs);
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
      let BuchungBO = BuchungBO.fromJSON(responseJSON)[0];
      // console.info(accountBO);
      return new Promise(function (resolve) {
        // We expect only one new account
        resolve(BuchungBO);
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


  /**
   * Deletes the given Buchung and returns a Promise, which resolves to an BuchungBO
   * 
   * @param buchungID to be deleted
   * @public
   */
  deleteBuchung (buchungID) {
    return this.#fetchAdvanced(this.#deleteBuchungIdURL(buchungID), {
      method: 'DELETE'
    })
      .then((responseJSON) => {
        // We always get an array of BuchungBO.fromJSON, but only need one object
        let personBO = BuchungBO.fromJSON(responseJSON)[0];
        // console.info(BuchungBO);
        return new Promise(function (resolve) {
          resolve(buchungID);
        })
      })
  }}