import { useEffect, useRef } from 'react';
import {
  SnackbarProvider,
  enqueueSnackbar,
  closeSnackbar,
} from 'notistack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { backOff } from 'exponential-backoff';

import FormSubmissionSnackbar from './FormSubmissionSnackbar';
import SaveErrorSnackbar from './SaveErrorSnackbar';
import { onMessage, saveLikedFormSubmission } from './service/mockServer';

export default function ToastStack({onLike, onLikeFail}) {
  const forms = useRef(new Map());
  const displayed = useRef([]);
  const waitList = useRef([]);
  const maxSnack = 4;

  useEffect(() => {
    onMessage((formSubmission) => {
      if (!forms.current.has(formSubmission.id)) {
        forms.current.set(formSubmission.id, formSubmission);
        if (displayed.current.length < maxSnack) {
          enqueue(formSubmission.id);
        } else {
          waitList.current.push({key: formSubmission.id, variant: 'formSubmission'});
        }
      }
    })
  // Set the dependency to [] so that the callback is only registered with the server once
  // eslint-disable-next-line
  }, []);

  function enqueue(key, variant = "formSubmission") {
    let data = forms.current.get(key).data;
    displayed.current.push({key, variant});
    enqueueSnackbar({
      key,
      variant,
      data,
      handleLike: () => handleLike(key),
      handleClose: () => handleClose(key),
      anchorOrigin: { horizontal: "right", vertical: "bottom" },
      persist: true,
    })
  }

  function closeToast(key) {
    closeSnackbar(key);

    // update displayed array
    let index = displayed.current.findIndex(toast => toast.key === key);
    if (index >= 0) {
      displayed.current.splice(index, 1);
    }

    // open a new toast if the waitList is not empty
    if (waitList.current.length > 0) {
      let toast = waitList.current.shift();
      enqueue(toast.key, toast.variant);
    }
  }

  function clearData(key) {
    forms.current.delete(key);
  }

  function handleClose(key) {
    closeToast(key);
    clearData(key);
  }

  function handleLikeFail(key) {
    onLikeFail(key);
    if (displayed.current.length < maxSnack) {
      enqueue(key, "saveError");
    } else {
      let index = displayed.current.findLastIndex(toast => toast.variant === "formSubmission");
      // If the snackbar is full, try to dequeue one of them and put it in waitList
      if (index >= 0) {
        waitList.current.unshift(displayed.current[index])
        waitList.current.unshift({key, variant: "saveError"})
        closeToast(displayed.current[index].key);
      } else {
        waitList.current.unshift({key, variant: "saveEerror"})
      }
    }
  }

  function handleLike(key) {
    let form = forms.current.get(key);
    closeToast(key);    // Close the toast immediately to prevent liking it twice
    onLike(form);       // Update the liked submissions locally because the server is slow
    backOff(() => saveLikedFormSubmission(form), {
      numOfAttempts: 5,
      retry: (e, attemptNumber) => {
        console.log(`SaveLikedFormSubmission attempt ${attemptNumber} failed. Error: ${e.message}`);
        return true; // Retry on failure
      }
    })
    .then(() => clearData(key))
    .catch(() => handleLikeFail(key));
  }

  return (
    <SnackbarProvider
      maxSnack={maxSnack}
      Components={{
        formSubmission: FormSubmissionSnackbar,
        saveError: SaveErrorSnackbar
      }}
    />
  )
}

