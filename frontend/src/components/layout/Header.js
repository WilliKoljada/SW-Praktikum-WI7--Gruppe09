import React, { Component } from "react";
import PropTypes from "prop-types";
import { Paper, Typography, Tabs, Tab, AppBar } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import ProfileDropDown from "../dialogs/ProfileDropDown";

/**
 * Shows the header with the main navigation Tabs within a Paper.
 *
 * @see See Material-UIs [Tabs](https://material-ui.com/components/tabs/)
 * @see See Material-UIs [Paper](https://material-ui.com/components/paper/)
 *
 */
class Header extends Component {

  constructor(props) {
    super(props);

    // Init an empty state
    this.state = {
      tabindex: 0
    };
  }

  /** Handles onChange events of the Tabs component */
  handleTabChange = (e, newIndex) => {
    // console.log(newValue)
    this.setState({
      tabindex: newIndex
    })
  };

  /** Renders the component */
  render() {
    const { user } = this.props;

    return (
      <Paper elevation={3} >
        <ProfileDropDown user={user} />
        <Typography variant="h3" component="h1" align="center" color="primary">
           Zeiterfassungsapp
        </Typography>
        <Typography variant='h5' component='h2' align='center'>
           Track your productivity.
         </Typography> <br></br>

        {
          user ?
            <AppBar position="static" color="secondary">
             <Tabs variant="scrollable" indicatorColor="secondary" textColor="primary" centered value={this.state.tabindex} onChange={this.handleTabChange} >
              <Tab label="Personen" component={RouterLink} to={`/persons`} />
              <Tab label="Projekte" component={RouterLink} to={`/projekte`} />
              <Tab label="Aktivitaten" component={RouterLink} to={`/aktivitaeten`} />
              <Tab label="Ereignisse" component={RouterLink} to={`/ereignis`} />
              <Tab label="Zeitintervall" component={RouterLink} to={`/zeitintervall`} />
              <Tab label="Arbeitzeitkonto" component={RouterLink} to={`/arbeitzeit`} />
              <Tab label="About" component={RouterLink} to={`/about`} />
            </Tabs>
             </AppBar>
            : null
        }
      </Paper>
    )
  }
}

/** PropTypes */
Header.propTypes = {
  /** The logged in firesbase user */
  user: PropTypes.object,
}

export default Header;