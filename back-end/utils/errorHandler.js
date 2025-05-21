// Custom Error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Development mode: Trả về lỗi chi tiết
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } 
  // Production mode: Chỉ trả về thông báo lỗi
  else {
    // Lỗi operational (lỗi có thể dự đoán được)
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message
      });
    } 
    // Lỗi programming hoặc lỗi không xác định
    else {
      console.error('ERROR 💥', err);
      res.status(500).json({
        success: false,
        status: 'error',
        message: 'Đã xảy ra lỗi! Vui lòng thử lại sau.'
      });
    }
  }
};

// Catch async errors
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Handle MongoDB errors
export const handleMongoErrors = (err) => {
  let error = { ...err };
  error.message = err.message;

  // Lỗi duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Giá trị ${field} đã tồn tại. Vui lòng sử dụng giá trị khác.`;
    return new AppError(message, 400);
  }

  // Lỗi validation
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Dữ liệu không hợp lệ. ${errors.join('. ')}`;
    return new AppError(message, 400);
  }

  // Lỗi Cast Error (invalid ID)
  if (err.name === 'CastError') {
    const message = `Không tìm thấy dữ liệu với ID: ${err.value}`;
    return new AppError(message, 404);
  }

  return error;
};

// Handle JWT errors
export const handleJWTErrors = (err) => {
  if (err.name === 'JsonWebTokenError') {
    return new AppError('Token không hợp lệ. Vui lòng đăng nhập lại!', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return new AppError('Token đã hết hạn. Vui lòng đăng nhập lại!', 401);
  }
  return err;
};

// Handle file upload errors
export const handleFileUploadErrors = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn!', 400);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Số lượng file vượt quá giới hạn cho phép!', 400);
  }
  return err;
};

// Handle rate limit errors
export const handleRateLimitErrors = (err) => {
  if (err.type === 'RateLimitExceeded') {
    return new AppError('Quá nhiều yêu cầu từ IP này. Vui lòng thử lại sau!', 429);
  }
  return err;
};

// Global error handler
export const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Xử lý các loại lỗi cụ thể
  if (err.name === 'MongoError') error = handleMongoErrors(err);
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    error = handleJWTErrors(err);
  }
  if (err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = handleFileUploadErrors(err);
  }
  if (err.type === 'RateLimitExceeded') {
    error = handleRateLimitErrors(err);
  }

  // Gọi error handler middleware
  errorHandler(error, req, res, next);
}; 