const router = require("express").Router();
const stadiumController = require("./../controllers/stadium.Controller");
const userValidator = require("../validators/user.validator");
const loginValidator = require("../validators/login.validator");


router.post("/api/createstadium", userValidator, stadiumController.createStadium);

router.post("/api/stadium/:id", loginValidator, stadiumController.updateStadium);

router.get("/api/stadiums", stadiumController.findAllStadiums);

router.get("/api/stadiums/:id", stadiumController.findOneStadium)

module.exports = router;

