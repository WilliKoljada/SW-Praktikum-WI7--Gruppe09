import React, { Component } from "react";
import PropTypes from "prop-types";
import EreignisForm from "../dialogs/EreignisForm";
import EreignisDeleteDialog from "../dialogs/EreignisDeleteDialog";
import EreignisList from "../EreignisList";
import { Button, ButtonGroup } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from "@material-ui/core";



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
 /** Renders the component */
  render() {
    const { classes, expandedState } = this.props;
    // Use the states ereignis
    const { ereignis, showEreignisForm, showEreignisDeleteDialog } = this.state;
 // console.log(this.state);
    return (
      <div>
        <Accordion defaultExpanded={false} expanded={expandedState} onChange={this.expansionPanelStateChanged}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id={`ereignis${ereignis.getID()}ereignispanel-header`}
          >
            <Grid container spacing={1} justify="flex-start" alignItems="center">
              <Grid item>
                <Typography variant="body1" className={classes.heading}>
                    {ereignis.getName()}, {ereignis.getBezeichnung()}
                </Typography>
              </Grid>
              <Grid item>
                <ButtonGroup variant="text" size="small">
                  <Button color="primary" onClick={this.editEreignisButtonClicked}>
                    edit
                  </Button>
                  <Button color="secondary" onClick={this.deleteEreignisButtonClicked}>
                  delete
                  </Button>
                </ButtonGroup>
              </Grid>
              <Grid item xs />
              <Grid item>
                <Typography variant="body2" color={"textSecondary"}>List of ereignis</Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <EreignisList show={expandedState} ereignis={ereignis} />
          </AccordionDetails>
        </Accordion>
        <EreignisForm show={showEreignisForm} ereignis={ereignis} onClose={this.ereignisFormClosed} />
        <EreignisDeleteDialog show={showEreignisDeleteDialog} ereignis={ereignis} onClose={this.deleteEreignisDialogClosed} />
      </div>
    );
  }
}
/** Component specific styles */
const styles = theme => ({
  root: {
    width: "100%",
  }
});

