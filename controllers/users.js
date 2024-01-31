const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { BadRequestError } = require("../utils/BadRequestError");
const { NotFoundError } = require("../utils/NotFoundError");
const { ConflictError } = require("../utils/ConflictError");
const { UnauthorizedError } = require("../utils/UnauthorizedError");

const getUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "CastError") {
        next(new BadRequestError("Invalid request data"));
      } else if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Document not found"));
      }
      next(e);
    });
};

const createUser = (req, res, next) => {
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
            next(new ConflictError("conflict error"));
          } else if (e.name === "ValidationError") {
            next(new BadRequestError("Invalid request data"));
          }
          next(e);
        }),
    )
    .catch((e) => {
      console.error(e);

      next(e);
    });
};

const login = (req, res, next) => {
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
        next(new UnauthorizedError("unauthorized"));
      }

      next(e);
    });
};

const updateUser = (req, res, next) => {
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
        next(new BadRequestError("Invalid request data"));
      }

      next(e);
    });
};

module.exports = { getUser, createUser, login, updateUser };
