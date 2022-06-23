import React, { Component } from "react";
import PropTypes from "prop-types";
import ZeitenForm from "../dialogs/ZeitenForm";
import ZeitenDeleteDialog from "../dialogs/ZeitenDeleteDialog";
import ZeitenList from "../ZeitenList";
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

