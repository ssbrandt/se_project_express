const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");
const errors = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", user);

router.use((req, res) => {
  const error = errors.NOT_FOUND;
  res.status(error.status).send({ message: error.message });
});

module.exports = router;
