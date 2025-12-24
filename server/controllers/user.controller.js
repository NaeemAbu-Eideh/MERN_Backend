const User = require("./../models/user.model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    try {
        delete req.body.confirmPassword;

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await User.create({
            ...req.body,
            role: req.body.role || "user", // ✅ role
            password: hashedPassword,
        });

        return res.status(201).json({ success: true, userId: user._id });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

const login = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Incorrect email or password" });
        }

        const isCorrect = await bcrypt.compare(password, user.password);
        if (!isCorrect) {
            return res.status(401).json({ message: "Incorrect email or password" });
        }

        return res.json({
            success: true,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role, // ✅ role
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.json(error);
    }
};

const getUserById = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.json(error);
    }
};

module.exports = {createUser, getAllUsers, getUserById, login};
