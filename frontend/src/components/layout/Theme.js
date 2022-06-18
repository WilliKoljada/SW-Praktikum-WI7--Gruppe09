import { createMuiTheme } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';

//official  colors:
const white = '#ffffff';
const darkGray = '#3e4847';
const orange = '#f57c00';
const green = "#c1e1c1";

//Creating a costume theme for this app:

const theme = createMuiTheme({
    fontFamily: [
      'Arial'
    ].join(','),

  palette:{
    darkGray,
    orange,
    white,
    green,
    primary: {
        contrastText: darkGray,
        dark: colors.green[900],
      main: colors.green[500],
      light: colors.green[300]

    },
    secondary: {
        contrastText: darkGray,
        main: green
    },
    warning:{
        contrastText: white,
        dark:'#f57c00',
        main:'#ff9800',
        light:'#ffb74d'
    },
    error: {
        contrastText: white,
        dark:'#d32f2f',
        main: white,
        light:'#f44336'
    },
    success: {
        contrastText: white,
        dark:'#388e3c',
        main: '#4caf50',
        light:'#81c784'
    },
    background: {
        default: white
    },
    text:{
        primary: darkGray,
        link: '#1976d2'

    },
    info: {
        contrastText: darkGray,
        dark:'#1976d2',
        main:'#2196f3',
        light:'#64b5f6'
    }
  }
});
export default theme;