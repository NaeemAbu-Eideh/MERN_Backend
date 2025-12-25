const router = require("express").Router();
const joinController = require("./../controllers/joinRequest.Controller");
const userValidator = require("../validators/user.validator");
const loginValidator = require("../validators/login.validator");


router.post("/api/creatjoin", userValidator, joinController.createJoin);

router.post("/api/join/:id", loginValidator, joinController.updateJoin);

router.get("/api/joins", joinController.findAllJoins);

router.get("/api/joins/:id", joinController.findOneJoin)

module.exports = router;

