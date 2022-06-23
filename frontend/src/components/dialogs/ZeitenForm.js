import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText,
DialogActions, TextField, InputLabel, NativeSelect } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ZeiterfassungAPI from "../../api/ZeiterfassungAPI";
import ZeitintervallBO from "../../api/ZeitintervallBO";
import ContextErrorMessage from "./ContextErrorMessage";
import LoadingProgress from "./LoadingProgress";


/**
 * Shows a modal form dialog for a ZeitintervallBO in prop zeit. If the zeit is set, the dialog is configured
 * as an edit dialog and the text fields of the form are filled from the given ZeitintervallBO object.
 * If the zeit is null, the dialog is configured as a new zeit dialog and the textfields are empty.
 * In dependency of the edit/new state, the respective backend calls are made to update or create a zeit.
 * After that, the function of the onClose prop is called with the created/update ZeitintervallBO object as parameter.
 * When the dialog is canceled, onClose is called with null.
 *
 * @see See Material-UIs [Dialog](https://material-ui.com/components/dialogs)
 * @see See Material-UIs [TextField](https://material-ui.com/components/text-fields//)
 *
 * @author
 */
class ZeitenForm extends Component {

  constructor(props) {
    super(props);

    let datum = null;
    let start = null;
    let end = null;
    let aktivitaetID = null;
    let userID = null;
    if(props.zeit) {
      datum = props.zeit.getDatum();
      start = props.zeit.getStart();
      end = props.zeit.getEnd();
      aktivitaetID = props.zeit.getAktivitaetID();
      userID = props.zeit.getUserID();
    }

    // Init the state
    this.state = {
      datum: datum,
      datumValidationFailed: false,
      datumEdited: false,
      start: start,
      startValidationFailed: false,
      startEdited: false,
      end: end,
      endValidationFailed: false,
      endEdited: false,
      aktivitaetID: aktivitaetID,
      aktivitaetIDValidationFailed: false,
      aktivitaetIDEdited: false,
      userID: userID,
      userIDValidationFailed: false,
      userIDEdited: false,
      addingInProgress: false,
      updatingInProgress: false,
      addingError: null,
      updatingError: null
    };
    // save this state for canceling
    this.baseState = this.state;
  }

  /** Adds the zeit */
  addZeiten = () => {
    let newZeiten = new ZeitintervallBO(
      this.state.datum,
      this.state.start,
			this.state.end,
			this.state.aktivitaetID,
			this.state.userID
    );
    ZeiterfassungAPI.getAPI().addZeitIntervall(newZeiten).then(zeit => {
      // Backend call sucessfull
      // reinit the dialogs state for a new empty zeit
      this.setState(this.baseState);
      this.props.onClose(zeit); // call the parent with the zeit object from backend
    }).catch(e =>
      this.setState({
        updatingInProgress: false,    // disable loading indicator
        updatingError: e              // show error message
      })
    );

    // set loading to true
    this.setState({
      updatingInProgress: true,       // show loading indicator
      updatingError: null             // disable error message
    });
  }

  /** Updates the zeit */
  updateZeiten = () => {
    // clone the original zeit, in case the backend call fails
    let updatedZeiten = Object.assign(new ZeitintervallBO(), this.props.zeit);
    // set the new attributes from our dialog
    updatedZeiten.setDatum(this.state.datum);
		updatedZeiten.setStart(this.state.start);
		updatedZeiten.setEnd(this.state.end);
		updatedZeiten.setAktivitaetID(this.state.aktivitaetID);
		updatedZeiten.setUserID(this.state.userID);
    ZeiterfassungAPI.getAPI().updateZeitIntervall(updatedZeiten).then(zeit => {
      this.setState({
        updatingInProgress: false,              // disable loading indicator
        updatingError: null                     // no error message
      });
      // keep the new state as base state
      this.baseState.datum = this.state.datum;
      this.baseState.start = this.state.start;
      this.baseState.end = this.state.end;
      this.baseState.aktivitaetID = this.state.aktivitaetID;
      this.baseState.userID = this.state.userID;
      this.props.onClose(updatedZeiten);      // call the parent with the new zeit
    }).catch(e =>
      this.setState({
        updatingInProgress: false,              // disable loading indicator
        updatingError: e                        // show error message
      })
    );

    // set loading to true
    this.setState({
      updatingInProgress: true,                 // show loading indicator
      updatingError: null                       // disable error message
    });
  }

  /** Handles value changes of the forms textfields and validates them */
  textFieldValueChange = (event) => {
    const value = event.target.value;

    let error = false;
    if (value.trim().length === 0) {
      error = true;
    }

    this.setState({
      [event.target.id]: event.target.value,
      [event.target.id + "ValidationFailed"]: error,
      [event.target.id + "Edited"]: true
    });
  }

  /** Handles the close / cancel button click event */
  handleClose = () => {
    // Reset the state
    this.setState(this.baseState);
    this.props.onClose(null);
  }
