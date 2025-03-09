import app from './app';
import dotenv from 'dotenv';
import { AddressInfo } from 'net';

// Load environment variables
dotenv.config();

// Get port from environment variables or use default
const PORT = process.env.PORT || 3000;

// Start the server
const server = app.listen(PORT, () => {
  const address = server.address() as AddressInfo;
  console.log(`
    🚀 Server is running!
    🔉 Listening on port ${address.port}
    📭 API available at http://localhost:${address.port}/api/books
    🩺 Health check at http://localhost:${address.port}/health
  `);

  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string'
    ? 'Pipe ' + PORT
    : 'Port ' + PORT;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // For security reasons, it's generally better to crash and restart
  // when an uncaught exception occurs
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('SIGTERM/SIGINT received. Shutting down gracefully...');

  server.close(() => {
    console.log('HTTP server closed');

    // You could also close database connections here
    // db.end() or similar

    console.log('Process terminated');
    process.exit(0);
  });

  // Force close if graceful shutdown takes too long
  setTimeout(() => {
    console.error('Shutdown timed out, forcefully exiting...');
    process.exit(1);
  }, 10000);
}

export default server;
