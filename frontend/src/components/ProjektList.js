import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button, TextField, InputAdornment, IconButton, Grid, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear"
import { withRouter } from "react-router-dom";
import { ZeiterfassungAPI } from "../api";
import ContextErrorMessage from "./dialogs/ContextErrorMessage";
import LoadingProgress from "./dialogs/LoadingProgress";
import ProjektForm from "./dialogs/ProjektForm";
import ProjektListEntry from "./entries/ProjektListEntry";

class ProjektList extends Component {

  constructor(props) {
    super(props);

     // console.log(props);
    let expandedID = null;

    if (this.props.location.expandProjekt) {
      expandedID = this.props.location.expandProjekt.getID();
    }

    // Init the state
    this.state = {
      projekte: [],
      filteredProjekte: [],
      projektFilter: "",
      error: null,
      loadingInProgress: false,
      expandedProjektID: expandedID,
      showProjektForm: false
    };
  }

  /** Fetches ProjektBOs for the current person */
  getProjekts = () => {
    ZeiterfassungAPI.getAPI().getProjekte()
      .then(projektBOs =>
        this.setState({  // Set new state when ProjektBOs have been fetched
          projekte: projektBOs,
          loadingInProgress: false, // loading indicator
          loadingProjektError: null
        })).catch(e =>
          this.setState({ // Reset state with error from catch
            projekte: [],
            loadingInProgress: false,
            loadingProjektError: e
          }
        )
      );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      loadingProjektError: null
    });
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    this.getProjekte();
  }

/**
   * Handles onExpandedStateChange events from the ProjektListEntry component. Toggels the expanded state of
   * the ProjektListEntry of the given ProjektBO.
   *
   * @param {projekt} ProjektBO of the ProjektListEntry to be toggeled
   */
   onExpandedStateChange = projekt => {
    // console.log(projektID);
    // Set expandend projekt entry to null by default
    let newID = null;

    // If same projekt entry is clicked, collapse it else expand a new one
    if (projekt.getID() !== this.state.expandedProjektID) {
      // Expand the projekt entry with projektID
      newID = projekt.getID();
    }
    // console.log(newID);
    this.setState({
      expandedProjektID: newID,
    });
  }

  /**
   * Handles onProjektDeleted events from the ProjektListEntry component
   *
   * @param {projekt} ProjektBO of the ProjektListEntry to be deleted
   */
  projektDeleted = projekt => {
    const newProjektList = this.state.projekte.filter(projektFromState => projektFromState.getID() !== projekt.getID());
    this.setState({
      projekte: newProjektList,
      filteredProjekte: [...newProjektList],
      showProjektForm: false
    });
  }

  /** Handles the onClick event of the add projekt button */
  addProjektButtonClicked = event => {
    // Do not toggle the expanded state
    event.stopPropagation();
    //Show the ProjektForm
    this.setState({
    showProjektForm: true
    });
  }

/** Handles the onClose event of the ProjektForm */
  projektFormClosed = projekt => {
    // projekt is not null and therefore created
    if (projekt) {
      const newProjektList = [...this.state.projekte, projekt];
      this.setState({
        projekte: newProjektList,
        filteredProjekte: [...newProjektList],
        showProjektForm: false
      });
    } else {
      this.setState({
        showProjektForm: false
      });
    }
  }

  /** Handels onChange events of the projekt filter text field */
  filterFieldValueChange = event => {
    const value = event.target.value.toLowerCase();
    this.setState({
      filteredProjekte: this.state.projekte.filter(projekt => {
        let nameContainsValue = projekt.getName().toLowerCase().includes(value);
        let bezeichungContainsValue = projekt.getBezeichung().toLowerCase().includes(value);
        let auftraggeberContainsValue = projekt.getAuftraggeber().toLowerCase().includes(value);
        return nameContainsValue || bezeichungContainsValue || auftraggeberContainsValue;
      }),
      projektFilter: value
    });
  }

  /** Renders the component */
  render() {
    const { classes } = this.props;
    const { filteredProjekte, projektFilter, expandedProjektID, loadingInProgress, error, showProjektForm } = this.state;

    return (
      <div className={classes.root}>
        <Grid className={classes.projektFilter} container spacing={1} justify="flex-start" alignItems="center">
          <Grid item>
            <Typography>
              Filter projekt list by name:
              </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              autoFocus
              fullWidth
              id="projektFilter"
              type="text"
              value={projektFilter}
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
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={this.addProjektButtonClicked}>
              Add Projekt
          </Button>
          </Grid>
        </Grid>
        {
          // Show the list of ProjektListEntry components
          // Do not use strict comparison, since expandedProjektID maybe a string if given from the URL parameters
          filteredProjekte.map(projekt =>
            <ProjektListEntry key={projekt.getID()} projekt={projekt} expandedState={expandedProjektID === projekt.getID()}
              onExpandedStateChange={this.onExpandedStateChange}
              onProjektDeleted={this.projektDeleted}
            />)
        }
        <LoadingProgress show={loadingInProgress} />
        <ContextErrorMessage error={error} contextErrorMsg={`The list of projekte could not be loaded.`} onReload={this.getProjekte} />
        <ProjektForm show={showProjektForm} onClose={this.projektFormClosed} />
      </div>
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: '100%',
  },
  projektFilter: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  }
});

/** PropTypes */
ProjektList.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** @ignore */
  location: PropTypes.object.isRequired,
}

export default withRouter(withStyles(styles)(ProjektList));