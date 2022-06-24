import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { ZeiterfassungAPI, PersonBO } from "../../api";
import ContextErrorMessage from "./ContextErrorMessage";
import LoadingProgress from "./LoadingProgress";


/**
 * Shows a modal form dialog for a PersonBO in prop person. If the person is set, the dialog is configured
 * as an edit dialog and the text fields of the form are filled from the given PersonBO object.
 * If the person is null, the dialog is configured as a new person dialog and the textfields are empty.
 * In dependency of the edit/new state, the respective backend calls are made to update or create a person.
 * After that, the function of the onClose prop is called with the created/update PersonBO object as parameter.
 * When the dialog is canceled, onClose is called with null.
 *
 * @see See Material-UIs [Dialog](https://material-ui.com/components/dialogs)
 * @see See Material-UIs [TextField](https://material-ui.com/components/text-fields//)
 *
 * @author
 */
class PersonForm extends Component {

  constructor(props) {
    super(props);

    let vorname = "";
    let nachname = "";
    let email = "";
    let benutzername = "";
    let google_id = "";
    if (props.person) {
      vorname = props.person.getVorame();
      nachname = props.person.getNachname();
      email = props.person.getEmail();
      benutzername = props.person.getBenutzername();
      google_id = props.person.getGoogle_id();
    }

    // Init the state
    this.state = {
      vorname: vorname,
      vornameValidationFailed: false,
      vornameameEdited: false,
      nachname: nachname,
      nachnameValidationFailed: false,
      nachnameameEdited: false,
      email: email,
      emailValidationFailed: false,
      emailEdited: false,
      benutzername: benutzername,
      benutzernameValidationFailed: false,
      benutzernameEdited: false,
      addingInProgress: false,
      updatingInProgress: false,
      addingError: null,
      updatingError: null
    };
    // save this state for canceling
    this.baseState = this.state;
  }

  /** Adds the person */
  addPerson = () => {
    let newPerson = new PersonBO(
        this.state.vorname,
        this.state.nachname,
        this.state.email,
		this.state.benutzername,
		this.state.google_id
    );
    ZeiterfassungAPI.getAPI().addPerson(newPerson).then(person => {
      // Backend call sucessfull
      // reinit the dialogs state for a new empty person
      this.setState(this.baseState);
      this.props.onClose(person); // call the parent with the person object from backend
    }).catch(e =>
      this.setState({
        updatingInProgress: false,    // disable loading indicator
        updatingError: e              // show error message
      })
    );
