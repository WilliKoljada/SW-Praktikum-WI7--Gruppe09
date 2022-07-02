import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Typography, Paper } from "@material-ui/core";
import ZeiterfassungAPI from "../../api/ZeiterfassungAPI";
import ContextErrorMessage from "../dialogs/ContextErrorMessage";
import LoadingProgress from "../dialogs/LoadingProgress";

/**
 * Renders a AktivitaetBO object within a ListEntry and provides a delete button to delete it.
 *
 * @see See Material-UIs [Lists](https://material-ui.com/components/lists/)
 * @see See Material-UIs [ListItem](https://material-ui.com/api/list-item/)
 *
 * @author
 */
class AktivitaetDetail extends Component{
  constructor(props) {
    super(props);

    // Init state
    this.state = {
      aktivitaet: null,
      projektName: "",
      loadingInProgress: false,
      loadingError: null,
    };

    if(this.props.aktivitaet){
      this.state.aktivitaet = this.props.aktivitaet;
    }
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    //this.getAktivitaet();
  }

  /** gets the balance for this person */
  getAktivitaet = () => {
    ZeiterfassungAPI.getAPI().getAktivitaet(this.props.aktivitaet.getID()).then(aktivitaet =>
      this.setState({
        aktivitaet: aktivitaet,
        loadingInProgress: false,
        loadingError: null
      })).catch(e =>
        this.setState({ // Reset state with error from catch
          aktivitaet: null,
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

  getProjektName = () => {
    ZeiterfassungAPI.getAPI().getProjekt(this.props.aktivitaet.getProjektID()).then(projekt =>
      this.setState({
        projektName: projekt.getName(),
        loadingInProgress: false,
        loadingError: null
      })).catch(e =>
        this.setState({
          projektName: "",
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
    const { aktivitaet, projektName, loadingInProgress, loadingError } = this.state;

    return (
      <Paper variant="outlined" className={classes.root}>
        {
          aktivitaet ?
          (<div>
            <Typography>
              Name: <strong>{aktivitaet.getName()}</strong>
            </Typography>
            <Typography>
              Beschreibung: <strong>{aktivitaet.getBeschreibung()}</strong>
            </Typography>
            <Typography>
              Dauert: <strong>{aktivitaet.getDauert()}</strong>
            </Typography>
            {projektName !== "" &&
              <Typography>
                Projekt: <strong>{projektName}</strong>
              </Typography>
            }
          </div>)
          : null
        }
        <LoadingProgress show={loadingInProgress} />
        <ContextErrorMessage error={loadingError} contextErrorMsg={`The data of aktivitaet id ${aktivitaet.getID()} could not be loaded.`} onReload={this.getAktivitaet} />
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
AktivitaetDetail.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The aktivitaet to be rendered */
  aktivitaet: PropTypes.object.isRequired,
}

export default withStyles(styles)(AktivitaetDetail);

