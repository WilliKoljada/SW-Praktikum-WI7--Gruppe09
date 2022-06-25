import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Typography, Paper } from "@material-ui/core";
import ZeiterfassungAPI from "../../api/ZeiterfassungAPI";
import ContextErrorMessage from "../dialogs/ContextErrorMessage";
import LoadingProgress from "../dialogs/LoadingProgress";

/**
 * Renders a ZeitenBO object within a ListEntry and provides a delete button to delete it.
 *
 * @see See Material-UIs [Lists](https://material-ui.com/components/lists/)
 * @see See Material-UIs [ListItem](https://material-ui.com/api/list-item/)
 *
 * @author
 */
class ZeitenDetail extends Component{
  constructor(props) {
    super(props);

    // Init state
    this.state = {
      zeit: null,
      loadingInProgress: false,
      loadingError: null,
    };

    if(this.props.zeit){
      this.state.zeit = this.props.zeit;
    }
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    //this.getZeitintervall();
  }

  /** gets the balance for this person */
  getZeitintervall = () => {
    ZeiterfassungAPI.getAPI().getZeitintervall(this.props.zeit.getID()).then(zeit =>
      this.setState({
        zeit: zeit,
        loadingInProgress: false,
        loadingError: null
      })).catch(e =>
        this.setState({ // Reset state with error from catch
          zeit: null,
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
    const { zeit, loadingInProgress, loadingError } = this.state;

    return (
      <Paper variant="outlined" className={classes.root}>
        {
          zeit ?
          (<div>
            <Typography>
              Datum: <strong>{zeit.getDatum()}</strong>
            </Typography>
            <Typography>
              Startzeit: <strong>{zeit.getStartzeit()}</strong>
            </Typography>
            <Typography>
              Endzeit: <strong>{zeit.getEndzeit()}</strong>
            </Typography>
          </div>)
            : null
        }
        <LoadingProgress show={loadingInProgress} />
        <ContextErrorMessage error={loadingError} contextErrorMsg={`The data of zeitintervall id ${zeit.getID()} could not be loaded.`} onReload={this.getZeitintervall} />
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
ZeitenDetail.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The projekt to be rendered */
  zeit: PropTypes.object.isRequired,
}

export default withStyles(styles)(ZeitenDetail);
