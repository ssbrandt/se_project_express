const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItems");

//Create

router.post("/", createItem);
router.get("/", getItems);
router.delete("/:itemId", deleteItem);

module.exports = router;
