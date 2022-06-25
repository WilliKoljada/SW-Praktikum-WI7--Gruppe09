import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from "@material-ui/core";
import { Button, ButtonGroup } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ProjektForm from "../dialogs/ProjektForm";
import ProjektDeleteDialog from "../dialogs/ProjektDeleteDialog";
import ProjektDetail from "../details/ProjektDetail";


/**
 * Renders ProjektBO object within a expandable/collapsible ProjektListEntry with the projekt manipulation
 * functions. If expanded, it renders a AccountList.
 *
 * @see See [ProjektList](#projektlist)
 *
 * @author
 */
class ProjektListEntry extends Component {
  constructor(props) {
    super(props);

    // Init the state
    this.state = {
      projekt: props.projekt,
      showProjektForm: false,
      showProjektDeleteDialog: false,
    };
  }

  /** Handles onChange events of the underlying ExpansionPanel */
  expansionPanelStateChanged = () => {
    this.props.onExpandedStateChange(this.props.projekt);
  }

  /** Handles onProjektDelete events from an ProjektListEntry  */
  deleteProjektHandler = (deletedProjekt) => {
    // console.log(deletedProjekt.getID());
    this.setState({
      projekte: this.state.projekte.filter(projekt => projekt.getID() !== deletedProjekt.getID())
    })
  }

  /** Handles the onClick event of the edit projekt button */
  editProjektButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showProjektForm: true
    });
  }

  /** Handles the onClose event of the ProjektForm */
  projektFormClosed = (projekt) => {
    // projekt is not null and therefor changed
    if (projekt) {
      this.setState({
        projekt: projekt,
        showProjektForm: false
      });
    } else {
      this.setState({
        showProjektForm: false
      });
    }
  }

  /** Handles the onClick event of the delete projekt button */
  deleteProjektButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showProjektDeleteDialog: true
    });
  }

  /** Handles the onClose event of the ProjektDeleteDialog */
  deleteProjektDialogClosed = (projekt) => {
    // if projekt is not null, delete it
    if (projekt) {
      this.props.onProjektDeleted(projekt);
    };

    // Don´t show the dialog
    this.setState({
      showProjektDeleteDialog: false
    });
  }

  /** Renders the component */
  render() {
    const { classes, expandedState, user } = this.props;
    // Use the states projekt
    const { projekt, showProjektForm, showProjektDeleteDialog } = this.state;

    // console.log(this.state);
    return (
      <div>
        <Accordion defaultExpanded={false} expanded={expandedState} onChange={this.expansionPanelStateChanged}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id={`projekt${projekt.getID()}projektpanel-header`}
          >
            <Grid container spacing={1} justifyContent="flex-start" alignItems="center">
              <Grid item>
                <Typography variant="body1" className={classes.heading}>
                    {projekt.getID()} - {projekt.getName()}
                </Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container justifyContent="flex-start" alignItems="center">
              <ProjektDetail projekt={projekt} />
              <Grid item>
                <ButtonGroup variant="text" size="small">
                  <Button color="primary" onClick={this.editProjektButtonClicked}>
                    edit
                  </Button>
                  <Button color="secondary" onClick={this.deleteProjektButtonClicked}>
                    delete
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <ProjektForm show={showProjektForm} projekt={projekt} user={user} onClose={this.projektFormClosed} />
        <ProjektDeleteDialog show={showProjektDeleteDialog} projekt={projekt} onClose={this.deleteProjektDialogClosed} />
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
ProjektListEntry.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The ProjektBO to be rendered */
  projekt: PropTypes.object.isRequired,
  /** The state of this ProjektListEntry. If true the projekt is shown with its accounts */
  expandedState: PropTypes.bool.isRequired,
  /** The handler responsible for handle expanded state changes (exanding/collapsing) of this ProjektListEntry
   *
   * Signature: onExpandedStateChange(ProjektBO projekt)
   */
  onExpandedStateChange: PropTypes.func.isRequired,
  /**
   *  Event Handler function which is called after a sucessfull delete of this projekt.
   *
   * Signature: onProjektDelete(ProjektBO projekt)
   */
  onProjektDeleted: PropTypes.func.isRequired
}

export default withStyles(styles)(ProjektListEntry);