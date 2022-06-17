import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button, TextField, InputAdornment, IconButton, Grid, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear"
import { withRouter } from "react-router-dom";
import ZeiterfassungAPI from "../api/ZeiterfassungAPI";
import ContextErrorMessage from "./dialogs/ContextErrorMessage";
import LoadingProgress from "./dialogs/LoadingProgress";
import AktivitaetForm from "./dialogs/AktivitaetForm";
import AktivitaetListEntry from "./entries/AktivitaetListEntry";

class AktivitaetList extends Component {
  constructor(props) {
    super(props);

    // console.log(props);
    let expandedID = null;

    if (this.props.location.expandAktivitaet) {
      expandedID = this.props.location.expandAktivitaet.getID();
    }

    // Init the state
    this.state = {
      aktivitaets: [],
      filteredAktivitaets: [],
      aktivitaetFilter: "",
      error: null,
      loadingInProgress: false,
      expandedAktivitaetID: expandedID,
      showAktivitaetForm: false
    };
  }

  /** Fetches AktivitaetBOs for the current person */
  getAktivitaets = () => {
    ZeiterfassungAPI.getAPI().getAktivitaets()
      .then(aktivitaetBOs =>
        this.setState({  // Set new state when AktivitaetBOs have been fetched
          aktivitaets: aktivitaetBOs,
          loadingInProgress: false, // loading indicator
          loadinAktivitaettError: null
        })).catch(e =>
          this.setState({ // Reset state with error from catch
            aktivitaets: [],
            loadingInProgress: false,
            loadingAktivitaetError: e
          }
        )
      );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      loadingAktivitaetError: null
    });
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    this.getAktivitaets();
  }

  /**
   * Handles onExpandedStateChange events from the AktivitaetListEntry component. Toggels the expanded state of
   * the AktivitaetListEntry of the given AktivitaetBO.
   *
   * @param {aktivitaet} AktivitaetBO of the AktivitaetListEntry to be toggeled
   */
   onExpandedStateChange = aktivitaet => {
    // console.log(aktivitaetID);
    // Set expandend aktivitaet entry to null by default
    let newID = null;

    // If same aktivitaet entry is clicked, collapse it else expand a new one
    if (aktivitaet.getID() !== this.state.expandedAktivitaetID) {
      // Expand the aktivitaet entry with aktivitaetID
      newID = aktivitaet.getID();
    }
    // console.log(newID);
    this.setState({
      expandedAktivitaetID: newID,
    });
  }

  /**
   * Handles onAktivitaetDeleted events from the AktivitaetListEntry component
   *
   * @param {aktivitaet} AktivitaetBO of the AktivitaetListEntry to be deleted
   */
  aktivitaetDeleted = aktivitaet => {
    const newAktivitaetList = this.state.aktivitaet.filter(aktivitaetFromState => aktivitaetFromState.getID() !== aktivitaet.getID());
    this.setState({
      aktivitaets: newAktivitaetList,
      filteredAktivitaets: [...newAktivitaetList],
      showAktivitaetForm: false
    });
  }

  /** Handles the onClick event of the add aktivitaet button */
  addAktivitaetButtonClicked = event => {
    // Do not toggle the expanded state
    event.stopPropagation();
    //Show the AktivitaetForm
    this.setState({
      showAktivitaetForm: true
    });
  }

  /** Handles the onClose event of the AktivitaetForm */
  aktivitaetFormClosed = aktivitaet => {
    // aktivitaet is not null and therefore created
    if (aktivitaet) {
      const newAktivitaetList = [...this.state.aktivitaets, aktivitaet];
      this.setState({
        aktivitaets: newAktivitaetList,
        filteredAktivitaets: [...newAktivitaetList],
        showAktivitaetForm: false
      });
    } else {
      this.setState({
        showAktivitaetForm: false
      });
    }
  }

  /** Handels onChange events of the aktivitaet filter text field */
  filterFieldValueChange = event => {
    const value = event.target.value.toLowerCase();
    this.setState({
      filteredAktivitaets: this.state.aktivitaets.filter(aktivitaet => {
        let nameContainsValue = aktivitaet.getName().toLowerCase().includes(value);
        return nameContainsValue;
      }),
      aktivitaetFilter: value
    });
  }

  /** Handles the onClose event of the clear filter button */
  clearFilterFieldButtonClicked = () => {
    // Reset the filter
    this.setState({
      filteredAktivitaets: [...this.state.aktivitaets],
      aktivitaetFilter: ""
    });
  }

  /** Renders the component */
  render() {
    const { classes } = this.props;
    const { filteredAktivitaets, aktivitaetFilter, expandedAktivitaetID, loadingInProgress, error, showAktivitaetForm } = this.state;

    return (
      <div className={classes.root}>
        <Grid className={classes.aktivitaetFilter} container spacing={1} justify="flex-start" alignItems="center">
          <Grid item>
            <Typography>
              Filter aktivität list by name:
              </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              autoFocus
              fullWidth
              id="aktivitaetFilter"
              type="text"
              value={aktivitaetFilter}
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
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={this.addAktivitaetButtonClicked}>
              Add Aktivität
          </Button>
          </Grid>
        </Grid>
        {
          // Show the list of AktivitaetListEntry components
          // Do not use strict comparison, since expandedAktivitaetID maybe a string if given from the URL parameters
          filteredAktivitaets.map(aktivitaet =>
            <AktivitaetListEntry key={aktivitaet.getID()} aktivitaet={aktivitaet} expandedState={expandedAktivitaetID === aktivitaet.getID()}
              onExpandedStateChange={this.onExpandedStateChange}
              onAktivitaetDeleted={this.aktivitaetDeleted}
            />)
        }
        <LoadingProgress show={loadingInProgress} />
        <ContextErrorMessage error={error} contextErrorMsg={`The list of aktivität could not be loaded.`} onReload={this.getAktivitaets} />
        <AktivitaetForm show={showAktivitaetForm} onClose={this.aktivitaetFormClosed} />
      </div>
    );
  }
}

/** Component specific styles */
const styles = theme => (
  root:
    width: '100%',

  aktivitaetFilter: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  }
});

/** PropTypes */
AktivitaetList.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** @ignore */
  location: PropTypes.object.isRequired,
}

export default withRouter(withStyles(styles)(AktivitaetList));