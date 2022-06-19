import React, { Component } from "react";
import PropTypes from "prop-types";


/**
 * Shows a modal form dialog EreignisBO in prop ereignis. If the ereignis is set, the dialog is configured
 * as an edit dialog and the text fields of the form are filled from the given EreignisBO object.
 * If the ereignis is null, the dialog is configured as a new ereignis dialog and the textfields are empty.
 * In dependency of the edit/new state, the respective backend calls are made to update or create a ereignis.
 * After that, the function of the onClose prop is called with the created/update EreignisBO object as parameter.
 * When the dialog is canceled, onClose is called with null.
 *
 * @see See Material-UIs [Dialog](https://material-ui.com/components/dialogs)
 * @see See Material-UIs [TextField](https://material-ui.com/components/text-fields//)
 *
 * @author
 */
class EreignisForm extends Component {

  constructor(props) {
    super(props);

    let name = "";
    let bezeichung = "";
    if (props.ereignis) {
      name = props.ereignis.getName();
      bezeichung = props.ereignis.getBezeichnung();
    }
