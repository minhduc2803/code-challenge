export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  
  static badRequest(message: string = 'Bad Request'): ApiError {
    return new ApiError(400, message);
  }
  
  static notFound(message: string = 'Resource not found'): ApiError {
    return new ApiError(404, message);
  }
  
  static internal(message: string = 'Internal Server Error'): ApiError {
    return new ApiError(500, message);
  }
}
