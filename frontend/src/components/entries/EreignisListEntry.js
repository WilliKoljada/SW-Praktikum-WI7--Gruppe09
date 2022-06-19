import React, { Component } from "react";
import PropTypes from "prop-types";
import EreignisForm from "../dialogs/EreignisForm";
import EreignisDeleteDialog from "../dialogs/EreignisDeleteDialog";
import EreignisList from "../EreignisList";






/**
 * Renders EreignisBO object within a expandable/collapsible EreignisListEntry with the ereignis manipulation
 * functions. If expanded, it renders a AccountList.
 *
 * @see See [EreignisList](#ereignislist)
 *
 * @author
 */
class EreignisListEntry extends Component {

  constructor(props) {
    super(props);

    // Init the state
    this.state = {
      ereignis: props.ereignis,
      showEreignisForm: false,
      showEreignisDeleteDialog: false,
    };
  }
