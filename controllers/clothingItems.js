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

// get

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      console.error(e);
      const error = errors.INTERNAL_SERVER_ERROR;
      res.status(error.status).send({ message: error.message });
    });
};

// delete
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => {
      res.send({ message: "Item Deleted" });
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

// like

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      console.log(item);

      res.send({ data: item });
    })
    .catch((e) => {
      console.error(e.name);
      if (e.name === "CastError") {
        const error = errors.INVALID_REQUEST;
        res.status(error.status).send({ message: error.message });
      } else if (e.name === "DocumentNotFoundError") {
        const error = errors.NOT_FOUND;
        res.status(error.status).send({ message: error.message });
      } else {
        const error = errors.INTERNAL_SERVER_ERROR;
        res.status(error.status).send({ message: error.message, e });
      }
    });
};

// unlike

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send({ data: item }))
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
        res.status(error.status).send({ message: error.message, e });
      }
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
