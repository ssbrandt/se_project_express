const User = require("../models/user");
const { errors } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ users });
    })
    .catch((e) => {
      console.error(e);
      const error = errors.INTERNAL_SERVER_ERROR;
      res.status(error.status).send({ message: error.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "CastError") {
        const error = errors.INVALID_REQUEST;
        console.log(errors.INVALID_REQUEST);
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

  const { name, avatar, email } = req.body;

  bcrypt.hash(req.body.password, 10),
    then((hash) =>
      User.create({ name, avatar, email, password: hash })
        .then((user) => {
          console.log(user);

          res.send({ data: user });
        })
        .catch((e) => {
          console.error(e);

          if (e.name === "ValidationError") {
            const error = errors.INVALID_REQUEST;
            res.status(error.status).send({ message: error.message });
          } else if (e.name === "CastError") {
            const error = errors.NOT_FOUND;
            res.status(error.status).send({ message: error.message });
          } else if (errors.code === 11000) {
            const error = errors.CONFLICT_ERROR;
            res.status(error.status).send({ message: error.message });
          } else {
            const error = errors.INTERNAL_SERVER_ERROR;
            res.status(error.status).send({ message: error.message });
          }
        }),
    );
};

const login = (req, res) => {
  const { email, password } = req.body;
  //to complete

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((e) => {
      const error = errors.NOT_FOUND;
      res.status(error.status).send({ message: error.message });
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  if (avatar && !validator.isURL(avatar)) {
    return res.status(400).send({ message: "invalid URL " });
  }

  return User.findByIdAndUpdate(
    userId,
    { $set: { name, avatar } },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      console.error(e);

      if (e.name === "ValidationError") {
        const error = errors.INVALID_REQUEST;
        res.status(error.status).send({ message: error.message });
      } else if (e.name === "CastError") {
        const error = errors.NOT_FOUND;
        res.status(error.status).send({ message: error.message });
      } else if (errors.code === 11000) {
        const error = errors.CONFLICT_ERROR;
        res.status(error.status).send({ message: error.message });
      } else {
        const error = errors.INTERNAL_SERVER_ERROR;
        res.status(error.status).send({ message: error.message });
      }
    });
};

module.exports = { getUsers, getUser, createUser, login, updateUser };
