import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from "@material-ui/core";
import { Button, ButtonGroup } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PersonForm from "../dialogs/PersonForm";
import PersonDeleteDialog from "../dialogs/PersonDeleteDialog";
import PersonList from "../PersonList";


/**
 * Renders a PersonBO object within a expandable/collapsible PersonListEntry with the person manipulation
 * functions. If expanded, it renders a AccountList.
 *
 * @see See [PersontList](#personlist)
 *
 * @author
 */
class PersonListEntry extends Component {

  constructor(props) {
    super(props);

    // Init the state
    this.state = {
      person: props.person,
      showPersonForm: false,
      showPersonDeleteDialog: false,
    };
  }

  /** Handles onChange events of the underlying ExpansionPanel */
  expansionPanelStateChanged = () => {
    this.props.onExpandedStateChange(this.props.person);
  }

  /** Handles onPersonDelete events from an AccountListEntry  */
  deletePersonHandler = (deletedPerson) => {
    // console.log(deletedPerson.getID());
    this.setState({
      persons: this.state.persons.filter(person => person.getID() !== deletedPerson.getID())
    })
  }

  /** Handles the onClick event of the edit person button */
  editPersonButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showPersonForm: true
    });
  }

  /** Handles the onClose event of the ProjektForm */
  personFormClosed = (person) => {
    // person is not null and therefor changed
    if (person) {
      this.setState({
        person: person,
        showPersonForm: false
      });
    } else {
      this.setState({
        showPersonForm: false
      });
    }
  }
