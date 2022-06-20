import React, { Component } from "react";
import PropTypes from "prop-types";
import EreignisForm from "../dialogs/EreignisForm";
import EreignisDeleteDialog from "../dialogs/EreignisDeleteDialog";
import EreignisList from "../EreignisList";
import { Button, ButtonGroup } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";




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
 /** Handles onChange events of the underlying ExpansionPanel */
  expansionPanelStateChanged = () => {
    this.props.onExpandedStateChange(this.props.ereignis);
  }

  /** Handles onEreignisDelete events from an EreignisListEntry  */
  deleteEreignisHandler = (deletedEreignis) => {
    // console.log(deletedEreignis.getID());
    this.setState({
      ereigniss: this.state.ereigniss.filter(ereignis => ereignis.getID() !== deletedEreignis.getID())
    })
  }

  /** Handles the onClick event of the edit ereignis button */
  editEreignisButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showEreignisForm: true
    });
  }

  /** Handles the onClose event of the EreignisForm */
  ereignisFormClosed = (ereignis) => {
    // ereignis is not null and therefor changed
    if(ereignis) {
      this.setState({
        ereignis: ereignis,
        showEreignisForm: false
      });
    } else {
      this.setState({
        showEreignisForm: false
      });
    }
  }
   /** Handles the onClick event of the delete ereignis button */
  deleteEreignisButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showEreignisDeleteDialog: true
    });
  }

  /** Handles the onClose event of the EreignisDeleteDialog */
  deleteEreignisDialogClosed = (ereignis) => {
    // if ereignis is not null, delete it
    if(ereignis) {
      this.props.onEreignisDeleted(ereignis);
    };

    // Don´t show the dialog
    this.setState({
      showEreignisDeleteDialog: false
    });
  }
