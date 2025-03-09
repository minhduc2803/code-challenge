import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TokenSelector.module.css';

const TokenSelector = ({ selectedToken, onSelectToken, tokens, otherSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredTokens = tokens.filter(token => {
    const matchesSearch = token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (token.name && token.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const isNotOtherSelected = !otherSelected || token.symbol !== otherSelected.symbol;
    return matchesSearch && isNotOtherSelected;
  });

  const handleSelectToken = (token) => {
    onSelectToken(token);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      {selectedToken ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={styles.tokenButton}
        >
          <img 
            src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${selectedToken.symbol}.svg`}
            alt={selectedToken.symbol}
            className={styles.tokenIcon}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://via.placeholder.com/24/6D28D9/FFFFFF?text=${selectedToken.symbol.charAt(0)}`;
            }}
          />
          <span className={styles.tokenSymbol}>{selectedToken.symbol}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.dropdownIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={styles.tokenButton}
        >
          <span className={styles.placeholderText}>Select Token</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.dropdownIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={styles.dropdown}
          >
            <div className={styles.searchContainer}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tokens..."
                className={styles.searchInput}
              />
            </div>
            <div className={styles.tokenList}>
              {filteredTokens.length > 0 ? (
                filteredTokens.map((token) => (
                  <button
                    key={token.symbol}
                    type="button"
                    onClick={() => handleSelectToken(token)}
                    className={styles.tokenOption}
                  >
                    <img 
                      src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token.symbol}.svg`}
                      alt={token.symbol}
                      className={styles.tokenOptionIcon}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/32/6D28D9/FFFFFF?text=${token.symbol.charAt(0)}`;
                      }}
                    />
                    <div className={styles.tokenInfo}>
                      <div className={styles.tokenOptionSymbol}>{token.symbol}</div>
                      <div className={styles.tokenName}>{token.name || token.symbol}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className={styles.noResults}>No tokens found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TokenSelector;
