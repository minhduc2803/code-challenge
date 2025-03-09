import db from '../config/db.config';
import { ApiError } from '../utils/error.utils';

export interface Book {
  id?: number;
  title: string;
  author: string;
  publish_year?: number;
  genre?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface BookFilters {
  title?: string;
  author?: string;
  genre?: string;
}

export class BookModel {
  /**
   * Create a new book
   */
  static async create(book: Book): Promise<Book> {
    const { title, author, publish_year, genre } = book;

    const query = `
      INSERT INTO books (title, author, publish_year, genre)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await db.query(query, [
      title,
      author,
      publish_year || null,
      genre || null
    ]);

    return result.rows[0];
  }

  /**
   * Get all books with optional filters
   */
  static async findAll(filters: BookFilters = {}): Promise<Book[]> {
    let query = 'SELECT * FROM books';
    const params: any[] = [];
    const whereConditions: string[] = [];
    let paramIndex = 1;

    if (filters.title) {
      whereConditions.push(`title ILIKE $${paramIndex}`);
      params.push(`%${filters.title}%`);
      paramIndex++;
    }

    if (filters.author) {
      whereConditions.push(`author ILIKE $${paramIndex}`);
      params.push(`%${filters.author}%`);
      paramIndex++;
    }

    if (filters.genre) {
      whereConditions.push(`genre ILIKE $${paramIndex}`);
      params.push(`%${filters.genre}%`);
      paramIndex++;
    }

    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    return result.rows;
  }

  /**
   * Get a book by ID
   */
  static async findById(id: number): Promise<Book | null> {
    const query = 'SELECT * FROM books WHERE id = $1';
    const result = await db.query(query, [id]);

    return result.rows.length ? result.rows[0] : null;
  }

  /**
   * Update a book
   */
  static async update(id: number, bookData: Partial<Book>): Promise<Book | null> {
    // First check if book exists
    const existingBook = await this.findById(id);

    if (!existingBook) {
      return null;
    }

    // Build the SET part of the query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Only include fields that are provided in the update
    if (bookData.title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      values.push(bookData.title);
      paramIndex++;
    }

    if (bookData.author !== undefined) {
      updates.push(`author = $${paramIndex}`);
      values.push(bookData.author);
      paramIndex++;
    }

    if (bookData.publish_year !== undefined) {
      updates.push(`publish_year = $${paramIndex}`);
      values.push(bookData.publish_year);
      paramIndex++;
    }

    if (bookData.genre !== undefined) {
      updates.push(`genre = $${paramIndex}`);
      values.push(bookData.genre);
      paramIndex++;
    }

    // If no fields to update, return the existing book
    if (updates.length === 0) {
      return existingBook;
    }

    // Add the ID as the last parameter
    values.push(id);

    const query = `
      UPDATE books 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete a book
   */
  static async delete(id: number): Promise<boolean> {
    // First check if book exists
    const existingBook = await this.findById(id);

    if (!existingBook) {
      return false;
    }

    // Delete the book
    const query = 'DELETE FROM books WHERE id = $1';
    await db.query(query, [id]);
    return true;
  }
}
