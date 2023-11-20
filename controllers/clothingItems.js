const ClothingItem = require("../models/clothingItem");
const { errors } = require("../utils/errors");

const createItem = (req, res) => {
  const userId = req.user._id;

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: userId })
    .then((item) => {
      console.log(item);

      res.send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "ValidationError") {
        console.error(e);
        const error = errors.INVALID_REQUEST;
        res.status(error.status).send({ message: error.message });
      } else {
        console.error(e);
        const error = errors.INTERNAL_SERVER_ERROR;
        res.status(error.status).send({ message: error.message });
      }
    });
};

//get

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      console.error(e);
      const error = errors.INTERNAL_SERVER_ERROR;
      res.status(error.status).send({ message: error.message });
    });
};

//delete
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(204).send({});
    })
    .catch((e) => {
      console.error(e);
      if (e.name == "CastError") {
        const error = errors.NOT_FOUND;
        res.status(error.status).send({ message: error.message });
      } else {
        const error = errors.INTERNAL_SERVER_ERROR;
        res.status(error.status).send({ message: error.message });
      }
    });
};

module.exports = { createItem, getItems, deleteItem };
