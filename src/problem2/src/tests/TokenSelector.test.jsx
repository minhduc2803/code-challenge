import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TokenSelector from '../components/TokenSelector';

// Mock framer-motion to avoid animation-related issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('TokenSelector Component', () => {
  const mockTokens = [
    { symbol: 'BTC', name: 'Bitcoin', price: 50000 },
    { symbol: 'ETH', name: 'Ethereum', price: 3000 },
    { symbol: 'USDC', name: 'USD Coin', price: 1 },
  ];
  
  const mockOnSelectToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders select token button when no token is selected', () => {
    render(
      <TokenSelector
        selectedToken={null}
        onSelectToken={mockOnSelectToken}
        tokens={mockTokens}
      />,
    );
    
    expect(screen.getByText('Select Token')).toBeInTheDocument();
  });

  test('renders selected token when a token is selected', () => {
    render(
      <TokenSelector
        selectedToken={mockTokens[0]}
        onSelectToken={mockOnSelectToken}
        tokens={mockTokens}
      />,
    );
    
    expect(screen.getByText('BTC')).toBeInTheDocument();
  });

  test('opens dropdown when button is clicked', async () => {
    render(
      <TokenSelector
        selectedToken={null}
        onSelectToken={mockOnSelectToken}
        tokens={mockTokens}
      />,
    );
    
    // Click the select button
    fireEvent.click(screen.getByText('Select Token'));
    
    // Check if dropdown appears with token options
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search tokens...')).toBeInTheDocument();
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });
  });

  test('filters tokens based on search input', async () => {
    render(
      <TokenSelector
        selectedToken={null}
        onSelectToken={mockOnSelectToken}
        tokens={mockTokens}
      />,
    );
    
    // Open dropdown
    fireEvent.click(screen.getByText('Select Token'));
    
    // Type in search box
    const searchInput = screen.getByPlaceholderText('Search tokens...');
    fireEvent.change(searchInput, { target: { value: 'bit' } });
    
    // Check filtering works
    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
      expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
    });
  });

  test('selects a token when clicked', async () => {
    render(
      <TokenSelector
        selectedToken={null}
        onSelectToken={mockOnSelectToken}
        tokens={mockTokens}
      />,
    );
    
    // Open dropdown
    fireEvent.click(screen.getByText('Select Token'));
    
    // Click on a token
    fireEvent.click(screen.getByText('Bitcoin'));
    
    // Check if onSelectToken was called with the correct token
    expect(mockOnSelectToken).toHaveBeenCalledWith(mockTokens[0]);
  });

  test('excludes the other selected token from options', async () => {
    render(
      <TokenSelector
        selectedToken={null}
        onSelectToken={mockOnSelectToken}
        tokens={mockTokens}
        otherSelected={mockTokens[0]} // BTC is selected in the other dropdown
      />,
    );
    
    // Open dropdown
    fireEvent.click(screen.getByText('Select Token'));
    
    // Check that BTC is not in the options
    await waitFor(() => {
      expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument();
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });
  });
});