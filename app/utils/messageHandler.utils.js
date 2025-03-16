module.exports = (req, res, next) => {
  res.jsonSuccess = (statusCode = 200, message, data, rest) => {
    return res.status(statusCode || 200).send({
      success: true,
      message,
      ...(data && { data }),
      ...(rest && { rest }),
    });
  };

  res.jsonFailed = (statusCode, message, errors) => {
    return res.status(statusCode || 500).send({
      success: false,
      message,
      ...(errors && { errors }),
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
