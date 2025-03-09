# Book API - Express.js TypeScript CRUD Application with PostgreSQL

This is a robust CRUD (Create, Read, Update, Delete) API for managing books. It's built with Express.js and TypeScript, using PostgreSQL as the database.

## Features

- Create a new book
- List all books with optional filters (title, author, genre)
- Get details of a specific book
- Update book details
- Delete a book

## Architecture

This application follows clean architecture principles:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Models**: Manage data access and manipulation
- **Middleware**: Handle validation and error processing
- **Routes**: Define API endpoints with validation rules

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

## Installation

### 1. Clone the repository:

git clone https://github.com/yourusername/book-api.git cd book-api

### 2. Install dependencies:

npm install

### 3. Set up environment variables:

cp .env.example .env

Edit the `.env` file to match your PostgreSQL configuration.

### 4. Initialize the database:

npm run init

### 5. Build the application:

npm run build

## Running the Application

### Development Mode

npm run dev

### Production Mode

npm start

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable in the `.env` file.

# Book API Endpoints

Here's a comprehensive list of all endpoints available in the Book API application:

## 1. Book Endpoints

| Method | Endpoint | Description | Request Body | Query Parameters | URL Parameters |
|--------|----------|-------------|--------------|------------------|----------------|
| `POST` | `/api/books` | Create a new book | `{ title, author, publish_year?, genre? }` | - | - |
| `GET` | `/api/books` | Get all books with optional filters | - | `title?`, `author?`, `genre?` | - |
| `GET` | `/api/books/:id` | Get a single book by ID | - | - | `id` (integer) |
| `PUT` | `/api/books/:id` | Update a book | `{ title?, author?, publish_year?, genre? }` | - | `id` (integer) |
| `DELETE` | `/api/books/:id` | Delete a book | - | - | `id` (integer) |

## 2. Health Check Endpoint

| Method | Endpoint | Description | Request Body | Query Parameters | URL Parameters |
|--------|----------|-------------|--------------|------------------|----------------|
| `GET` | `/health` | Check API health status | - | - | - |

## Detailed Endpoint Information

### 1. Create a Book

- **URL**: `/api/books`
- **Method**: `POST`
- **Description**: Creates a new book in the database
- **Request Body**:
  ```json
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "publish_year": 1925,
    "genre": "Classic"
  }
  ```
- **Required Fields**: `title`, `author`
- **Optional Fields**: `publish_year`, `genre`
- **Response**: 201 Created
  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "publish_year": 1925,
      "genre": "Classic",
      "created_at": "2023-04-12T15:30:45.123Z",
      "updated_at": "2023-04-12T15:30:45.123Z"
    }
  }
  ```

### 2. Get All Books

- **URL**: `/api/books`
- **Method**: `GET`
- **Description**: Retrieves all books, with optional filtering
- **Query Parameters**:
  - `title`: Filter books by title (case-insensitive, partial match)
  - `author`: Filter books by author (case-insensitive, partial match)
  - `genre`: Filter books by genre (case-insensitive, partial match)
- **Example**: `/api/books?author=tolkien&genre=fantasy`
- **Response**: 200 OK
  ```json
  {
    "status": "success",
    "results": 1,
    "data": [
      {
        "id": 5,
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "publish_year": 1937,
        "genre": "Fantasy",
        "created_at": "2023-04-12T15:30:45.123Z",
        "updated_at": "2023-04-12T15:30:45.123Z"
      }
    ]
  }
  ```

### 3. Get a Book by ID

- **URL**: `/api/books/:id`
- **Method**: `GET`
- **Description**: Retrieves a single book by its ID
- **URL Parameters**:
  - `id`: The ID of the book to retrieve (integer)
- **Example**: `/api/books/5`
- **Response**: 200 OK
  ```json
  {
    "status": "success",
    "data": {
      "id": 5,
      "title": "The Hobbit",
      "author": "J.R.R. Tolkien",
      "publish_year": 1937,
      "genre": "Fantasy",
      "created_at": "2023-04-12T15:30:45.123Z",
      "updated_at": "2023-04-12T15:30:45.123Z"
    }
  }
  ```
- **Error Response**: 404 Not Found
  ```json
  {
    "status": "error",
    "message": "Book not found"
  }
  ```

### 4. Update a Book

- **URL**: `/api/books/:id`
- **Method**: `PUT`
- **Description**: Updates an existing book
- **URL Parameters**:
  - `id`: The ID of the book to update (integer)
- **Request Body** (all fields optional):
  ```json
  {
    "title": "Updated Title",
    "author": "Updated Author",
    "publish_year": 2023,
    "genre": "Updated Genre"
  }
  ```
- **Example**: `/api/books/5`
- **Response**: 200 OK
  ```json
  {
    "status": "success",
    "data": {
      "id": 5,
      "title": "Updated Title",
      "author": "Updated Author",
      "publish_year": 2023,
      "genre": "Updated Genre",
      "created_at": "2023-04-12T15:30:45.123Z",
      "updated_at": "2023-04-12T16:45:12.789Z"
    }
  }
  ```
- **Error Response**: 404 Not Found
  ```json
  {
    "status": "error",
    "message": "Book not found"
  }
  ```

### 5. Delete a Book

- **URL**: `/api/books/:id`
- **Method**: `DELETE`
- **Description**: Deletes a book from the database
- **URL Parameters**:
  - `id`: The ID of the book to delete (integer)
- **Example**: `/api/books/5`
- **Response**: 200 OK
  ```json
  {
    "status": "success",
    "message": "Book deleted successfully"
  }
  ```
- **Error Response**: 404 Not Found
  ```json
  {
    "status": "error",
    "message": "Book not found"
  }
  ```

### 6. Health Check

- **URL**: `/health`
- **Method**: `GET`
- **Description**: Checks the health status of the API
- **Response**: 200 OK
  ```json
  {
    "status": "ok",
    "timestamp": "2023-04-12T16:45:12.789Z",
    "uptime": 3600
  }
  ```

## Validation Errors

All endpoints that accept input (POST, PUT) validate the data and return a 400 Bad Request response if validation fails:

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "publish_year",
      "message": "Publish year must be a valid year"
    }
  ]
}
```

## Not Found Error

If you try to access a non-existent endpoint:

```json
{
  "status": "error",
  "message": "Route /api/nonexistent not found"
}
```

These endpoints provide a complete CRUD interface for managing books in the database, with proper validation, error handling, and consistent response formats.