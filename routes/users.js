const router = require("express").Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
} = require("../controllers/users");
const auth = require("../middleware/auth.js");

router.use(auth);
router.get("/me", auth, getUser);
router.patch("/me", auth, updateUser);

// router.post("/", createUser);
// router.get("/", getUsers);
// router.get("/:userId", getUser);

module.exports = router;
