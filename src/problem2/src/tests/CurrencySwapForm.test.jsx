import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import CurrencySwapForm from '../components/CurrencySwapForm';
import { fetchTokenPrices } from '../services/api';

jest.mock('../services/api');

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children }) => <div>{children}</div>,
    button: ({ children, type, onClick, className }) => <button type={type} onClick={onClick} className={className}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('CurrencySwapForm Component', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    fetchTokenPrices.mockResolvedValue({
      BTC: { price: 50000, name: 'Bitcoin' },
      ETH: { price: 3000, name: 'Ethereum' },
      USDC: { price: 1, name: 'USD Coin' },
    });
    
    jest.useFakeTimers();
    jest.advanceTimersByTime(1000);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const renderWithQueryClient = (component) => render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>,
  );

  test('shows error when API call fails', async () => {
    fetchTokenPrices.mockRejectedValue(new Error('API Error'));
    renderWithQueryClient(<CurrencySwapForm />);

    await waitFor(() => {
      expect(screen.getByText('Error loading token prices. Please try again later.')).toBeInTheDocument();
    });
  });

  test('renders loading state initially', async () => {
    renderWithQueryClient(<CurrencySwapForm />);

    await waitFor(() => {
      expect(screen.getByText('Loading token prices...')).toBeInTheDocument();
    });
  });

  test('renders form after data is loaded', async () => {
    renderWithQueryClient(<CurrencySwapForm />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading token prices...')).not.toBeInTheDocument();
      expect(screen.getByText('From')).toBeInTheDocument();
      expect(screen.getByText('To')).toBeInTheDocument();
    });
  });

  test('swaps tokens when swap button is clicked', async () => {
    renderWithQueryClient(<CurrencySwapForm />);
    
    // Wait for form to load
    
    await waitFor(() => {
      expect(screen.getAllByText('Select Token')[0]).toBeInTheDocument();
    });
    
    // Select "From" token
    fireEvent.click(screen.getAllByText('Select Token')[0]);
    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Bitcoin'));
    
    // Select "To" token
    fireEvent.click(screen.getAllByText('Select Token')[0]);
    await waitFor(() => {
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Ethereum'));
    
    const searchInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(searchInput, { target: { value: 3 } });

    await waitFor(() => {
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });
});