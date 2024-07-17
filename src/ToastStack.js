import { useEffect, useCallback, useRef } from 'react';
import { SnackbarProvider, enqueueSnackbar, closeSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { backOff } from 'exponential-backoff';

import { onMessage, saveLikedFormSubmission } from './service/mockServer';

export default function ToastStack({onLike}) {
  const forms = useRef(new Map());
  const currentForms = useRef(new Set());
  const waitList = useRef([]);
  const maxSnack = 5;

  useEffect(() => {
    onMessage((formSubmission) => {
      console.log(`${formSubmission.id}, ${Date.now()}`);
      if (!forms.current.has(formSubmission.id)) {
        forms.current.set(formSubmission.id, formSubmission);
        if (currentForms.current.size < maxSnack) {
          enqueue(formSubmission.id);
        } else {
          waitList.current.push(formSubmission.id);
        }
        console.log(currentForms);
        console.log(waitList);
        console.log(forms);
      }
    })
  }, []);

  function enqueue(key) {
    console.log(`enqueue: ${key}, ${forms.current.get(key)}`);
    let {firstName, lastName, email} = forms.current.get(key).data;
    let message = `${firstName} ${lastName}\n${email}`;
    currentForms.current.add(key);
    enqueueSnackbar(message, {
      key,
      variant: 'default',
      anchorOrigin: { horizontal: "right", vertical: "bottom" },
      persist: true,
      style: { whiteSpace: "pre-line", width: '400px' },
      action: (key) => (
        <>
          <Button color="secondary" size="small" onClick={() => handleLike(key)}>
            LIKE
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => handleClose(key)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      )
    })
  }

  function handleClose(key) {
    closeSnackbar(key);
    currentForms.current.delete(key);
    if (waitList.current.length > 0) {
      let newKey = waitList.current.shift();
      enqueue(newKey);
    }
  }

  const handleLike = useCallback((key) => {
    let form = forms.current.get(key);
    handleClose(key); // Close the toast immediately to prevent liking it twice
    onLike(form);       // Update the liked submissions locally because the server is slow
    backOff(() => saveLikedFormSubmission(form), {
      retry: (e, attemptNumber) => {
        console.log(`SaveLikedFormSubmission attempt ${attemptNumber} failed. Error: ${e.message}`);
        return true; // Retry on failure
      }
    })
    .then(() => console.log("Form submission liked"))
    .catch(() => alert("Server Error!")); // TODO: if it fails, the form submission needs to be unliked
  })

  return (
    <SnackbarProvider maxSnack={maxSnack} />
  )
}
