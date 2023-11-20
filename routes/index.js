const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");

router.use("/items", clothingItem);
router.use("/users", user);

router.use((req, res) => {
  const error = errors.ROUTER_ERROR;
  //come back and fix this
  res.status(500).send({ message: "Router Not Found" });
});

module.exports = router;
