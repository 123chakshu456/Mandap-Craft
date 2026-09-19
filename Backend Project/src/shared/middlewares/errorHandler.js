export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  // Always log error stack in server logs
  console.error('❌ Server Error:', err.message || err);

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || undefined;

  // 1. Prisma Known Request Errors
  if (err.code === 'P2002') {
    // Unique constraint violation (e.g. duplicate email, slug, SKU)
    statusCode = 409;
    const targets = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
    message = `A record with this ${targets} already exists.`;
  } else if (err.code === 'P2025') {
    // Record not found during update/delete
    statusCode = 404;
    message = err.meta?.cause || 'The requested record was not found or has already been removed.';
  } else if (err.code === 'P2003') {
    // Foreign key constraint failed
    statusCode = 400;
    message = 'Invalid reference: Related resource does not exist or cannot be modified.';
  } else if (err.code === 'P2000') {
    // Value too long for column
    statusCode = 400;
    message = 'One or more input values exceeded allowable length constraints.';
  } else if (err.name === 'PrismaClientValidationError') {
    // Prisma schema validation error
    statusCode = 400;
    message = 'Invalid input parameters passed to database operation.';
  }

  // 2. JWT Authentication Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authorization token.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authorization token has expired. Please log in again.';
  }

  // 3. Multer File Upload Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      statusCode = 413;
      message = 'Uploaded file exceeds maximum size limit.';
    } else {
      statusCode = 400;
      message = `Upload error: ${err.message}`;
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && {
      code: err.code,
      stack: err.stack,
    }),
  });
};
