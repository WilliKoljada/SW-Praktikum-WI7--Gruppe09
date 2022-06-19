import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ZeiterfassungAPI from "../../api/ZeiterfassungAPI";
import EreignisBO from "../../api/EreignisBO";
import ContextErrorMessage from "./ContextErrorMessage";
import LoadingProgress from "./LoadingProgress";


/**
 * Shows a modal form dialog EreignisBO in prop ereignis. If the ereignis is set, the dialog is configured
 * as an edit dialog and the text fields of the form are filled from the given EreignisBO object.
 * If the ereignis is null, the dialog is configured as a new ereignis dialog and the textfields are empty.
 * In dependency of the edit/new state, the respective backend calls are made to update or create a ereignis.
 * After that, the function of the onClose prop is called with the created/update EreignisBO object as parameter.
 * When the dialog is canceled, onClose is called with null.
 *
 * @see See Material-UIs [Dialog](https://material-ui.com/components/dialogs)
 * @see See Material-UIs [TextField](https://material-ui.com/components/text-fields//)
 *
 * @author
 */
class EreignisForm extends Component {

  constructor(props) {
    super(props);

    let name = "";
    let bezeichung = "";
    if (props.ereignis) {
      name = props.ereignis.getName();
      bezeichung = props.ereignis.getBezeichnung();
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

  /** Adds the ereignis */
  addEreignis = () => {
    let newEreignis = new EreignisBO(
        this.state.name,
        this.state.bezeichung
    );
    ZeiterfassungAPI.getAPI().addEreignis(newEreignis).then(ereignis => {
      // Backend call sucessfull
      // reinit the dialogs state for a new empty ereignis
      this.setState(this.baseState);
      this.props.onClose(ereignis); // call the parent with the ereignis object from backend
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

  /** Updates the ereignis */
  updateEreignis = () => {
    // clone the original ereignis, in case the backend call fails
    let updatedEreignis = Object.assign(new EreignisBO(), this.props.ereignis);
    // set the new attributes from our dialog
    updatedEreignis.setName(this.state.name);
	updatedEreignis.setBezeichnung(this.state.bezeichung);
    ZeiterfassungAPI.getAPI().updateEreignis(updatedEreignis).then(ereignis => {
      this.setState({
        updatingInProgress: false,              // disable loading indicator
        updatingError: null                     // no error message
      });
      // keep the new state as base state
      this.baseState.name = this.state.name;
      this.baseState.bezeichung = this.state.bezeichung;
      this.props.onClose(updatedEreignis);      // call the parent with the new ereignis
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

  /** Renders the component */
  render() {
    const { classes, ereignis, show } = this.props;
    const { name, nameValidationFailed, nameEdited, bezeichung, bezeichungValidationFailed,
			bezeichungEdited,addingInProgress, addingError, updatingInProgress, updatingError } = this.state;

    let title = "";
    let header = "";

    if(ereignis) {
      // ereignis defindet, so ist an edit dialog
      title = "Update a ereignis";
      header = `Ereignis ID: ${ereignis.getID()}`;
    } else {
      title = "Create a new ereignis";
      header = "Enter ereignis data";
    }

    return (
      show ?
        <Dialog open={show} onClose={this.handleClose} maxWidth="xs">
          <DialogTitle id="form-dialog-title">{title}
            <IconButton className={classes.closeButton} onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {header}
            </DialogContentText>
            <form className={classes.root} noValidate autoComplete="off">
              <TextField
								autoFocus
								type="text"
								required
								fullWidth
								margin="normal"
								id="name"
								label="Name:"
								value={name}
                onChange={this.textFieldValueChange}
								error={nameValidationFailed}
                helperText={nameValidationFailed ? "The name must contain at least one character" : " "}
							/>
              <TextField
								type="text"
								required
								fullWidth
								margin="normal"
								id="bezeichung"
								label="Bezeichung:"
								value={bezeichung}
                onChange={this.textFieldValueChange}
								error={bezeichungValidationFailed}
                helperText={bezeichungValidationFailed ? "The Bezeichnung must contain at least one character" : " "}
							/>

