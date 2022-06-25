import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ZeiterfassungAPI from "../../api/ZeiterfassungAPI";
import ContextErrorMessage from "./ContextErrorMessage";
import LoadingProgress from "./LoadingProgress";

/**
 * Shows a modal delete/cancle dialog, which asks for deleting a projekt. The ProjektBO to be deleted must be given in prop projekt.
 * In dependency of the user interaction (delete/cancel) the respective backendcall is made. After that, the function of the onClose prop
 * is called with the deleted ProjektBO object as parameter. When the dialog is canceled, onClose is called with null.
 *
 * @see See Material-UIs [Dialog](https://material-ui.com/components/dialogs)
 */
class ProjektDeleteDialog extends Component {

  constructor(props) {
    super(props);

    // Init the state
    this.state = {
      deletingInProgress: false,
      deletingError: null
    };
  }

  /** Delete the projekt */
  deleteProjekt = () => {
    ZeiterfassungAPI.getAPI().deleteProjekt(this.props.projekt.getID()).then(projekt => {
      this.setState({
        deletingInProgress: false,              // disable loading indicator
        deletingError: null                     // no error message
      });
      this.props.onClose(this.props.projekt);  // call the parent with the deleted projekt
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
    const { classes, projekt, show } = this.props;
    const { deletingInProgress, deletingError } = this.state;

    return (
      show ?
        <Dialog open={show} onClose={this.handleClose}>
          <DialogTitle id="delete-dialog-title">Delete projekt
            <IconButton className={classes.closeButton} onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Really delete projekt "{projekt.getName()}" (ID: {projekt.getID()})?
            </DialogContentText>
            <LoadingProgress show={deletingInProgress} />
            <ContextErrorMessage error={deletingError} contextErrorMsg={`The projekt "${projekt.getName()}" (ID: ${projekt.getID()}) could not be deleted.`}
              onReload={this.deleteProjekt} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button variant="contained" onClick={this.deleteProjekt} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        : null
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  }
});

/** PropTypes */
ProjektDeleteDialog.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The ProjektBO to be deleted */
  projekt: PropTypes.object.isRequired,
  /** If true, the dialog is rendered */
  show: PropTypes.bool.isRequired,
  /**
   * Handler function which is called, when the dialog is closed.
   * Sends the deleted ProjektBO as parameter or null, if cancel was pressed.
   *
   * Signature: onClose(ProjektBO projekt);
   */
  onClose: PropTypes.func.isRequired,
}

export default withStyles(styles)(ProjektDeleteDialog);