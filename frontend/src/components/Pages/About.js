import React from "react"
import { makeStyles, Paper, Typography, Link } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core";
import theme from "../layout/Theme";
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1)
  },
  content: {
    margin: theme.spacing(1),
  }
}));

/**
 * Zeigt die About Page mit den Verantwortlichen, die Autoren und ihre Bereiche an; inklusive Verlinkung zu den Github Profilen
 */

function About() {

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={0} className={classes.root}>
        <div className={classes.content}>
          <Typography variant="h6">
          Zeiterfassung
          </Typography>
          <br />

          <h4>Database</h4>
          <Typography>
          Database written by <Link href="https://github.com/AyhanCoemert">Ayhan Cömert</Link> <br />
          Database written by <Link href="https://github.com/WilliKoljada">Willi Koljada</Link> <br />
          </Typography>
          <br />

          <h4> React Frontend</h4>
          <Typography>
          React Frontend written by <Link href="https://github.com/AniqaKhan301">Aniqa Khan</Link> <br />
          React Frontend written by <Link href="https://github.com/AyhanCoemert">Ayhan Cömert</Link> <br />
          React Frontend written by <Link href="https://github.com/WilliKoljada">Willi Koljada</Link> <br />
          React Frontend written by <Link href="https://github.com/Ka041">Kaswara Al Mustafa</Link> <br />
          React Frontend written by <Link href="https://github.com/benjamintok">Benjamin Tok</Link> <br />
          </Typography>
          <br />

          <h4>Python Backend </h4>
          <Typography>
          React Frontend written by <Link href="https://github.com/Ka041">Kaswara Al Mustafa</Link> <br />
          Python Backend written by <Link href="https://github.com/AniqaKhan301">Aniqa Khan</Link> <br />
          Python Backend written by <Link href="https://github.com/AyhanCoemert">Ayhan Cömert</Link> <br />
          React Frontend written by <Link href="https://github.com/benjamintok">Benjamin Tok</Link> <br />
          React Frontend written by <Link href="https://github.com/WilliKoljada">Willi Koljada</Link> <br />
          </Typography>

          <br />
          <Typography variant="body2">
            © Hochschule der Medien 2021, all rights reserved.
        </Typography>
        </div>
      </Paper>
    </ThemeProvider>
  )
}

export default About;