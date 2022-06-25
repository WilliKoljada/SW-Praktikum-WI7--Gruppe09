import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from "@material-ui/core";
import { Button, ButtonGroup } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EreignisForm from "../dialogs/EreignisForm";
import EreignisDeleteDialog from "../dialogs/EreignisDeleteDialog";
import EreignisList from "../EreignisList";
import EreignisDetail from "../details/EreignisDetail";

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
    const { classes, expandedState, user } = this.props;
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
            <Grid container spacing={1} justifyContent="flex-start" alignItems="center">
              <Grid item>
                <Typography variant="body1" className={classes.heading}>
                    {ereignis.getID()} - {ereignis.getType()} am {ereignis.getDatum()}
                </Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1} justifyContent="flex-start" alignItems="center">
              <EreignisDetail ereignis={ereignis} />
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
            </Grid>
          </AccordionDetails>
        </Accordion>
        <EreignisForm show={showEreignisForm} ereignis={ereignis} user={user} onClose={this.ereignisFormClosed} />
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

/** PropTypes */
EreignisListEntry.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The EreignisBO to be rendered */
  ereignis: PropTypes.object.isRequired,
  /** The state of this EreignisListEntry. If true the ereignis is shown with its accounts */
  expandedState: PropTypes.bool.isRequired,
  /** The handler responsible for handle expanded state changes (exanding/collapsing) of this EreignisListEntry
   *
   * Signature: onExpandedStateChange(EreignisBO ereignis)
   */
  onExpandedStateChange: PropTypes.func.isRequired,
  /**
   *  Event Handler function which is called after a sucessfull delete of this ereignis.
   *
   * Signature: onEreignisDelete(EreignisBO ereignis)
   */
  onEreignisDeleted: PropTypes.func.isRequired
}

export default withStyles(styles)(EreignisListEntry);