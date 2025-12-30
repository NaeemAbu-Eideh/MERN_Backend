const router = require("express").Router();
const TournamentController = require("./../controllers/tournament.Controller");
const validateTournament = require("../validators/tournament.validator");


router.post("/api/createTournament", validateTournament, TournamentController.createTournament);

router.put("/api/tournaments/:id", validateTournament, TournamentController.updateTournament);

router.get("/api/tournaments", TournamentController.getAllTournaments);

router.get("/api/tournaments/:id", TournamentController.getSingleTournament);

router.delete("/api/tournaments/:id", TournamentController.deleteAnExistingTournament);

module.exports = router;

