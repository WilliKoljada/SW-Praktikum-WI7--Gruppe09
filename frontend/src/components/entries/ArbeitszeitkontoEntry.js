import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ArbeitszeitkontoDetail from "../details/ArbeitszeitkontoDetail";

/**
 * Renders a ArbeitszeitkontoBO object within a expandable/collapsible ArbeitszeitkontoListEntry with the Arbeitszeitkonto manipulation
 * functions. If expanded, it renders a AccountList.
 *
 *
 * @author
 */
class ArbeitszeitkontoEntry extends Component {

  constructor(props) {
    super(props);

    // Init the state
    this.state = {
      arbeitszeitkonto: props.arbeitszeitkonto,
    };
  }

  expansionPanelStateChanged = () => {
    this.props.onExpandedStateChange(this.props.arbeitszeitkonto);
  }

  render() {
    const { classes, expandedState } = this.props;
    const { arbeitszeitkonto } = this.state;

    return (
      <div>
        <Accordion defaultExpanded={false} expanded={expandedState} onChange={this.expansionPanelStateChanged}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id={`arbeitszeitkontopanel-header`}
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
              <ArbeitszeitkontoDetail arbeitszeitkonto={arbeitszeitkonto} />
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
ArbeitszeitkontoEntry.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  arbeitszeitkonto: PropTypes.object.isRequired,
  expandedState: PropTypes.bool.isRequired,
  onExpandedStateChange: PropTypes.func.isRequired,
}

export default withStyles(styles)(ArbeitszeitkontoEntry);