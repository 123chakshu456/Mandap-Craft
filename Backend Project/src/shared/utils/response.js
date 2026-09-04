/**
 * Standard Success Response envelope
 * @param {import('express').Response} res
 * @param {any} data
 * @param {string} [message]
 * @param {number} [statusCode=200]
 */
export const successResponse = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standard Error Response envelope
 * @param {import('express').Response} res
 * @param {string} [message='An error occurred']
 * @param {number} [statusCode=400]
 * @param {any} [errors]
 */
export const errorResponse = (res, message = 'An error occurred', statusCode = 400, errors = null) => {
  const payload = {
    success: false,
    message,
  };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};
