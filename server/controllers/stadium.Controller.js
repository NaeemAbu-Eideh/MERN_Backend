const Stadium = require('../models/Stadium.model');
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const bulkCreateStadiums = async (req, res) => {
    try {
        const stadiums = req.body; // لازم Array

        if (!Array.isArray(stadiums) || stadiums.length === 0) {
            return res.status(400).json({ message: "Body must be a non-empty array of stadiums" });
        }

        // تنضيف بسيط
        const cleaned = stadiums.map((s) => ({
            name: (s.name || "").trim(),
            city: (s.city || "").trim(),
            address: (s.address || "").trim(),
            mapLink: (s.mapLink || "").trim(),
            capacity: s.capacity ?? null,
            facilities: Array.isArray(s.facilities) ? s.facilities : [],
            status: s.status || "available",
        }));

        // ordered:false => إذا واحد غلط/مكرر ما يوقف الباقي
        const created = await Stadium.insertMany(cleaned, { ordered: false });

        return res.status(201).json({
            message: "Bulk stadiums created",
            count: created.length,
            stadiums: created,
        });
    } catch (err) {
        // لو في Validation errors/duplicates... رح يطلع هون
        return res.status(500).json({ message: "Bulk insert error", error: err });
    }
};

const createStadium = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }
    try{
        const stadium = await  Stadium.create(req.body);
        res.json(stadium);
    }catch(err){
        if(err.name === 'ValidationError'){
           return res.status(400).json({errors: err.errors});
        }
        res.json(err);
    }
}

const updateStadium = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid stadium id" });
        }

        const stadium = await Stadium.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!stadium) return res.status(404).json({ message: "Stadium not found" });

        return res.json({ data: stadium });
    } catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid stadium id" });
        if (err.name === "ValidationError") return res.status(422).json({ errors: err.errors });
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

const deleteStadium = async (req, res) => {
    try{
        const stadium = await Stadium.findByIdAndDelete({_id : req.params._id});
        res.json(stadium);
    }catch(err){
        res.json(err);
    }
}

const findOneStadium = async (req, res) => {
    try{
        const stadium = await Stadium.findById(req.params.id);
        res.json(stadium);
    }catch(err){
        res.json(err);
    }
}

const findAllStadiums = async (req, res) => {
    try{
        const stadiums = await Stadium.find();
        res.json(stadiums);
    }catch(err){
        res.json(err);
    }
}

module.exports = { findOneStadium, findAllStadiums, deleteStadium, updateStadium, createStadium , bulkCreateStadiums}