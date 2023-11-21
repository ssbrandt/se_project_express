const User = require("../models/user");
const { errors } = require("../utils/errors");

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

  const { name, avatar } = req.body;

  User.create({ name, avatar })
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
      } else {
        const error = errors.INTERNAL_SERVER_ERROR;
        res.status(error.status).send({ message: error.message });
      }
    });
};

module.exports = { getUsers, getUser, createUser };
