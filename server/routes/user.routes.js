const router = require("express").Router();
const UserController = require("./../controllers/user.controller");
const userValidator = require("../validators/user.validator");
const loginValidator = require("../validators/login.validator");


router.post("/api/createUser", userValidator, UserController.createUser);

router.post("/api/login", loginValidator, UserController.login);

router.get("/api/users", UserController.getAllUsers);

router.get("/api/users/:id", UserController.getUserById)

module.exports = router;

