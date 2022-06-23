import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText,
DialogActions, TextField, InputLabel, NativeSelect } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ZeiterfassungAPI from "../../api/ZeiterfassungAPI";
import ZeitintervallBO from "../../api/ZeitintervallBO";
import ContextErrorMessage from "./ContextErrorMessage";
import LoadingProgress from "./LoadingProgress";


/**
 * Shows a modal form dialog for a ZeitintervallBO in prop zeit. If the zeit is set, the dialog is configured
 * as an edit dialog and the text fields of the form are filled from the given ZeitintervallBO object.
 * If the zeit is null, the dialog is configured as a new zeit dialog and the textfields are empty.
 * In dependency of the edit/new state, the respective backend calls are made to update or create a zeit.
 * After that, the function of the onClose prop is called with the created/update ZeitintervallBO object as parameter.
 * When the dialog is canceled, onClose is called with null.
 *
 * @see See Material-UIs [Dialog](https://material-ui.com/components/dialogs)
 * @see See Material-UIs [TextField](https://material-ui.com/components/text-fields//)
 *
 * @author
 */
class ZeitenForm extends Component {

  constructor(props) {
    super(props);

    let datum = null;
    let start = null;
    let end = null;
    let aktivitaetID = null;
    let userID = null;
    if(props.zeit) {
      datum = props.zeit.getDatum();
      start = props.zeit.getStart();
      end = props.zeit.getEnd();
      aktivitaetID = props.zeit.getAktivitaetID();
      userID = props.zeit.getUserID();
    }
