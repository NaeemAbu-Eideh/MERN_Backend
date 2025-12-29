const Tournament = require('../models/Tournament.model');
const { validationResult } = require("express-validator");


const createTournament = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    try {
        const tournament = await Tournament.create(req.body);
        return res.status(201).json(tournament);
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ errors: err.errors });
        }
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { createTournament };


const getAllTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find();
        res.json(tournaments);
    } catch (err) {
        res.json(err);
    }
}

const getSingleTournament = async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id).populate("createdByAdminId", "firstName lastName");
        res.json(tournament);
    } catch (err) {
        res.json(err);
    }
}

const updateTournament = async (req, res) => {
    try {
        const tournament = Tournament.findByIdAndUpdate({_id: req.params.id}, req.body, {
            new: true,
            runValidators: true
        });
        res.json(tournament);
    } catch (err) {
        if (res.name === "ValidationError") {
            return res.status(400).json({errors: err.errors});
        }
        res.json(err);
    }
}

const deleteAnExistingTournament = async (req, res) => {
    try {
        const tournament = await Tournament.deleteOne({_id: req.params.id});
        res.json(tournament);
    } catch (err) {
        res.json(err);
    }
}

module.exports = {
    createTournament,
    getAllTournaments,
    updateTournament,
    getSingleTournament,
    deleteAnExistingTournament
};