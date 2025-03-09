// Mock API service
export const fetchTokenPrices = jest.fn().mockResolvedValue({
  BTC: {
    price: 50000,
    name: 'Bitcoin',
    date: '2023-09-01T00:00:00Z',
  },
  ETH: {
    price: 3000,
    name: 'Ethereum',
    date: '2023-09-01T00:00:00Z',
  },
  SWTH: {
    price: 0.015,
    name: 'Switcheo',
    date: '2023-09-01T00:00:00Z',
  },
  USDC: {
    price: 1,
    name: 'USD Coin',
    date: '2023-09-01T00:00:00Z',
  },
});