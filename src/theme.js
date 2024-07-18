import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#21242E', // Replace with your desired primary color
    },
    secondary: {
      main: '#AB6345', // Replace with your desired secondary color
    },
    background: {
      default: '#F4F3F0', // Replace with your desired background color
      paper: '#ffffff',   // Replace with your desired paper background color
    },
    text: {
      primary: '#000000',
    },
  },
});

export default theme;
