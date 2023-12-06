const router = require("express").Router();
const { getUser, updateUser } = require("../controllers/users");
const auth = require("../middleware/auth");

router.use(auth);
router.get("/me", auth, getUser);
router.patch("/me", auth, updateUser);

module.exports = router;
