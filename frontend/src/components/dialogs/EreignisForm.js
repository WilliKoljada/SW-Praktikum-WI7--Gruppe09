import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, TextField, InputLabel, NativeSelect } from "@material-ui/core";
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

    let type = "urlaub";
    let datum = "";
    let startzeit = "";
    let endzeit = "";
    let personID = 0;
    if (props.ereignis) {
      type = props.ereignis.getType();
      datum = props.ereignis.getDatum();
      startzeit = props.ereignis.getStartzeit();
      endzeit = props.ereignis.getEndzeit();
      personID = props.ereignis.getPersonID();
    }

    // Init the state
    this.state = {
      type: type,
      datum: datum,
      datumValidationFailed: false,
      datumEdited: false,
      startzeit: startzeit,
      startzeitValidationFailed: false,
      startzeitEdited: false,
      endzeit: endzeit,
      endzeitValidationFailed: false,
      endzeitEdited: false,
      personID: personID,
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

  /** Adds the ereignis */
  addEreignis = () => {
    let newEreignis = new EreignisBO(
        this.state.type,
        this.state.datum,
        this.state.startzeit,
        this.state.endzeit,
        this.state.personID
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
    updatedEreignis.setType(this.state.type);
	  updatedEreignis.setDatum(this.state.datum);
	  updatedEreignis.setStartzeit(this.state.startzeit);
	  updatedEreignis.setEndzeit(this.state.endzeit);
	  updatedEreignis.setPersonID(this.state.personID);
    ZeiterfassungAPI.getAPI().updateEreignis(updatedEreignis).then(ereignis => {
      this.setState({
        updatingInProgress: false,              // disable loading indicator
        updatingError: null                     // no error message
      });
      // keep the new state as base state
      this.baseState.type = this.state.type;
      this.baseState.datum = this.state.datum;
      this.baseState.startzeit = this.state.startzeit;
      this.baseState.endzeit = this.state.endzeit;
      this.baseState.personID = this.state.personID;
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

  handleSelectType = (event) => {
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
    const { classes, ereignis, show } = this.props;
    const { type, startzeit, startzeitValidationFailed, datum, datumValidationFailed, datumEdited,
      startzeitEdited, endzeit, endzeitValidationFailed, endzeitEdited,
			addingInProgress, addingError, updatingInProgress, updatingError } = this.state;

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
            <InputLabel variant="standard" htmlFor="type">
								Type
							</InputLabel>
              <NativeSelect
								fullWidth
                value={type}
                onChange={this.handleSelectType}
								inputProps={{
									name: "type",
									id: "type"
								}}
							>
								<option value={"urlaub"}>Urlaub</option>
								<option value={"krankheit"}>Krankheit</option>
								<option value={"pause"}>Pause</option>
							</NativeSelect>
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
                helperText={datumValidationFailed ? "The Datum must mus be set" : " "}
							/>
              <TextField
								type="time"
								fullWidth
                required
								margin="normal"
								id="startzeit"
								label="startzeit:"
								value={startzeit}
                onChange={this.textFieldValueChange}
								error={startzeitValidationFailed}
                helperText={startzeitValidationFailed ? "The Startzeit must be set" : " "}
							/>
              <TextField
								type="time"
								fullWidth
                required
								margin="normal"
								id="endzeit"
								label="Endzeit:"
								value={endzeit}
                onChange={this.textFieldValueChange}
								error={endzeitValidationFailed}
                helperText={endzeitValidationFailed ? "The Endzeit must be set" : " "}
							/>
            </form>
            <LoadingProgress show={addingInProgress || updatingInProgress} />
            {
              // Show error message in dependency of ereignis prop
              ereignis ?
                <ContextErrorMessage error={updatingError} contextErrorMsg={`The ereignis ${ereignis.getID()} could not be updated.`} onReload={this.updateEreignis} />
                :
                <ContextErrorMessage error={addingError} contextErrorMsg={`The ereignis could not be added.`} onReload={this.addEreignis} />
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            {
              // If a ereignis is given, show an update button, else an add button
              ereignis ?
                <Button disabled={datumValidationFailed || startzeitValidationFailed || endzeitValidationFailed} variant="contained" onClick={this.updateEreignis} color="primary">
                  Update
              </Button>
                : <Button disabled={datumValidationFailed || !datumEdited || startzeitValidationFailed || !startzeitEdited || endzeitValidationFailed || !endzeitEdited} variant="contained" onClick={this.addEreignis} color="primary">
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
EreignisForm.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The EreignisBO to be edited */
  ereignis: PropTypes.object,
  user: PropTypes.object.isRequired,
  /** If true, the form is rendered */
  show: PropTypes.bool.isRequired,
  /**
   * Handler function which is called, when the dialog is closed.
   * Sends the edited or created EreignisBO as parameter or null, if cancel was pressed.
   *
   * Signature: onClose(EreignisBO ereignis);
   */
  onClose: PropTypes.func.isRequired,
}

export default withStyles(styles)(EreignisForm);