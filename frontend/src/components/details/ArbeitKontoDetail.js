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
class ArbeitKontoDetail extends Component{
  constructor(props) {
    super(props);

    // Init state
    this.state = {
      arbeitKonto: null,
      loadingInProgress: false,
      loadingError: null,
    };

    if(this.props.arbeitKonto){
      this.state.arbeitKonto = this.props.arbeitKonto;
    }
  }

  getArbeitKonto = () => {
    ZeiterfassungAPI.getAPI().getArbeitKonto(this.props.arbeitKonto.getID()).then(arbeitKonto =>
      this.setState({
        arbeitKonto: arbeitKonto[0],
        loadingInProgress: false,
        loadingError: null
      })).catch(e =>
        this.setState({ // Reset state with error from catch
          arbeitKonto: null,
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
    const { arbeitKonto, loadingInProgress, loadingError } = this.state;

    return (
      <Paper variant="outlined" className={classes.root}>
        {
          arbeitKonto ?
          (<div>
            <Typography>
              Arbeit zeit: <strong>{arbeitKonto.getArbeit()}</strong>
            </Typography>
            <Typography>
              krankheit zeit: <strong>{arbeitKonto.getKrankheit()}</strong>
            </Typography>
            <Typography>
              Urlaub zeit: <strong>{arbeitKonto.getUrlaub()}</strong>
            </Typography>
            <Typography>
              Pause zeit: <strong>{arbeitKonto.getPause()}</strong>
            </Typography>
          </div>)
            : null
        }
        <LoadingProgress show={loadingInProgress} />
        <ContextErrorMessage error={loadingError} contextErrorMsg={`The data of arbeit konto id ${arbeitKonto.getID()} could not be loaded.`} onReload={this.getArbeitKonto} />
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
ArbeitKontoDetail.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The ereignis to be rendered */
  arbeitKonto: PropTypes.object.isRequired,
}

export default withStyles(styles)(ArbeitKontoDetail);