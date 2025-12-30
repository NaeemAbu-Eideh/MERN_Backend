const router = require("express").Router();
const joinController = require("./../controllers/joinRequest.Controller");


router.post("/api/createjoin", joinController.createJoin);

router.get("/api/join-requests", joinController.getAllJoinRequests);

router.patch("/api/join-requests/:id/approve", joinController.approveJoinRequest);
router.patch("/api/join-requests/:id/reject", joinController.rejectJoinRequest);

router.post("/api/join/:id", joinController.updateJoin);

router.get("/api/joins", joinController.findAllJoins);

router.get("/api/joins/:id", joinController.findOneJoin)

// router.post("/api/tournaments/:id/join", TournamentController.joinTournament);

module.exports = router;

