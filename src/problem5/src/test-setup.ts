import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Mock console.log and console.error to reduce noise in tests
global.console.log = jest.fn();
global.console.error = jest.fn();

// Add global test teardown
afterAll(async () => {
  // Add any cleanup code here if needed
});