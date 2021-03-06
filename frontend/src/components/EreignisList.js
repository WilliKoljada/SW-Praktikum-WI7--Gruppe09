import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button, TextField, InputAdornment, IconButton, Grid, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear"
import { withRouter } from "react-router-dom";
import ZeiterfassungAPI from "../api/ZeiterfassungAPI";
import ContextErrorMessage from "./dialogs/ContextErrorMessage";
import LoadingProgress from "./dialogs/LoadingProgress";
import EreignisForm from "./dialogs/EreignisForm";
import EreignisListEntry from "./entries/EreignisListEntry";

class EreignisList extends Component {

  constructor(props) {
    super(props);

    // console.log(props);
    let expandedID = null;

    if (this.props.location.expandEreignis) {
      expandedID = this.props.location.expandEreignis.getID();
    }

    // Init the state
    this.state = {
      ereigniss: [],
      person: null,
      filteredEreigniss: [],
      ereignisFilter: "",
      error: null,
      loadingInProgress: false,
      expandedEreignisID: expandedID,
      showEreignisForm: false
    };
  }

  getPersonByGoogleID = () => {
    ZeiterfassungAPI.getAPI().getPersonByGoogleID(this.props.user.uid).then(person => {
      this.setState({
        person: person[0]
      })
    }).catch(e =>
      this.setState({
        person: null,
        updatingInProgress: false,    // disable loading indicator
        updatingError: e              // show error message
      })
    );
  }

  /** Fetches EreignisBOs for the current person */
  getEreigniss = () => {
    ZeiterfassungAPI.getAPI().getEreigniss().then(ereignisBOs =>
      this.setState({  // Set new state when EreignisBOs have been fetched
        ereigniss: ereignisBOs,
        filteredEreigniss: ereignisBOs,
        loadingInProgress: false, // loading indicator
        loadingEreignisError: null
      })).catch(e =>
        this.setState({ // Reset state with error from catch
          ereigniss: [],
          loadingInProgress: false,
          loadingEreignisError: e
        }
      )
    );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      loadingEreignisError: null
    });
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    this.getEreigniss();
    this.getPersonByGoogleID();
  }

  /**
   * Handles onExpandedStateChange events from the EreignisListEntry component. Toggels the expanded state of
   * the EreignisListEntry of the given EreignisBO.
   *
   * @param {ereignis} EreignisBO of the EreignisListEntry to be toggeled
   */
   onExpandedStateChange = ereignis => {
    // console.log(ereignisID);
    // Set expandend ereignis entry to null by default
    let newID = null;

    // If same ereignis entry is clicked, collapse it else expand a new one
    if (ereignis.getID() !== this.state.expandedEreignisID) {
      // Expand the ereignis entry with ereignisID
      newID = ereignis.getID();
    }
    // console.log(newID);
    this.setState({
      expandedEreignisID: newID,
    });
  }

  /**
   * Handles onEreignisDeleted events from the EreignisListEntry component
   *
   * @param {ereignis} EreignisBO of the EreignisListEntry to be deleted
   */
  ereignisDeleted = ereignis => {
    const newEreignisList = this.state.ereigniss.filter(ereignisFromState => ereignisFromState.getID() !== ereignis.getID());
    this.setState({
      ereigniss: newEreignisList,
      filteredEreigniss: [...newEreignisList],
      showEreignisForm: false
    });
  }

  /** Handles the onClick event of the add ereignis button */
  addEreignisButtonClicked = event => {
    // Do not toggle the expanded state
    event.stopPropagation();
    //Show the EreignisForm
    this.setState({
      showEreignisForm: true
    });
  }

  /** Handles the onClose event of the EreignisForm */
  ereignisFormClosed = ereignis => {
    // ereignis is not null and therefore created
    if(ereignis){
      const newEreignisList = [...this.state.ereigniss, ereignis];
      this.setState({
        ereigniss: newEreignisList,
        filteredEreigniss: [...newEreignisList],
        showEreignisForm: false
      });
    } else {
      this.setState({
        showEreignisForm: false
      });
    }
  }

  /** Handels onChange events of the ereignis filter text field */
  filterFieldValueChange = event => {
    const value = event.target.value.toLowerCase();
    this.setState({
      filteredEreigniss: this.state.ereigniss.filter(ereignis => {
        let typeContainsValue = ereignis.getType().toLowerCase().includes(value);
        return typeContainsValue;
      }),
      ereignisFilter: value
    });
  }

  /** Handles the onClose event of the clear filter button */
  clearFilterFieldButtonClicked = () => {
    // Reset the filter
    this.setState({
      filteredEreigniss: [...this.state.ereigniss],
      ereignisFilter: ""
    });
  }

  /** Renders the component */
  render() {
    const { classes, user } = this.props;
    const { filteredEreigniss, person, ereignisFilter, expandedEreignisID, loadingInProgress, error, showEreignisForm } = this.state;

    return (
      <div className={classes.root}>
        <Grid className={classes.ereignisFilter} container spacing={1} justifyContent="flex-start" alignItems="center">
          <Grid item>
            <Typography>
              Filter ereignis list by type:
              </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              autoFocus
              fullWidth
              id="ereignisFilter"
              type="text"
              value={ereignisFilter}
              onChange={this.filterFieldValueChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">
                  <IconButton onClick={this.clearFilterFieldButtonClicked}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs />
          <Grid item>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={this.addEreignisButtonClicked}>
              Buchung
          </Button>
          </Grid>
        </Grid>
        <Grid item xs />
        <Grid item>
          <Typography variant="body2" color={"textSecondary"}>List of ereignis</Typography>
        </Grid>
        {
          // Show the list of EreignisListEntry components
          // Do not use strict comparison, since expandedEreignisID maybe a string if given from the URL parameters
          person && filteredEreigniss.map(ereignis =>
            (<div key={ereignis.getID()}>
              <EreignisListEntry
                key={ereignis.getID()}
                ereignis={ereignis}
                user={user}
                person={person}
                expandedState={expandedEreignisID === ereignis.getID()}
                onExpandedStateChange={this.onExpandedStateChange}
                onEreignisDeleted={this.ereignisDeleted}
              />
              <br />
              <Grid item xs />
            </div>)
          )
        }
        <LoadingProgress show={loadingInProgress} />
        <ContextErrorMessage error={error} contextErrorMsg={`The list of ereignis could not be loaded.`} onReload={this.getEreigniss} />
        <EreignisForm show={showEreignisForm} user={user} onClose={this.ereignisFormClosed} />
      </div>
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: '100%',
  },
  ereignisFilter: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  }
});

/** PropTypes */
EreignisList.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** @ignore */
  location: PropTypes.object.isRequired,
}

export default withRouter(withStyles(styles)(EreignisList));