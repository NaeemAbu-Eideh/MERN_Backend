const { body } = require("express-validator");
const mongoose = require("mongoose");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const validateTeam = [
    body("name")
        .notEmpty().withMessage("name is required")
        .isLength({ min: 2 }).withMessage("name must be at least 2 chars")
        .trim(),

    body("ownerUserId")
        .notEmpty().withMessage("ownerUserId is required")
        .custom(isValidObjectId).withMessage("ownerUserId must be a valid ObjectId"),

    body("members")
        .optional()
        .isArray().withMessage("members must be an array")
        .custom((arr) => arr.every((id) => isValidObjectId(id)))
        .withMessage("members must contain valid ObjectIds"),

    body("members")
        .optional()
        .custom((arr) => {
            const ids = (arr || []).map((x) => String(x));
            const unique = new Set(ids);
            if (unique.size !== ids.length) throw new Error("members contains duplicate ids");
            return true;
        }),
];

module.exports = validateTeam;
