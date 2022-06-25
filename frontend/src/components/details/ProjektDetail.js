import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Typography, Paper } from "@material-ui/core";
import ZeiterfassungAPI from "../../api/ZeiterfassungAPI";
import ContextErrorMessage from "../dialogs/ContextErrorMessage";
import LoadingProgress from "../dialogs/LoadingProgress";

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
      loadingInProgress: false,
      loadingError: null,
    };

    if(this.props.projekt){
      this.state.projekt = this.props.projekt;
    }
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    //this.getProjekt();
  }

  /** gets the balance for this person */
  getProjekt = () => {
    ZeiterfassungAPI.getAPI().getProjekt(this.props.projekt.getID()).then(projekt =>
      this.setState({
        projekt: projekt,
        loadingInProgress: false,
        loadingError: null
      })).catch(e =>
        this.setState({ // Reset state with error from catch
          projekt: null,
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

  /** Renders the component */
  render() {
    const { classes } = this.props;
    const { projekt, loadingInProgress, loadingError } = this.state;

    return (
      <Paper variant="outlined" className={classes.root}>
        {
          projekt ?
            (<div>
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
            </div>)
            : null
        }
        <LoadingProgress show={loadingInProgress} />
        <ContextErrorMessage error={loadingError} contextErrorMsg={`The data of projekt id ${projekt.getID()} could not be loaded.`} onReload={this.getProjekt} />
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