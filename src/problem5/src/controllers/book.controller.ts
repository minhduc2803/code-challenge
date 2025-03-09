import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/book.service';
import { Book, BookFilters } from '../models/book.model';

/**
 * Create a new book
 * 
 * @route POST /api/books
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bookData: Book = req.body;
    const newBook = await BookService.createBook(bookData);

    res.status(201).json({
      status: 'success',
      data: newBook
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all books with optional filters
 * 
 * @route GET /api/books
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters: BookFilters = {
      title: req.query.title as string,
      author: req.query.author as string,
      genre: req.query.genre as string
    };

    const books = await BookService.getBooks(filters);

    res.status(200).json({
      status: 'success',
      results: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single book by ID
 * 
 * @route GET /api/books/:id
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const book = await BookService.getBookById(id);

    res.status(200).json({
      status: 'success',
      data: book
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a book
 * 
 * @route PUT /api/books/:id
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const bookData: Partial<Book> = req.body;
    const updatedBook = await BookService.updateBook(id, bookData);

    res.status(200).json({
      status: 'success',
      data: updatedBook
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a book
 * 
 * @route DELETE /api/books/:id
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    await BookService.deleteBook(id);

    res.status(200).json({
      status: 'success',
      message: 'Book deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
