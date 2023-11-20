errors = {
  INVALID_REQUEST: {
    status: 400,
    message: "Invalid request data",
  },
  NOT_FOUND: {
    status: 404,
    message: "Resource not found",
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "An error has occurred on the server.",
  },
  ROUTER_ERROR: {
    status: 500,
    message: "Router Not Found",
  },
};

module.exports = { errors };
