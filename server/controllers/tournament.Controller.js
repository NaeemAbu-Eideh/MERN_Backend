const Tournament = require('../models/Tournament.model');

const createTournament = async (req, res) => {
   try {
       const tournament = await  Tournament.create(req.body);
       res.json(tournament);
   }catch(err) {
       if(res.name === "ValidationError") {
           return res.status(400).json({error: err.error});
       }
       res.json(err);
   }
}

const getAllTournaments = async (req, res) => {
    try{
        const tournaments = await Tournament.find();
        res.json(tournaments);
    }catch(err){
        res.json(err);
    }
}

const getSingleTournament = async (req, res) => {
    try{
        const tournament = Tournament.find({ _id: req.params._id });
        res.json(tournament);
    }catch(err){
        res.json(err);
    }
}

const updateTournament = async (req, res) => {
    try{
        const tournament = Tournament.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });
        res.json(tournament);
    }catch(err){
        if(res.name === "ValidationError") {
            return res.status(400).json({error: err.error});
        }
        res.json(err);
    }
}

const deleteAnExistingTournament = async (req, res) => {
    try{
        const tournament = await Tournament.deleteOne({ _id: req.params.id });
        res.json(tournament);
    }catch(err){
        res.json(err);
    }
}

module.exports = { createTournament, getAllTournaments, updateTournament, getSingleTournament, deleteAnExistingTournament };