const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { errors } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    const error = errors.UNAUTHORIZED;
    return res.status(error.status).send({ message: error.message });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const error = errors.UNAUTHORIZED;
    return res.status(error.status).send({ message: error.message });
  }

  req.user = payload;
  return next();
};
