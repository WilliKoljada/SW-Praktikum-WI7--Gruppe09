import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText,
InputLabel, NativeSelect, DialogActions, TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ZeiterfassungAPI from "../../api/ZeiterfassungAPI";
import AktivitaetBO from "../../api/AktivitaetBO";
import ContextErrorMessage from "./ContextErrorMessage";
import LoadingProgress from "./LoadingProgress";


/**
 * Shows a modal form dialog for a AktivitaetBO in prop aktivitaet. If the aktivitaet is set, the dialog is configured
 * as an edit dialog and the text fields of the form are filled from the given AktivitaetBO object.
 * If the aktivitaet is null, the dialog is configured as a new aktivitaet dialog and the textfields are empty.
 * In dependency of the edit/new state, the respective backend calls are made to update or create a aktivitaet.
 * After that, the function of the onClose prop is called with the created/update AktivitaetBO object as parameter.
 * When the dialog is canceled, onClose is called with null.
 *
 * @see See Material-UIs [Dialog](https://material-ui.com/components/dialogs)
 * @see See Material-UIs [TextField](https://material-ui.com/components/text-fields//)
 *
 * @author
 */
class AktivitaetForm extends Component {