const { body } = require("express-validator");
const User = require("./../models/user.model")

const validateLogin = [
    body("email")
        .notEmpty().withMessage("email is required")
        .trim()
        .isEmail().withMessage("please enter a valid email")
        .normalizeEmail()
        .bail()
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (!user) throw new Error("Email does not exist");
            return true;
        }),

    body("password")
        .notEmpty().withMessage("password is required")
        .isLength({min:8}).withMessage("password must be at least 8 chars."),
];


module.exports = validateLogin;
