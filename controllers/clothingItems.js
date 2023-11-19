const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
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

//update

//delete

module.exports = { createItem, getItems };
