import { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { onMessage, saveLikedFormSubmission } from './service/mockServer';

export default function Toast({onLikeSucceed, onLikeFail = null}) {
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
  });

  onLikeFail = null || (() => alert("Liking the form submission failed"));

  function handleClose() {
    setState({ ...state, open: false });
  }

  function handleLike() {
    handleClose();
    saveLikedFormSubmission(form).then(onLikeSucceed, onLikeFail);
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
