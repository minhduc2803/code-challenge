import { Book, BookFilters, BookModel } from '../models/book.model';
import { ApiError } from '../utils/error.utils';

export class BookService {
  /**
   * Create a new book
   */
  static async createBook(bookData: Book): Promise<Book> {
    return await BookModel.create(bookData);
  }

  /**
   * Get all books with optional filters
   */
  static async getBooks(filters: BookFilters): Promise<Book[]> {
    return await BookModel.findAll(filters);
  }

  /**
   * Get a book by ID
   */
  static async getBookById(id: number): Promise<Book> {
    const book = await BookModel.findById(id);

    if (!book) {
      throw ApiError.notFound('Book not found');
    }

    return book;
  }

  /**
   * Update a book
   */
  static async updateBook(id: number, bookData: Partial<Book>): Promise<Book> {
    const updatedBook = await BookModel.update(id, bookData);

    if (!updatedBook) {
      throw ApiError.notFound('Book not found');
    }

    return updatedBook;
  }

  /**
   * Delete a book
   */
  static async deleteBook(id: number): Promise<void> {
    const deleted = await BookModel.delete(id);

    if (!deleted) {
      throw ApiError.notFound('Book not found');
    }
  }
}
