import { useState, useEffect }from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { backOff } from 'exponential-backoff';

import Toast from './Toast';
import SubmissionTable from './SubmissionTable';

import { fetchLikedFormSubmissions } from './service/mockServer';

export default function Content() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshSubmissionTable();
  }, [])

  function onfetchSubmissionsSucceed(response) {
    setRows(response.formSubmissions);
    setLoading(false);
  }

  function onfetchSubmissionsFail(response) {
    alert("Fetching liked form submissions failed");
  }

  function refreshSubmissionTable() {
    setLoading(true);

    backOff(() => fetchLikedFormSubmissions(), {
      retry: (e, attemptNumber) => {
        console.log(`FetchLikedFormSubmissions attempt ${attemptNumber} failed. Error: ${e.message}`);
        return true; // Retry on failure
      }
    })
    .then(onfetchSubmissionsSucceed)
    .catch(onfetchSubmissionsFail);
  }

  return (
    <Box sx={{marginTop: 3}}>
      <Typography variant="h4">Liked Form Submissions</Typography>
      <SubmissionTable rows={rows} loading={loading} />
      <Toast onLikeSucceed={refreshSubmissionTable} />
    </Box>
  );
}

