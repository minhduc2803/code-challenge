export const fetchTokenPrices = async () => {
  try {
    const response = await fetch('https://interview.switcheo.com/prices.json');
    if (!response.ok) {
      throw new Error('Failed to fetch token prices');
    }
    const data = await response.json();
      
    return data.reduce((acc, token) => {
      acc[token.currency] = {
        price: parseFloat(token.price),
        name: token.currency,
        date: token.date,
      };
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching token prices:', error);
    throw error;
  }
};