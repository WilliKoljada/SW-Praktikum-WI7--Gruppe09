import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ZeiterfassungAPI from "../../api/ZeiterfassungAPI";
import ProjektBO from "../../api/ProjektBO";
import ContextErrorMessage from "./ContextErrorMessage";
import LoadingProgress from "./LoadingProgress";


/**
 * Shows a modal form dialog for a ProjektBO in prop projekt. If the projekt is set, the dialog is configured
 * as an edit dialog and the text fields of the form are filled from the given ProjektBO object.
 * If the projekt is null, the dialog is configured as a new projekt dialog and the textfields are empty.
 * In dependency of the edit/new state, the respective backend calls are made to update or create a projekt.
 * After that, the function of the onClose prop is called with the created/update ProjektBO object as parameter.
 * When the dialog is canceled, onClose is called with null.
 *
 * @see See Material-UIs [Dialog](https://material-ui.com/components/dialogs)
 * @see See Material-UIs [TextField](https://material-ui.com/components/text-fields//)
 *
 * @author
 */
class ProjektForm extends Component {
  constructor(props) {
    super(props);

    let name = "";
    let auftraggeber = "";
    let beschreibung = "";
    let personID = 0;
    if(props.projekt){
      name = props.projekt.getName();
      auftraggeber = props.projekt.getAuftraggeber();
      beschreibung = props.projekt.getBeschreibung();
      personID = props.projekt.getPersonID();
    }
    // Init the state
    this.state = {
      name: name,
      nameValidationFailed: false,
      nameEdited: false,
      auftraggeber: auftraggeber,
      auftraggeberValidationFailed: false,
      auftraggeberEdited: false,
      beschreibung: beschreibung,
      beschreibungValidationFailed: false,
      beschreibungEdited: false,
      personID: personID,
      personIDValidationFailed: false,
      personIDEdited: false,
      addingInProgress: false,
      updatingInProgress: false,
      addingError: null,
      updatingError: null
    };
    // save this state for canceling
    this.baseState = this.state;
  }

  componentDidMount() {
    this.getPersonByGoogleID();
  }

  getPersonByGoogleID = () => {
    ZeiterfassungAPI.getAPI().getPersonByGoogleID(this.props.user.uid).then(person => {
      this.setState({
        personID: person[0].getID()
      })
    }).catch(e =>
      this.setState({
        updatingInProgress: false,    // disable loading indicator
        updatingError: e              // show error message
      })
    );
  }

  /** Adds the projekt */
  addProjekt = () => {
    let newProjekt = new ProjektBO(
        this.state.name,
        this.state.auftraggeber,
        this.state.beschreibung,
				this.state.personID
    );
    ZeiterfassungAPI.getAPI().addProjekt(newProjekt).then(projekt => {
      // Backend call sucessfull
      // reinit the dialogs state for a new empty projekt
      this.setState(this.baseState);
      this.props.onClose(projekt); // call the parent with the projekt object from backend
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

  /** Updates the projekt */
  updateProjekt = () => {
    // clone the original projekt, in case the backend call fails
    let updatedProjekt = Object.assign(new ProjektBO(), this.props.projekt);
    // set the new attributes from our dialog
    updatedProjekt.setName(this.state.name);
    updatedProjekt.setAuftraggeber(this.state.auftraggeber);
		updatedProjekt.setBeschreibung(this.state.beschreibung);
		updatedProjekt.setPersonID(this.state.personID);
    ZeiterfassungAPI.getAPI().updateProjekt(updatedProjekt).then(projekt => {
      this.setState({
        updatingInProgress: false,              // disable loading indicator
        updatingError: null                     // no error message
      });
      // keep the new state as base state
      this.baseState.name = this.state.name;
      this.baseState.auftraggeber = this.state.auftraggeber;
      this.baseState.beschreibung = this.state.beschreibung;
      this.baseState.personID = this.state.personID;
      this.props.onClose(updatedProjekt);      // call the parent with the new projekt
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

  handleSelect = (event) => {
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
    const { classes, projekt, show } = this.props;
    const { name, nameValidationFailed, nameEdited, auftraggeber, auftraggeberValidationFailed, auftraggeberEdited, beschreibung,
      beschreibungValidationFailed, addingInProgress, addingError, updatingInProgress, updatingError } = this.state;

    let title = "";
    let header = "";

    if (projekt) {
      // projekt defindet, so ist an edit dialog
      title = "Update a projekt";
      header = `Projekt ID: ${projekt.getID()}`;
    } else {
      title = "Create a new projekt";
      header = "Enter projekt data";
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
								autoFocus
								type="text"
								required
								fullWidth
								margin="normal"
								id="auftraggeber"
								label="Auftraggeber:"
								value={auftraggeber}
                onChange={this.textFieldValueChange}
								error={auftraggeberValidationFailed}
                helperText={auftraggeberValidationFailed ? "The Auftraggeber must contain at least one character" : " "}
							/>
              <TextField
								type="text"
								fullWidth
								margin="normal"
                multiline
                minRows={4}
                maxRows={10}
								id="beschreibung"
								label="Beschreibung:"
								value={beschreibung}
                onChange={this.textFieldValueChange}
								error={beschreibungValidationFailed}
                helperText={beschreibungValidationFailed ? "The Beschreibung must contain at least one character" : " "}
							/>
            </form>
            <LoadingProgress show={addingInProgress || updatingInProgress} />
            {
              // Show error message in dependency of projekt prop
              projekt ?
                <ContextErrorMessage error={updatingError} contextErrorMsg={`The projekt ${projekt.getID()} could not be updated.`} onReload={this.updateProjekt} />
                :
                <ContextErrorMessage error={addingError} contextErrorMsg={`The projekt could not be added.`} onReload={this.addProjekt} />
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            {
              // If a projekt is given, show an update button, else an add button
              projekt ?
                <Button disabled={nameValidationFailed || auftraggeberValidationFailed} variant="contained" onClick={this.updateProjekt} color="primary">
                  Update
              </Button>
                : <Button disabled={nameValidationFailed || !nameEdited || auftraggeberValidationFailed || !auftraggeberEdited} variant="contained" onClick={this.addProjekt} color="primary">
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
ProjektForm.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The ProjektBO to be edited */
  projekt: PropTypes.object,
  user: PropTypes.object.isRequired,
  /** If true, the form is rendered */
  show: PropTypes.bool.isRequired,
  /**
   * Handler function which is called, when the dialog is closed.
   * Sends the edited or created ProjektBO as parameter or null, if cancel was pressed.
   *
   * Signature: onClose(ProjektBO projekt);
   */
  onClose: PropTypes.func.isRequired,
}

export default withStyles(styles)(ProjektForm);