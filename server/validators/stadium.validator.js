const { body } = require("express-validator");

const validateStadium = [
    body("name")
        .notEmpty().withMessage("name is required")
        .isLength({ min: 2 }).withMessage("name must be at least 2 chars")
        .trim(),

    body("city")
        .optional({ nullable: true })
        .isString().withMessage("city must be a string")
        .trim(),

    body("address")
        .optional({ nullable: true })
        .isString().withMessage("address must be a string")
        .trim(),

    body("mapLink")
        .optional({ nullable: true })
        .isString().withMessage("mapLink must be a string")
        .trim()
        .isURL().withMessage("mapLink must be a valid URL"),

    body("capacity")
        .optional({ nullable: true })
        .isInt({ min: 0 }).withMessage("capacity must be a non-negative number")
        .toInt(),

    body("facilities")
        .optional()
        .isArray().withMessage("facilities must be an array of strings")
        .custom((arr) => arr.every((x) => typeof x === "string"))
        .withMessage("facilities must contain only strings"),

    body("status")
        .optional()
        .isIn(["available", "unavailable"])
        .withMessage("status must be one of: available, unavailable"),
];

module.exports = validateStadium;
