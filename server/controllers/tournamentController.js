// controllers/tournamentController.js
const Tournament = require('../models/Tournament.model');


exports.createTournament = async (req, res) => {
    try {
        const newTournament = await Tournament.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { tournament: newTournament }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};


exports.getAllTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find();
        res.status(200).json({
            status: 'success',
            results: tournaments.length,
            data: { tournaments }
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};


exports.getTournament = async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id)
            .populate('participantsUsers') 
            .populate('participantsTeams'); 

        if (!tournament) {
            return res.status(404).json({ status: 'fail', message: 'No tournament found with that ID' });
        }

        res.status(200).json({
            status: 'success',
            data: { tournament }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};


exports.updateTournament = async (req, res) => {
    try {
        const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true 
        });

        if (!tournament) {
            return res.status(404).json({ status: 'fail', message: 'No tournament found with that ID' });
        }

        res.status(200).json({
            status: 'success',
            data: { tournament }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};


exports.deleteTournament = async (req, res) => {
    try {
        const tournament = await Tournament.findByIdAndDelete(req.params.id);

        if (!tournament) {
            return res.status(404).json({ status: 'fail', message: 'No tournament found with that ID' });
        }

        res.status(204).json({ 
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};