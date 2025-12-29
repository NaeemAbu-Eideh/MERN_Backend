const {body} = require("express-validator");
const User = require("../models/user.model")

const validateUser = [
        body("firstName")
            .notEmpty().withMessage("firstName is required")
            .isLength({min: 3}).withMessage("firstName must be at least 3 chars")
            .trim(),

        body("lastName")
            .notEmpty().withMessage("lastName is required")
            .isLength({min: 3}).withMessage("lastName must be at least 3 chars")
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

        body("password")
            .notEmpty().withMessage("password is required")
            .isLength({min: 8}).withMessage("password must be at least 8 chars"),

        body("confirmPassword")
            .notEmpty().withMessage("confirmPassword is required")
            .custom((value, {req}) => value === req.body.password)
            .withMessage("Passwords do not match"),

        body("role")
            .notEmpty().withMessage("role is required")
    ]
;

module.exports = validateUser;
