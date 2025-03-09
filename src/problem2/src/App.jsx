import { QueryClient, QueryClientProvider } from 'react-query';
import CurrencySwapForm from './components/CurrencySwapForm.jsx';
import { motion } from 'framer-motion';
import styles from './App.module.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.formWrapper}
        >
          <div className={styles.card}>
            <div className={styles.header}>
              <h1 className={styles.title}>Currency Swap</h1>
            </div>
            <CurrencySwapForm />
          </div>
        </motion.div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
