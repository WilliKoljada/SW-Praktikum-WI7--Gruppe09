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
class ArbeitszeitkontoDetail extends Component{
  constructor(props) {
    super(props);

    // Init state
    this.state = {
      arbeitszeitkonto: null,
      loadingInProgress: false,
      loadingError: null,
    };

    if(this.props.Arbeitszeitkonto){
      this.state.arbeitszeitkonto = this.props.arbeitszeitkonto;
    }
  }

  componentDidMount() {
    //this.getArbeitszeitkonto();
  }

  getArbeitszeitkonto = () => {
    ZeiterfassungAPI.getAPI().getArbeitszeitkonto(this.props.arbeitszeitkonto.getID()).then(arbeitszeitkonto =>
      this.setState({
        arbeitszeitkonto: arbeitszeitkonto[0],
        loadingInProgress: false,
        loadingError: null
      })).catch(e =>
        this.setState({ // Reset state with error from catch
          arbeitszeitkonto: null,
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
    const { arbeitszeitkonto, loadingInProgress, loadingError } = this.state;

    return (
      <Paper variant="outlined" className={classes.root}>
        {
          arbeitszeitkonto ?
          (<div>
            <Typography>
              Arbeit zeit: <strong>{arbeitszeitkonto.getArbeit()}</strong>
            </Typography>
            <Typography>
              krankheit zeit: <strong>{arbeitszeitkonto.getKrankheit()}</strong>
            </Typography>
            <Typography>
              Urlaub zeit: <strong>{arbeitszeitkonto.getUrlaub()}</strong>
            </Typography>
          </div>)
            : null
        }
        <LoadingProgress show={loadingInProgress} />
        <ContextErrorMessage error={loadingError} contextErrorMsg={`The data of arbeit konto id ${arbeitszeitkonto.getID()} could not be loaded.`} onReload={this.getArbeitszeitkonto} />
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
ArbeitszeitkontoDetail.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The ereignis to be rendered */
  arbeitszeitkonto: PropTypes.object.isRequired,
}

export default withStyles(styles)(ArbeitszeitkontoDetail);