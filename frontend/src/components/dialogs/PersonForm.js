import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, TextField, NativeSelect, InputLabel } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ZeiterfassungAPI from "../../api/ZeiterfassungAPI";
import PersonBO from "../../api/PersonBO";
import ContextErrorMessage from "./ContextErrorMessage";
import LoadingProgress from "./LoadingProgress";
import firebase from "firebase/app";

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
    let role = "admin";
    if(props.person){
      vorname = props.person.getVorname();
      nachname = props.person.getNachname();
      email = props.person.getEmail();
      benutzername = props.person.getBenutzername();
      role = props.person.getRole();
      google_id = props.person.getGoogle_id();
    }

    if(props.user){
      google_id = props.user.uid;
      console.log("user", props.user)
    }

    // Init the state
    this.state = {
      vorname: vorname,
      vornameValidationFailed: false,
      nachname: nachname,
      nachnameValidationFailed: false,
      email: email,
      emailValidationFailed: false,
      emailEdited: false,
      benutzername: benutzername,
      benutzernameValidationFailed: false,
      benutzernameEdited: false,
      role: role,
      google_id: google_id,
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
		  this.state.google_id,
      this.state.role
    );
    console.log(JSON.stringify(newPerson));
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

    // set loading to true
    this.setState({
      updatingInProgress: true,       // show loading indicator
      updatingError: null             // disable error message
    });
  }

  /** Updates the person */
  updatePerson = () => {
    // clone the original person, in case the backend call fails
    let updatedPerson = Object.assign(new PersonBO(), this.props.person);
    // set the new attributes from our dialog
    updatedPerson.setVorname(this.state.vorname);
    updatedPerson.setNachname(this.state.nachname);
	  updatedPerson.setEmail(this.state.email);
	  updatedPerson.setBenutzername(this.state.benutzername);
	  updatedPerson.setGoogle_id(this.state.google_id);
    updatedPerson.setRole(this.state.role);
    console.log(updatedPerson);
    ZeiterfassungAPI.getAPI().updatePerson(updatedPerson).then(person => {
      this.setState({
        updatingInProgress: false,              // disable loading indicator
        updatingError: null                     // no error message
      });
      // keep the new state as base state
      this.baseState.vorname = this.state.vorname;
      this.baseState.nachname = this.state.nachname;
      this.baseState.email = this.state.email;
      this.baseState.benutzername = this.state.benutzername;
      this.baseState.google_id = this.state.google_id;
      this.baseState.role = this.state.role;
      this.props.onClose(updatedPerson);      // call the parent with the new person
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

  handleSelectRole = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    })
  };

  /** Handles the close / cancel button click event */
  handleClose = () => {
    // Reset the state
    this.setState(this.baseState);
    this.props.onClose(null);
  }

  /** Renders the component */
  render() {
    const { classes, person, show } = this.props;
    const { vorname, nachname, role, email, emailValidationFailed, emailEdited, benutzername, benutzernameValidationFailed,
      benutzernameEdited, addingInProgress, addingError, updatingInProgress, updatingError } = this.state;

    let title = "";
    let header = "";

    if (person) {
      // person defindet, so ist an edit dialog
      title = "Update a person";
      header = `Person ID: ${person.getID()}`;
    } else {
      title = "Create a new person";
      header = "Enter person data";
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
								fullWidth
								margin="normal"
								id="vorname"
								label="Vorname:"
								value={vorname}
                onChange={this.textFieldValueChange}
							/>
              <TextField
								autoFocus
								type="text"
								fullWidth
								margin="normal"
								id="nachname"
								label="Nachname:"
								value={nachname}
                onChange={this.textFieldValueChange}
							/>
              <TextField
								autoFocus
								type="text"
								required
								fullWidth
								margin="normal"
								id="email"
								label="Email:"
								value={email}
                onChange={this.textFieldValueChange}
								error={emailValidationFailed}
                helperText={emailValidationFailed ? "The email must contain at least one character" : " "}
							/>
              <TextField
								type="text"
								required
								fullWidth
								margin="normal"
								id="benutzername"
								label="Benutzername:"
								value={benutzername}
                onChange={this.textFieldValueChange}
								error={benutzernameValidationFailed}
                helperText={benutzernameValidationFailed ? "The Benutzername must contain at least one character" : " "}
							/>
              <InputLabel variant="standard" htmlFor="role">
								Role
							</InputLabel>
              <NativeSelect
								fullWidth
                value={role}
                onChange={this.handleSelectRole}
								inputProps={{
									name: "role",
									id: "role"
								}}
							>
								<option value={"admin"}>admin</option>
								<option value={"mitarbeiter"}>Mitarbeiter</option>
							</NativeSelect>
            </form>
            <LoadingProgress show={addingInProgress || updatingInProgress} />
            {
              // Show error message in dependency of person prop
              person ?
                <ContextErrorMessage error={updatingError} contextErrorMsg={`The person ${person.getBenutzername()} could not be updated.`} onReload={this.updatePerson} />
                :
                <ContextErrorMessage error={addingError} contextErrorMsg={`The person could not be added.`} onReload={this.addPerson} />
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            {
              // If a person is given, show an update button, else an add button
              person ?
                <Button disabled={emailValidationFailed || benutzernameValidationFailed} variant="contained" onClick={this.updatePerson} color="primary">
                  Update
              </Button>
                : <Button disabled={emailValidationFailed || !emailEdited || benutzernameValidationFailed || !benutzernameEdited} variant="contained" onClick={this.addPerson} color="primary">
                  Add
             </Button>
            }
          </DialogActions>
        </Dialog>
        : null
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

/** PropTypes */
PersonForm.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The PersonBO to be edited */
  person: PropTypes.object,
  /** If true, the form is rendered */
  show: PropTypes.bool.isRequired,
  /**
   * Handler function which is called, when the dialog is closed.
   * Sends the edited or created PersonBO as parameter or null, if cancel was pressed.
   *
   * Signature: onClose(PersonBO person);
   */
  onClose: PropTypes.func.isRequired,
}

export default withStyles(styles)(PersonForm);
