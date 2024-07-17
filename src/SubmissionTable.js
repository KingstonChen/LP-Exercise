import * as React from 'react';
import { styled } from '@mui/system';
import {
  TablePagination,
  tablePaginationClasses as classes,
} from '@mui/base/TablePagination';

export default function SubmissionTable({rows}) {
  console.log(rows);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - rows.length);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Root sx={{ maxWidth: '100%', width: '100%' }}>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <tr key={row.id}>
              <td>{row.data.firstName}</td>
              <td>{row.data.lastName}</td>
              <td>{row.data.email}</td>
            </tr>
          ))}
          {emptyRows > 0 && Array.from({length: emptyRows}).map((_, index) => (
            <tr key={`empty-${index}`}>
                <td className="empty-row" colspan="3"></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <CustomTablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                actions: {
                  showFirstButton: true,
                  showLastButton: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </tr>
        </tfoot>
      </table>
    </Root>
  );
}

const Root = styled('div')`
  table {
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    height: 41px;
    width: 30%;
    border: 1px solid #DAE2ED;
    text-align: left;
    padding: 8px;
  }

  td.empty-row {
    border-top: none;
    border-bottom: none;
  }

  `;

const CustomTablePagination = styled(TablePagination)`
  & .${classes.toolbar} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .${classes.selectLabel} {
    margin: 0;
  }

  & .${classes.displayedRows} {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .${classes.actions} {
    display: flex;
    gap: 0.25rem;
  }
`;

