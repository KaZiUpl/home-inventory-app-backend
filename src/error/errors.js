class BadRequestError extends Error {
  constructor(message = 'Something is wrong with the request.') {
    super(message);
    this.status = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message = 'You have to log in to access this resource.') {
    super(message);
    this.status = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message = 'You do not have permission to access this resource.') {
    super(message);
    this.status = 403;
  }
}

class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.status = 404;
  }
}

class UnprocessableEntityError extends Error {
  constructor(message = 'Unprocessable entity') {
    super(message);
    this.status = 422;
  }
}

class InternalServerError extends Error {
  constructor(message = 'Something went wrong.') {
    super(message);
    this.status = 500;
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
  UnprocessableEntityError,
  InternalServerError
};
