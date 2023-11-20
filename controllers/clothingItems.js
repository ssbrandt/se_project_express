const ClothingItem = require("../models/clothingItem");

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
      if (e.name === "ValidationError" || e.name === "CastError") {
        res.status(400).send({ message: "Invalid data input", e });
      } else {
        res.status(500).send({ message: "Error from createItem", e });
      }
    });
};

//get

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      console.error(e);
      res.status(500).send({ message: "error from getClothingItems", e });
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
        res.status(404).send({ message: "Item Not Found", e });
      } else {
        res.status(500).send({ message: "error from deleteClothingItems", e });
      }
    });
};

module.exports = { createItem, getItems, deleteItem };
