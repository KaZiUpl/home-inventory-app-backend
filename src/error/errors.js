class HTTPError extends Error {
  constructor(message, statusCode, body) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    if (typeof body === 'string') {
      this.body = { message: body };
    } else {
      this.body = body;
    }
    this.status = statusCode;
  }
}

class BadRequestError extends HTTPError {
  constructor(
    body = { message: 'Something is wrong with your request' },
    errorMessage = 'Something went wrong'
  ) {
    super(typeof body === 'string' ? body : errorMessage, 400, body);
  }
}

class UnauthorizedError extends HTTPError {
  constructor(
    body = { message: 'You have to log in to access this resource' },
    errorMessage = 'User unauthorized'
  ) {
    super(typeof body === 'string' ? body : errorMessage, 401, body);
  }
}

class ForbiddenError extends HTTPError {
  constructor(
    body = { message: 'You do not have permission to access this resource' },
    errorMessage = 'Access to a resource denied'
  ) {
    super(typeof body === 'string' ? body : errorMessage, 403, body);
  }
}

class NotFoundError extends HTTPError {
  constructor(
    body = { message: 'Resource not found' },
    errorMessage = 'Entity not found'
  ) {
    super(typeof body === 'string' ? body : errorMessage, 404, body);
  }
}

class UnprocessableEntityError extends HTTPError {
  constructor(
    body = { message: 'Unprocessable entity' },
    errorMessage = 'Invalid request body format'
  ) {
    super(typeof body === 'string' ? body : errorMessage, 422, body);
  }
}

class InternalServerError extends HTTPError {
  constructor(
    body = { message: 'Something went wrong' },
    errorMessage = 'Something went wrong'
  ) {
    super(typeof body === 'string' ? body : errorMessage, 500, body);
  }
}

module.exports = {
  HTTPError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
  UnprocessableEntityError,
  InternalServerError
};
