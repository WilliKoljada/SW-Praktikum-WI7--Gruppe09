import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from "@material-ui/core";
import { Button, ButtonGroup } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AktivitaetForm from "../dialogs/AktivitaetForm";
import AktivitaetDeleteDialog from "../dialogs/AktivitaetDeleteDialog";
import AktivitaetDetail from "../details/AktivitaetDetail";

/**
 * Renders a AktivitaetBO object within a expandable/collapsible AktivitaetListEntry with the aktivitaet manipulation
 * functions. If expanded, it renders a AccountList.
 *
 * @see See [AktivitaetList](#aktivitaetlist)
 *
 * @author
 */
class AktivitaetListEntry extends Component {

  constructor(props) {
    super(props);

    // Init the state
    this.state = {
      aktivitaet: props.aktivitaet,
      showAktivitaetForm: false,
      showAktivitaetDeleteDialog: false,
    };
  }

  /** Handles onChange events of the underlying ExpansionPanel */
  expansionPanelStateChanged = () => {
    this.props.onExpandedStateChange(this.props.aktivitaet);
  }

  /** Handles onAktivitaetDelete events from an AktivitaetListEntry  */
  deleteAktivitaetHandler = (deletedAktivitaet) => {
    // console.log(deletedAktivitaet.getID());
    this.setState({
      aktivitaets: this.state.aktivitaets.filter(aktivitaet => aktivitaet.getID() !== deletedAktivitaet.getID())
    })
  }

  /** Handles the onClick event of the edit aktivitaet button */
  editAktivitaetButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showAktivitaetForm: true
    });
  }

  /** Handles the onClose event of the AktivitaetForm */
  aktivitaetFormClosed = (aktivitaet) => {
    // aktivitaet is not null and therefor changed
    if(aktivitaet){
      this.setState({
        aktivitaet: aktivitaet,
        showAktivitaetForm: false
      });
    } else {
      this.setState({
        showAktivitaetForm: false
      });
    }
  }

  /** Handles the onClick event of the delete aktivitaet button */
  deleteAktivitaetButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showAktivitaetDeleteDialog: true
    });
  }

  /** Handles the onClose event of the AktivitaetDeleteDialog */
  deleteAktivitaetDialogClosed = (aktivitaet) => {
    // if aktivitaet is not null, delete it
    if (aktivitaet) {
      this.props.onAktivitaetDeleted(aktivitaet);
    };

    // Don´t show the dialog
    this.setState({
      showAktivitaetDeleteDialog: false
    });
  }

  /** Renders the component */
  render() {
    const { classes, expandedState, user } = this.props;
    // Use the states aktivitaet
    const { aktivitaet, showAktivitaetForm, showAktivitaetDeleteDialog } = this.state;

    // console.log(this.state);
    return (
      <div>
        <Accordion defaultExpanded={false} expanded={expandedState} onChange={this.expansionPanelStateChanged}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id={`aktivitaet${aktivitaet.getID()}aktivitaetpanel-header`}
          >
            <Grid container spacing={1} justifyContent="flex-start" alignItems="center">
              <Grid item>
                <Typography variant="body1" className={classes.heading}>
                    {aktivitaet.getID()} - {aktivitaet.getName()}
                </Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1} justifyContent="flex-start" alignItems="center">
              <AktivitaetDetail aktivitaet={aktivitaet} />
              <Grid item>
                <ButtonGroup variant="text" size="small">
                  <Button color="primary" onClick={this.editAktivitaetButtonClicked}>
                    edit
                  </Button>
                  <Button color="secondary" onClick={this.deleteAktivitaetButtonClicked}>
                    delete
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <AktivitaetForm show={showAktivitaetForm} user={user} aktivitaet={aktivitaet} onClose={this.aktivitaetFormClosed} />
        <AktivitaetDeleteDialog show={showAktivitaetDeleteDialog} aktivitaet={aktivitaet} onClose={this.deleteAktivitaetDialogClosed} />
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
AktivitaetListEntry.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The AktivitaetBO to be rendered */
  aktivitaet: PropTypes.object.isRequired,
  person: PropTypes.object.isRequired,
  /** The state of this AktivitaetListEntry. If true the aktivitaet is shown with its accounts */
  expandedState: PropTypes.bool.isRequired,
  /** The handler responsible for handle expanded state changes (exanding/collapsing) of this AktivitaetListEntry
   *
   * Signature: onExpandedStateChange(AktivitaetBO aktivitaet)
   */
  onExpandedStateChange: PropTypes.func.isRequired,
  /**
   *  Event Handler function which is called after a sucessfull delete of this aktivitaet.
   *
   * Signature: onAktivitaetDelete(AktivitaetBO aktivitaet)
   */
  onAktivitaetDeleted: PropTypes.func.isRequired
}

export default withStyles(styles)(AktivitaetListEntry);