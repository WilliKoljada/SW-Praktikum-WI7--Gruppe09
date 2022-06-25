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

    let datum = "";
    let startzeit = "";
    let endzeit = "";
    let aktivitaetID = 1;
    let personID = 0;
    if(props.zeit){
      datum = props.zeit.getDatum();
      startzeit = props.zeit.getStartzeit();
      endzeit = props.zeit.getEndzeit();
      aktivitaetID = props.zeit.getAktivitaetID();
      personID = props.zeit.getPersonID();
    }

    // Init the state
    this.state = {
      aktivitaets: [],
      datum: datum,
      datumValidationFailed: false,
      datumEdited: false,
      startzeit: startzeit,
      startzeitValidationFailed: false,
      startzeitEdited: false,
      endzeit: endzeit,
      endzeitValidationFailed: false,
      endzeitEdited: false,
      aktivitaetID: aktivitaetID,
      aktivitaetIDValidationFailed: false,
      aktivitaetIDEdited: false,
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

  /** Fetches AktivitaetBOs for the current person */
  getAktivitaets = () => {
    ZeiterfassungAPI.getAPI().getAktivitaets().then(aktivitaetBOs =>
      this.setState({  // Set new state when AktivitaetBOs have been fetched
        aktivitaets: aktivitaetBOs,
        aktivitaetID: aktivitaetBOs[0].getID()
      })).catch(e =>
        this.setState({ // Reset state with error from catch
          aktivitaets: [],
        }
      )
    );
  }

  componentDidMount() {
    this.getAktivitaets();
    this.getPersonByGoogleID();
  }

  /** Adds the zeit */
  addZeiten = () => {
    let newZeiten = new ZeitintervallBO(
      this.state.datum,
      this.state.startzeit,
			this.state.endzeit,
			this.state.aktivitaetID,
			this.state.personID
    );
    ZeiterfassungAPI.getAPI().addZeitIntervall(newZeiten).then(zeit => {
      // Backend call sucessfull
      // reinit the dialogs state for a new empty zeit
      this.setState({
        datum: "",
        startzeit: "",
        endzeit: "",
        aktivitaetID: 1
      });
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
		updatedZeiten.setStartzeit(this.state.startzeit);
		updatedZeiten.setEndzeit(this.state.endzeit);
		updatedZeiten.setAktivitaetID(this.state.aktivitaetID);
		updatedZeiten.setPersonID(this.state.personID);
    ZeiterfassungAPI.getAPI().updateZeitIntervall(updatedZeiten).then(zeit => {
      this.setState({
        updatingInProgress: false,              // disable loading indicator
        updatingError: null                     // no error message
      });
      // keep the new state as base state
      this.baseState.datum = this.state.datum;
      this.baseState.startzeit = this.state.startzeit;
      this.baseState.endzeit = this.state.endzeit;
      this.baseState.aktivitaetID = this.state.aktivitaetID;
      this.baseState.personID = this.state.personID;
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

  handleSelectAkt = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  /** Handles the close / cancel button click event */
  handleClose = () => {
    // Reset the state
    this.setState(this.baseState);
    this.props.onClose(null);
  }

  /** Renders the component */
  render() {
    const { classes, zeit, show } = this.props;
    const { datum, datumValidationFailed, datumEdited, startzeit, startzeitValidationFailed, startzeitEdited, endzeit, endzeitValidationFailed,
			endzeitEdited, aktiviteatID, addingInProgress, addingError, updatingInProgress, updatingError, aktivitaets } = this.state;

    let title = "";
    let header = "";

    if(zeit) {
      // zeit defindet, so ist an edit dialog
      title = "Update a Zeitintervall";
      header = `Zeitintervall ID: ${zeit.getID()}`;
    } else {
      title = "Buchung eines Zeitintervall";
      header = "Enter Zeitintervall data";
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
								type="date"
								required
								fullWidth
								margin="normal"
								id="datum"
								label="Datum:"
								value={datum}
                onChange={this.textFieldValueChange}
								error={datumValidationFailed}
                helperText={datumValidationFailed ? "The Datum must contain at least one character" : " "}
							/>
              <TextField
								type="time"
								required
								fullWidth
								margin="normal"
								id="startzeit"
								label="Startzeit:"
								value={startzeit}
                onChange={this.textFieldValueChange}
								error={startzeitValidationFailed}
                helperText={startzeitValidationFailed ? "The Startzeit must contain at least one character" : " "}
							/>
              <TextField
								type="time"
								required
								fullWidth
								margin="normal"
								id="endzeit"
								label="Endzeit:"
								value={endzeit}
                onChange={this.textFieldValueChange}
								error={endzeitValidationFailed}
                helperText={endzeitValidationFailed ? "The Endzeit must contain at least one character" : " "}
							/>
              <InputLabel variant="standard" htmlFor="aktivitaetID">
								Aktivität
							</InputLabel>
              <NativeSelect
								fullWidth
								value={aktiviteatID}
                onChange={this.handleSelectAkt}
								inputProps={{
									name: "AktivitaetID",
									id: "aktivitaetID"
								}}
							>
                {
                  aktivitaets.map(aktivitaet =>
                    <option key={aktivitaet.getID()} value={aktivitaet.getID()}>{aktivitaet.getName()}</option>
                  )
                }
							</NativeSelect>
            </form>
            <LoadingProgress show={addingInProgress || updatingInProgress} />
            {
              // Show error message in dependency of zeitintervall prop
              zeit ?
                <ContextErrorMessage error={updatingError} contextErrorMsg={`The Zeitintervall ${zeit.getID()} could not be updated.`} onReload={this.updateZeiten} />
                :
                <ContextErrorMessage error={addingError} contextErrorMsg={`The Zeitintervall could not be added.`} onReload={this.addZeiten} />
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            {
              // If a zeitintervall is given, show an update button, else an add button
              zeit ?
                <Button disabled={datumValidationFailed || startzeitValidationFailed || endzeitValidationFailed} variant="contained" onClick={this.updateZeiten} color="primary">
                  Update
              </Button>
                : <Button disabled={datumValidationFailed || !datumEdited || startzeitValidationFailed || !startzeitEdited || endzeitValidationFailed || !endzeitEdited} variant="contained" onClick={this.addZeiten} color="primary">
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
ZeitenForm.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The ZeitintervallBO to be edited */
  zeit: PropTypes.object,
  user: PropTypes.object.isRequired,
  /** If true, the form is rendered */
  show: PropTypes.bool.isRequired,
  /**
   * Handler function which is called, when the dialog is closed.
   * Sends the edited or created ZeitintervallBO as parameter or null, if cancel was pressed.
   *
   * Signature: onClose(ZeitintervallBO zeit);
   */
  onClose: PropTypes.func.isRequired,
}

export default withStyles(styles)(ZeitenForm);
