import { Request, Response } from 'express';
import * as bookController from '../book.controller';
import { ApiError } from '../../utils/error.utils';
import dbMock from '../../config/db.config';

// Mock the database module
jest.mock('../../config/db.config', () => {
  return {
    query: jest.fn(),
    getClient: jest.fn()
  };
});

describe('Book Controller Integration Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('createBook', () => {
    it('should create a book and return 201 status', async () => {
      // Mock request data
      const bookData = {
        title: 'Test Book',
        author: 'Test Author',
        publish_year: 2023,
        genre: 'Test Genre'
      };
      
      mockRequest.body = bookData;
      
      // Mock database response for the insert query
      (dbMock.query as jest.Mock).mockResolvedValueOnce({
        rows: [{
          id: 1,
          ...bookData,
          created_at: new Date(),
          updated_at: new Date()
        }]
      });
      
      // Call the controller
      await bookController.createBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Verify that the database was called with the correct query
      expect(dbMock.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO books'),
        expect.arrayContaining([
          bookData.title,
          bookData.author,
          bookData.publish_year,
          bookData.genre
        ])
      );
      
      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: expect.objectContaining({
          id: 1,
          title: bookData.title,
          author: bookData.author
        })
      });
    });

    it('should call next with error when database operation fails', async () => {
      // Mock request data
      mockRequest.body = {
        title: 'Test Book',
        author: 'Test Author'
      };
      
      // Mock database error
      const dbError = new Error('Database error');
      (dbMock.query as jest.Mock).mockRejectedValueOnce(dbError);
      
      // Call the controller
      await bookController.createBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Verify error handling
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('getBooks', () => {
    it('should return books and 200 status', async () => {
      // Mock request query
      mockRequest.query = { title: 'Test' };
      
      // Mock database response
      const books = [
        { 
          id: 1, 
          title: 'Test Book 1', 
          author: 'Author 1',
          publish_year: 2021,
          genre: 'Fiction',
          created_at: new Date(),
          updated_at: new Date()
        },
        { 
          id: 2, 
          title: 'Test Book 2', 
          author: 'Author 2',
          publish_year: 2022,
          genre: 'Non-Fiction',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];
      
      (dbMock.query as jest.Mock).mockResolvedValueOnce({ rows: books });
      
      // Call the controller
      await bookController.getBooks(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Verify database was called with correct query
      expect(dbMock.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM books'),
        expect.arrayContaining(['%Test%'])
      );
      
      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        results: 2,
        data: books
      });
    });

    it('should return empty array when no books match filters', async () => {
      // Mock request query
      mockRequest.query = { title: 'NonExistent' };
      
      // Mock empty database response
      (dbMock.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      
      // Call the controller
      await bookController.getBooks(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        results: 0,
        data: []
      });
    });
  });

  describe('getBookById', () => {
    it('should return a book and 200 status when found', async () => {
      // Mock request params
      const bookId = 1;
      mockRequest.params = { id: bookId.toString() };
      
      // Mock database response
      const book = { 
        id: bookId, 
        title: 'Test Book', 
        author: 'Test Author',
        publish_year: 2023,
        genre: 'Test Genre',
        created_at: new Date(),
        updated_at: new Date()
      };
      
      (dbMock.query as jest.Mock).mockResolvedValueOnce({ rows: [book] });
      
      // Call the controller
      await bookController.getBookById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Verify database was called with correct query
      expect(dbMock.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM books WHERE id = $1'),
        [bookId]
      );
      
      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: book
      });
    });

    it('should call next with ApiError when book not found', async () => {
      // Mock request params
      mockRequest.params = { id: '999' };
      
      // Mock empty database response
      (dbMock.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      
      // Call the controller
      await bookController.getBookById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Verify error handling
      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
      expect(mockNext.mock.calls[0][0].message).toBe('Book not found');
    });
  });

  describe('updateBook', () => {
    it('should update a book and return 200 status', async () => {
      // Mock request data
      const bookId = 1;
      const updateData = { title: 'Updated Title', genre: 'Updated Genre' };
      
      mockRequest.params = { id: bookId.toString() };
      mockRequest.body = updateData;
      
      // Mock database responses
      // First for the findById check
      const existingBook = { 
        id: bookId, 
        title: 'Old Title', 
        author: 'Test Author',
        publish_year: 2023,
        genre: 'Old Genre',
        created_at: new Date(),
        updated_at: new Date()
      };
      
      (dbMock.query as jest.Mock).mockResolvedValueOnce({ rows: [existingBook] });
      
      // Then for the update operation
      const updatedBook = { 
        ...existingBook,
        title: updateData.title,
        genre: updateData.genre,
        updated_at: new Date()
      };
      
      (dbMock.query as jest.Mock).mockResolvedValueOnce({ rows: [updatedBook] });
      
      // Call the controller
      await bookController.updateBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Verify database was called with correct queries
      expect(dbMock.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('SELECT * FROM books WHERE id = $1'),
        [bookId]
      );
      
      expect(dbMock.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('UPDATE books'),
        expect.arrayContaining([updateData.title, updateData.genre, bookId])
      );
      
      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: updatedBook
      });
    });

    it('should call next with ApiError when book not found', async () => {
      // Mock request data
      mockRequest.params = { id: '999' };
      mockRequest.body = { title: 'Updated Title' };
      
      // Mock empty database response
      (dbMock.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      
      // Call the controller
      await bookController.updateBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Verify error handling
      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
    });
  });

  describe('deleteBook', () => {
    it('should delete a book and return 200 status', async () => {
      // Mock request params
      const bookId = 1;
      mockRequest.params = { id: bookId.toString() };
      
      // Mock database responses
      // First for the findById check
      const existingBook = { 
        id: bookId, 
        title: 'Test Book', 
        author: 'Test Author'
      };
      
      (dbMock.query as jest.Mock).mockResolvedValueOnce({ rows: [existingBook] });
      
      // Then for the delete operation
      (dbMock.query as jest.Mock).mockResolvedValueOnce({ rowCount: 1 });
      
      // Call the controller
      await bookController.deleteBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Verify database was called with correct queries
      expect(dbMock.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('SELECT * FROM books WHERE id = $1'),
        [bookId]
      );
      
      expect(dbMock.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('DELETE FROM books WHERE id = $1'),
        [bookId]
      );
      
      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Book deleted successfully'
      });
    });

    it('should call next with ApiError when book not found', async () => {
      // Mock request params
      mockRequest.params = { id: '999' };
      
      // Mock empty database response
      (dbMock.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      
      // Call the controller
      await bookController.deleteBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Verify error handling
      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
    });
  });
});
