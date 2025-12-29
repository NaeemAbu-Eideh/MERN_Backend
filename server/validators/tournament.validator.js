const { body } = require("express-validator");
const mongoose = require("mongoose");

const validateTournament = [
    body("title")
        .notEmpty().withMessage("title is required")
        .isLength({ min: 3 }).withMessage("title must be at least 3 chars")
        .trim(),

    body("sportType")
        .notEmpty().withMessage("sportType is required")
        .isLength({ min: 2 }).withMessage("sportType must be at least 2 chars")
        .trim(),

    body("mode")
        .notEmpty().withMessage("mode is required")
        .isIn(["solo", "team", "both"]).withMessage("mode must be one of: solo, team, both"),

    body("startDate")
        .notEmpty().withMessage("startDate is required")
        .isISO8601().withMessage("startDate must be a valid date (ISO8601)")
        .toDate(),

    body("endDate")
        .notEmpty().withMessage("endDate is required")
        .isISO8601().withMessage("endDate must be a valid date (ISO8601)")
        .toDate()
        .custom((end, { req }) => {
            const start = req.body.startDate ? new Date(req.body.startDate) : null;
            if (start && new Date(end) < start) {
                throw new Error("endDate must be after startDate");
            }
            return true;
        }),

    body("status")
        .optional()
        .isIn(["draft", "open", "ongoing", "finished"])
        .withMessage("status must be one of: draft, open, ongoing, finished"),

    body("rules")
        .optional()
        .isString().withMessage("rules must be a string")
        .trim(),

    body("maxParticipants")
        .optional({ nullable: true })
        .isInt({ min: 1 }).withMessage("maxParticipants must be a positive number")
        .toInt(),

    body("maxTeams")
        .optional({ nullable: true })
        .isInt({ min: 1 }).withMessage("maxTeams must be a positive number")
        .toInt(),

    body("createdByAdminId")
        .notEmpty().withMessage("createdByAdminId is required")
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("createdByAdminId must be a valid ObjectId"),

    body("participantsUsers")
        .optional()
        .isArray().withMessage("participantsUsers must be an array")
        .custom((arr) => arr.every((id) => mongoose.Types.ObjectId.isValid(id)))
        .withMessage("participantsUsers must contain valid ObjectIds"),

    body("participantsTeams")
        .optional()
        .isArray().withMessage("participantsTeams must be an array")
        .custom((arr) => arr.every((id) => mongoose.Types.ObjectId.isValid(id)))
        .withMessage("participantsTeams must contain valid ObjectIds"),
];

module.exports = validateTournament;
