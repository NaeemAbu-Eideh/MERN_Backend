const router = require("express").Router();
const stadiumController = require("./../controllers/stadium.Controller");
const validateStadium = require("../validators/stadium.validator");

// router.post("/api/stadiums/bulk", stadiumController.bulkCreateStadiums);

router.post("/api/createStadium", validateStadium, stadiumController.createStadium);

router.put("/api/stadiums/:id", validateStadium, stadiumController.updateStadium);

router.get("/api/stadiums", stadiumController.findAllStadiums);

router.get("/api/stadiums/:id", stadiumController.findOneStadium)

router.delete("/api/stadiums/:id", stadiumController.deleteStadium)

module.exports = router;

