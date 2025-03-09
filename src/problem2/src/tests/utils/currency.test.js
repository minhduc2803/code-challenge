import { formatCurrency, calculateExchangeAmount } from '../../utils/currency';

describe('Currency Utility Functions', () => {
  describe('formatCurrency', () => {
    test('formats regular numbers correctly', () => {
      expect(formatCurrency(1234.5678)).toBe('1234.5678');
      expect(formatCurrency(1.2)).toBe('1.2');
      expect(formatCurrency(1.0)).toBe('1');
    });

    test('handles zero correctly', () => {
      expect(formatCurrency(0)).toBe('0.0000e+0');
    });

    test('handles very small numbers with exponential notation', () => {
      expect(formatCurrency(0.0000001)).toBe('1.0000e-7');
    });

    test('handles empty or invalid inputs', () => {
      expect(formatCurrency('')).toBe('');
      expect(formatCurrency(null)).toBe('');
      expect(formatCurrency(undefined)).toBe('');
      expect(formatCurrency('not a number')).toBe('');
    });
  });

  describe('calculateExchangeAmount', () => {
    const mockTokenPrices = {
      BTC: { price: 50000 },
      ETH: { price: 3000 },
      USDC: { price: 1 },
    };

    test('calculates exchange amount correctly', () => {
      const fromToken = { symbol: 'BTC', price: 50000 };
      const toToken = { symbol: 'ETH', price: 3000 };
      const amount = '3';
      
      // 2 BTC = (3 * 50000/3000) ETH = 50 ETH
      expect(calculateExchangeAmount(fromToken, toToken, amount, mockTokenPrices)).toBe(50);
    });

    test('returns null for missing tokens', () => {
      expect(calculateExchangeAmount(null, { price: 3000 }, '1', mockTokenPrices)).toBeNull();
      expect(calculateExchangeAmount({ price: 50000 }, null, '1', mockTokenPrices)).toBeNull();
    });

    test('returns null for invalid amount', () => {
      const fromToken = { price: 50000 };
      const toToken = { price: 3000 };
      
      expect(calculateExchangeAmount(fromToken, toToken, '', mockTokenPrices)).toBeNull();
      expect(calculateExchangeAmount(fromToken, toToken, 'abc', mockTokenPrices)).toBeNull();
    });

    test('returns null for missing prices', () => {
      const fromToken = { symbol: 'BTC' }; // no price
      const toToken = { symbol: 'ETH', price: 3000 };
      
      expect(calculateExchangeAmount(fromToken, toToken, '1', mockTokenPrices)).toBeNull();
    });
  });
});