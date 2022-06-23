import React, { Component } from "react";
import PropTypes from "prop-types";
import ZeitenForm from "../dialogs/ZeitenForm";
import ZeitenDeleteDialog from "../dialogs/ZeitenDeleteDialog";
import ZeitenList from "../ZeitenList";
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from "@material-ui/core";
import { Button, ButtonGroup } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

/**
 * Renders ZeitintervallBO object within a expandable/collapsible ZeitintervallListEntry with the zeit manipulation
 * functions. If expanded, it renders a ZeitenList.
 *
 * @see See [ZeitenList](#zeitenlist)
 *
 * @author
 */
class ZeitenListEntry extends Component {

  constructor(props) {
    super(props);

    // Init the state
    this.state = {
      zeit: props.zeit,
      showZeitenForm: false,
      showZeitenDeleteDialog: false,
    };
  }

 /** Handles onChange events of the underlying ExpansionPanel */
  expansionPanelStateChanged = () => {
    this.props.onExpandedStateChange(this.props.zeit);
  }

  /** Handles onZeitenDelete events from an ZeitenListEntry  */
  deleteZeitenHandler = (deletedZeiten) => {
    // console.log(deletedZeiten.getID());
    this.setState({
      zeiten: this.state.zeiten.filter(zeit => zeit.getID() !== deletedZeiten.getID())
    })
  }

 /** Handles the onClick event of the edit zeit button */
  ediZeitentButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showZeitenForm: true
    });
  }
