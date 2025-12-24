// controllers/matchController.js
const Match = require('../models/Match.model');

exports.createMatch = async (req, res) => {
    try {
        const newMatch = await Match.create(req.body);
        res.status(201).json({ status: 'success', data: { match: newMatch } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getAllMatches = async (req, res) => {
    try {
        // يمكننا هنا إضافة فلتر لجلب مباريات بطولة معينة فقط
        // مثال: ?tournamentId=123
        const filter = {};
        if (req.query.tournamentId) filter.tournamentId = req.query.tournamentId;

        const matches = await Match.find(filter)
            .populate('stadiumId')
            .populate('tournamentId');
        
        res.status(200).json({ status: 'success', results: matches.length, data: { matches } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.getMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) return res.status(404).json({ message: 'Match not found' });
        res.status(200).json({ status: 'success', data: { match } });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateMatch = async (req, res) => {
    try {
        const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!match) return res.status(404).json({ message: 'Match not found' });
        res.status(200).json({ status: 'success', data: { match } });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteMatch = async (req, res) => {
    try {
        await Match.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};