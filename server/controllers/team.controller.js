const Team = require("../models/team.model");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator")

const dedupeIds = (arr = []) => {
    const uniq = [...new Set(arr.map((id) => id.toString()))];
    return uniq.map((id) => new mongoose.Types.ObjectId(id));
};


const deleteTeam = async (req, res) => {
    try{
        const team = await Team.findByIdAndDelete({_id: req.params.id})
        res.json(team)
    }catch(err){
        res.json(err)
    }
}

const getMyTeams = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        const teams = await Team.find({
            $or: [{ ownerUserId: userId }, { members: userId }],
        }).select("_id name");

        return res.json({ data: teams });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

const createTeamsBulk = async (req, res) => {
    try {
        const teams = req.body; // لازم Array

        if (!Array.isArray(teams) || teams.length === 0) {
            return res.status(400).json({ message: "Body must be a non-empty array of teams" });
        }

        const cleaned = teams.map((t) => ({
            name: (t.name || "").trim(),
            ownerUserId: new mongoose.Types.ObjectId(t.ownerUserId),
            members: Array.isArray(t.members) ? dedupeIds(t.members) : []
        }));

        // ordered:false => لو فريق واحد فيه مشكلة ما يوقف الباقي
        const created = await Team.insertMany(cleaned, { ordered: false });

        return res.status(201).json({
            message: "Teams created successfully",
            count: created.length,
            teams: created
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ errors: err.errors });
        }
        return res.status(500).json(err);
    }
};

const createTeam = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.mapped() });
    }
    try {
        const body = req.body;

        const team = await Team.create({
            name: body.name,
            ownerUserId: body.ownerUserId,
            members: Array.isArray(body.members) ? dedupeIds(body.members) : []
        });

        res.json(team);
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ errors: err.errors });
        }
        res.json(err);
    }
};

const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find().select("_id");
            // .populate("ownerUserId", "firstName lastName")
            // .populate("members", "firstName lastName");

        res.json(teams);
    } catch (err) {
        res.json(err);
    }
};

const getSingleTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate("ownerUserId", "firstName lastName")
            .populate("members", "firstName lastName");

        res.json(team);
    } catch (err) {
        res.json(err);
    }
};

const updateTeam = async (req, res) => {
    try {
        const body = { ...req.body };

        if (body.members) {
            body.members = Array.isArray(body.members) ? dedupeIds(body.members) : [];
        }

        const team = await Team.findByIdAndUpdate(
            { _id: req.params.id },
            body,
            { new: true, runValidators: true }
        )
            .populate("ownerUserId", "firstName lastName")
            .populate("members", "firstName lastName");

        res.json(team);
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ errors: err.errors });
        }
        res.json(err);
    }
};

module.exports = {
    createTeam,
    getAllTeams,
    getSingleTeam,
    updateTeam,
    createTeamsBulk,
    getMyTeams,
    deleteTeam
};
