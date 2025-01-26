module.exports = (req, res, next) => {
  res.jsonSuccess = (statusCode, message, data, rest) => {
    console.log('MASUK SUCCESS')
    return res.status(statusCode).send({
      response: {
        success: true,
        message,
      },
      ...(data && { data }),
      ...(rest && { rest }),
    });
  };

  res.jsonFailed = (statusCode, message, error) => {
    console.log('MASUK FAILED')
    return res.status(statusCode).send({
      response: {
        success: false,
        message,
      },
      ...(error && { error }),
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
