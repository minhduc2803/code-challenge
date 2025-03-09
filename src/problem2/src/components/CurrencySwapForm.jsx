import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import TokenSelector from './TokenSelector';
import { fetchTokenPrices } from '../services/api';
import { formatCurrency, calculateExchangeAmount } from '../utils/currency';
import styles from './CurrencySwapForm.module.css';

const CurrencySwapForm = () => {
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);

  const { data: tokenPrices, isLoading, isError } = useQuery('tokenPrices', fetchTokenPrices, {
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const availableTokens = tokenPrices ? 
    Object.keys(tokenPrices)
      .filter(symbol => tokenPrices[symbol] && tokenPrices[symbol].price)
      .map(symbol => ({
        symbol,
        price: tokenPrices[symbol].price,
        name: tokenPrices[symbol].name || symbol,
      }))
    : [];

  useEffect(() => {
    setError(null);
  }, [fromToken, toToken, amount]);

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const exchangeAmount = calculateExchangeAmount(fromToken, toToken, amount, tokenPrices);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading token prices...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.errorContainer}>
        <p>Error loading token prices. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <form>
        <div className={styles.formGroup}>
          <label htmlFor="fromCurrency" className={styles.label}>From</label>
          <div className={styles.inputContainer}>
            <div className={styles.tokenInputGroup}>
              <TokenSelector 
                selectedToken={fromToken}
                onSelectToken={setFromToken}
                tokens={availableTokens}
                otherSelected={toToken}
              />
              <div className={styles.amountInputWrapper}>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={styles.amountInput}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.swapButtonContainer}>
          <motion.button
            type="button"
            onClick={handleSwapTokens}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={styles.swapButton}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.swapIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </motion.button>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="toCurrency" className={styles.label}>To</label>
          <div className={styles.inputContainer}>
            <div className={styles.tokenInputGroup}>
              <TokenSelector 
                selectedToken={toToken}
                onSelectToken={setToToken}
                tokens={availableTokens}
                otherSelected={fromToken}
              />
              <div className={styles.amountInputWrapper}>
                <div className={styles.calculatedAmount}>
                  {exchangeAmount ? formatCurrency(exchangeAmount) : '0.00'}
                </div>
                {fromToken && toToken && amount && (
                  <p className={styles.exchangeRate}>
                    1 {fromToken.symbol} ≈ {formatCurrency(fromToken.price / toToken.price)} {toToken.symbol}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={styles.errorMessage}
            >
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default CurrencySwapForm;
