import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, ListItem } from "@material-ui/core";
import { Button, List } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { ZeiterfassungAPI } from "../api";
import ContextErrorMessage from "./dialogs/ContextErrorMessage";
import LoadingProgress from "./dialogs/LoadingProgress";
import ProjektListEntry from "./entries/ProjektListEntry";

class ProjektList extends Component {

  constructor(props) {
    super(props);

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
        <List className={classes.ProjektList}>
          {
            projekte.map(projekt => <ProjektListEntry key={projekt.getID()} person={person} projekt={projekt} onProjektDeleted={this.deleteProjektHandler}
              show={this.props.show} />)
          }
          <ListItem>
            <LoadingProgress show={loadingInProgress} />
            <ContextErrorMessage error={loadingProjektError} contextErrorMsg={`List of projekt for person ${person.getID()} could not be loaded.`} onReload={this.getProjekt} />
            <ContextErrorMessage error={addingProjektError} contextErrorMsg={`Projekt for person ${person.getID()} could not be added.`} onReload={this.addProjekt} />
          </ListItem>
        </List>
        <Button className={classes.addProjektButton} variant="contained" color="primary" startIcon={<AddIcon />} onClick={this.addProjekt}>
          Add Projekt
        </Button>
      </div>
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: "100%",
  },
  accountList: {
    marginBottom: theme.spacing(2),
  },
  addAccountButton: {
    position: "absolute",
    right: theme.spacing(3),
    bottom: theme.spacing(1),
  }
});

/** PropTypes */
AccountList.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The CustomerBO of this AccountList */
  customer: PropTypes.object.isRequired,
  /** If true, accounts are (re)loaded */
  show: PropTypes.bool.isRequired
}

export default withStyles(styles)(ProjektList);