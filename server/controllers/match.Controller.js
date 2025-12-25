const Match = require('../models/Match.model');

const createMatch = async (req, res) => {
    try{
        const match = await Match.create(req.body);
        res.json(match);
    }catch(err){
        if(err.name === 'ValidationError'){
            return res.status(400).json({errors: err.errors});
        }
        res.json(err)
    }
}

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