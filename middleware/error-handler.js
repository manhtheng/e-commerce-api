const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || 500,
    msg: err.message || 'some thing went wrong try again later'
  };

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
    customError.statusCode = 400;
  }

  if (err.name === 'CastError') {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.msg = `No item found with id: ${err.value}`;
  }
  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
  }

  return res.status(customError.statusCode).json({ err: err, msg: customError.msg })
};

module.exports = errorHandlerMiddleware;