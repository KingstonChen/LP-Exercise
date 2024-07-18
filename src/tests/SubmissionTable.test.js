import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import SubmissionTable from '../SubmissionTable';

const mockRows = [
  { id: '1', data: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' } },
  { id: '2', data: { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' } },
  { id: '3', data: { firstName: 'Bob', lastName: 'Brown', email: 'bob.brown@example.com' } },
  { id: '4', data: { firstName: 'Alice', lastName: 'White', email: 'alice.white@example.com' } },
  { id: '5', data: { firstName: 'Tom', lastName: 'Jones', email: 'tom.jones@example.com' } },
  { id: '6', data: { firstName: 'Jerry', lastName: 'Black', email: 'jerry.black@example.com' } },
];

describe('SubmissionTable', () => {
  test('renders table rows based on the provided rows data', () => {
    render(<SubmissionTable rows={mockRows} loading={false} />);

    mockRows.slice(0, 5).forEach(row => {
      expect(screen.getByText(row.data.firstName)).toBeInTheDocument();
      expect(screen.getByText(row.data.lastName)).toBeInTheDocument();
      expect(screen.getByText(row.data.email)).toBeInTheDocument();
    });
  });

  test('displays loading spinner when loading is true', () => {
    render(<SubmissionTable rows={[]} loading={true} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('correctly handles pagination', async () => {
    render(<SubmissionTable rows={mockRows} loading={false} />);

    // Check initial rows
    mockRows.slice(0, 5).forEach(row => {
      expect(screen.getByText(row.data.firstName)).toBeInTheDocument();
    });

    // Click next page button
    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    userEvent.click(nextPageButton);

    await waitFor(() => {
      mockRows.slice(5, 6).forEach(row => {
        expect(screen.getByText(row.data.firstName)).toBeInTheDocument();
      });
    });
  });

  test('correctly handles changing rows per page', async () => {
    render(<SubmissionTable rows={mockRows} loading={false} />);

    const select = screen.getByLabelText(/rows per page/i);
    userEvent.selectOptions(select, '10');

    await waitFor(() => {
      mockRows.forEach(row => {
        expect(screen.getByText(row.data.firstName)).toBeInTheDocument();
      });
    });
  });

  test('displays empty rows when there are not enough rows to fill the page', async () => {
    render(<SubmissionTable rows={mockRows.slice(0, 3)} loading={false} />);

    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(7); // 3 rows + 2 empty rows + header + footer
      expect(screen.getAllByRole('cell', { name: /^$/ })).toHaveLength(2);
    });
  });
});
