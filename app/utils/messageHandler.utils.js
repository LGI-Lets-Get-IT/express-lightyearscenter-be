module.exports = (req, res, next) => {
  res.jsonSuccess = (statusCode, message, data, rest) => {
    return res.status(statusCode).send({
      success: true,
      message,
      ...(data && { data }),
      ...(rest && { rest }),
    });
  };

  res.jsonFailed = (statusCode, message, error) => {
    return res.status(statusCode).send({
      success: false,
      message,
      ...(error && { error }),
    });
  };

  res.throwError = (code, message) => {
    const error = new Error();
    error.statusCode = code;
    error.message = message;
    throw error;
  };

  next();
};
