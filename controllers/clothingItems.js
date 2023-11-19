const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  console.log(req.body);

  const userId = req.user._id;
  console.log(userId);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: userId })
    .then((item) => {
      console.log(item);

      res.send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from createItem", e });
    });
};

//get

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
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
      res.status(500).send({ message: "error from deleteClothingItems", e });
    });
};

module.exports = { createItem, getItems, deleteItem };
