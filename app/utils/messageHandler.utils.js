const {
  INTERNAL_SERVER_ERROR,
} = require("../constants/httpStatusCode.constant");
const { SERVER_RESPONSE } = require("../constants/message.constant");

const messageHandler = {
  sendResponse: (res, outputJson) => {
    return res
      .status(outputJson.response?.code || INTERNAL_SERVER_ERROR)
      .send(outputJson);
  },

  jsonSuccess: ({ code, message }, data, rest) => {
    console.log("MESSAGE", message);
    return {
      response: {
        code: code || 200,
        message,
      },
      ...(data && { data }),
      // ...(rest ^&&)
    };
  },

  // jsonSuccess: (res, successCode, successMsg, data) => {
  //   return res.status(successCode).send({
  //     response: {
  //       code,
  //       message,
  //     },
  //     ...(data && data),
  //   });
  // },

  jsonFailed: ({ code, message }, error) => {
    return {
      response: {
        code: code || 500,
        message: message || SERVER_RESPONSE.INTERNAL_SERVER_ERROR,
        ...(error && error),
      },
    };
  },

  // jsonFailed: (res, error) => {
  //   return res.status(error.code || 500).send({
  //     error_response: {
  //       code: error.code || 500,
  //       message: error.message || "Internal Server Error",
  //     },
  //   });
  // },

  throwError: ({ code, message }) => {
    const error = new Error();
    error.code = code;
    error.message = message;

    throw error;
  },
};

module.exports = messageHandler;
