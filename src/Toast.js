import { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { backOff } from 'exponential-backoff';

import { onMessage, saveLikedFormSubmission } from './service/mockServer';

export default function Toast({onLike}) {
  const [state, setState] = useState({
    open: false,
    firstName: "",
    lastName: "",
    email: "",
  });
  const {open, firstName, lastName, email} = state;
  const message = `${firstName} ${lastName}\n${email}`;
  const [form, setForm] = useState({
    id: "",
    data: {}
  })

  useEffect(() => {
    onMessage((formSubmission) => {
      if (form.id !== formSubmission.id) {
        setForm(formSubmission);
        setState({...formSubmission.data, open: true});
      }
    })
  }, []);

  function handleClose() {
    setState({ ...state, open: false });
  }

  function handleLike() {
    handleClose();  // Close the toast immediately to prevent liking it twice
    onLike(form);   // Update the liked submissions locally because the server is slow
    backOff(() => saveLikedFormSubmission(form), {
      retry: (e, attemptNumber) => {
        console.log(`SaveLikedFormSubmission attempt ${attemptNumber} failed. Error: ${e.message}`);
        return true; // Retry on failure
      }
    })
    .then(() => console.log("Form submission liked"))
    .catch(() => alert("Server Error!")); // TODO: if it fails, the form submission needs to be unliked
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
