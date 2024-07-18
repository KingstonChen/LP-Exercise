import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import ToastStack from '../ToastStack';
import { onMessage, saveLikedFormSubmission } from '../service/mockServer';

jest.mock('../service/mockServer', () => ({
  onMessage: jest.fn(),
  saveLikedFormSubmission: jest.fn(),
}));

const renderToastStack = (props = {}) =>
  render(
      <ToastStack {...props} />
  );

describe('ToastStack', () => {
  let onLike, onLikeFail;

  beforeEach(() => {
    onLike = jest.fn();
    onLikeFail = jest.fn();
    jest.resetAllMocks();
  });

  test('enqueues a toast when a message is received', async () => {
    onMessage.mockImplementation((callback) => {
      callback({
        id: '1',
        data: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      });
    });

    renderToastStack({ onLike, onLikeFail });

    await waitFor(() => {
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
      expect(screen.getByText(/john.doe@example.com/)).toBeInTheDocument();
    });
  });

  test('closes a toast when the close button is clicked', async () => {
    onMessage.mockImplementation((callback) => {
      callback({
        id: '1',
        data: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      });
    });

    renderToastStack({ onLike, onLikeFail });

    await waitFor(() => expect(screen.getByText(/John Doe/)).toBeInTheDocument());

    userEvent.click(screen.getByRole('button', { name: /close/i }));

    await waitFor(() => expect(screen.queryByText(/John Doe/)).not.toBeInTheDocument());
  });

  test('closes a toast when the LIKE button is clicked', async () => {
    onMessage.mockImplementation((callback) => {
      callback({
        id: '1',
        data: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      });
    });

    renderToastStack({ onLike, onLikeFail });

    await waitFor(() => expect(screen.getByText(/John Doe/)).toBeInTheDocument());

    userEvent.click(screen.getByRole('button', { name: /LIKE/i }));

    await waitFor(() => expect(screen.queryByText(/John Doe/)).not.toBeInTheDocument());
  });

  test('moves a toast to the waitlist when maxSnack is exceeded', async () => {
    onMessage.mockImplementation((callback) => {
      for (let i = 1; i <= 6; i++) {
        callback({
          id: i.toString(),
          data: { firstName: `User${i}`, lastName: 'Doe', email: `user${i}@example.com` },
        });
      }
    });

    renderToastStack({ onLike, onLikeFail });

    await waitFor(() => {
      for (let i = 1; i <= 4; i++) {
        expect(screen.getByText(new RegExp(`User${i}`))).toBeInTheDocument();
      }
      expect(screen.queryByText(/User5/)).not.toBeInTheDocument();
      expect(screen.queryByText(/User6/)).not.toBeInTheDocument();
    });
  });

  test('displays a toast from the waitlist when a toast is dismissed', async () => {
    onMessage.mockImplementation((callback) => {
      for (let i = 1; i <= 5; i++) {
        callback({
          id: i.toString(),
          data: { firstName: `User${i}`, lastName: 'Doe', email: `user${i}@example.com` },
        });
      }
    });

    renderToastStack({ onLike, onLikeFail });

    await waitFor(() => {
      for (let i = 1; i <= 4; i++) {
        expect(screen.getByText(new RegExp(`User${i}`))).toBeInTheDocument();
      }
      expect(screen.queryByText(/User5/)).not.toBeInTheDocument();
    });

    userEvent.click(screen.getAllByRole('button', { name: /close/i })[0]);
    await waitFor(() => {
        expect(screen.getByText(new RegExp(/User5/))).toBeInTheDocument();
    });
  });
});
