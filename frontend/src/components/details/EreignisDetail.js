import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Typography, Paper } from "@material-ui/core";
import ZeiterfassungAPI from "../../api/ZeiterfassungAPI";
import ContextErrorMessage from "../dialogs/ContextErrorMessage";
import LoadingProgress from "../dialogs/LoadingProgress";

/**
 * Renders a EreignisBO object within a ListEntry and provides a delete button to delete it.
 *
 * @see See Material-UIs [Lists](https://material-ui.com/components/lists/)
 * @see See Material-UIs [ListItem](https://material-ui.com/api/list-item/)
 *
 * @author
 */
class EreignisDetail extends Component{
  constructor(props) {
    super(props);

    // Init state
    this.state = {
      ereignis: null,
      loadingInProgress: false,
      loadingError: null,
    };

    if(this.props.ereignis){
      this.state.ereignis = this.props.ereignis;
    }
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    //this.getEreignis();
  }

  /** gets the balance for this person */
  getEreignis = () => {
    ZeiterfassungAPI.getAPI().getEreignis(this.props.ereignis.getID()).then(ereignis =>
      this.setState({
        ereignis: ereignis,
        loadingInProgress: false,
        loadingError: null
      })).catch(e =>
        this.setState({ // Reset state with error from catch
          ereignis: null,
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
    const { ereignis, loadingInProgress, loadingError } = this.state;

    return (
      <Paper variant="outlined" className={classes.root}>
        {
          ereignis ?
          (<div>
            <Typography>
              Type: <strong>{ereignis.getType()}</strong>
            </Typography>
            <Typography>
              Datum: <strong>{ereignis.getDatum()}</strong>
            </Typography>
            <Typography>
              Startzeit: <strong>{ereignis.getStartzeit()}</strong>
            </Typography>
            <Typography>
              Endzeit: <strong>{ereignis.getEndzeit()}</strong>
            </Typography>
          </div>)
            : null
        }
        <LoadingProgress show={loadingInProgress} />
        <ContextErrorMessage error={loadingError} contextErrorMsg={`The data of ereignis id ${ereignis.getID()} could not be loaded.`} onReload={this.getEreignis} />
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
EreignisDetail.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The ereignis to be rendered */
  ereignis: PropTypes.object.isRequired,
}

export default withStyles(styles)(EreignisDetail);