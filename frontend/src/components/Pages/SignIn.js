import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Grid, Typography, withStyles } from "@material-ui/core";

/**
Beschreibt die Komponente der Sign-In Seite
 */
class SignIn extends Component {


	/**
	 * Handles the click event of the sign in button an calls the prop onSignIn handler
	 */
	handleSignInButton = () => {
		this.props.onSignIn();
	}

	/** Rendert die Seite zum Einloggen in die Applikation */
	render() {
		const { classes } = this.props;

		return (
			<div>
				<Typography className={classes.root} color="primary" align="center" variant="h6">Welcome   </Typography>
				<Typography className={classes.root} align="center">Dear user, it appears that you are not signed in yet.</Typography>
				<Typography className={classes.root} align="center">In order to use the services of Zeiterfassungsapp, please</Typography>
				<Grid container justifyContent="center">
					<Grid item>
						<Button variant="contained" color="secondary" onClick={this.handleSignInButton}>
							Sign in with Google
      			</Button>
					</Grid>
				</Grid>
			</div>
		);
	}
}

/** Component spezifische styles */
const styles = theme => ({
	root: {
		margin: theme.spacing(2)
	}
});

/** PropTypes */
SignIn.propTypes = {
	/** @ignore */
	classes: PropTypes.object.isRequired,
	/**
	 * Handler function, which is called if the user wants to sign in.
	 */
	onSignIn: PropTypes.func.isRequired,
}

export default withStyles(styles)(SignIn)