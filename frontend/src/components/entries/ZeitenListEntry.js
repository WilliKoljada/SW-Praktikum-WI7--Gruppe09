import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from "@material-ui/core";
import { Button, ButtonGroup } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ZeitenForm from "../dialogs/ZeitenForm";
import ZeitenDeleteDialog from "../dialogs/ZeitenDeleteDialog";
import ZeitenDetail from "../details/ZeitenDetail";

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

  /** Handles the onClose event of the ZeitenForm */
  zeitFormClosed = (zeit) => {
    // zeit is not null and therefor changed
    if(zeit) {
      this.setState({
        zeit: zeit,
        showZeitenForm: false
      });
    } else {
      this.setState({
        showZeitenForm: false
      });
    }
  }

  /** Handles the onClick event of the delete zeit button */
  deleteZeitenButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showZeitenDeleteDialog: true
    });
  }

  /** Handles the onClose event of the ZeitenDeleteDialog */
  deleteZeitenDialogClosed = (zeit) => {
    // if zeit is not null, delete it
    if(zeit) {
      this.props.onZeitenDeleted(zeit);
    };

    // Don´t show the dialog
    this.setState({
      showZeitenDeleteDialog: false
    });
  }

  /** Renders the component */
  render() {
    const { classes, expandedState, user } = this.props;
    // Use the szeit
    const { zeit, showZeitenForm, showZeitenDeleteDialog } = this.state;

    // console.log(this.state);
    return (
      <div>
        <Accordion defaultExpanded={false} expanded={expandedState} onChange={this.expansionPanelStateChanged}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id={`zeit${zeit.getID()}zeitpanel-header`}
          >
            <Grid container spacing={1} justifyContent="flex-start" alignItems="center">
              <Grid item>
                <Typography variant="body1" className={classes.heading}>
                    {zeit.getID()} - {zeit.getDatum()}
                </Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1} justifyContent="flex-start" alignItems="center">
              <ZeitenDetail zeit={zeit} />
              <Grid item>
                <ButtonGroup variant="text" size="small">
                  <Button color="primary" onClick={this.ediZeitentButtonClicked}>
                    edit
                  </Button>
                  <Button color="secondary" onClick={this.deleteZeitenButtonClicked}>
                    delete
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <ZeitenForm show={showZeitenForm} zeit={zeit} user={user} onClose={this.zeitFormClosed} />
        <ZeitenDeleteDialog show={showZeitenDeleteDialog} zeit={zeit} onClose={this.deleteZeitenDialogClosed} />
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
ZeitenListEntry.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The ZeitintervallBO to be rendered */
  zeit: PropTypes.object.isRequired,
  /** The state of this ZeitenListEntry. If true the zeit is shown with its accounts */
  expandedState: PropTypes.bool.isRequired,
  /** The handler responsible for handle expanded state changes (exanding/collapsing) of this ZeitenListEntry
   *
   * Signature: onExpandedStateChange(ZeitintervallBO zeit)
   */
  onExpandedStateChange: PropTypes.func.isRequired,
  /**
   *  Event Handler function which is called after a sucessfull delete of this zeit.
   *
   * Signature: onZeitenDelete(ZeitintervallBO zeit)
   */
  onZeitenDeleted: PropTypes.func.isRequired
}

export default withStyles(styles)(ZeitenListEntry);