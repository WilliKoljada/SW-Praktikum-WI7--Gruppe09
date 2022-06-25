import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button, Grid, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
// import ClearIcon from "@material-ui/icons/Clear"
import { withRouter } from "react-router-dom";
import ZeiterfassungAPI from "../api/ZeiterfassungAPI";
import ContextErrorMessage from "./dialogs/ContextErrorMessage";
import LoadingProgress from "./dialogs/LoadingProgress";
import ZeitenForm from "./dialogs/ZeitenForm";
import ZeitenListEntry from "./entries/ZeitenListEntry";

class ZeitenList extends Component {

  constructor(props) {
    super(props);

    // console.log(props);
    let expandedID = null;

    if(this.props.location.expandZeiten){
      expandedID = this.props.location.expandZeiten.getID();
    }

    // Init the state
    this.state = {
      zeiten: [],
      error: null,
      loadingInProgress: false,
      expandedZeitenID: expandedID,
      showZeitenForm: false
    };
  }

  /** Fetches ZeitintervallBOs for the current person */
  getZeiten = () => {
    ZeiterfassungAPI.getAPI().getZeitIntervalls().then(zeitintervallBOs =>
        this.setState({  // Set new state when ZeitintervallBOs have been fetched
          zeiten: zeitintervallBOs,
          loadingInProgress: false, // loading indicator
          loadingZeitenError: null
        })).catch(e =>
          this.setState({ // Reset state with error from catch
            zeiten: [],
            loadingInProgress: false,
            loadingZeitenError: e
          }
        )
      );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      loadingZeitenError: null
    });
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    this.getZeiten();
  }

  /**
   * Handles onExpandedStateChange events from the ZeitenListEntry component. Toggels the expanded state of
   * the ZeitenListEntry of the given ZeitintervallBO.
   *
   * @param {zeit} ZeitintervallBO of the ZeitenListEntry to be toggeled
   */
   onExpandedStateChange = zeit => {
    // console.log(zeitintervallID);
    // Set expandend zeit entry to null by default
    let newID = null;

    // If same zeit entry is clicked, collapse it else expand a new one
    if (zeit.getID() !== this.state.expandedZeitenID) {
      // Expand the zeit entry with zeitintervallID
      newID = zeit.getID();
    }
    // console.log(newID);
    this.setState({
      expandedZeitenID: newID,
    });
  }

  /**
   * Handles onZeitenDeleted events from the ZeitenListEntry component
   *
   * @param {zeit} ZeitIntervallBO of the ZeitenListEntry to be deleted
   */
  zeitDeleted = zeit => {
    const newZeitenList = this.state.zeiten.filter(zeitFromState => zeitFromState.getID() !== zeit.getID());
    this.setState({
      zeiten: newZeitenList,
      showZeitenForm: false
    });
  }

  /** Handles the onClick event of the add zeit button */
  addZeitenButtonClicked = event => {
    // Do not toggle the expanded state
    event.stopPropagation();
    //Show the ZeitenForm
    this.setState({
      showZeitenForm: true
    });
  }

  /** Handles the onClose event of the ZeitenForm */
  zeitFormClosed = zeit => {
    // zeit is not null and therefore created
    if(zeit) {
      const newZeitenList = [...this.state.zeiten, zeit];
      this.setState({
        zeiten: newZeitenList,
        showZeitenForm: false
      });
    } else {
      this.setState({
        showZeitenForm: false
      });
    }
  }

  /** Renders the component */
  render() {
    const { classes, user } = this.props;
    const { zeiten, expandedZeitenID, loadingInProgress, error, showZeitenForm } = this.state;

    return (
      <div className={classes.root}>
        <Grid className={classes.zeitFilter} container spacing={1} justifyContent="flex-start" alignItems="center">
          <Grid item>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={this.addZeitenButtonClicked}>
              Buchung
          </Button>
          </Grid>
        </Grid>
        <Grid item xs />
        <Grid item>
          <Typography variant="body2" color={"textSecondary"}>List of Zeitintervall</Typography>
        </Grid>
        {
          zeiten.map(zeit =>
            (<div key={zeit.getID()}>
              <ZeitenListEntry key={zeit.getID()} zeit={zeit} user={user} expandedState={expandedZeitenID === zeit.getID()}
                onExpandedStateChange={this.onExpandedStateChange}
                onZeitenDeleted={this.zeitDeleted}
              />
              <br />
              <Grid item xs />
            </div>)
          )
        }
        <LoadingProgress show={loadingInProgress} />
        <ContextErrorMessage error={error} contextErrorMsg={`The list of zeitintervall could not be loaded.`} onReload={this.getZeiten} />
        <ZeitenForm show={showZeitenForm} user={user} onClose={this.zeitFormClosed} />
      </div>
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: '100%',
  },
  zeitFilter: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  }
});

/** PropTypes */
ZeitenList.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** @ignore */
  location: PropTypes.object.isRequired,
}

export default withRouter(withStyles(styles)(ZeitenList));