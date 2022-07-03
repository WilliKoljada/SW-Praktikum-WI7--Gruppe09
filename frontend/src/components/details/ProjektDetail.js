import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Typography, Paper, Button } from "@material-ui/core";
import ZeiterfassungAPI from "../../api/ZeiterfassungAPI";
import ContextErrorMessage from "../dialogs/ContextErrorMessage";
import LoadingProgress from "../dialogs/LoadingProgress";
import PersonProjektDeleteDialog from "../dialogs/PersonProjektDeleteDialog";

/**
 * Renders a ProjektBO object within a ListEntry and provides a delete button to delete it.
 *
 * @see See Material-UIs [Lists](https://material-ui.com/components/lists/)
 * @see See Material-UIs [ListItem](https://material-ui.com/api/list-item/)
 *
 * @author
 */
class ProjektDetail extends Component {
  constructor(props) {
    super(props);

    // Init state
    this.state = {
      projekt: null,
      persons: [],
      deletedPersonID: 0,
      deletedProjektID: props.projekt.getID(),
      loadingInProgress: false,
      loadingError: null,
    };

    if(this.props.projekt){
      this.state.projekt = this.props.projekt;
    }
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    this.getProjektPersonen();
  }

  /** gets the balance for this person */
  getProjektPersonen = () => {
    console.log(this.props.projekt.getID())
    ZeiterfassungAPI.getAPI().getPersonInProjekt(this.props.projekt.getID()).then(personBos =>
      this.setState({
        persons: personBos,
        showPersonProjektDeleteDialog: false,
        loadingInProgress: false,
        loadingError: null
      })).catch(e =>
        this.setState({ // Reset state with error from catch
          persons: [],
          loadingInProgress: false,
          loadingError: e
        })
      );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      loadingError: null
    });
  }

  showRemovePersonDialog = (personID) => {
    console.log(personID);
    this.setState({
      deletedPersonID: personID,
      showPersonProjektDeleteDialog: true
    });
  }

  deletePersonProjektDialogClosed = () => {
    this.setState({
      showPersonProjektDeleteDialog: false
    });
  }

  /** Renders the component */
  render() {
    const { classes, person } = this.props;
    const { projekt, persons, showPersonProjektDeleteDialog, loadingInProgress, loadingError,
    deletedPersonID, deletedProjektID } = this.state;

    return (
      <Paper variant="outlined" className={classes.root}>
        {
          projekt ?
            (<div className={classes.parent}>
              <div className={classes.child}>
                <Typography>
                  Name: <strong>{projekt.getName()}</strong>
                </Typography>
                <Typography>
                  Auftraggeber: <strong>{projekt.getAuftraggeber()}</strong>
                </Typography>
                <Typography>
                  Beschreibung: <strong>{projekt.getBeschreibung()}</strong>
                </Typography>
                <Typography>
                  Kapazitaet: <strong>{projekt.getKapazitaet()}</strong>
                </Typography>
              </div>
              <div>
                <Typography><strong>List of person in Projekt</strong></Typography>
                {persons.length !== 0 && persons.map(pers =>(
                  <div key={pers.getID()}>
                     <Typography>{pers.getBenutzername()}</Typography>
                     {projekt.getPersonID() === person.getID() &&
                      <Button color="secondary" onClick={() => this.showRemovePersonDialog(pers.getID())}>
                        remove Person
                      </Button>
                     }
                  </div>
                )
                )}
              </div>
            </div>)
            : null
        }
        <LoadingProgress show={loadingInProgress} />
        <ContextErrorMessage
          error={loadingError}
          contextErrorMsg={`The data of projekt id ${projekt.getID()} could not be loaded.`}
          onReload={this.getProjektPersonen}
        />
        {persons.length > 0 &&
          <PersonProjektDeleteDialog
            show={showPersonProjektDeleteDialog}
            personID={deletedPersonID}
            projektID={deletedProjektID}
            onClose={this.deletePersonProjektDialogClosed}
          />
        }
      </Paper>
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: "100%",
    padding: theme.spacing(1),
    marginTop: theme.spacing(1)
  },
  parent: {
    display: "flex"
  },
  child: {
    flex: "50%"
  }
});

/** PropTypes */
ProjektDetail.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The projekt to be rendered */
  projekt: PropTypes.object.isRequired,
}

export default withStyles(styles)(ProjektDetail);