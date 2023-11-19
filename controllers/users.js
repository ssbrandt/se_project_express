const User = require("../models/user");

const getUsers = (req, res) => {
  //
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
      res.status(500).send({ message: "Error from createItem", e });
    });
};

module.exports = { getUsers, createUser };
