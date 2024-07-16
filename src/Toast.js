import { useEffect, useState, Fragment } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { onMessage } from './service/mockServer';

export default function Toast() {
  const [state, setState] = useState({
    open: false,
    firstName: "",
    lastName: "",
    email: "",
    id: ""
  });
  const {open, firstName, lastName, email, id} = state;
  const message = `${firstName} ${lastName}\n${email}`;

  useEffect(() => {
    onMessage((formSubmission) => {
      setState({
        open: true,
        firstName: formSubmission.data.firstName,
        lastName: formSubmission.data.lastName,
        email: formSubmission.data.email,
        id: formSubmission.id
      })
    })
  }, []);


  function handleClose() {
    setState({ ...state, open: false, id: "" });
  }

  function handleLike() {
  }

  const action = (
    <>
      <Button color="secondary" size="small" onClick={handleLike}>
        LIKE
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}
      action={action}
    />
  )
}
