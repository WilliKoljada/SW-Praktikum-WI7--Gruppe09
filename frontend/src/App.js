import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Container, ThemeProvider, CssBaseline } from "@material-ui/core";
import firebase from "firebase/app";
import "firebase/auth";
import Header from "./components/layout/Header";
import About from "./components/Pages/About";
import theme from "./components/layout/Theme";
import SignIn from "./components/Pages/SignIn";
import ProjektList from "./components/ProjektList";
import PersonList from "./components/PersonList";
import EreignisList from "./components/EreignisList";
import ZeitenList from "./components/ZeitenList";
import ArbeitKonto from "./components/ArbeitKonto";
import AktivitaetList from "./components/AktivitaetList";
import LoadingProgress from "./components/dialogs/LoadingProgress";
import ContextErrorMessage from "./components/dialogs/ContextErrorMessage";
import firebaseConfig from "./firebaseconfig";
/**
 * The main bank administration app. It uses Googles firebase to log into the bank end. For routing the 
 * user to the respective pages, react-router-dom ist used.
 * 
 * @see See Google [firebase.auth()](https://firebase.google.com/docs/reference/js/firebase.auth.Auth)
 * @see See Google [firebase.auth().signInWithRedirect](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signinwithredirect)
 * @see [react-router-dom](https://reacttraining.com/react-router/web/guides/quick-start)
 * 
 */
class App extends React.Component {

	/** Constructor of the app, which initializes firebase  */
	constructor(props) {
		super(props);

		// Init an empty state
		this.state = {
			currentUser: null,
			appError: null,
			authError: null,
			authLoading: false
		};
	}

	/** 
	 * Create an error boundary for this app and recieve all errors from below the component tree.
	 * 
	 * @See See Reacts [Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
 	 */
	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { appError: error };
	}

	/** Handles firebase users logged in state changes  */
	handleAuthStateChange = user => {
		if (user) {
			this.setState({
				authLoading: true
			});
			// The user is signed in
			user.getIdToken().then(token => {
				// Add the token to the browser"s cookies. The server will then be
				// able to verify the token against the API.
				// SECURITY NOTE: As cookies can easily be modified, only put the
				// token (which is verified server-side) in a cookie; do not add other
				// user information.
				document.cookie = `token=${token};path=/`;

				// Set the user not before the token arrived
				console.log(user);
				this.setState({
					currentUser: user,
					authError: null,
					authLoading: false
				});
			}).catch(e => {
				this.setState({
					authError: e,
					authLoading: false
				});
			});
		} else {
			// User has logged out, so clear the id token
			document.cookie = "token=;path=/";

			// Set the logged out user to null
			this.setState({
				currentUser: null,
				authLoading: false
			});
		}
	}

  /** 
   * Handles the sign in request of the SignIn component uses the firebase.auth() component to sign in.
	 * @see See Google [firebase.auth()](https://firebase.google.com/docs/reference/js/firebase.auth.Auth)
	 * @see See Google [firebase.auth().signInWithRedirect](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signinwithredirect)
	 */
	handleSignIn = () => {
		this.setState({
			authLoading: true
		});
		const provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithRedirect(provider);
	}

	/**
	 * Lifecycle method, which is called when the component gets inserted into the browsers DOM.
	 * Initializes the firebase SDK.
	 * 
	 * @see See Googles [firebase init process](https://firebase.google.com/docs/web/setup)
	 */
	componentDidMount() {
		firebase.initializeApp(firebaseConfig);
		firebase.auth().languageCode = "en";
		firebase.auth().onAuthStateChanged(this.handleAuthStateChange);
	}

	/** Renders the whole app */
	render() {
		const { currentUser, appError, authError, authLoading } = this.state;

		return (
			<ThemeProvider theme={theme}>
				{/* Global CSS reset and browser normalization. CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
				<CssBaseline />
				<Router basename={process.env.PUBLIC_URL}>
					<Container maxWidth="lg">
						<Header user={currentUser} />
						{
							// Is a user signed in?
							currentUser ?
								<>
									<Redirect from="/" to="/persons" />
									<Route exact path="/about">
										<About />
									</Route>

									<Route exact path="/persons">
										<PersonList user={currentUser} />
									</Route>
									<Route exact path="/projekte">
										<ProjektList user={currentUser} />
									</Route>
									<Route exact path="/aktivitaeten">
										<AktivitaetList user={currentUser} />
									</Route>
									<Route exact path="/ereignis">
										<EreignisList user={currentUser} />
									</Route>
									<Route exact path="/zeitintervall">
										<ZeitenList user={currentUser} />
									</Route>
									<Route exact path="/arbeitkonto">
										<ArbeitKonto user={currentUser} />
									</Route>
								</>
								
								:
								// else show the sign in page
								<>
									<Redirect to="/index.html" />
									<SignIn onSignIn={this.handleSignIn} />
								</>
						}
						<LoadingProgress show={authLoading} />
						<ContextErrorMessage error={authError} contextErrorMsg={`Something went wrong during sighn in process.`} onReload={this.handleSignIn} />
						<ContextErrorMessage error={appError} contextErrorMsg={`Something went wrong inside the app. Please reload the page.`} />
					</Container>
				</Router>
			</ThemeProvider>
		);
	}
}

export default App;
