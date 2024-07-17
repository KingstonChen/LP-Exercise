import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Toast from './Toast';
import SubmissionTable from './SubmissionTable';

import { fetchLikedFormSubmissions } from './service/mockServer';

export default function Content() {
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    refreshSubmissionTable();
  }, [])

  function onfetchSubmissionsSucceed(response) {
    setRows(response.formSubmissions);
  }

  function onfetchSubmissionsFail(response) {
      // TODO: retry
    alert("Fetching liked form submissions failed");
  }

  function refreshSubmissionTable() {
    fetchLikedFormSubmissions().then(onfetchSubmissionsSucceed, onfetchSubmissionsFail);
  }

  return (
    <Box sx={{marginTop: 3}}>
      <Typography variant="h4">Liked Form Submissions</Typography>
      <SubmissionTable rows={rows} />
      <Toast onLikeSucceed={refreshSubmissionTable} />
    </Box>
  );
}

