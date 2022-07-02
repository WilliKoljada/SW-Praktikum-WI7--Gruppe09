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
 *
 * @see See Material-UIs [Dialog](https://material-ui.com/components/dialogs)
 * @see See Material-UIs [TextField](https://material-ui.com/components/text-fields//)
 *
 * @author
 */
class PersonProjektForm extends Component {

  constructor(props) {
    super(props);
    // Init the state
    this.state = {
      projekts: [],
      persons: [],
      personID: 0,
      projektID: 0,
      addingInProgress: false,
      updatingInProgress: false,
      addingError: null,
      updatingError: null
    };
    // save this state for canceling
    this.baseState = this.state;
  }

  getProjekts = () => {
    ZeiterfassungAPI.getAPI().getProjektVonPerson(this.props.person.getID()).then(projektBOs =>
      this.setState({
        projekts: projektBOs,
      })).catch(e =>
        this.setState({
          projekts: []
        }
      )
    );
  }

  getPersons = () => {
    ZeiterfassungAPI.getAPI().getPersons().then(personBOs =>
      this.setState({
        persons: personBOs,
      })).catch(e =>
        this.setState({
          persons: []
        }
      )
    );
  }

  componentDidMount() {
    this.getProjekts();
    this.getPersons();
  }

