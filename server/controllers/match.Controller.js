const Match = require('../models/Match.model');
const { validationResult } = require("express-validator");

const createMatch = async (req, res) => {
    try {
        const { tournamentId, stadiumId, startTime, endTime, teamAId, teamBId, status } = req.body;

        if (!tournamentId || !stadiumId || !startTime || !endTime || !teamAId || !teamBId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const match = await Match.create({
            tournamentId,
            stadiumId,
            startTime,
            endTime,
            sideA: { type: "team", refId: teamAId },
            sideB: { type: "team", refId: teamBId },
            status: status || "scheduled",
        });

        return res.status(201).json({ success: true, data: match });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const updateMatch = async (req, res) => {
    try{
        const match = await Match.findByIdAndUpdate({_id: req.params._id}, req.body, { new: true, runValidators: true });
        res.json(match);
    }catch(err){
        if(err.name === 'ValidationError'){
            return res.status(400).json({errors: err.errors});
        }
        res.json(err)
    }
}

const deleteMatch = async (req, res) => {
    try{
        const match = await Match.findByIdAndDelete({_id: req.params._id});
        res.json(match);
    }catch(err){
        res.json(err);
    }
}

const findOneMatch = async (req, res) => {
    try {
        const match = await Match.findById({_id: req.params._id});
        res.json(match);
    }catch (err){
        return res.json(err);
    }
}

const findAllMatches = async (req, res) => {
    try{
        const matches = await Match.find();
        res.json(matches);
    }catch(err){
        res.json(err);
    }
}

module.exports = { createMatch, updateMatch, deleteMatch, findOneMatch, findAllMatches };