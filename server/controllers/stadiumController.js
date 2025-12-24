const Model = require('../models/Stadium.model'); // <--- غير هذا السطر فقط حسب الملف

// 1. Create
exports.createItem = async (req, res) => {
    try {
        const doc = await Model.create(req.body);
        res.status(201).json({ status: 'success', data: doc });
    } catch (err) { res.status(400).json({ message: err.message }); }
};

// 2. Get All
exports.getAllItems = async (req, res) => {
    try {
        const docs = await Model.find();
        res.status(200).json({ status: 'success', results: docs.length, data: docs });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// 3. Get One
exports.getItem = async (req, res) => {
    try {
        const doc = await Model.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ status: 'success', data: doc });
    } catch (err) { res.status(400).json({ message: err.message }); }
};

// 4. Update
exports.updateItem = async (req, res) => {
    try {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!doc) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ status: 'success', data: doc });
    } catch (err) { res.status(400).json({ message: err.message }); }
};

// 5. Delete
exports.deleteItem = async (req, res) => {
    try {
        await Model.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) { res.status(400).json({ message: err.message }); }
};