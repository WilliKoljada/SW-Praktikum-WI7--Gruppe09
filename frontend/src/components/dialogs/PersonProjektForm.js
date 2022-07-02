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
 *
 * @see See Material-UIs [Dialog](https://material-ui.com/components/dialogs)
 * @see See Material-UIs [TextField](https://material-ui.com/components/text-fields//)
 *
 * @author
 */
class PersonProjektForm extends Component {

  constructor(props) {
    super(props);
    // Init the state
    this.state = {
      projekts: [],
      persons: [],
      personID: 0,
      projektID: 0,
      addingInProgress: false,
      updatingInProgress: false,
      addingError: null,
      updatingError: null
    };
    // save this state for canceling
    this.baseState = this.state;
  }

  getProjekts = () => {
    ZeiterfassungAPI.getAPI().getProjektVonPerson(this.props.person.getID()).then(projektBOs =>
      this.setState({
        projekts: projektBOs,
      })).catch(e =>
        this.setState({
          projekts: []
        }
      )
    );
  }

  getPersons = () => {
    ZeiterfassungAPI.getAPI().getPersons().then(personBOs =>
      this.setState({
        persons: personBOs,
      })).catch(e =>
        this.setState({
          persons: []
        }
      )
    );
  }

  componentDidMount() {
    this.getProjekts();
    this.getPersons();
  }

  /** Adds person to projekt */
  addPersonToProjekt = () => {
    ZeiterfassungAPI.getAPI().addPersonInProjekt(this.state.personID, this.state.projektID)
    .then(() => {
      this.setState({
        personID: 0,
        projektID: 0
      });
      this.props.onClose();
    }).catch(e =>
      this.setState({
        updatingInProgress: false,
        updatingError: e
      })
    );

    // set loading to true
    this.setState({
      updatingInProgress: true,       // show loading indicator
      updatingError: null             // disable error message
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
    this.props.onClose();
  };

 /** Renders the component */
  render() {
    const { classes, aktivitaet, show } = this.props;
    const { projekts, persons, personID, projektID, addingInProgress, addingError, updatingInProgress, updatingError } = this.state;

    let title = "Fügt einer Person zu einem Projekt";
    let header = "Select the Person and the Projekt";

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
              <InputLabel variant="standard" htmlFor="personID">
								Person
							</InputLabel>
              <NativeSelect
								fullWidth
                onChange={this.handleSelect}
								value={personID}
								inputProps={{
									name: "PersonID",
									id: "personID"
								}}
							>
                {
                  persons.map(person =>
                    {person.getGoogle_id() !== this.props.user.uid &&
                      <option key={person.getID()} value={person.getID()}>{person.getBenutzername()}</option>
                    }
                  )
                }
							</NativeSelect>
              <InputLabel variant="standard" htmlFor="projektID">
								Projekt
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
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button variant="contained" onClick={this.addPersonToProjekt} color="primary">
              Add
             </Button>
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
PersonProjektForm.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The AktivitaetBO to be edited */
  person: PropTypes.object.isRequired,
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

export default withStyles(styles)(PersonProjektForm);


