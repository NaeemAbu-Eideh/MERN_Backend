const router = require("express").Router();
const matchController = require("./../controllers/match.Controller");
const userValidator = require("../validators/user.validator");
const loginValidator = require("../validators/login.validator");


router.post("/api/creatematch", userValidator, matchController.createMatch);

router.post("/api/match/:id", loginValidator, matchController.updateMatch);

router.get("/api/matches", matchController.findAllMatches);

router.get("/api/matches/:id", matchController.findOneMatch)

module.exports = router;

