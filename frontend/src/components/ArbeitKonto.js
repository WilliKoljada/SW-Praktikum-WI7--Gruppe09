import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Grid } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import ZeiterfassungAPI from "../api/ZeiterfassungAPI";
import ContextErrorMessage from "./dialogs/ContextErrorMessage";
import LoadingProgress from "./dialogs/LoadingProgress";
import ArbeitKontoEntry from "./entries/ArbeitKontoEntry";

class Arbeitkonto extends Component {

  constructor(props) {
    super(props);

    // console.log(props);
    let expandedID = null;
    let personID = 1;
    if (this.props.location.expandedArbeitKontoID) {
      expandedID = this.props.location.expandedArbeitKontoID.getID();
    }

    // Init the state
    this.state = {
      arbeitKonto: null,
      personID: personID,
      error: null,
      loadingInProgress: false,
      expandedArbeitKontoID: expandedID
    };
    //this.getPersonByGoogleID();
    //this.getArbeitKonto();
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

	getArbeitKonto = () => {
    ZeiterfassungAPI.getAPI().getArbeitKonto(this.state.personID).then(arbeitKonto =>{
      this.setState({
        arbeitKonto: arbeitKonto[0],
        loadingInProgress: false,
        loadingError: null
      });
    }).catch(e =>
        this.setState({ // Reset state with error from catch
          arbeitKonto: null,
          loadingInProgress: false,
          loadingError: e
        })
    );
  }


  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    console.log("user", this.props.user.uid);
    this.getPersonByGoogleID();
		this.getArbeitKonto();
  }

  /**
   * Handles onExpandedStateChange events from the EreignisListEntry component. Toggels the expanded state of
   * the ArbeitKontoListEntry of the given EreignisBO.
   *
   * @param {arbeitKonto} ArbeitKontoBO of the ArbeitKonListEntry to be toggeled
   */
   onExpandedStateChange = arbeitKonto => {
    let newID = null;

    // If same ereignis entry is clicked, collapse it else expand a new one
    if (arbeitKonto.getID() !== this.state.expandedArbeitKontoID) {
      newID = arbeitKonto.getID();
    }
    this.setState({
      expandedArbeitKontoID: newID,
    });
  }

  /** Renders the component */
  render() {
    const { classes, user } = this.props;
    const { arbeitKonto, loadingInProgress, error } = this.state;

    return (
      <div className={classes.root}>
        <div>
          {arbeitKonto && <ArbeitKontoEntry
						arbeitKonto={arbeitKonto}
						user={user}
						expandedState={true}
            onExpandedStateChange={this.onExpandedStateChange}
          />}
          <br />
          <Grid item xs />
          </div>
        <LoadingProgress show={loadingInProgress} />
        <ContextErrorMessage error={error} contextErrorMsg={`arbeitKonto could not be loaded.`} onReload={this.getArbeitKonto} />
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
Arbeitkonto.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** @ignore */
  location: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export default withRouter(withStyles(styles)(Arbeitkonto));