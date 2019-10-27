import { createMuiTheme } from '@material-ui/core/styles';
import { red, purple, grey, blueGrey } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: blueGrey[900],
    },
    secondary: {
      main: purple[500],
    },
    error: {
      main: red.A400,
    },
    background: {
      default: grey[50],
    },
  },
});

export default theme;