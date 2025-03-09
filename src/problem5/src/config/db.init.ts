// src/config/db.init.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
  console.log('Starting database initialization...');
  
  // Connect to postgres database first to create our application database
  const adminPool = new Pool({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || '5432'),
    database: 'postgres', // Connect to default database
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  });

  try {
    // Check if our target database exists
    const dbName = process.env.PGDATABASE || 'bookdb';
    const dbCheckResult = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    // Create database if it doesn't exist
    if (dbCheckResult.rows.length === 0) {
      console.log(`Database '${dbName}' does not exist, creating...`);
      
      // Make sure no other connections to the DB exist
      await adminPool.query(`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '${dbName}'
        AND pid <> pg_backend_pid();
      `).catch(() => {
        // Ignore errors if no connections exist
      });
      
      await adminPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database '${dbName}' created successfully`);
    } else {
      console.log(`Database '${dbName}' already exists`);
    }

    // Close admin connection
    await adminPool.end();
    console.log('Admin connection closed');

    // Now connect to the target database to create tables
    const appPool = new Pool({
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '5432'),
      database: dbName,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    });

    console.log('Connected to application database, setting up schema...');

    // Create books table
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        publish_year INTEGER,
        genre VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Books table created or already exists');

    // Create indexes
    await appPool.query(`
      CREATE INDEX IF NOT EXISTS idx_books_title ON books (title);
      CREATE INDEX IF NOT EXISTS idx_books_author ON books (author);
      CREATE INDEX IF NOT EXISTS idx_books_genre ON books (genre);
    `);
    console.log('Indexes created or already exist');

    // Create function for updating timestamps
    await appPool.query(`
      CREATE OR REPLACE FUNCTION update_modified_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('Timestamp update function created');

    // Create trigger
    await appPool.query(`
      DROP TRIGGER IF EXISTS update_books_updated_at ON books;
      
      CREATE TRIGGER update_books_updated_at
      BEFORE UPDATE ON books
      FOR EACH ROW
      EXECUTE FUNCTION update_modified_column();
    `);
    console.log('Timestamp update trigger created');

    // Insert sample data if the table is empty
    const count = await appPool.query('SELECT COUNT(*) FROM books');
    if (parseInt(count.rows[0].count) === 0) {
      console.log('Adding sample data...');
      await appPool.query(`
        INSERT INTO books (title, author, publish_year, genre)
        VALUES 
          ('To Kill a Mockingbird', 'Harper Lee', 1960, 'Classic'),
          ('1984', 'George Orwell', 1949, 'Dystopian'),
          ('The Great Gatsby', 'F. Scott Fitzgerald', 1925, 'Classic'),
          ('Pride and Prejudice', 'Jane Austen', 1813, 'Romance'),
          ('The Hobbit', 'J.R.R. Tolkien', 1937, 'Fantasy')
      `);
      console.log('Sample data added');
    } else {
      console.log('Database already contains data, skipping sample data insertion');
    }

    console.log('Database initialization completed successfully');
    await appPool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
