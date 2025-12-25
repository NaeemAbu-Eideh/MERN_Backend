const Join = require('../models/JoinRequest.model');

const createJoin = async (req, res) => {
    try{
        const join = await Join.create(req.body);
        res.json(join);
    }catch(err){
        if(err.name === 'ValidationError'){
            return res.status(400).json({error: err.errors});
        }
        res.json(err);
    }
}

const updateJoin = async (req, res) => {
    try{
        const join = await Join.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(join);
    }catch(err){
        if(err.name === 'ValidationError'){
            return res.status(400).json({error: err.errors});
        }
        res.json(err);
    }
}

const deleteJoin = async (req, res) => {
    try{
        const join = await Join.findByIdAndDelete({_id: req.params._id});
        res.json(join);
    }catch(err){
        res.json(err);
    }
}

const findAllJoins = async (req, res) => {
    try{
        const joins = await Join.find();
        res.json(joins);
    }catch(err){
        res.json(err);
    }
}

const findOneJoin = async (req, res) => {
    try{
          const join = await Join.findById({_id: req.params._id});
          res.json(join);
    }catch(err){
        res.json(err);
    }
}

module.exports = { createJoin, updateJoin, deleteJoin, findAllJoins, findOneJoin };