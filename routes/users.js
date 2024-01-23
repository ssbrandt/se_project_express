const router = require("express").Router();
const { getUser, updateUser } = require("../controllers/users");
const auth = require("../middleware/auth");
const { validateUserUpdate } = require("../middleware/validation");

router.use(auth);
router.get("/me", auth, getUser);
router.patch("/me", auth, validateUserUpdate, updateUser);

module.exports = router;
