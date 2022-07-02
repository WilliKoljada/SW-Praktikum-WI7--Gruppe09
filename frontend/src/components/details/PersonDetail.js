import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Typography, Paper } from "@material-ui/core";
import ZeiterfassungAPI from "../../api/ZeiterfassungAPI";
import ContextErrorMessage from "../dialogs/ContextErrorMessage";
import LoadingProgress from "../dialogs/LoadingProgress";

/**
 * Renders a PersonBO object within a ListEntry and provides a delete button to delete it.
 *
 * @see See Material-UIs [Lists](https://material-ui.com/components/lists/)
 * @see See Material-UIs [ListItem](https://material-ui.com/api/list-item/)
 *
 * @author
 */
class PersonDetail extends Component {
  constructor(props) {
    super(props);

    // Init state
    this.state = {
      person: null,
      loadingInProgress: false,
      loadingError: null,
    };
    if(this.props.person){
      this.state.person = this.props.person;
    }
  }

  /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
  componentDidMount() {
    // this.getPerson();
  }

  /** gets the balance for this person */
  getPerson = () => {
    ZeiterfassungAPI.getAPI().getPerson(this.props.person.getID()).then(person =>
      this.setState({
        person: person,
        loadingInProgress: false,
        loadingError: null
      })).catch(e =>
        this.setState({ // Reset state with error from catch
          person: null,
          loadingInProgress: false,
          loadingError: e
        })
      );

    // set loading to true
    this.setState({
      loadingInProgress: true,
      loadingError: null
    });
  }

  /** Renders the component */
  render() {
    const { classes } = this.props;
    const { person, loadingInProgress, loadingError } = this.state;

    return (
      <Paper variant="outlined" className={classes.root}>
        {
          person ?
          (<div>
            <Typography>
              Vorname: <strong>{person.getVorname()}</strong>
            </Typography>
            <Typography>
              Nachname: <strong>{person.getNachname()}</strong>
            </Typography>
            <Typography>
              Email: <strong>{person.getEmail()}</strong>
            </Typography>
          </div>)
            : null
        }
        <LoadingProgress show={loadingInProgress} />
        <ContextErrorMessage error={loadingError} contextErrorMsg={`The data of person id ${person.getID()} could not be loaded.`} onReload={this.getPerson} />
      </Paper>
    );
  }
}

/** Component specific styles */
const styles = theme => ({
  root: {
    width: "100%",
    padding: theme.spacing(1),
    marginTop: theme.spacing(1)
  }
});

/** PropTypes */
PersonDetail.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The personID to be rendered */
  person: PropTypes.object.isRequired,
}

export default withStyles(styles)(PersonDetail);