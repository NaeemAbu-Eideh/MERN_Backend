const router = require("express").Router();
const matchController = require("./../controllers/match.Controller");
const validateMatch = require("../validators/match.validator");



router.post("/api/creatematch", validateMatch, matchController.createMatch);

// router.post("/api/match/:id",  matchController.updateMatch);

router.get("/api/matches", matchController.findAllMatches);

router.get("/api/matches/:id", matchController.findOneMatch)

router.delete("/api/matches/:id", matchController.deleteMatch)

module.exports = router;

