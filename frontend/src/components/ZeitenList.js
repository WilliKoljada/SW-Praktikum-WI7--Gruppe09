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

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    this.getZeiten();
  }

  /**
   * Handles onExpandedStateChange events from the ZeitenListEntry component. Toggels the expanded state of
   * the ZeitenListEntry of the given ZeitintervallBO.
   *
   * @param {zeit} ZeitintervallBO of the ZeitenListEntry to be toggeled
   */
   onExpandedStateChange = zeit => {
    // console.log(zeitintervallID);
    // Set expandend zeit entry to null by default
    let newID = null;

    // If same zeit entry is clicked, collapse it else expand a new one
    if (zeit.getID() !== this.state.expandedZeitenID) {
      // Expand the zeit entry with zeitintervallID
      newID = zeit.getID();
    }
    // console.log(newID);
    this.setState({
      expandedZeitenID: newID,
    });
  }

  /**
   * Handles onZeitenDeleted events from the ZeitenListEntry component
   *
   * @param {zeit} ZeitIntervallBO of the ZeitenListEntry to be deleted
   */
  zeitDeleted = zeit => {
    const newZeitenList = this.state.zeiten.filter(zeitFromState => zeitFromState.getID() !== zeit.getID());
    this.setState({
      zeiten: newZeitenList,
      showZeitenForm: false
    });
  }

  /** Handles the onClick event of the add zeit button */
  addZeitenButtonClicked = event => {
    // Do not toggle the expanded state
    event.stopPropagation();
    //Show the ZeitenForm
    this.setState({
      showZeitenForm: true
    });
  }

  /** Handles the onClose event of the ZeitenForm */
  zeitFormClosed = zeit => {
    // zeit is not null and therefore created
    if(zeit) {
      const newZeitenList = [...this.state.zeiten, zeit];
      this.setState({
        zeiten: newZeitenList,
        showZeitenForm: false
      });
    } else {
      this.setState({
        showZeitenForm: false
      });
    }
  }
