const router = require("express").Router();
const stadiumController = require("./../controllers/stadium.Controller");
const validateStadium = require("../validators/stadium.validator");

// router.post("/api/stadiums/bulk", stadiumController.bulkCreateStadiums);

router.post("/api/createStadium", validateStadium, stadiumController.createStadium);

router.post("/api/stadium/:id", stadiumController.updateStadium);

router.get("/api/stadiums", stadiumController.findAllStadiums);

router.get("/api/stadiums/:id", stadiumController.findOneStadium)

module.exports = router;

