import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from "@material-ui/core";
import { Button, ButtonGroup } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AktivitaetForm from "../dialogs/AktivitaetForm";
import AktivitaetDeleteDialog from "../dialogs/AktivitaetDeleteDialog";
import AktivitaetList from "../AktivitaetList";


/**
 * Renders a AktivitaetBO object within a expandable/collapsible AktivitaetListEntry with the aktivitaet manipulation
 * functions. If expanded, it renders a AccountList.
 *
 * @see See [AktivitaetList](#aktivitaetlist)
 *
 * @author
 */
class AktivitaetListEntry extends Component {