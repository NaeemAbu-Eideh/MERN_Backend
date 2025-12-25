const Stadium = require('../models/Stadium.model');

const createStadium = async (req, res) => {
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
    try{
        const stadium = await Stadium.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });
        res.json(stadium);
    }catch(err){
        if(err.name === 'ValidationError'){
            return res.status(400).json({errors: err.errors});
        }
        res.json(err);
    }
}

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
        const stadium = await Stadium.findById({_id : req.params._id});
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

module.exports = { findOneStadium, findAllStadiums, deleteStadium, updateStadium, createStadium }