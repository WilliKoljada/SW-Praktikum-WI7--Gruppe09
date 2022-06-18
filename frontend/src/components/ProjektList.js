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
      loadingInProgress: false,
      loadingProjektError: null,
      addingProjektError: null,
    };
  }

  /** Fetches AccountBOs for the current customer */
  getProjekt = () => {
    ZeiterfassungAPI.getAPI().getProjekt(this.props.customer.getID()).then(accountBOs =>
      this.setState({  // Set new state when AccountBOs have been fetched
        accounts: accountBOs,
        loadingInProgress: false, // loading indicator
        loadingAccountError: null
      })).catch(e =>
        this.setState({ // Reset state with error from catch
          accounts: [],
          loadingInProgress: false,
          loadingProjektError: e
        })
      );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      loadingProjektError: null
    });
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    this.getAccounts();
  }

  /** Lifecycle method, which is called when the component was updated */
  componentDidUpdate(prevProps) {
    // reload accounts if shown state changed. Occures if the CustomerListEntrys ExpansionPanel was expanded
    // if ((this.props.show !== prevProps.show)) {
    //   this.getAccounts();
    // }
  }

  /** Adds an account for the current customer */
  addProjekt = () => {
    BankAPI.getAPI().addAccountForCustomer(this.props.customer.getID()).then(projektBO => {
      // console.log(accountBO)
      this.setState({  // Set new state when AccountBOs have been fetched
        projekt: [...this.state.projekt, projektBO],
        loadingInProgress: false, // loading indicator
        addingProjektError: null
      })
    }).catch(e =>
      this.setState({ // Reset state with error from catch
        accounts: [],
        loadingInProgress: false,
        addingProjektError: e
      })
    );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      addingProjektError: null
    });
  }

  /** Handles onAccountDelete events from an AccountListEntry  */
  deleteProjektHandler = (deletedProjekt) => {
    // console.log(deletedAccount.getID());
    this.setState({
      projekt: this.state.projekte.filter(projekt => projekt.getID() !== deletedProjekt.getID())
    })
  }

  /** Renders the component */
  render() {
    const { classes, customer } = this.props;
    // Use the states customer
    const { projekte, loadingInProgress, loadingProjektError, addingProjektError } = this.state;

    // console.log(this.props);
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