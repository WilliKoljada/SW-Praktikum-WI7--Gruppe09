import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button, TextField, InputAdornment, IconButton, Grid, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear"
import { withRouter } from "react-router-dom";
import ZeiterfassungAPI from "../api/ZeiterfassungAPI";
import ContextErrorMessage from "./dialogs/ContextErrorMessage";
import LoadingProgress from "./dialogs/LoadingProgress";
import ZeitenForm from "./dialogs/ZeitenForm";
import ZeitenListEntry from "./entries/ZeitenListEntry";

class ZeitenList extends Component {

  constructor(props) {
    super(props);

    // console.log(props);
    let expandedID = null;

    if(this.props.location.expandZeiten){
      expandedID = this.props.location.expandZeiten.getID();
    }

    // Init the state
    this.state = {
      zeiten: [],
      error: null,
      loadingInProgress: false,
      expandedZeitenID: expandedID,
      showZeitenForm: false
    };
  }

  /** Fetches ZeitintervallBOs for the current person */
  getZeiten = () => {
    ZeiterfassungAPI.getAPI().getZeitIntervalls()
      .then(zeitintervallBOs =>
        this.setState({  // Set new state when ZeitintervallBOs have been fetched
          zeiten: zeitintervallBOs,
          loadingInProgress: false, // loading indicator
          loadingZeitenError: null
        })).catch(e =>
          this.setState({ // Reset state with error from catch
            zeiten: [],
            loadingInProgress: false,
            loadingZeitenError: e
          }
        )
      );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      loadingZeitenError: null
    });
  }
