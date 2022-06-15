import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button, TextField, InputAdornment, IconButton, Grid, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear"
import { withRouter } from "react-router-dom";
import ZeiterfassungAPI from "../api/ZeiterfassungAPI";
import ContextErrorMessage from "./dialogs/ContextErrorMessage";
import LoadingProgress from "./dialogs/LoadingProgress";
import EreignisForm from "./dialogs/EreignisForm";
import EreignisListEntry from "./entries/EreignisListEntry";

class EreignisList extends Component {

  constructor(props) {
    super(props);

    // console.log(props);
    let expandedID = null;

    if (this.props.location.expandEreignis) {
      expandedID = this.props.location.expandEreignis.getID();
    }

    // Init the state
    this.state = {
      ereigniss: [],
      filteredEreigniss: [],
      ereignisFilter: "",
      error: null,
      loadingInProgress: false,
      expandedEreignisID: expandedID,
      showEreignisForm: false
    };
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
EreignisList.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** @ignore */
  location: PropTypes.object.isRequired,
}

export default withRouter(withStyles(styles)(EreignisList));