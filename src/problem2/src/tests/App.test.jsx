import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { fetchTokenPrices } from '../services/api';

jest.mock('../services/api');

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children }) => <div>{children}</div>,
    button: ({ children }) => <button>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchTokenPrices.mockResolvedValue({});
  });

  test('renders without crashing', async () => {
    render(<App />);
    expect(screen.getByText('Currency Swap')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('From')).toBeInTheDocument();
      expect(screen.getByText('To')).toBeInTheDocument();
    });
  });
});
