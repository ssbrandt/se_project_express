const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");
const { createUser, login } = require("../controllers/users");
const { NotFoundError } = require("../utils/NotFoundError");
const {
  validateAuth,
  validateCreateUser,
} = require("../middleware/validation");

router.post("/signup", validateCreateUser, createUser);
router.post("/signin", validateAuth, login);
router.use("/items", clothingItem);
router.use("/users", user);

router.use((req, res, next) => {
  next(new NotFoundError("Not Found"));
});

module.exports = router;
