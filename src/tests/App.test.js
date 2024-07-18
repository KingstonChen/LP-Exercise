import React from 'react';
import { screen, render } from '@testing-library/react';
import App from '../App';

test('renders header text', () => {
  render(<App />);

  const heading  = screen.getByRole('heading', { name: /toast exercise/i});
  expect(heading).toBeInTheDocument();
});

test('renders new submission button', () => {
  render(<App />);

  const button = screen.getByRole('button', { name: /New Submission/i});
  expect(button).toBeInTheDocument();
});

test('renders liked form submissions table', () => {
  render(<App />);

  const table = screen.getByRole('table');
  expect(table).toBeInTheDocument();
});
