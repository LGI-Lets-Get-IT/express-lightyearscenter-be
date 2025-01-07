exports.CLIENT_RESPONSE = {
  NOT_AUTHORIZED: {
    code: 401,
    message: {
      indonesian: "Anda tidak memiliki akses",
      english: "You are not authorized",
    },
  },

  NOT_ALLOWED_ACTION: {
    code: 403,
    message: {
      indonesian: "Anda tidak berhak untuk melakukan tindakan ini",
      english: "You are not authorized to perform this action",
    },
  },

  NOT_LOGGED_IN: {
    code: 401,
    message: {
      indonesian: "Anda belum login",
      english: "You are not logged in",
    },
  },

  ALREADY_LOGGED_IN: {
    code: 403,
    message: {
      indonesian: "Anda sudah login",
      english: "You are already logged in",
    },
  },

  INVALID_TOKEN: {
    code: 404,
    message: {
      indonesian: "Token tidak valid",
      english: "Invalid token",
    },
  },

  NOT_FOUND: {
    code: 404,
    message: {
      indonesian: "Data tidak ditemukan",
      english: "Data not found",
    },
  },
};

exports.SERVER_RESPONSE = {
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: {
      indonesian: "Terjadi kesalahan pada server",
      english: "Internal server error",
    },
  },
};
