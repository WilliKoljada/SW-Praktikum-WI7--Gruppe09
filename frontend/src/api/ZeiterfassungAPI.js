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
  #getPersonByEmailURL = (email) => `${this.#ZeiterfassungServerBaseURL}/person/${email}`;
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

  #fetchAdvanced = (url, init) => fetch(url, init)
    .then(res => {
      // The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500.
      if (!res.ok) {
        throw Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    }
  )


  getAktivitaets() {
    return this.#fetchAdvanced(this.#getAllAktivitaetURL()).then((responseJSON) => {
      let aktivitaetBOs = AktivitaetBO.fromJSON(responseJSON);
      // console.info(aktivitaetBOs);
      return new Promise(function (resolve) {
        resolve(aktivitaetBOs);
      })
    })
  }

  getAktivitaet(AktivitaetID) {
    return this.#fetchAdvanced(this.#getAktivitaetURL(AktivitaetID)).then((responseJSON) => {
      let responseAktivitaetID = AktivitaetID.fromJSON(responseJSON)[0];
      // console.info(responseAktivitaetBO);
      return new Promise(function (resolve) {
        resolve(responseAktivitaetID);
      })
    })
  }


  addAktivitaet(aktivitaetBO) {
    return this.#fetchAdvanced(this.#addAktivitaetURL(), {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(aktivitaetBO)
    }).then((responseJSON) => {
      let responseaktivitaetBO = aktivitaetBO.fromJSON(responseJSON)[0];
      // console.info(aktivitaetBOs);
      return new Promise(function (resolve) {
        resolve(responseaktivitaetBO);
      })
    })
  }


  updateAktivitaet(aktivitaetBO) {
    return this.#fetchAdvanced(this.#updateAktivitaetURL(aktivitaetBO.getId()), {
      method: "PUT",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(aktivitaetBO)
    }).then((responseJSON) => {
      let responseAktivitaetBO = AktivitaetBO.fromJSON(responseJSON)[0];
      // console.info(aktivitaetBOs);
      return new Promise(function (resolve) {
        resolve(responseAktivitaetBO);
      })
    })
  }


  deleteAktivitaet(aktivitaetID) {
    return this.#fetchAdvanced(this.#deleteAktivitaetURL(aktivitaetID), {
      method: "DELETE"
    }).then((responseJSON) => {
      let responseAktivitaetID = AktivitaetBO.fromJSON(responseJSON)[0];
      // console.info(aktivitaetBOs);
      return new Promise(function (resolve) {
        resolve(responseAktivitaetID);
      })
    })
  }


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



  addPerson(personBO) {
    return this.#fetchAdvanced(this.#addPersonURL(), {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(personBO)
    }).then((responseJSON) => {
      let responsePersonBO = PersonBO.fromJSON(responseJSON)[0];
      // console.info(personBO);
      return new Promise(function (resolve) {
        // We expect only one new person
        resolve(responsePersonBO);
      })
    })
  }

  updatePerson(personBO) {
    return this.#fetchAdvanced(this.#updatePersonURL(personBO.getID()), {
      method: "PUT",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(personBO)
    }).then((responseJSON) => {
      let responsePersonID = PersonBO.fromJSON(responseJSON)[0];
      // console.info(personBOs);
      return new Promise(function (resolve) {
        resolve(responsePersonID);
      })
    })
  }



  deletePerson(personID) {
    return this.#fetchAdvanced(this.#deletePersonURL(personID), {
      method: "DELETE"
    }).then((responseJSON) => {
      let responsePersonBO = PersonBO.fromJSON(responseJSON)[0];
      // console.info(personBOs);
      return new Promise(function (resolve) {
        resolve(responsePersonBO);
      })
    })
  }


   getProjekts() {
    return this.#fetchAdvanced(this.#getAllProjektsURL())
      .then((responseJSON) => {
        let projektBOs = ProjektBO.fromJSON(responseJSON);
        return new Promise(function (resolve) {
          resolve(projektBOs);
        })
      })
  }


   getProjekt(projektID) {
    return this.#fetchAdvanced(this.#getProjektByIdURL(projektID))
      .then((responseJSON) => {
      let responseProjektBO = ProjektBO.fromJSON(responseJSON)[0];
      // console.info(responseProjektBO);
      return new Promise(function (resolve) {
        resolve(responseProjektBO);
      })
    })
  }

  addProjekt(projektBO) {
    return this.#fetchAdvanced(this.#addProjektURL(), {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(projektBO)
    }).then((responseJSON) => {
      let responseProjektBO = ProjektBO.fromJSON(responseJSON)[0];
      // console.info(ProjektBOs);
      return new Promise(function (resolve) {
        resolve(responseProjektBO);
      })
    })
  }


  updateProjekt(projektBO) {
    return this.#fetchAdvanced(this.#updateProjektURL(projektBO.getID()), {
      method: "PUT",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(projektBO)
    }).then((responseJSON) => {
      let responseProjektBO = ProjektBO.fromJSON(responseJSON)[0];
      // console.info(ProjektBOs);
      return new Promise(function (resolve) {
        resolve(responseProjektBO);
      })
    })
  }


  deleteProjekt(projektID) {
    return this.#fetchAdvanced(this.#deleteProjektURL(projektID), {
      method: "DELETE"
    }).then((responseJSON) => {
      let responseProjektBO = ProjektBO.fromJSON(responseJSON)[0];
      // console.info(ProjektBOs);
      return new Promise(function (resolve) {
        resolve(responseProjektBO);
      })
    })
  }


   getEreigniss() {
    return this.#fetchAdvanced(this.#getAllEreignisURL()).then((responseJSON) => {
      let ereignisBO = EreignisBO.fromJSON(responseJSON);
      // console.info(ereignisBOs);
      return new Promise(function (resolve) {
        resolve(ereignisBO);
      })
    })
  }


  getEreignis(EreignisID) {
    return this.#fetchAdvanced(this.#getEreignisByIdURL(EreignisID)).then((responseJSON) => {
      let responseEreignisID = EreignisBO.fromJSON(responseJSON)[0];
      // console.info(responseEreignisBO);
      return new Promise(function (resolve) {
        resolve(responseEreignisID);
      })
    })
  }


  addEreignis(ereignisBO) {
    return this.#fetchAdvanced(this.#addEreignisURL(), {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(ereignisBO)
    }).then((responseJSON) => {
      let responseEreignisBO = EreignisBO.fromJSON(responseJSON)[0];
      // console.info(ereignisBOs);
      return new Promise(function (resolve) {
        resolve(responseEreignisBO);
      })
    })
  }


  updateEreignis(ereignisBO) {
    return this.#fetchAdvanced(this.#updateEreignisURL(ereignisBO.getID()), {
      method: "PUT",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(ereignisBO)
    }).then((responseJSON) => {
      let responseEreignisBO = EreignisBO.fromJSON(responseJSON)[0];
      // console.info(ereignisBOs);
      return new Promise(function (resolve) {
        resolve(responseEreignisBO);
      })
    })
  }


  deleteEreignis(ereignisID) {
    return this.#fetchAdvanced(this.#deleteEreignisURL(ereignisID), {
      method: "DELETE"
    }).then((responseJSON) => {
      let responseaEreignisBO = EreignisBO.fromJSON(responseJSON)[0];
      // console.info(ereignisBOs);
      return new Promise(function (resolve) {
        resolve(responseaEreignisBO);
      })
    })
  }

   getArbeitszeitkonten() {
    return this.#fetchAdvanced(this.#getAllArbeitszeitkontoURL()).then((responseJSON) => {
      let ArbeitszeitkontoBOs = ArbeitszeitkontoBO.fromJSON(responseJSON);
      // console.info(arbeitZeiBOs);
      return new Promise(function (resolve) {
        resolve(ArbeitszeitkontoBOs);
      })
    })
  }


  getArbeitszeitkonto(userID) {
    return this.#fetchAdvanced(this.#getArbeitszeitkontoByUserIdURL(userID)).then((responseJSON) => {
      let responseArbeitszeitkontoBO = ArbeitszeitkontoBO.fromJSON(responseJSON)[0];
      // console.info(responseArbeitszeitkontoBO);
      return new Promise(function (resolve) {
        resolve(responseArbeitszeitkontoBO);
      })
    })
  }



   getZeitIntervalls() {
    return this.#fetchAdvanced(this.#getAllZeitintervallURL()).then((responseJSON) => {
      let responseZeitintervallBO = ZeitintervallBO.fromJSON(responseJSON);
      // console.info(zeitintervallBOs);
      return new Promise(function (resolve) {
        resolve(responseZeitintervallBO);
      })
    })
  }


  getZeitIntervall(zeitintervallID) {
    return this.#fetchAdvanced(this.#getZeitintervallURL(zeitintervallID)).then((responseJSON) => {
      let responseZeitintervallBO = ZeitintervallBO.fromJSON(responseJSON)[0];
      // console.info(responseZeitintervallBOs);
      return new Promise(function (resolve) {
        resolve(responseZeitintervallBO);
      })
    })
  }


  addZeitIntervall(zeitintervallID) {
    return this.#fetchAdvanced(this.#addZeitintervallURL(), {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(zeitintervallID)
    }).then((responseJSON) => {
      let responseZeitintervallBO = ZeitintervallBO.fromJSON(responseJSON)[0];
      // console.info(ZeitintervallBOs);
      return new Promise(function (resolve) {
        resolve(responseZeitintervallBO);
      })
    })
  }


  updateZeitIntervall(zeitintervallBO) {
    return this.#fetchAdvanced(this.#updateZeitintervallURL(zeitintervallBO.getID()), {
      method: "PUT",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify(zeitintervallBO)
    }).then((responseJSON) => {
      let responseZeitintervallBO = ZeitintervallBO.fromJSON(responseJSON)[0];
      // console.info(ZeitintervallBOs);
      return new Promise(function (resolve) {
        resolve(responseZeitintervallBO);
      })
    })
  }


  deleteZeitIntervall(ZeitintervallID) {
    return this.#fetchAdvanced(this.#deleteZeitintervallURL(ZeitintervallID), {
      method: "DELETE"
    }).then((responseJSON) => {
      let responseaZeitintervallBO = ZeitintervallBO.fromJSON(responseJSON)[0];
      // console.info(ZeitintervallBOs);
      return new Promise(function (resolve) {
        resolve(responseaZeitintervallBO);
      })
    })
  }
}