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
    let beschreibung = "";
    let kapaz = 0;
    let projektID = 0;
    if(props.aktivitaet) {
      name = props.aktivitaet.getName();
      beschreibung = props.aktivitaet.getBeschreibung();
      kapaz = props.aktivitaet.getKapaz();
      projektID = props.aktivitaet.getProjektID();
    }

    // Init the state
    this.state = {
      projekts: [],
      name: name,
      nameValidationFailed: false,
      nameEdited: false,
      beschreibung: beschreibung,
      beschreibungValidationFailed: false,
      beschreibungEdited: false,
      projektID: projektID,
      addingInProgress: false,
      updatingInProgress: false,
      addingError: null,
      updatingError: null
    };
    // save this state for canceling
    this.baseState = this.state;
  }

  getProjekts = () => {
    ZeiterfassungAPI.getAPI().getProjekts().then(projektBOs =>
      this.setState({
        projekts: projektBOs,
        projektID: projektBOs[0].getID()
      })).catch(e =>
        this.setState({
          projekts: []
        }
      )
    );
  }

  componentDidMount() {
    this.getProjekts();
  }

  /** Adds the aktivitaet */
  addAktivitaet = () => {
    let newAktivitaet = new AktivitaetBO(
        this.state.name,
        this.state.beschreibung,
        this.state.projektID
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

    // set loading to true
    this.setState({
      updatingInProgress: true,       // show loading indicator
      updatingError: null             // disable error message
    });
  }

  /** Updates the aktivitaet */
  updateAktivitaet = () => {
    // clone the original aktivitaet, in case the backend call fails
    let updatedAktivitaet = Object.assign(new AktivitaetBO(), this.props.aktivitaet);
    // set the new attributes from our dialog
    updatedAktivitaet.setName(this.state.name);
		updatedAktivitaet.setBeschreibung(this.state.beschreibung);
    updatedAktivitaet.setProjektID(this.state.projektID);
    ZeiterfassungAPI.getAPI().updateAktivitaet(updatedAktivitaet).then(aktivitaet => {
      this.setState({
        updatingInProgress: false,              // disable loading indicator
        updatingError: null                     // no error message
      });
      // keep the new state as base state
      this.baseState.name = this.state.name;
      this.baseState.bezeichung = this.state.bezeichung;
      this.baseState.kapaz = this.state.kapaz;
      this.baseState.projektID = this.state.projektID;
      this.props.onClose(updatedAktivitaet);      // call the parent with the new aktivitaet
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
    console.log("value", event.target.value);
    console.log("id", event.target.id);
    this.setState({
      [event.target.id]: event.target.value
    })
    console.log("state", this.state.projektID);
  };

  /** Handles the close / cancel button click event */
  handleClose = () => {
    // Reset the state
    this.setState(this.baseState);
    this.props.onClose(null);
  };

  /** Renders the component */
  render() {
    const { classes, aktivitaet, show } = this.props;
    const { name, nameValidationFailed, nameEdited, beschreibung, beschreibungValidationFailed,
			projektID, addingInProgress, addingError, updatingInProgress, updatingError, projekts } = this.state;

    let title = "";
    let header = "";

    if (aktivitaet) {
      // aktivitaet defindet, so ist an edit dialog
      title = "Update a aktivitaet";
      header = `Aktivität ID: ${aktivitaet.getID()}`;
    } else {
      title = "Create a new aktivität";
      header = "Enter aktivität data";
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
                helperText={nameValidationFailed ? "The Name must contain at least one character" : " "}
							/>
              <TextField
								type="text"
								fullWidth
                multiline
                minRows={4}
                maxRows={10}
								margin="normal"
								id="beschreibung"
								label="Beschreibung:"
								value={beschreibung}
                onChange={this.textFieldValueChange}
								error={beschreibungValidationFailed}
                helperText={beschreibungValidationFailed ? "The Bezeichnung must contain at least one character" : " "}
							/>
              <InputLabel variant="standard" htmlFor="projektID">
								Projekt ID
							</InputLabel>
              <NativeSelect
								fullWidth
                onChange={this.handleSelect}
								value={projektID}
								inputProps={{
									name: "ProjektID",
									id: "projektID"
								}}
							>
                {
                  projekts.map(projekt =>
                    <option key={projekt.getID()} value={projekt.getID()}>{projekt.getName()}</option>
                  )
                }
							</NativeSelect>
            </form>
            <LoadingProgress show={addingInProgress || updatingInProgress} />
            {
              // Show error message in dependency of aktivitaet prop
              aktivitaet ?
                <ContextErrorMessage error={updatingError} contextErrorMsg={`The aktivität ${aktivitaet.getID()} could not be updated.`} onReload={this.updateAktivitaet} />
                :
                <ContextErrorMessage error={addingError} contextErrorMsg={`The aktivität could not be added.`} onReload={this.addAktivitaet} />
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            {
              // If a aktivitaet is given, show an update button, else an add button
              aktivitaet ?
                <Button disabled={nameValidationFailed} variant="contained" onClick={this.updateAktivitaet} color="primary">
                  Update
              </Button>
                : <Button disabled={nameValidationFailed || !nameEdited} variant="contained" onClick={this.addAktivitaet} color="primary">
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
AktivitaetForm.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The AktivitaetBO to be edited */
  aktivitaet: PropTypes.object,
  user: PropTypes.object.isRequired,
  /** If true, the form is rendered */
  show: PropTypes.bool.isRequired,
  /**
   * Handler function which is called, when the dialog is closed.
   * Sends the edited or created AktivitaetBO as parameter or null, if cancel was pressed.
   *
   * Signature: onClose(AktivitaetBO aktivitaet);
   */
  onClose: PropTypes.func.isRequired,
}

export default withStyles(styles)(AktivitaetForm);