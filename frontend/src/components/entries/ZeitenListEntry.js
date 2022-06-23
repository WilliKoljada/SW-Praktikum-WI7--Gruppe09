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
    const { classes, expandedState } = this.props;
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
            <Grid container spacing={1} justify="flex-start" alignItems="center">
              <Grid item>
                <Typography variant="body1" className={classes.heading}>
                    {zeit.getID()},
                </Typography>
              </Grid>
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
              <Grid item xs />
              <Grid item>
                <Typography variant="body2" color={"textSecondary"}>List of Zeitintervall</Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <ZeitenList show={expandedState} zeit={zeit} />
          </AccordionDetails>
        </Accordion>
        <ZeitenForm show={showZeitenForm} zeit={zeit} onClose={this.zeitFormClosed} />
        <ZeitenDeleteDialog show={showZeitenDeleteDialog} zeit={zeit} onClose={this.deleteZeitenDialogClosed} />
      </div>
    );
  }
}

