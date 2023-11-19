const router = require("express").Router();
const { createItem, getItems } = require("../controllers/clothingItems");

//Create

router.post("/", createItem);
router.get("/", getItems);

module.exports = router;
