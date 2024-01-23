const ClothingItem = require("../models/clothingItem");
const { errors } = require("../utils/errors");
const { BadRequestError } = require("../utils/BadRequestError");
const { ForbiddenError } = require("../utils/ForbiddenError");
const { NotFoundError } = require("../utils/NotFoundError");

const createItem = (req, res, next) => {
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);

      res.status(201).send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "ValidationError") {
        next(new BadRequestError("Invalid request data"));
      }
      next(e);
    });
};

// get

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      console.error(e);
      next(e);
    });
};

// delete
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const currentUser = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== currentUser) {
        throw new ForbiddenError("Unauthorized action");
      }

      return item.deleteOne().then(() => res.send({ message: "Item deleted" }));
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
        next(new BadRequestError("Invalid request data"));
      } else if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Document not found"));
      }
      next(e);
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
        next(new BadRequestError("Invalid request data"));
      } else if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Document not found"));
      }
      next(e);
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
