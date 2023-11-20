const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((e) => {
      res.status(500).send({ message: "error from getUsers", e });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "CastError") {
        res.status(404).send({ message: "Item not found" });
      } else {
        res.status(500).send({ message: "error from get User" });
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
      if (e.name === "ValidationError" || e.name === "CastError") {
        res.status(400).send({ message: "Invalid data input", e });
      } else {
        res.status(500).send({ message: "Error from createItem", e });
      }
    });
};

module.exports = { getUsers, getUser, createUser };
