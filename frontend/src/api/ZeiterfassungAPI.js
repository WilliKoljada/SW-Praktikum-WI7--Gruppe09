import AktivitaetBO from "./AktivitaetBO";
import PersonBO from "./PersonBO";
import ProjektBO from "./ProjektBO";
import ArbeitszeitkontoBO from "./ArbeitszeitkontoBO";
import ZeitintervallBO from "./ZeitintervallBO";
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
  #ZeiterfassungServerBaseURL = "/Zeiterfassungapp";

  // Local http-fake-backend
  //#ZeiterfassungServerBaseURL = "/api/zeiterfassungapp";

  // Person related
  #getAllPersonURL = () => `${this.#ZeiterfassungServerBaseURL}/person`;
  #getPersonByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/person/${id}`;
  #getPersonByGoogleIdURL = (google_id) => `${this.#ZeiterfassungServerBaseURL}/person-by-google-id/${google_id}`;
  #getPersonByEmailURL = (email) => `${this.#ZeiterfassungServerBaseURL}/person-by-email/${email}`;
  #addPersonURL = () => `${this.#ZeiterfassungServerBaseURL}/person`;
  #updatePersonURL = (id) => `${this.#ZeiterfassungServerBaseURL}/person/${id}/`;
  #deletePersonURL = (id) => `${this.#ZeiterfassungServerBaseURL}/person/${id}`;

  // Projekt related
  #getAllProjektsURL = () => `${this.#ZeiterfassungServerBaseURL}/projekt`;
  #getProjektByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/projekt/${id}`;
  #addProjektURL = () => `${this.#ZeiterfassungServerBaseURL}/projekt`;
  #updateProjektURL = (id) => `${this.#ZeiterfassungServerBaseURL}/projekt/${id}`;
  #deleteProjektURL = (id) => `${this.#ZeiterfassungServerBaseURL}/projekt/${id}`;

  // Aktivitaet related
  #getAllAktivitaetURL = () => `${this.#ZeiterfassungServerBaseURL}/aktivitaet`;
  #addAktivitaetURL = () => `${this.#ZeiterfassungServerBaseURL}/aktivitaet`;
  #getAktivitaetURL = (id) => `${this.#ZeiterfassungServerBaseURL}/aktivitaet/${id}`;
  #updateAktivitaetURL = (id) => `${this.#ZeiterfassungServerBaseURL}/aktivitaet/${id}`;
  #deleteAktivitaetURL = (id) => `${this.#ZeiterfassungServerBaseURL}/aktivitaet/${id}`;

  // Ereignis related
  #getAllEreignisURL = () => `${this.#ZeiterfassungServerBaseURL}/ereignis`;
  #getEreignisByIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/ereignis/${id}`;
  #addEreignisURL = (id) => `${this.#ZeiterfassungServerBaseURL}/ereignis/${id}`;
  #updateEreignisURL = (id) => `${this.#ZeiterfassungServerBaseURL}/ereignis/${id}`;
  #deleteEreignisURL = (id) => `${this.#ZeiterfassungServerBaseURL}/ereignis/${id}`;

  // Zeitintervall related
  #getAllZeitintervallURL = () => `${this.#ZeiterfassungServerBaseURL}/zeitintervall`;
  #getZeitintervallURL = (id) => `${this.#ZeiterfassungServerBaseURL}/zeitintervall/${id}`;
  #addZeitintervallURL = () => `${this.#ZeiterfassungServerBaseURL}/zeitintervall`;
  #updateZeitintervallURL = (id) => `${this.#ZeiterfassungServerBaseURL}/zeitintervall/${id}`;
  #deleteZeitintervallURL = (id) => `${this.#ZeiterfassungServerBaseURL}/zeitintervall/${id}`;

  // Arbeitszeitkonto related
  #getAllArbeitszeitkontoURL = () => `${this.#ZeiterfassungServerBaseURL}/arbeitszeitkonto`;
  #getArbeitszeitkontoByUserIdURL = (id) => `${this.#ZeiterfassungServerBaseURL}/arbeitszeitkonto/${id}`;

  /**
   * Get the Singelton instance
   *
   * @public
   */
  static getAPI() {
    if(this.#api == null) {
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
   * Returns a Promise, which resolves to an Array of CustomerBOs
   *
   * @public
   */
  getAktivitaets() {
    return this.#fetchAdvanced(this.#getAllAktivitaetURL()).then((responseJSON) => {
      let aktivitaetBOs = AktivitaetBO.fromJSON(responseJSON);
      // console.info(aktivitaetBOs);
      return new Promise(function (resolve) {
        resolve(aktivitaetBOs);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to a AktivitaetBO
   *
   * @param {Number} AktivitaetID to be retrieved
   * @public
   */
  getAktivitaet(AktivitaetID) {
    return this.#fetchAdvanced(this.#getAktivitaetURL(AktivitaetID)).then((responseJSON) => {
      // We always get an array of AktivitaetBOs.fromJSON, but only need one object
      let responseAktivitaetID = AktivitaetID.fromJSON(responseJSON)[0];
      // console.info(responseAktivitaetBO);
      return new Promise(function (resolve) {
        resolve(responseAktivitaetID);
      })
    })
  }

  /**
   * Adds an aktivitaet and returns a Promise, which resolves to a new AktivitaetBO object with the
   *
   * @param {AktivitaetBO} AktivitaetBO to be added. The ID of the new aktivitaet is set by the backend
   * @public
   */
  addAktivitaet(aktivitaetBO) {
    return this.#fetchAdvanced(this.#addAktivitaetURL(), {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(aktivitaetBO)
    }).then((responseJSON) => {
      // We always get an array of AktivitaetBOs.fromJSON, but only need one object
      let responseaktivitaetBO = aktivitaetBO.fromJSON(responseJSON)[0];
      // console.info(aktivitaetBOs);
      return new Promise(function (resolve) {
        resolve(responseaktivitaetBO);
      })
    })
  }

  /**
   * Updates an aktivitaet and returns a Promise, which resolves to a AktivitaetBO.
   *
   * @param {AktivitaetBO} aktivitaetBO to be updated
   * @public
   */
  updateAktivitaet(aktivitaetBO) {
    return this.#fetchAdvanced(this.#updateAktivitaetURL(aktivitaetBO.getId()), {
      method: "PUT",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(aktivitaetBO)
    }).then((responseJSON) => {
      // We always get an array of AktivitaetBOs.fromJSON
      let responseAktivitaetBO = AktivitaetBO.fromJSON(responseJSON)[0];
      // console.info(aktivitaetBOs);
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
      method: "DELETE"
    }).then((responseJSON) => {
      // We always get an array of AktivitaetBOs.fromJSON
      let responseAktivitaetID = AktivitaetBO.fromJSON(responseJSON)[0];
      // console.info(aktivitaetBOs);
      return new Promise(function (resolve) {
        resolve(responseAktivitaetID);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to an Array of PersonBOs
   *
   * @param {Number} personID for which the the persons should be retrieved
   * @public
   */
  getPersons() {
    return this.#fetchAdvanced(this.#getAllPersonURL())
      .then((responseJSON) => {
        let personBos = PersonBO.fromJSON(responseJSON);
        // console.info(personBOs);
        return new Promise(function (resolve) {
          resolve(personBos);
        })
      })
  }

  /**
   * Returns a Promise, which resolves to an Array of PersonBOs
   *
   * @param {Number} PersonID for which the the person should be retrieved
   * @public
   */
  getPersonByID(PersonID) {
    return this.#fetchAdvanced(this.#getPersonByIdURL(PersonID))
      .then((responseJSON) => {
        let PersonID = PersonBO.fromJSON(responseJSON);
        // console.info(personBOs);
        return new Promise(function (resolve) {
          resolve(PersonID);
        })
      })
  }


  /**
   * Returns a Promise, which resolves to an Array of PersonBOs
   *
   * @param {String} PersonGoogleId for which the the person should be retrieved
   * @public
   */
  getPersonByGoogleID(PersonGoogleId) {
    return this.#fetchAdvanced(this.#getPersonByGoogleIdURL(PersonGoogleId))
      .then((responseJSON) => {
        let Person = PersonBO.fromJSON(responseJSON);
        // console.info(personBOs);
        return new Promise(function (resolve) {
          resolve(Person);
        })
      })
  }


  /**
   * Returns a Promise, which resolves to an Array of PersonBOs
   *
   * @param {String} PersonEmail for which the the person should be retrieved
   * @public
   */
  getPersonByMail(PersonEmail) {
    return this.#fetchAdvanced(this.#getPersonByEmailURL(PersonEmail))
      .then((responseJSON) => {
        let Person = PersonBO.fromJSON(responseJSON);
        // console.info(personBOs);
        return new Promise(function (resolve) {
          resolve(Person);
        })
      })
  }


  /**
   * Returns a Promise, which resolves to an PersonBOs
   *
   * @param {PersonBo} personID for which the the accounts should be added to
   * @public
   */
  addPerson(personBO) {
    return this.#fetchAdvanced(this.#addPersonURL(), {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(personBO)
    }).then((responseJSON) => {
      // We always get an array of PersonBO.fromJSON, but only need one object
      let responsePersonBO = PersonBO.fromJSON(responseJSON)[0];
      // console.info(personBO);
      return new Promise(function (resolve) {
        // We expect only one new person
        resolve(responsePersonBO);
      })
    })
  }

  /**
   * Updates a person and returns a Promise, which resolves to a PersonBO.
   *
   * @param {PersonBO} personBO to be updated
   * @public
   */
  updatePerson(personBO) {
    return this.#fetchAdvanced(this.#updatePersonURL(personBO.getID()), {
      method: "PUT",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(personBO)
    }).then((responseJSON) => {
      // We always get an array of PersonBOs.fromJSON
      console.log(responseJSON);
      let responsePersonID = PersonBO.fromJSON(responseJSON)[0];
      // console.info(personBOs);
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
  deletePerson(personID) {
    return this.#fetchAdvanced(this.#deletePersonURL(personID), {
      method: "DELETE"
    }).then((responseJSON) => {
      // We always get an array of PersonBO.fromJSON, but only need one object
      let responsePersonBO = PersonBO.fromJSON(responseJSON)[0];
      // console.info(personBOs);
      return new Promise(function (resolve) {
        resolve(responsePersonBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to an Array of ProjektBOs
   *
   * @public
   */
   getProjekts() {
    return this.#fetchAdvanced(this.#getAllProjektsURL())
      .then((responseJSON) => {
        let projektBOs = ProjektBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(projektBOs);
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
    return this.#fetchAdvanced(this.#getProjektByIdURL(projektID))
      .then((responseJSON) => {
      // We always get an array of ProjektBOs.fromJSON, but only need one object
      let responseProjektBO = ProjektBO.fromJSON(responseJSON)[0];
      // console.info(responseProjektBO);
      return new Promise(function (resolve) {
        resolve(responseProjektBO);
      })
    })
  }

  /**
   * Adds a projekt and returns a Promise, which resolves to a new ProjektBO object with the
   *
   * @param {ProjektBO} projektBO to be added. The ID of the new Projekt is set by the backend
   * @public
   */
  addProjekt(projektBO) {
    return this.#fetchAdvanced(this.#addProjektURL(), {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
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
   * Updates a project and returns a Promise, which resolves to a ProjektBO.
   *
   * @param {ProjektBO} projektBO to be updated
   * @public
   */
  updateProjekt(projektBO) {
    return this.#fetchAdvanced(this.#updateProjektURL(projektBO.getID()), {
      method: "PUT",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
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
    return this.#fetchAdvanced(this.#deleteProjektURL(projektID), {
      method: "DELETE"
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
   * Returns a Promise, which resolves to an Array of EreignisBO
   *
   * @public
   */
   getEreigniss() {
    return this.#fetchAdvanced(this.#getAllEreignisURL()).then((responseJSON) => {
      let ereignisBO = EreignisBO.fromJSON(responseJSON);
      // console.info(ereignisBOs);
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
      // console.info(responseEreignisBO);
      return new Promise(function (resolve) {
        resolve(responseEreignisID);
      })
    })
  }

  /**
   * Adds a ereignis and returns a Promise, which resolves to a new EreignisBO object with the
   *
   * @param {EreignisBO} ereignisBO to be added. The ID of the new Ereignis is set by the backend
   * @public
   */
  addEreignis(ereignisBO) {
    return this.#fetchAdvanced(this.#addEreignisURL(), {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(ereignisBO)
    }).then((responseJSON) => {
      // We always get an array of EreignisBO.fromJSON, but only need one object
      let responseEreignisBO = EreignisBO.fromJSON(responseJSON)[0];
      // console.info(ereignisBOs);
      return new Promise(function (resolve) {
        resolve(responseEreignisBO);
      })
    })
  }

  /**
   * Updates a ereignis and returns a Promise, which resolves to a EreignisBO.
   *
   * @param {EreignisBO} EreignisBO to be updated
   * @public
   */
  updateEreignis(ereignisBO) {
    return this.#fetchAdvanced(this.#updateEreignisURL(ereignisBO.getID()), {
      method: "PUT",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(ereignisBO)
    }).then((responseJSON) => {
      // We always get an array of EreignisBO.fromJSON
      let responseEreignisBO = EreignisBO.fromJSON(responseJSON)[0];
      // console.info(ereignisBOs);
      return new Promise(function (resolve) {
        resolve(responseEreignisBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to an Array of EreignisBO
   *
   * @param {Number} ereignisID to be deleted
   * @public
   */
  deleteEreignis(ereignisID) {
    return this.#fetchAdvanced(this.#deleteEreignisURL(ereignisID), {
      method: "DELETE"
    }).then((responseJSON) => {
      // We always get an array of ArbeitszeitkontoBO.fromJSON
      let responseaEreignisBO = EreignisBO.fromJSON(responseJSON)[0];
      // console.info(ereignisBOs);
      return new Promise(function (resolve) {
        resolve(responseaEreignisBO);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to an Array of ArbeitszeitkontoBO
   *
   * @public
   */
   getArbeitszeitkonten() {
    return this.#fetchAdvanced(this.#getAllArbeitszeitkontoURL()).then((responseJSON) => {
      let ArbeitszeitkontoBOs = ArbeitszeitkontoBO.fromJSON(responseJSON);
      // console.info(arbeitZeiBOs);
      return new Promise(function (resolve) {
        resolve(ArbeitszeitkontoBOs);
      })
    })
  }

  /**
   * Returns a Promise, which resolves to a ArbeitszeitkontoBO
   *
   * @param {Number} userID to be retrieved
   * @public
   */
  getArbeitszeitkonto(userID) {
    return this.#fetchAdvanced(this.#getArbeitszeitkontoByUserIdURL(userID)).then((responseJSON) => {
      // We always get an array of ArbeitszeitkontoBOs.fromJSON, but only need one object
      let responseArbeitszeitkontoBO = ArbeitszeitkontoBO.fromJSON(responseJSON)[0];
      // console.info(responseArbeitszeitkontoBO);
      return new Promise(function (resolve) {
        resolve(responseArbeitszeitkontoBO);
      })
    })
  }


  /**
   * Returns a Promise, which resolves to an Array of ZeitIntervallBO
   *
   * @public
   */
   getZeitIntervalls() {
    return this.#fetchAdvanced(this.#getAllZeitintervallURL()).then((responseJSON) => {
      let responseZeitintervallBO = ZeitintervallBO.fromJSON(responseJSON);
      // console.info(zeitintervallBOs);
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
  getZeitIntervall(zeitintervallID) {
    return this.#fetchAdvanced(this.#getZeitintervallURL(zeitintervallID)).then((responseJSON) => {
      // We always get an array of ZeitintervallBO.fromJSON, but only need one object
      let responseZeitintervallBO = ZeitintervallBO.fromJSON(responseJSON)[0];
      // console.info(responseZeitintervallBOs);
      return new Promise(function (resolve) {
        resolve(responseZeitintervallBO);
      })
    })
  }

  /**
   * Adds a zeitintervall and returns a Promise, which resolves to a new ZeitintervallBO object with the
   *
   * @param {ZeitintervallBO} zeitintervallID to be added. The ID of the new Zeitintervall is set by the backend
   * @public
   */
  addZeitIntervall(zeitintervallID) {
    return this.#fetchAdvanced(this.#addZeitintervallURL(), {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
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
   * Updates a zeitintervall and returns a Promise, which resolves to a zeitintervallBO.
   *
   * @param {ZeitintervallBO} zeitintervallBO to be updated
   * @public
   */
  updateZeitIntervall(zeitintervallBO) {
    return this.#fetchAdvanced(this.#updateZeitintervallURL(zeitintervallBO.getID()), {
      method: "PUT",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
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
  deleteZeitIntervall(ZeitintervallID) {
    return this.#fetchAdvanced(this.#deleteZeitintervallURL(ZeitintervallID), {
      method: "DELETE"
    }).then((responseJSON) => {
      // We always get an array of ZeitintervallBO.fromJSON
      let responseaZeitintervallBO = ZeitintervallBO.fromJSON(responseJSON)[0];
      // console.info(ZeitintervallBOs);
      return new Promise(function (resolve) {
        resolve(responseaZeitintervallBO);
      })
    })
  }
}