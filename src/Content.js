import { useState, useEffect }from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { backOff } from 'exponential-backoff';

import ToastStack from './ToastStack';
import SubmissionTable from './SubmissionTable';

import { fetchLikedFormSubmissions } from './service/mockServer';

export default function Content() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function fetchSubmissionTable() {
      setLoading(true);

      backOff(() => fetchLikedFormSubmissions(), {
        retry: (e, attemptNumber) => {
          console.log(`FetchLikedFormSubmissions attempt ${attemptNumber} failed. Error: ${e.message}`);
          return true; // Retry on failure
        }
      })
      .then((response) => {
        setRows(response.formSubmissions);
        setLoading(false);
      })
      .catch(() => alert("Server Error!"));
    }

    fetchSubmissionTable();
  }, [])

  function addNewLikedFormSubmission(form) {
    setRows(prevRows => [form, ...prevRows]);
  }

  function removeFailedLike(key) {
    setRows(prevRows => prevRows.filter(form => form.id !== key));
  }

  return (
    <Box sx={{marginTop: 3}}>
      <Typography variant="h4">Liked Form Submissions</Typography>
      <SubmissionTable rows={rows} loading={loading} />
      <ToastStack onLike={addNewLikedFormSubmission} onLikeFail={removeFailedLike} />
    </Box>
  );
}

