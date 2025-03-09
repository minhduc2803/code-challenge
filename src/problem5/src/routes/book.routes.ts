import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
} from '../controllers/book.controller';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Create a new book
router.post('/', validate([
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('publish_year').optional().isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Publish year must be a valid year'),
  body('genre').optional().isString().withMessage('Genre must be a string')
]), createBook);

// Get all books with optional filters
router.get('/', validate([
  query('title').optional().isString().withMessage('Title filter must be a string'),
  query('author').optional().isString().withMessage('Author filter must be a string'),
  query('genre').optional().isString().withMessage('Genre filter must be a string')
]), getBooks);

// Get a single book by ID
router.get('/:id', validate([
  param('id').isInt().withMessage('ID must be an integer')
]), getBookById);

// Update a book
router.put('/:id', validate([
  param('id').isInt().withMessage('ID must be an integer'),
  body('title').optional().isString().withMessage('Title must be a string'),
  body('author').optional().isString().withMessage('Author must be a string'),
  body('publish_year').optional().isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Publish year must be a valid year'),
  body('genre').optional().isString().withMessage('Genre must be a string')
]), updateBook);

// Delete a book
router.delete('/:id', validate([
  param('id').isInt().withMessage('ID must be an integer')
]), deleteBook);

export default router;
