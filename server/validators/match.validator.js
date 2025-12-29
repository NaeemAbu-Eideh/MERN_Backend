const { body } = require("express-validator");
const mongoose = require("mongoose");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const validateMatch = [
    body("tournamentId")
        .notEmpty().withMessage("tournamentId is required")
        .custom(isValidObjectId).withMessage("tournamentId must be a valid ObjectId"),

    body("stadiumId")
        .optional({ nullable: true })
        .custom(isValidObjectId).withMessage("stadiumId must be a valid ObjectId"),

    body("teamAId")
        .notEmpty().withMessage("teamAId is required")
        .custom(isValidObjectId).withMessage("teamAId must be a valid ObjectId"),

    body("teamBId")
        .notEmpty().withMessage("teamBId is required")
        .custom(isValidObjectId).withMessage("teamBId must be a valid ObjectId")
        .custom((value, { req }) => {
            if (req.body.teamAId && value === req.body.teamAId) {
                throw new Error("teamBId must be different from teamAId");
            }
            return true;
        }),

    body("startTime")
        .notEmpty().withMessage("startTime is required")
        .isISO8601().withMessage("startTime must be a valid date (ISO8601)")
        .toDate(),

    body("endTime")
        .optional({ nullable: true })
        .isISO8601().withMessage("endTime must be a valid date (ISO8601)")
        .toDate()
        .custom((end, { req }) => {
            if (!end) return true;
            const start = req.body.startTime ? new Date(req.body.startTime) : null;
            if (start && new Date(end) < start) {
                throw new Error("endTime must be after startTime");
            }
            return true;
        }),

    body("status")
        .optional()
        .isIn(["scheduled", "ongoing", "finished", "cancelled"])
        .withMessage("status must be one of: scheduled, ongoing, finished, cancelled"),

    body("round")
        .optional({ nullable: true })
        .isString().withMessage("round must be a string")
        .trim(),

    body("scoreA")
        .optional({ nullable: true })
        .isInt({ min: 0 }).withMessage("scoreA must be a non-negative number")
        .toInt(),

    body("scoreB")
        .optional({ nullable: true })
        .isInt({ min: 0 }).withMessage("scoreB must be a non-negative number")
        .toInt(),
];

module.exports = validateMatch;
