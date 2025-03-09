// Format currency with 6 decimal places max
export const formatCurrency = (value) => {
  if (!value && value !== 0) return '';
    
  // Parse the value to a float
  const floatValue = parseFloat(value);
    
  // Handle NaN
  if (isNaN(floatValue)) return '';
    
  // For very small numbers, show more decimals
  if (Math.abs(floatValue) < 0.000001) {
    return floatValue.toExponential(4);
  }
    
  // For normal numbers, show up to 6 decimal places, trimming trailing zeros
  const formatted = floatValue.toFixed(6);
  return formatted.replace(/\.?0+$/, '');
};
  
// Calculate exchange amount based on token prices
export const calculateExchangeAmount = (fromToken, toToken, amount, tokenPrices) => {
  if (!fromToken || !toToken || !amount || isNaN(amount) || !tokenPrices) {
    return null;
  }
    
  const fromPrice = fromToken.price;
  const toPrice = toToken.price;
    
  if (!fromPrice || !toPrice) {
    return null;
  }
    
  // Calculate the exchange amount
  const exchangeRate = fromPrice / toPrice;
  return parseFloat(amount) * exchangeRate;
};