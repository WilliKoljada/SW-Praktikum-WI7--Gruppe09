import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Grid } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import ZeiterfassungAPI from "../api/ZeiterfassungAPI";
import ContextErrorMessage from "./dialogs/ContextErrorMessage";
import LoadingProgress from "./dialogs/LoadingProgress";
import ArbeitszeitkontoEntry from "./entries/ArbeitszeitkontoEntry";

class Arbeitszeitkonto extends Component {

  constructor(props) {
    super(props);

    // console.log(props);
    let expandedID = null;
    let personID = 1;
    if (this.props.location.expandedArbeitszeitkontoID) {
      expandedID = this.props.location.expandedArbeitszeitkontoID.getID();
    }

    // Init the state
    this.state = {
      arbeitszeitkonto: null,
      personID: personID,
      error: null,
      loadingInProgress: false,
      expandedArbeitszeitkontoID: expandedID
    };
    //this.getPersonByGoogleID();
    //this.getArbeitszeitkonto();
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

	getArbeitszeitkonto = () => {
    ZeiterfassungAPI.getAPI().getArbeitszeitkonto(this.state.personID).then(arbeitszeitkonto =>{
      this.setState({
        arbeitszeitkonto: arbeitszeitkonto[0],
        loadingInProgress: false,
        loadingError: null
      });

    }).catch(e =>
        this.setState({ // Reset state with error from catch
          arbeitszeitkonto: null,
          loadingInProgress: false,
          loadingError: e
        })
    );
  }


  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    console.log("user", this.props.user.uid);
    this.getPersonByGoogleID();
		this.getArbeitszeitkonto();
  }

  /**
   * Handles onExpandedStateChange events from the EreignisListEntry component. Toggels the expanded state of
   * the ArbeitszeitkontoListEntry of the given EreignisBO.
   *
   * @param {arbeitszeitkonto} ArbeitszeitkontoBO of the ArbeitszeitkontoListEntry to be toggeled
   */
   onExpandedStateChange = arbeitszeitkonto => {
    let newID = null;

    // If same ereignis entry is clicked, collapse it else expand a new one
    if (arbeitszeitkonto.getID() !== this.state.expandedArbeitszeitkontoID) {
      newID = arbeitszeitkonto.getID();
    }
    this.setState({
      expandedArbeitszeitkontoID: newID,
    });
  }

  /** Renders the component */
  render() {
    const { classes, user } = this.props;
    const { arbeitszeitkonto, loadingInProgress, error } = this.state;

    return (
      <div className={classes.root}>
        <div>
          {arbeitszeitkonto && <ArbeitszeitkontoEntry
						arbeitszeitkonto={arbeitszeitkonto}
						user={user}
						expandedState={true}
            onExpandedStateChange={this.onExpandedStateChange}
          />}
          <br />
          <Grid item xs />
          </div>
        <LoadingProgress show={loadingInProgress} />
        <ContextErrorMessage error={error} contextErrorMsg={`arbeitszeitkonto could not be loaded.`} onReload={this.getArbeitszeitkonto} />
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
Arbeitszeitkonto.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** @ignore */
  location: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export default withRouter(withStyles(styles)(Arbeitszeitkonto));