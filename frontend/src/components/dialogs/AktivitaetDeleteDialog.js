import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ZeiterfassungAPI from "../../api/ZeiterfassungAPI";
import ContextErrorMessage from "./ContextErrorMessage";
import LoadingProgress from "./LoadingProgress";

/**
 * Shows a modal delete/cancle dialog, which asks for deleting an aktivitaet. The AktivitaetBO to be deleted must be given in prop aktivitaet. 
 * In dependency of the user interaction (delete/cancel) the respective backendcall is made. After that, the function of the onClose prop 
 * is called with the deleted AktivitaetBO object as parameter. When the dialog is canceled, onClose is called with null.
 * 
 * @see See Material-UIs [Dialog](https://material-ui.com/components/dialogs)
 */
class AktivitaetDeleteDialog extends Component {

  constructor(props) {
    super(props);

    // Init the state
    this.state = {
      deletingInProgress: false,
      deletingError: null
    };
  }

  /** Delete the aktivitaet */
  deleteAktivitaet = () => {
    ZeiterfassungAPI.getAPI().deleteAktivitaet(this.props.aktivitaet.getID()).then(aktivitaet => {
      this.setState({
        deletingInProgress: false,              // disable loading indicator  
        deletingError: null                     // no error message
      });
      this.props.onClose(this.props.aktivitaet);  // call the parent with the deleted aktivitaet
    }).catch(e =>
      this.setState({
        deletingInProgress: false,              // disable loading indicator 
        deletingError: e                        // show error message
      })
    );

    // set loading to true
    this.setState({
      deletingInProgress: true,                 // show loading indicator
      deletingError: null                       // disable error message
    });
  }

  /** Handles the close / cancel button click event */
  handleClose = () => {
    // console.log(event);
    this.props.onClose(null);
  }

  /** Renders the component */
  render() {
    const { classes, aktivitaet, show } = this.props;
    const { deletingInProgress, deletingError } = this.state;

    return (
      show ?
        <Dialog open={show} onClose={this.handleClose}>
          <DialogTitle id="delete-dialog-title">Delete Aktivitaet
            <IconButton className={classes.closeButton} onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Really delete aktivität "{aktivitaet.getName()}" (ID: {aktivitaet.getID()})?
            </DialogContentText>
            <LoadingProgress show={deletingInProgress} />
            <ContextErrorMessage error={deletingError} contextErrorMsg={`The aktivität "${aktivitaet.getName()}" (ID: ${aktivitaet.getID()}) could not be deleted.`}
              onReload={this.deleteAktivitaet} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button variant="contained" onClick={this.deleteAktivitaet} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        : null
    );
  }
}
