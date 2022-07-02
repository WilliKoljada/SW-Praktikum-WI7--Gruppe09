import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ArbeitKontoDetail from "../details/ArbeitKontoDetail";

/**
 * Renders a AktivitaetBO object within a expandable/collapsible AktivitaetListEntry with the aktivitaet manipulation
 * functions. If expanded, it renders a AccountList.
 *
 * @see See [AktivitaetList](#aktivitaetlist)
 *
 * @author
 */
class ArbeitKontoEntry extends Component {

  constructor(props) {
    super(props);

    // Init the state
    this.state = {
      arbeitKonto: props.arbeitKonto,
    };
  }

  expansionPanelStateChanged = () => {
    this.props.onExpandedStateChange(this.props.arbeitKonto);
  }

  render() {
    const { classes, expandedState } = this.props;
    const { arbeitKonto } = this.state;

    return (
      <div>
        <Accordion defaultExpanded={false} expanded={expandedState} onChange={this.expansionPanelStateChanged}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id={`arbeitKontoarbeitKontopanel-header`}
          >
            <Grid container spacing={1} justifyContent="flex-start" alignItems="center">
              <Grid item>
                <Typography variant="body1" className={classes.heading}>
                   Arbeit Konto
                </Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1} justifyContent="flex-start" alignItems="center">
              <ArbeitKontoDetail arbeitKonto={arbeitKonto} />
            </Grid>
          </AccordionDetails>
        </Accordion>
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
ArbeitKontoEntry.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  arbeitKonto: PropTypes.object.isRequired,
  expandedState: PropTypes.bool.isRequired,
  onExpandedStateChange: PropTypes.func.isRequired,
}

export default withStyles(styles)(ArbeitKontoEntry);