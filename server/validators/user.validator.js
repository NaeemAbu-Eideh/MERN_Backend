const {body} = require("express-validator");
const User = require("../models/user.model")

const validateUser = [
        body("firstName")
            .notEmpty().withMessage("firstName is required")
            .isLength({min: 2}).withMessage("firstName must be at least 2 chars")
            .trim(),

        body("lastName")
            .notEmpty().withMessage("lastName is required")
            .isLength({min: 2}).withMessage("lastName must be at least 2 chars")
            .trim(),

        body("email")
            .notEmpty().withMessage("email is required")
            .trim()
            .isEmail().withMessage("please enter a valid email")
            .normalizeEmail()
            .bail()
            .custom(async (value) => {
                const exists = await User.findOne({ email: value });
                if (exists) throw new Error("Email already exists");
                return true;
            }),

        body("dateOfBirth")
            .notEmpty().withMessage("dateOfBirth is required")
            .isISO8601().withMessage("dateOfBirth must be a valid date (YYYY-MM-DD)")
            .isBefore(new Date().toISOString().split("T")[0])
            .withMessage("dateOfBirth cannot be in the future")
            .toDate(),

        body("password")
            .notEmpty().withMessage("password is required")
            .isLength({min: 8}).withMessage("password must be at least 8 chars"),

        body("confirmPassword")
            .notEmpty().withMessage("confirmPassword is required")
            .custom((value, {req}) => value === req.body.password)
            .withMessage("Passwords do not match"),
    ]
;

module.exports = validateUser;
