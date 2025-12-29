const User = require("./../models/user.model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");


const bulkRegister = async (req, res) => {
    try {
        const users = req.body; // لازم تكون Array

        if (!Array.isArray(users) || users.length === 0) {
            return res.status(400).json({ message: "Body must be a non-empty array" });
        }

        // حضّر الداتا: احذف confirmPassword واعمل hash
        const prepared = await Promise.all(
            users.map(async (u) => {
                if (!u.email || !u.password) return null;

                const hashed = await bcrypt.hash(u.password, 10);

                return {
                    firstName: u.firstName,
                    lastName: u.lastName,
                    email: u.email.toLowerCase().trim(),
                    password: hashed,
                    role: u.role || "user"
                };
            })
        );

        const clean = prepared.filter(Boolean);

        // insertMany أسرع من create لكل واحد
        const created = await User.insertMany(clean, { ordered: false });
        return res.status(201).json({ count: created.length, users: created });
    } catch (err) {
        // لو في duplicates بالإيميل، ordered:false بخلي الباقي يكمل
        return res.status(500).json({ message: "Bulk insert error", error: err });
    }
};



const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }
    try {
        delete req.body.confirmPassword;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({...req.body, role: req.body.role || "user", password: hashedPassword,});
        res.status(201).json({ success: true, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
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
        res.json({success: true, user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }});
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.json(users)
    }catch (err) {
        res.json(err);
    }
}

getUserById = async (req, res) => {
    try{
        const user = await User.findById({ _id: req.params.id });
        res.json(user);
    } catch (error) {
        res.json(error);
    }
};

module.exports = {createUser, getAllUsers, getUserById, login, bulkRegister};