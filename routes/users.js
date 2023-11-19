const router = require("express").Router();

const { getUsers, getUser, createUser } = require("../controllers/users");

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:userId", getUser);

module.exports = router;
