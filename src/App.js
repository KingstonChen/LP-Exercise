import React from 'react';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';

import Header from './Header';
import Content from './Content';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Container>
        <Content />
      </Container>
    </ThemeProvider>
  );
}

export default App;
