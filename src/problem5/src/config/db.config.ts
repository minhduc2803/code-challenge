import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a new PostgreSQL connection pool
const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432'),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  // Maximum number of clients the pool should contain
  max: 20,
  // How long a client is allowed to remain idle before being closed
  idleTimeoutMillis: 30000,
  // How long to wait for a connection from the pool
  connectionTimeoutMillis: 2000,
});

// Test the database connection
pool.connect()
  .then(client => {
    console.log('Connected to PostgreSQL database');
    client.release();
  })
  .catch(err => {
    console.error('Error connecting to PostgreSQL database', err);
  });

export default {
  /**
   * Execute a SQL query with parameters
   */
  query: (text: string, params: any[] = []): Promise<any> => {
    return pool.query(text, params);
  },
  
  /**
   * Get a client from the pool for transactions
   */
  getClient: () => {
    return pool.connect();
  }
};
