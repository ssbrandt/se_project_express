const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { errors } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "CastError") {
        const error = errors.INVALID_REQUEST;
        res.status(error.status).send({ message: error.message });
      } else if (e.name === "DocumentNotFoundError") {
        const error = errors.NOT_FOUND;
        res.status(error.status).send({ message: error.message });
      } else {
        const error = errors.INTERNAL_SERVER_ERROR;
        res.status(error.status).send({ message: error.message });
      }
    });
};

const createUser = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({ name, avatar, email, password: hash })
        .then((user) => {
          console.log(user);
          const userData = user.toObject();
          delete userData.password;

          res.send({ data: userData });
        })
        .catch((e) => {
          console.error(e);

          if (e.code === 11000) {
            const error = errors.CONFLICT_ERROR;
            res.status(error.status).send({ message: error.message });
          } else if (e.name === "ValidationError") {
            const error = errors.INVALID_REQUEST;
            res.status(error.status).send({ message: error.message });
          } else {
            const error = errors.INTERNAL_SERVER_ERROR;
            res.status(error.status).send({ message: error.message });
          }
        }),
    )
    .catch((e) => {
      console.error(e);

      if (e.code === 11000) {
        const error = errors.CONFLICT_ERROR;
        res.status(error.status).send({ message: error.message });
      } else if (e.name === "ValidationError") {
        const error = errors.INVALID_REQUEST;
        res.status(error.status).send({ message: error.message });
      } else {
        const error = errors.INTERNAL_SERVER_ERROR;
        res.status(error.status).send({ message: error.message });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((e) => {
      console.error(e);

      if (e.message === "Incorrect email or password") {
        const error = errors.UNAUTHORIZED;
        res.status(error.status).send({ message: error.message });
      } else {
        const error = errors.INTERNAL_SERVER_ERROR;
        res.status(error.status).send({ message: error.message });
      }
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      avatar: req.body.avatar,
    },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send({ user }))
    .catch((e) => {
      console.error(e);

      if (e.name === "ValidationError") {
        const error = errors.INVALID_REQUEST;
        res.status(error.status).send({ message: error.message });
      } else {
        const error = errors.INTERNAL_SERVER_ERROR;
        res.status(error.status).send({ message: error.message });
      }
    });
};

module.exports = { getUser, createUser, login, updateUser };
