module.exports = (req, res, next) => {
  res.jsonSuccess = (statusCode, message, data, rest) => {
    return res.status(statusCode).send({
      response: {
        code: "DC-00",
        message,
      },
      ...(data && { data }),
      ...(rest && { rest }),
    });
  };

  res.jsonFailed = (statusCode, code, message, error) => {
    return res.status(statusCode).send({
      response: {
        code,
        message,
        ...(error && { error }),
      },
    });
  };

  res.throwError = (code, message) => {
    const error = new Error();
    error.statusCode = code;
    error.code = `DC-${code}`;
    error.message = message;
    throw error;
  };

  next();
};
