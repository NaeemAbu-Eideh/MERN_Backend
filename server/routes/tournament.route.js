const router = require("express").Router();
const TournamentController = require("./../controllers/tournament.Controller");
const userValidator = require("../validators/user.validator");
const loginValidator = require("../validators/login.validator");


router.post("/api/createtournament", userValidator, TournamentController.createTournament);

router.post("/api/tournament/:id", loginValidator, TournamentController.updateTournament);

router.get("/api/tournaments", TournamentController.getAllTournaments);

router.get("/api/tournaments/:id", TournamentController.getSingleTournament)

module.exports = router;

