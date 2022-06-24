import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText,
InputLabel, NativeSelect, DialogActions, TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ZeiterfassungAPI from "../../api/ZeiterfassungAPI";
import AktivitaetBO from "../../api/AktivitaetBO";
import ContextErrorMessage from "./ContextErrorMessage";
import LoadingProgress from "./LoadingProgress";


/**
 * Shows a modal form dialog for a AktivitaetBO in prop aktivitaet. If the aktivitaet is set, the dialog is configured
 * as an edit dialog and the text fields of the form are filled from the given AktivitaetBO object.
 * If the aktivitaet is null, the dialog is configured as a new aktivitaet dialog and the textfields are empty.
 * In dependency of the edit/new state, the respective backend calls are made to update or create a aktivitaet.
 * After that, the function of the onClose prop is called with the created/update AktivitaetBO object as parameter.
 * When the dialog is canceled, onClose is called with null.
 *
 * @see See Material-UIs [Dialog](https://material-ui.com/components/dialogs)
 * @see See Material-UIs [TextField](https://material-ui.com/components/text-fields//)
 *
 * @author
 */
class AktivitaetForm extends Component {

  constructor(props) {
    super(props);

    let name = "";
    let bezeichung = "";
    let kapaz = 0;
    if(props.aktivitaet) {
      name = props.aktivitaet.getName();
      bezeichung = props.aktivitaet.getBezeichnung();
      kapaz = props.aktivitaet.getKapaz();
    }

    // Init the state
    this.state = {
      name: name,
      nameValidationFailed: false,
      nameameEdited: false,
      bezeichung: bezeichung,
      bezeichungValidationFailed: false,
      bezeichungEdited: false,
      addingInProgress: false,
      updatingInProgress: false,
      addingError: null,
      updatingError: null
    };
    // save this state for canceling
    this.baseState = this.state;
  }

  /** Adds the aktivitaet */
  addAktivitaet = () => {
    let newAktivitaet = new AktivitaetBO(
        this.state.name,
        this.state.bezeichung
    );
    ZeiterfassungAPI.getAPI().addAktivitaet(newAktivitaet).then(aktivitaet => {
      // Backend call sucessfull
      // reinit the dialogs state for a new empty aktivitaet
      this.setState(this.baseState);
      this.props.onClose(aktivitaet); // call the parent with the aktivitaet object from backend
    }).catch(e =>
      this.setState({
        updatingInProgress: false,    // disable loading indicator
        updatingError: e              // show error message
      })
    );

