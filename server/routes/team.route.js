const router = require("express").Router();
const TeamController = require("./../controllers/team.controller");
const validateTeam = require("../validators/team.validator");

router.get("/api/my-teams/:userId", TeamController.getMyTeams);

router.post("/api/createTeamsBulk", TeamController.createTeamsBulk);

router.post("/api/createTeam", validateTeam, TeamController.createTeam);

router.post("/api/team/:id", TeamController.updateTeam);

router.get("/api/teams", TeamController.getAllTeams);

router.get("/api/teams/:id", TeamController.getSingleTeam);

module.exports = router;
